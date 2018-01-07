var http = require("http");
var express = require("express");
var bodyParser = require('body-parser');
var winston = require('winston');
var app = express();
var fs = require('fs');
var events = require('events');
var mongoose = require('mongoose');
const redis = require('socket.io-redis');
var IORedis = require('ioredis');
var redisStore = new IORedis();
var logger = new winston.Logger({
    level: 'info',
    transports: [
        new (winston.transports.Console)({ colorize: true }),
        new (winston.transports.File)({ filename: './logs/chat.log' })
    ]
  });
var eventEmitter = new events.EventEmitter();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const RedisConfig = require('./config/redis.js');
 require('./config/db.js')(mongoose);


  //including models files
fs.readdirSync("./models").forEach(function(file){
  if(file.indexOf(".js")){
    require("./models/"+file);
  }
});
// Express CORS setup
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});
const port = process.env.PORT || '3000';
var server = app.listen(port);
//var io = require('socket.io').listen(server);
const io_s = require('socket.io')(server);
var confi
io_s.adapter(redis(RedisConfig));
const io = io_s.of('chatspace');
var path = __dirname + '/views/';
var usersCollection = [];
// Express routes
app.set("view engine", "vash");
app.use(express.static('./')); 
var chatModel = mongoose.model('Chat');
var chatMongoHistoryModel = mongoose.model('ChatHistory');
var customerIssueModel = mongoose.model('CustomerIssue');
require('./dbinitaldata/populatedb.js')(chatMongoHistoryModel,customerIssueModel,logger);
//insertData();
//insertIssueData();
app.get("*",function(req, res){
  res.render("index");
});
app.post("/usrlist",function(req, res){
logger.info("usrlist::start");
  var clonedArray = usersCollection.slice();
  var i = usersCollection.findIndex(x => x.id == req.body.userId);
  clonedArray.splice(i,1);
  logger.info("usrlist::end");
  res.json(clonedArray);
});
app.post("/chathistory",function(req, res){
  logger.info("chathistory::start");
   return chatModel.find({})
      .where('msgFrom').equals(req.body.msgFrom)
      .sort('-createdOn')
      .skip( ((req.body.msgCount)?req.body.msgCount:0))
      .lean()
      .limit(((req.body.limit)?req.body.limit:10))
      .exec(function(err, result) {
        if (err) {
		  logger.info("chathistory::error");
          res.json({status:"error","error":err});
        } else {
          logger.info("chathistory::success");
          res.json(result);
        }
      });
  
});
app.post("/chatboathistory",function(req, res){
  logger.info("chatboathistory::start");
   return chatModel.find({})
      .where('msgFrom').equals(req.body.msgFrom)
      .sort('-createdOn')
      .skip( ((req.body.msgCount)?req.body.msgCount:0))
      .lean()
      .limit(((req.body.limit)?req.body.limit:10))
      .exec(function(err, result) {
        if (err) {
		  logger.info("chathistory::error");
          res.json({status:"error","error":err});
        } else {
          logger.info("chathistory::success");
          res.json(result);
        }
      });
  
});

app.post("/customerissue",function(req, res){
  logger.info("customerissue::start");
   return customerIssueModel.find({})
      .sort('createdOn')
      .skip( ((req.body.msgCount)?req.body.msgCount:0))
      .lean()
      .limit(((req.body.limit)?req.body.limit:10))
      .exec(function(err, result) {
        if (err) {
		  logger.info("customer issue::error");
          res.json({status:"error","error":err});
        } else {
          logger.info("customerissue::success");
          res.json(result);
        }
      });
  
});

app.post("/customerissuebyid",function(req, res){
  logger.info("customerissue::start");
   return customerIssueModel.find({})
	   .where('issueId').equals(req.body.issueId)
      .sort('createdOn')
      .skip( ((req.body.msgCount)?req.body.msgCount:0))
      .lean()
      .limit(((req.body.limit)?req.body.limit:10))
      .exec(function(err, result) {
        if (err) {
		  logger.info("customer issue::error");
          res.json({status:"error","error":err});
        } else {
          logger.info("customerissue::success");
          res.json(result);
        }
      });
  
});

