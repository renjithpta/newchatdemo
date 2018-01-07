var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var chatHistorySchema = new Schema({
  id : {type:Number,default:"",required:true},
  msgFrom : {type:String,default:"",required:true},
  msgTo : {type:String,default:"",required:true},
  msgFromId : {type:String,default:"",required:true},
  msgToId : {type:String,default:"",required:true},
  msg : {type:String,default:"",required:true},
  createdOn : {type:Date,default:Date.now}

});

mongoose.model('ChatHistory',chatHistorySchema);


