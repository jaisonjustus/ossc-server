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

module.exports.addUser = function(request, response)	{
	console.log(request.params);
	response.send({});
};