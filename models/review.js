var mongoose = require('mongoose');
var schema = mongoose.Schema;

var reviewSchema = new schema({
	phnNumber:String,
	title :String,
	disc :String,
	author:String,
	rate:String
});



module.exports = mongoose.model('review',reviewSchema);