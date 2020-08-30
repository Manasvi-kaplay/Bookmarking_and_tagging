var express=require("express");
var router=express.Router();
var allQueries=require("../model/allQueries")
var Long = require('mongodb').Long;

//API to create a tag and attach it to a specific bookmark:
router.post('/add_to_bookmark',function(req,res){

//Values need to be entered by the user to mention the tags and the bookmark where they are to be attached:
    var title=req.body.title;
    var link=req.body.link;
    var publisher=req.body.publisher;
    var tags=req.body.tags;
    var time_c=req.body.time_created;

    var time_created = new Date().getTime()/1000;
    //function to generate uuid:
    function uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
    }
    var ob;
    var arr=[];
    var tag_list=[];
    tags.forEach(function(x){
     ob={"id":uuidv4(),"title":x,"time_created": Long.fromNumber(time_created),"time_updated":Long.fromNumber(time_created)}
    arr.push(ob);
    tag_list.push(ob.id);
    })
//Array of objects containing the tags(provided by the user):
    console.log("final array to be inserted...",arr)

//Array of tags uuids to be inserted in bookmarks collection:
    console.log("final tag_list to be inserted...",tag_list)

//Updated data(object) to be saved in database:
    var obj={"id":uuidv4(),"title":title,"link":link,"publisher":publisher,"time_created":time_c,"time_updated":Long.fromNumber(time_created),"tags":tag_list}

    //Calling database query to ensure 'title' field of tags collection is unique: 
    allQueries.createIndex("tags",{title:1},function(err,result0){
//Calling database query to insert multiple tags in 'tags' collection provided by the user:
    allQueries.insertMany("tags",arr,function(err1,result1){
//Calling database query to update bookmark in 'bookmarks' collection:
        allQueries.update("bookmarks",{link:link},obj,function(err2,result2){
            if(err){
                console.log("err....",err)
            }
            if(err1){
                console.log("err1...",err1)
                res.status(400).json({status:0,err:"err1"})
            }
        if(err2){
            console.log("err2....",err2)
            res.status(400).json({status:0,err:"err2"})
        }
        if(result1 && result2){
            res.status(200).json({status:1,result:"Tags inserted in 'tags' collection and bookmark updated"})
        }
    })
    })
})
})

//API to remove a tag from a specific bookmark:
router.post('/remove_from_bookmark',function(req,res){
//Data values to be entered by the user:
    var title=req.body.title;
    var link=req.body.link;
    var publisher=req.body.publisher;
    var tags=req.body.tags;
    var time_c=req.body.time_created;
    var time_created = new Date().getTime()/1000;
    function uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
    }
//updated object to be saved in 'bookmarks' collection:
    var obj={"id":uuidv4(),"title":title,"link":link,"publisher":publisher,"time_created":time_c,"time_updated":Long.fromNumber(time_created),"tags":tags}
    
//Calling database query to remove the tag from the bookmark and update the bookmark: 
    allQueries.update("bookmarks",{link:link},obj,function(err,result){
        if(err){
            res.status(400).json({status:0,err:"err2"})
        }
        if(result){
            res.status(200).json({status:1,result:"Tag removed from bookmark and bookmark updated!"})
        }
    })
})

//API to remove all tags from a specific bookmark:
router.post('/removeAll_from_bookmark',function(req,res){
    var link=req.body.link;
//Calling database query to remove entire 'tags' field from a specific bookmark:
    allQueries.remove_field("bookmarks",{link:link},{tags:""},function(err,result){
        if(err){
            res.status(400).json({status:0,err:"err"})
        }
        if(result){
            res.status(200).json({status:1,result:"All tags removed from the mentioned bookmark"})
        }
    })
})
module.exports=router;