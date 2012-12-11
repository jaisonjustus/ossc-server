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
		connectionString : 'mongodb://ossc-open-user:ossc-user-1@linus.mongohq.com:10012/ossc-db',
		dbName : 'ossc-db'
	},

	/** Redis configuration; **/
	redis : {
		connectionString : "redis://redistogo:809a1d4c38ec69083eca31a750d710c4@blackchin.redistogo.com:9031/",
		server : "blackchin.redistogo.com",
		port : "9031",
		instance : "spadefish-9006-nano",
		password : "809a1d4c38ec69083eca31a750d710c4"
	}

};
