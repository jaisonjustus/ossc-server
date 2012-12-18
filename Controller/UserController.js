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

var UserSchema;

UserSchema = require('./../Schema/UserSchema');

module.exports.addUser = function(request, response)	{
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

var addUser = function(request, response, callback)	{

	var UserModel, attributes;

	/** Registering User Model; **/
	mongoose.model('user', UserSchema);
	UserModel = mongoose.model('user');

	attributes = request.params;

	UserModel.findOne({ email : attributes.email }, "_id name email password token", function(error, user)	{

		if(user)	{
			if(attributes.password == user.password)	{
				authenticate(user, callback);
				//return callback(null, user);
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
	});
};



var authenticate = function(user, callback)   {
 
      var token;

      //delete user.password;
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
    });
  }
};

var setTokenOnRedis = function(token)	{
	redisClient.set(token, "1");
	redisClient.expire(token, 20);
}

var deleteTokenOnRedis = function(token)	{
	redisClient.del(token);
}