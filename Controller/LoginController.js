var app, mongoose, underscore, schema;

/** Acquiring parent export modules; **/
app = module.parent.exports.app;
if(app.server && app.mongoose && app.underscore)	{
	mongoose = app.mongoose;
	schema = mongoose.Schema;
	underscore = app.underscore;
};

module.exports.schema = schema;