module.exports = (function()	{
	if(module.parent.exports.schema)	{

		/** Define Schema inside the method **/
		return new module.parent.exports.schema({

			/** User email id; **/
			email : {
				type : String,
				index : {
					unique : true,
					dropDups : true
				}
			},

			/** User password; **/
			password : String,

			/** User First name; **/
			name : String,

			/** User token; **/
			token : String
		});
	}else	{
		return false;
	}
})();