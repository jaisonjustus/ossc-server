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

module.exports.authenticate = function(request, response)	{

	var reply = {};

	if(UserSchema)	{
		var UserModel, attributes;

		/** Registering User Model; **/
		mongoose.model('user', UserSchema);
		UserModel = mongoose.model('user');

		attributes = request.params;
		
		delete attributes._id;
		delete attributes.token;
		delete attributes.name;

		UserModel.findOne(attributes, "_id name email token", function(error, user)	{

			if(!error && user)	{
				var token, userData;
				
				//delete user.password;
				token = user.token;

				/** Checking token exists in redis; **/
				redisClient.get(token, function(error, value)	{
					if(value === null && error === null)	{
						
						/** Creating new token; **/
						token = require('crypto').createHash('md5').update("" + (new Date()).getTime()).digest("hex");
						user.token = token;
						userData = user;

						/** Storing new token on redis; **/
						setTokenOnRedis(token);

						/** Updating token in the user model; **/
						UserModel.update({ _id : user._id}, { token : token }, function(error, user)	{
							console.log("update", error, user);
							if(error !== null && user === null)	{
								deleteTokenOnRedis(token);

								/** Error message; **/
								reply = {
									error : true,
									code : "AUTH#001",
									msg : "User authentication failed, Please check user credentials."
								}
								response.send(reply);

							}else if(error === null && user !== null)	{
								reply = userData;
								response.send(reply);
							}
						});
					}else if(value !== null)	{
						reply = user;
						response.send(reply);
					}else	{
						/** Error message; **/
						reply = {
							error : true,
							code : "AUTH#001",
							msg : "User authentication failed, Please check user credentials."
						};
						response.send(reply);
					}
				});
			}else	{
				/** Error message; **/
				reply = {
					error : true,
					code : "AUTH#001",
					msg : "User authentication failed, Please check user credentials."
				}
			}		
		});
	}else	{

		/** Error message; **/
		reply = {
			error : true,
			code : "AUTH#001",
			msg : "User authentication failed, Please check user credentials."
		}

		response.send(reply);
	}
};

var setTokenOnRedis = function(token)	{
	redisClient.set(token, "1");
	redisClient.expire(token, 20);
}

var deleteTokenOnRedis = function(token)	{
	redisClient.del(token);
}