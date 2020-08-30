//This file contains routes to all the files of the 'controller' folder

var express=require("express");
var router=express.Router();
router.use("/bookmarks",require("./bookmarks"))
router.use("/tags",require("./tags"))
router.use("/tagging_bookmarks",require("./tagging_bookmarks"))
module.exports=router;