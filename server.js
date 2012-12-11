/** Defining module varaibles; **/
var restify, mongoose, underscore, redis, redisClient, config, route;

/** Defining variables; **/
var server, db, schema;

/**
 * Including dependencies
*/
restify = require('restify');
mongoose = require('mongoose');
underscore = require('underscore');
redis = require('redis');

/**
 * Including configuration file;
 */
config = require('./Configuration/App');

/**
 * Preparing Application server;
 */
server = restify.createServer();
server.use(restify.bodyParser());

/**
 * Preparing and connecting to Mongo Database;
 */
mongoose.connect(config.mongo.connectionString);

/**
 * Preparing and connecting to Redis Server;
 */
redisClient = redis.createClient(
	config.redis.port,
	config.redis.server
);

redisClient.auth(config.redis.password);

/**
 * Binding dependency modules for other tiers
 */
module.exports.app = {
	mongoose : mongoose,
	server : server,
	underscore : underscore,
	redisClient : redisClient
};

/**
 * Loading the route file and initializing it.
 */
route = require('./Configuration/Route');
//route.open();

/** Server listening at port 8080 **/
server.listen(config.server.port);