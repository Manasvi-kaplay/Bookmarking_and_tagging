var connection = require("../config/connection");

//Mongodb database queries used in the project:

module.exports.insert=function(collection_name,obj,cb){
  connection.init(function(err,client){
    var db = client.db('bookmarking');
db.collection(collection_name).insertOne(obj,cb)
});
}
module.exports.insertMany=function(collection_name,arr,cb){
	connection.init(function(err,client){
		var db = client.db('bookmarking');
	db.collection(collection_name).insertMany(arr,cb)
	})
}
module.exports.find=function(collection_name,cb){
	connection.init(function(err, client){
		var db = client.db('bookmarking');
		db.collection(collection_name).find().toArray(cb);
	});
}
module.exports.findWhere=function(collection_name,obj, cb){
	connection.init(function(err, client){
		var db = client.db('bookmarking');
		db.collection(collection_name).find(obj).toArray(cb);
	});
}
module.exports.update=function(collection_name,where,obj,cb){
	connection.init(function(err,client){
		var db=client.db('bookmarking');
  db.collection(collection_name).updateOne(where,{$set:obj},cb)
});
}
module.exports.remove_field=function(collection_name,where,obj,cb){
	connection.init(function(err,client){
		var db=client.db('bookmarking');
	db.collection(collection_name).update(where,{$unset:obj},cb)
	})
}
module.exports.delete=function(collection_name,obj,cb){
	connection.init(function(err,client){
		var db=client.db('bookmarking');
		db.collection(collection_name).deleteOne(obj,cb)
	})
}
module.exports.createIndex=function(collection_name,obj,cb){
	connection.init(function(err,client){
		var db=client.db("bookmarking");
		db.collection(collection_name).createIndex(obj,{unique:true},cb);
	})
}
module.exports.ensureIndex=function(collection_name,obj,obj2,cb){
	connection.init(function(err,client){
		var db=client.db("bookmarking")
		db.collection(collection_name).ensureIndex(obj,obj2,cb);
	})
}