/**
 * Application Configuarion File;
 */
module.exports = {
	/** Application server configuration; **/
	server : {
		port : 8080
	},
	
	/** MongoDB configuration; **/
	mongo : {
		connectionString : 'mongodb://<username>:<password>@<host>:<port>/<db-name>',
		dbName : 'collectionexchange'
	},

	/** Redis configuration; **/
	redis : {
		connectionString : "",
		server : "",
		port : "",
		instance : ""
	}

};
