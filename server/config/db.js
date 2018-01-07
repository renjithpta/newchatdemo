const MongoConfig = require('./mongodb.js');
module.exports= function(mongoose){
mongoose.Promise = global.Promise;
mongoose.connect(MongoConfig.url,{ useMongoClient: true, connectTimeoutMS: 100000 });
mongoose.connection.openUri(MongoConfig.url)
.once('open', () => console.log('Database Connection Established Successfully!'))
  .on('error', (error) => {
    console.warn('Warning', error);
  });
};