app.post("/currentchathistory",function(req, res){
  logger.info("chathistory::start");

   var fromId = [];
   var toId = [];
   for (var cnt =0;cnt < usersCollection.length;cnt++) {
	    if(usersCollection[cnt].displayName === req.body.fromName)
		fromId.push(usersCollection[cnt].id);
        if(usersCollection[cnt].displayName === req.body.toName)
		toId.push(usersCollection[cnt].id);
	}
  return  chatModel.find({ $or: [
          { $and: [{msgFromId:  {$in:  fromId}},   {msgToId: {$in: toId}}] },
          { $and: [{msgFromId:  {$in : toId}},     {msgToId: {$in: fromId}}] }
      ]})
      .sort('createdOn')
      .exec(function(err, result) {
        if (err) {
		  logger.info("chathistory::error");
          res.json([]);
        } else {
          logger.info("chathistory::success");
		  console.log(result);
          res.json(result);
        }
      });

   
});
app.post("/currentchatboathistory",function(req, res){
  return chatMongoHistoryModel.find({})
      .where('id').equals(req.body.id)
      .sort('createdOn')
       .exec(function(err, result) {
        if (err) {
		  logger.info("chathistory::error");
          res.json({status:"error","error":err});
        } else {
          logger.info("chathistory::success");
          res.json(result);
        }
      });

   
});
app.use(function (err, req, res, next) {
   logger.info(req.url);
  if (err.name === 'UnauthorizedError') {
    logger.info(err);
    res.status(401).send({status:'fail',message:'invalid activity'});
  }
});


var oldChats;
var currentHistory;
io.on('connection', function(socket){
  logger.info('A user has connected to the server.');

  socket.on('join', function(data) {
    // Same contract as ng-chat.User
	  logger.info('A user has joine.'+data.username);
	var isUserAlredayExits = usersCollection.find(x => x.id == socket.id);
	logger.info(isUserAlredayExits);
	if(!isUserAlredayExits){
    usersCollection.push({  
      id: socket.id, // Assigning the socket ID as the user ID in this example
      displayName: data.username,
	  dept:data.dept,
      status: 0, // ng-chat UserStatus.Online,
      avatar: null
    });
	}
	logger.info("iusers")
	logger.info(usersCollection)
    socket.broadcast.emit("usrlist", usersCollection);
    
    logger.info(data.username + " has joined the chat room.");

    // This is the user's unique ID to be used on ng-chat as the connected user.
    socket.emit("generatedUserId", socket.id);
	
	
    // On disconnect remove this socket client from the users collection
    socket.on('disconnect', function() {
      logger.info('User disconnected!');

      var i = usersCollection.findIndex(x => x.id == socket.id);
      usersCollection.splice(i, 1);

      socket.broadcast.emit("usrlist", usersCollection);
   });
  });
  socket.on('rejoined', function(userdetails){
        console.log("joined*************");
		console.log(userdetails);
	   var isUserAlredayExits = usersCollection.find(x => x.id == userdetails.id);
	   if(!isUserAlredayExits){
			usersCollection.push({  
			  id: userdetails.id, // Assigning the socket ID as the user ID in this example
			  displayName: userdetails.username,
			  dept:userdetails.dept,
			  status: userdetails.status, // ng-chat UserStatus.Online,
			  avatar: userdetails.avatar
			});
			}
	    console.log(usersCollection);
	 });

  socket.on("typing", function(message){
    logger.info("tying");
    logger.info(message);
    let msgUser =  usersCollection.find(x => x.id == message.fromId);
    io.to(message.toId).emit("starttyping", {
      user: msgUser ,
      message: message
    });

    for(var cnt =0;cnt < usersCollection.length ; cnt++){
		  if(usersCollection[cnt].displayName === message.msgTo &&  usersCollection[cnt].id != message.toId ) {
           	  io.to(usersCollection[cnt].id).emit("starttyping", {
				  user: msgUser ,
				  message: message
				});	

		  }

	 }


    logger.info("Message dispatched.");
  });
  
  socket.on('user_status_change', function (data) {
  
  	for (var item in usersCollection) {
	      if(usersCollection[item].id == data.fromId){
		     usersCollection[item].status = data.status;
		  }
	}
	socket.broadcast.emit("usrlist", usersCollection);
    logger.info(usersCollection);
	 
	});
  
  socket.on("typingstoped", function(message){
    logger.info("tying");
    logger.info(message);

    io.to(message.toId).emit("stoptyping", {
      user: usersCollection.find(x => x.id == message.fromId),
      message: message
    });


    logger.info("Message dispatched.");
  });
  //emits event to read old chats from database.
   //emits event to read old chats from database.
   socket.on('old-chats', function(data) {
      eventEmitter.emit('read-chat', data);
    });

	//emits event to read old chats from database.
   socket.on('request-cuurent-history', function(data) {
      eventEmitter.emit('read-current-chat', data);
    });

//sending old chats to client.
    oldChats = function(result, username, userId) {
	 console.log("history result");
	 console.log(result);
      io.to(userId).emit('old-chats', {
        result: result,
        userId: userId
      });
    }
   
   currentHistory = function(result,data){

	   io.to(data.recivedId).emit('currnt-chats-history', {
			result: result,
			data: data
		  });

	  }


  socket.on("sendMessage", function(message){
    console.log("Message received:");
    console.log(message);
    var userFrom=usersCollection.find(x => x.id == message.fromId);
	var userTo= usersCollection.find(x => x.id == message.toId);
	if(userTo){
    io.to(message.toId).emit("messageReceived", {
      user: userFrom,
      message: message
     });

	  for(var cnt =0;cnt < usersCollection.length ; cnt++){

		   var historyData= {fromId:message.fromId,toId:message.toId,fromName:userFrom,toName:userTo,from:false};

		  if(usersCollection[cnt].displayName === userTo.displayName &&  usersCollection[cnt].id != userTo.id ) {
              
			  io.to(usersCollection[cnt].id).emit("messageReceived", {
							  user: userFrom,
							  message: message,
							  historyData:historyData
							 });

		  }

		   if(usersCollection[cnt].displayName === userFrom.displayName &&  usersCollection[cnt].id != userFrom.id ) {
               message.fromId =  usersCollection[cnt].id;
			   console.log("msaage same user");
			   console.log(message);
			   historyData.from = true;
			   io.to(usersCollection[cnt].id).emit("messageReceived", {
							  user: userTo,
							  message: message,
							  historyData:historyData
							 });

		  }



	  }

	
	  console.log("From user ");
      console.log(userFrom);
	  var userFromName='';
	  var userToName='';
	  if(userFrom)
		  userFromName =userFrom.displayName;
	  if(userTo)
            userToName =userTo.displayName;
	 message.fromId =  message.fromId;
	  //emits event to save chat to database.
     eventEmitter.emit('save-chat', {
        msgFrom:userFromName,
        msgTo:userToName,
		msgFromId :message.fromId,
        msgToId : message.toId,
        msg: message.message,
        date: Date.now()
      });

    console.log("Message dispatched.");
	}else{

	 io.to(message.fromId).emit("useroffline", {
      name: message.msgTo,
      id: message.toId
     });

	}
  });
});

