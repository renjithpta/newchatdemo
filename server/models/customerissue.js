var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var customerIssueSchema = new Schema({
  issueId : {type:Number,required:true},
  issueDetails : {type:String,required:true},
  customerName : {type:String,required:true},
  createdOn:{type:Date,default:Date.now},
  chatHistoryId : {type:Number,required:true}
 });

mongoose.model('CustomerIssue',customerIssueSchema);


