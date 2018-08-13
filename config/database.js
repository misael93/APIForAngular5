module.exports = function(){
  switch(process.env.NODE_ENV){
    case 'local':
      return{
        'url': 'mongodb://localhost:27017/MyMusic',
         options : {
           useMongoClient: true
         }
      }
    case 'dev':
      return {
        url: 'mongodb://cluster-shard-00-00-copf4.mongodb.net:27017,cluster-shard-00-01-copf4.mongodb.net:27017,cluster-shard-00-02-copf4.mongodb.net:27017/test?ssl=true&replicaSet=cluster-shard-0&authSource=admin',
        options: {
          poolSize: 5,
          useNewUrlParser: true,
          user: process.env.USERDB,
          pass: process.env.PASSDB,
          promiseLibrary: global.Promise
        }
      }
  }
}
