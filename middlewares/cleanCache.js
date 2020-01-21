const { clearHash } = require('../services/cache')

module.exports = async (req, res, next) => {
    await next()      // wait until the execution of the next functions in the route handler terminates
    // then the execution will be back to here, and we will clear all the caches:                          
    clearHash(req.user.id)
}