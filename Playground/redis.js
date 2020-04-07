//! REDIS LIBRARY
//!CONCEPT
// It is a cache server in your machine to store data.
// It is dowloaded and instaled automaticly in Windows.
// Then it is ready to use and listen in the port 6379.

//*IMPORTING REDIS LIBRARY
const redis = require('redis');

//*SETTING CONFIGS OF RED
const redisPort = '6379';
const redisUrl = `redis://127.0.0.1:${redisPort}`; // It works with a localhost url in your machine listening on a especific port. 
const client = redis.createClient(redisUrl);//Creating an instance of Redis

//!SAVING AND RETRIEVING ===SINGLE=== VALUES IN THE REDIS CACHE OBJECT
//!REDIS ACEPTS ONLY STRINGS AND NUMBERS
//Works the same as a Javascript object {key: value} or the localStorage.setItem('Key', 'Value'). 
client.set('Redis', 'Saving my first value in Redis cache');
//To retrieve you must use a callback with the ERROR and the RESPONSE
client.get('Redis', (error, res) => console.log(error, res));
//Saving the work of writing the callback 
client.set('2Redis', 'Saving my second value in Redis cache');
client.get('2Redis', console.log);

//!SAVING AND RETRIEVING ===NESTED=== VALUES WITH THE HASH COMMAND
//Works the same as a NESTED Javascript object {key1: key2:{value} } 
client.hset('First Key', 'Second Key', 'Saving my FIRST NESTED OBJECT value in Redis cache');
client.hget('First Key', 'Second Key', console.log);

client.hset('First Key', 'Third Key', 'Saving my SECOND NESTED OBJECT value in Redis cache');
client.hget('First Key', 'Third Key', console.log);

// console.log(JSON.stringify({FourthKey: 'Another Key'}));

// client.hset('Another Key', JSON.stringify({FourthKey: 'Another Key'}));
// client.hget('Another Key', console.log);

//!SAVING WITH AN EXPIRATION DATE
//Have to use the parameter EX followed by a number representing the seconds of the expiration time
client.set('Expiration date Test', 'Expiration date test', 'EX', 10);

//!DELETING DATA SAVED IN REDIS INSTANCE
client.flushall();


