var controllers = {}, server;

/** Getting the dependencies modules from parent **/
module.exports.app = module.parent.exports.app;

/** Getting server from the parent; **/
server = module.exports.app.server;

/**
 * Loading Controller modules;
 */
require("fs").readdirSync("./Controller/").forEach(function(file) {
	controllers[file.replace("Controller.js","")] = require("./../Controller/" + file);
});

/**
 * Method to open the registered routes;
 */
var open = function()	{
	/**for(var route in routeRegister)	{
		routeRegister[route];
	}**/
};

module.exports = {
	open : open,
	controllers : controllers
};

var loadRoutes = function(register)	{
	for(var route in register)	{
		register[route]();
	}
}

var UserRoute = function()	{
	server.post('/user/login', controllers.Login.authenticate);
	server.post('/user/', controllers.User.addUser);
};

loadRoutes({
	user : UserRoute
});