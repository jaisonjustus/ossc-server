module.exports = (function()	{
	if(module.parent.exports.schema)	{
		/** Define Schema inside the method **/
		return new module.parent.exports.schema({});
	}else	{
		return false;
	}
})();