//This file contains database connectivity code.

var MongoClients=require("mongodb").MongoClient;
var url="mongodb+srv://manasvi:manasvi96@cluster0-2mm6t.mongodb.net/bookmarking?retryWrites=true&w=majority"
module.exports.init=function(cb){
    MongoClients.connect(url,{ useNewUrlParser: true },{ useUnifiedTopology: true }, cb);
}   