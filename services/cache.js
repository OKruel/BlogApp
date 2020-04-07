const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');
//!CREATING AN INSTANCE OF REDIS
const keys = require('../config/keys');
const client = redis.createClient(keys.redisUrl);
//!MAKING THE CLIENT.GET FUNCTION RETURN A PROMISE INSTEAD OF A CALLBACK.
client.hget = util.promisify(client.hget);
//!STORING THE EXEC MONGOOSE FUNCTION INTO A VARIABLE
const exec = mongoose.Query.prototype.exec;
//!CREATING A CACHE FUNCTION INSIDE THE MONGOOSE LIBRARY WITH PROTOTYPE INHERITANCE
mongoose.Query.prototype.cache = function (options = {}) {
    this.useCache = true;
    this.hashKey = JSON.stringify(options.key || '');
    return this;
};
//! REWRITING THE EXEC MONGOOSE FUNCTION
mongoose.Query.prototype.exec = async function () {

    if (!this.useCache) {
        // console.log('Option to NOT USE REDIS CACHE STRATEGY');
        return exec.apply(this, arguments);
    };

    //!CREATING A UNIQUE AND SOLID KEY TO STORE IN REDIS WITH THE USER ID AND THE COLLECTION
    const key = JSON.stringify(Object.assign({}, this.getQuery(), {
        collection: this.mongooseCollection.name
    }));
    //!CHECKING REDIS TO SEE IF THERE IS DATA WITH THE KEY STORED INSIDE
    const cacheValue = await client.hget(this.hashKey, key);
    //!IF TRUE RETURN THAT VALUE PARSED
    if (cacheValue) {
        // console.log('[NODE API Login Process] Step 2 -> USING REDIS CACHE STRATEGY, fetching from Redis cache');
        // console.log('===================================');

        const doc = JSON.parse(cacheValue);
        return Array.isArray(doc) ?
            doc.map(d => new this.model(d)) :
            new this.model(doc);
    };
    //!NORMAL QUERY BEING EXECUTED IN THE MONGO DB DATABASE
    const result = await exec.apply(this, arguments);
    //!STORING THE RESULT OF THE PREVIOUS QUERY INTO REDIS CACHE DATABASE
    client.hmset(this.hashKey, key, JSON.stringify(result), 'EX', 60);
    //!RETURNING THE VALUE FROM MONGODB IN A MONGOOSE DOCUMENT FORMAT.
    // console.log('[NODE API Login Process] Step 2 -> USING REDIS CACHE STRATEGY, REDIS CACHE EMPTY, fetching from MongoDB');
    // console.log('===================================');
    return result;
};

module.exports = {
    clearHash(hashKey) {
        client.del(JSON.stringify(hashKey));
    }
};