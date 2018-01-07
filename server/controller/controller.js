module.exports = function (app,usersCollection,chatModel,logger){
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
app.use(function (err, req, res, next) {
   logger.info(req.url);
  if (err.name === 'UnauthorizedError') {
    logger.info(err);
    res.status(401).send({status:'fail',message:'invalid activity'});
  }
});

}