var app, mongoose, underscore, schema, redisClient;

/** Acquiring parent export modules; **/
app = module.parent.exports.app;
if(app.server && app.mongoose && app.underscore)	{
	mongoose = app.mongoose;
	schema = mongoose.Schema;
	underscore = app.underscore;
	redisClient = app.redisClient;
};
module.exports.schema = schema;

/** 
 * Loading required schema for the controller;
 */
var UserSchema;
UserSchema = require('./../Schema/UserSchema');


/**
 * Method add a new contributor to the project. this method is also used
 * for user authentication. because while adding a new contributor, method 
 * check the user already register. if he is registered the user details get
 * returned with authenticated token. if the user doesn't exist we add the 
 * user to the list.
 *
 * @method addContributor
 * @param request object
 * @param response object
 * @param callback function
 */
var addContributor = function(request, response, callback)	{

	var UserModel, attributes;

	/** Registering User Model; **/
	mongoose.model('user', UserSchema);
	UserModel = mongoose.model('user');

	attributes = request.params;

	/** Checking contributor existences; **/
	UserModel.findOne({ email : attributes.email }, "_id name email password token", function(error, user)	{
		if(user)	{
			if(attributes.password == user.password)	{
				authenticate(user, UserModel, callback);
			}else	{
				return callback(error || "Wrong password!!");
			}
		}

		if(error || !user)	{
			var token = require('crypto').createHash('md5').update("" + (new Date()).getTime()).digest("hex");
			setTokenOnRedis(token);

			user = new UserModel();
		
			user.email = attributes.email;
			user.password = attributes.password;
			user.name = "contributor";
			user.token = token;

			user.save(function(error)	{
				if(error)	{
					return callback("User not registered.");
				}else	{
					return callback(null, user);
				}
			});
		}

		return callback(null, user);
	});
};

/**
 * Method to authenticate contributors.
 *
 * @method authenticate
 * @param user object
 * @param UserModel object
 * @param callback function
 */
var authenticate = function(user, UserModel, callback)   {
 
	var token, UserModel;

    token = user.token;

    /** Checking token exists in redis; **/
    redisClient.get(token, function(err, value){
    	if(err){
        	return callback(err);
		}
		
        if(value){
          return callback(null, value);
        }

        /** Creating new token; **/
        token = require('crypto').createHash('md5').update("" + (new Date()).getTime()).digest("hex");
        user.token = token;

        /** Storing new token on redis; **/
        setTokenOnRedis(token);

        /** Updating token in the user model; **/
        UserModel.update({ _id : user._id}, { token : token }, function(err, user) {
          if(err || !user) {
            deleteTokenOnRedis(token);
            return callback(err || "UserModel.update, no user found");
          }
          callback(null, user);
        });
      });
};

/**
 * Method to set token to redis.
 *
 * @method setTokenOnRedis
 * @param token string
 */
var setTokenOnRedis = function(token)	{
	redisClient.set(token, "1");
	redisClient.expire(token, 20);
}

/**
 * Method to delete token from redis database.
 *
 * @method deleteTokenOnRedis
 * @param token string
 */
var deleteTokenOnRedis = function(token)	{
	redisClient.del(token);
}

/** Module exports **/

/**
 * Method to add new contribbutor.
 *
 * @method addContributor
 * @param request object
 * @param response object
 */
module.exports.addContributor = function(request, response)	{
	addUser(request, response, function(error, reply)	{
		
		if(error)	{
			reply = {
				error : true,
				message : error
			};
		}

		response.send(reply);
	});
};