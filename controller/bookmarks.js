var express=require("express");
var router=express.Router();
var allQueries=require("../model/allQueries")
var Long = require('mongodb').Long;

//API to retrieve all the bookmarks:
router.get('/view_all',function(req,res){
    allQueries.find("bookmarks",function(err,result){
        if(err){
            console.log(err)
            res.status(400).json({status:0,err:"error!!"})
        }
        if(result){
            console.log("list of bookmarks...",result)
            res.status(200).json({status:1,result:result})
        }
    })
})
//API to create a new bookmark:
router.post('/add',function(req,res){
    console.log(req.body);
    //Values to be entered by the user:
    var title=req.body.title;
    var link=req.body.link;
    var publisher=req.body.publisher;

    //Calculation of current time in epochs:
    var time_created = new Date().getTime()/1000;
    console.log("time_created....",time_created)
    //Generate uuid:
    function uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      }

       //Object to be inserted in the 'bookmarks' collection of the database:
    var ob={"id":uuidv4(),"title":title,"link":link,"publisher":publisher,"time_created": Long.fromNumber(time_created),"time_updated":Long.fromNumber(time_created)}

//Calling database query to check if a bookmark exists with the same link as given by the user(to keep links of the bookmarks unique)
    allQueries.findWhere("bookmarks",{link:link},function(error,result0){
        if(error){
            res.status(400).json({status:0,err:"error!!"})
        }
        if(result0.length==0){//If same link as given by the user does not exist,then only insert the bookmark
    allQueries.insert("bookmarks",ob,function(err,result){
        if(err){
            res.status(400).json({status:0,err:"error"})
        }
        if(result){
            res.status(200).json({status:1,result:"Bookmark created successfully"})
        }
    })
}
        else{//If link is duplicate:
            res.status(400).json({status:0,err:"Bookmark with this link already exists!"})
            }
})
})

//API to delete a bookmark:
router.post('/delete',function(req,res){
    console.log("req.body....%%%%",req.body)
    //Values entered by the user:
    var link=req.body.link;
    allQueries.delete("bookmarks",{link:link},function(err,result){
        if(err){
            res.status(400).json({status:0,err:"error"})
        }
        if(result){
            res.status(200).json({status:1,result:"Bookmark deleted successfully"})
        }
    })
})
module.exports=router;