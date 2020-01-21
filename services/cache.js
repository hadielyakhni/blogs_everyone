// let a = a => console.log('initial a function')
// let b = a
// console.log(a === b)     // output:  true 
// a = a => console.log('edited a function')
// console.log(a === b)     // output: false
// a()       // output: edited a function
// b()      // output: initial a function


const mongoose = require('mongoose')
const redis = require('redis')
const { promisify } = require('util')
const keys = require('../config/keys')

const redisUrl = keys.redisUrl
const client = redis.createClient(redisUrl)
client.hget = promisify(client.hget)

const exec = mongoose.Query.prototype.exec

mongoose.Query.prototype.cache = function (options = {}) {
    this.useCache = true                                                    // this.useCache and this.hashKey
    this.hashKey = JSON.stringify(options.key || '')          // are defined by me
    return this      // to make this function chainable: " .find({}).cache().limit(10) "
}

mongoose.Query.prototype.exec = async function () {
    if (!this.useCache)
        return exec.apply(this, arguments)
    const key = JSON.stringify({ ...this.getQuery(), collection: this.mongooseCollection.name })
    const cacheValue = await client.hget(this.hashKey, key)
    if (cacheValue) {
        const doc = JSON.parse(cacheValue)
        return Array.isArray(doc)                           // we should return a documents or array of documenst
            ? doc.map(d => new this.model(d))     // this function expects an object
            : new this.model(doc)                           // and not an array
    }
    const result = await exec.apply(this, arguments)      // => SAH
    client.hset(this.hashKey, key, JSON.stringify(result))
    return result

    // ex = exec.bind(this)       //  => Kamen?
    // return ex(arguments)    // => SAH !!

    // return exec(arguments)    // => GHALAT!!!
}

module.exports = {
    clearHash(hashKey) {
        client.del(JSON.stringify(hashKey))
    }
}