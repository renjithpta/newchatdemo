module.exports= function(chatMongoHistoryModel,customerIssueModel,logger){


var newChat = new chatMongoHistoryModel({
      id: 1,
      msgFrom: 'John',
      msgTo :'System' ,
	  msgFromId:'eee',
	  msgToId:'ert45',
      msg: "Hello this John",
      });

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
	newChat = new chatMongoHistoryModel({
      id: 1,
      msgFrom: 'System',
      msgTo :'John' ,
	  msgFromId:'eee',
	  msgToId:'ert45',
      msg: "Hello John  How can i help you?",
      });

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

	newChat = new chatMongoHistoryModel({
      id: 1,
      msgFrom: 'John',
      msgTo :'System' ,
	  msgFromId:'eee',
	  msgToId:'ert45',
      msg: "Need a new towel in the bath room.Can i get it ?",
      });

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
newChat = new chatMongoHistoryModel({
      id: 101,
      msgFrom: 'Adam',
      msgTo :'System' ,
	  msgFromId:'eee',
	  msgToId:'ert45',
      msg: "Hello .I need a new Kettle",
      });

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

newChat = new chatMongoHistoryModel({
      id: 101,
      msgFrom: 'System',
      msgTo :'Adm' ,
	  msgFromId:'Hello Adam how can i help',
	  msgToId:'ert45',
      msg: "Hello",
      });

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

	newChat = new chatMongoHistoryModel({
      id: 101,
      msgFrom: 'System',
      msgTo :'Adm' ,
	  msgFromId:'eee',
	  msgToId:'ert45',
      msg: "Please get a kettle as early as possible",
      });

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

	newChat = new chatMongoHistoryModel({
      id: 103,
      msgFrom: 'John',
      msgTo :'System' ,
	  msgFromId:'eee',
	  msgToId:'ert45',
      msg: "Hello Need a help.",
      });

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
	newChat = new chatMongoHistoryModel({
      id: 103,
      msgFrom: 'System',
      msgTo :'John' ,
	  msgFromId:'eee',
	  msgToId:'ert45',
      msg: "Hello How can  i help you",
      });

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

	newChat = new chatMongoHistoryModel({
      id: 103,
      msgFrom: 'John',
      msgTo :'System' ,
	  msgFromId:'eee',
	  msgToId:'ert45',
      msg: "I haven an issue with bathrrom door.",
      });

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

	newChat = new chatMongoHistoryModel({
      id: 103,
      msgFrom: 'Tom',
      msgTo :'System' ,
	  msgFromId:'eee',
	  msgToId:'ert45',
      msg: "I haven an issue with electricity.",
      });

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



	

var issue = new customerIssueModel({
        issueId: 1,
        issueDetails: "Need a new towel.",
        customerName: "John ",
        createdOn: "2017-05-01 11:10:09",
        chatHistoryId: 1
      });

    issue.save(function(err, result) {
      if (err) {
        console.log("Error : " + err);
      } else if (result == undefined || result == null || result == "") {
        console.log("Issue Is Not Saved.");
      } else {
        console.log("Issue Saved.");
        //console.log(result);
      }
    });
	issue = new customerIssueModel({
        issueId: 101,
        issueDetails: "Room service required.Please bring a new kettle ",
        customerName: "Adam",
        createdOn: "2017-04-01 11:10:09",
        chatHistoryId: 101
      });

    issue.save(function(err, result) {
      if (err) {
        console.log("Issue error : " + err);
      } else if (result == undefined || result == null || result == "") {
        console.log("Issue Is Not Saved.");
      } else {
        console.log("Issue Saved.");
        //console.log(result);
      }
    });

	issue = new customerIssueModel({
        issueId: 102,
        issueDetails: "Cleaning is not done properly  in my room",
        customerName: "Sam",
        createdOn: "2017-04-01 11:10:09",
        chatHistoryId: 102
      });

    issue.save(function(err, result) {
      if (err) {
        console.log("Error : " + err);
      } else if (result == undefined || result == null || result == "") {
        console.log("Chat Is Not Saved.");
      } else {
        console.log("Chat Saved.");
        //console.log(result);
      }
    });
issue = new customerIssueModel({
        issueId: 103,
         issueDetails: "Issue with bathromm door.",
         customerName: "Jibson",
         createdOn: "2017-04-01 11:10:09",
         chatHistoryId: 103
      });

    issue.save(function(err, result) {
      if (err) {
        console.log("Error : " + err);
      } else if (result == undefined || result == null || result == "") {
        console.log("Chat Is Not Saved.");
      } else {
        console.log("Chat Saved.");
        //console.log(result);
      }
    });

issue = new customerIssueModel({
        issueId: 104,
        issueDetails: "Electricy problem in room .",
        customerName: "Tom",
        createdOn: "2017-04-01 11:10:09",
        chatHistoryId: 104
      });

    issue.save(function(err, result) {
      if (err) {
        console.log("Error : " + err);
      } else if (result == undefined || result == null || result == "") {
        console.log("Chat Is Not Saved.");
      } else {
        console.log("Chat Saved.");
        //console.log(result);
      }
    });
};

