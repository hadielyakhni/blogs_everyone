const mongoose = require('mongoose')
require('../models/User')
require('../models/Blog')
const keys = require('../config/keys')

const URL = keys.mongoURI

const OPTIONS = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}

mongoose.connect(URL, OPTIONS)
    .catch(error => console.log(error))