eventEmitter.on('save-chat', function(data) {

    // var today = Date.now();

    var newChat = new chatModel({

      msgFrom: data.msgFrom,
      msgTo: data.msgTo,
      msgFromId :data.msgFromId ,
      msgToId : data.msgToId,
      msg: data.msg,
      createdOn: data.date

    });
console.log(newChat);
    newChat.save(function(err, result) {
      if (err) {
        console.log("Error : " + err);
      } else if (result == undefined || result == null || result == "") {
        console.log("Chat Is Not Saved.");
      } else {
        console.log("Chat Saved.");
        //console.log(result);
      }
    });

  }); //end of saving chat.


  //reading chat from database.
  eventEmitter.on('read-chat', function(data) {

    chatModel.find({})
      .where('msgFrom').equals(data.msgFrom)
      .sort('-createdOn')
      .skip(data.msgCount)
      .lean()
      .limit(10)
      .exec(function(err, result) {
        if (err) {
          console.log("Error : " + err);
        } else {
          //calling function which emits event to client to show chats.
          oldChats(result, data.username, data.fromId);
        }
      });
  }); //end of reading chat from database.


 //reading chat from database.
  eventEmitter.on('read-current-chat', function(data) {
console.log("----befoere------------");
console.log(data);
  
   var fromId = [];
   var toId = [];
   for (var cnt =0;cnt < usersCollection.length;cnt++) {
	    if(usersCollection[cnt].displayName === data.fromName.displayName)
		fromId.push(usersCollection[cnt].id);
        if(usersCollection[cnt].displayName === data.toName.displayName)
		toId.push(usersCollection[cnt].id);
	}

 fromId.push(data.fromId);
 toId.push(data.toId);

console.log(fromId);
console.log(toId);
  chatModel.find({ $or: [
          { $and: [{msgFromId:  {$in:  fromId}},   {msgToId: {$in: toId}}] },
          { $and: [{msgFromId:  {$in : toId}},     {msgToId: {$in: fromId}}] }
      ]})
      .sort('createdOn')
      .exec(function(err, result) {
        if (err) {
          console.log("Error : " + err);
        } else {
          //calling function which emits event to client to show chats.
          currentHistory(result, data);
        }
      });
  }); //end of reading chat from database.

