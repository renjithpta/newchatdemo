var oldChats;
module.exports = function(io,logger,eventEmitter,chatModel,usersCollection) {
io.on('connection', function(socket){
  logger.info('A user has connected to the server.');

  socket.on('join', function(username) {
    // Same contract as ng-chat.User
	  logger.info('A user has joine.'+username);
	var isUserAlredayExits = usersCollection.find(x => x.id == socket.id);
	logger.info(isUserAlredayExits);
	if(!isUserAlredayExits){
    usersCollection.push({  
      id: socket.id, // Assigning the socket ID as the user ID in this example
      displayName: username,
      status: 0, // ng-chat UserStatus.Online,
      avatar: null
    });
	}
	logger.info("iusers")
	logger.info(usersCollection)
    socket.broadcast.emit("usrlist", usersCollection);
    
    logger.info(username + " has joined the chat room.");

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
			  status: userdetails.status, // ng-chat UserStatus.Online,
			  avatar: userdetails.avatar
			});
			}
	    console.log(usersCollection);
	 });

  socket.on("typing", function(message){
    logger.info("tying");
    logger.info(message);

    io.to(message.toId).emit("starttyping", {
      user: usersCollection.find(x => x.id == message.fromId),
      message: message
    });

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
   socket.on('old-chats', function(data) {
      eventEmitter.emit('read-chat', data);
    });
  //sending old chats to client.
    oldChats = function(result, username, userId) {
	 console.log("history result");
	 console.log(result);
      io.to(userId).emit('old-chats', {
        result: result,
		username:username,
        userId: userId
      });
    }

  socket.on("sendMessage", function(message){
    logger.info("Message received:");
    logger.info(message);

    io.to(message.toId).emit("messageReceived", {
      user: usersCollection.find(x => x.id == message.fromId),
      message: message
    });
	
	   
	  var userFrom=usersCollection.find(x => x.id == message.fromId);
	  var userTo= usersCollection.find(x => x.id == message.toId);
	  logger.info("From user ");
      logger.info(userFrom);
	  var userFromName='';
	  var userToName='';
	  if(userFrom)
		  userFromName =userFrom.displayName;
	  if(userTo)
            userToName =userTo.displayName;
	 
	  //emits event to save chat to database.
      eventEmitter.emit('save-chat', {
        msgFrom:((message.msgFrom)?message.msgFrom:userFromName),
        msgTo:((message.msgTo)?message.msgTo:userToName),
		msgFromId :message.fromId,
        msgToId : message.toId,
        msg: message.message,
        date: Date.now()
      });


    logger.info("Message dispatched.");
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

}
