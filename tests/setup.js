jest.setTimeout(10000);

require('../models/User');

const mongoose = require('mongoose');
const keys = require('../config/keys');

mongoose.Promise = global.Promise; //Mongoose by default wants you to tell what kind of Promise implementation you want to use;
mongoose.connect(keys.mongoURI, {useMongoClient: true})
