var express=require("express");
var router=express.Router();
var Long = require('mongodb').Long;
var allQueries=require("../model/allQueries")

//API to retrieve all the tags:
router.get('/view_all',function(req,res){
    allQueries.find("tags",function(err,result){
        if(err){
            console.log(err)
        }
        if(result){
            console.log("list of tags...",result)
            res.status(200).json({status:1,result:result})
        }
    })
})

//API to create a new tag:

router.post('/add',function(req,res){
    console.log(req.body);
    //Values to be entered by the user:
    var title=req.body.title;

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

    //Object to be inserted in the 'tags' collection of the database:
    var ob={"id":uuidv4(),"title":title,"time_created": Long.fromNumber(time_created),"time_updated":Long.fromNumber(time_created)}

    //Calling database query to check if a tag exists with the same title as given by the user(to keep title of the tags unique)
    allQueries.findWhere("tags",{title:title},function(error,result0){
        if(error){
            res.status(400).json({status:0,err:"error!!"})
        }
        if(result0.length==0){//If same name as given by the user does not exist,then only insert the tag
    allQueries.insert("tags",ob,function(err,result){
        if(err){
            res.status(400).json({status:0,err:"error"})
        }
        if(result){
            res.status(200).json({status:1,result:"Tag created successfully"})
        }
    })
}
        else{//If title is duplicate:
            res.status(400).json({status:0,err:"Tag with this title already exists!"})
            }
})
})

//API to delete a tag from 'tags' collection of the database:
router.post('/delete',function(req,res){
    console.log("req.body....%%%%",req.body)
    //Values given by the user:
    var title=req.body.title;
    allQueries.delete("tags",{title:title},function(err,result){
        if(err){
            res.status(400).json({status:0,err:"error"})
        }
        if(result){
            res.status(200).json({status:1,result:"Tag deleted successfully"})
        }
    })
})
module.exports=router;