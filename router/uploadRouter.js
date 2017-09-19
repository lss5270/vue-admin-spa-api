var db=require('./../global/global.js');
var express = require('express');
// var ObjectID = require('mongodb').ObjectID; //查询ID模块
let ejsExcel=require('ejsexcel');
let fs=require('fs');


var router = express.Router();


// 插入数据 post
router.get('/fileUpload',function(req,res){
    console.log("进来了-----");
    //1.先处理上传


    //2.上传成后解析excel文件成json，并存入数据库
    let exBuf=fs.readFileSync(__dirname+'./../uploadFile/test.xlsx');
    let workSheets;

    ejsExcel.getExcelArr(exBuf).then(exlJson=>{
        console.log("************  read success:getExcelArr");
        let workBook=exlJson;
        workSheets=workBook[0];
        workSheets.forEach((item,index)=>{
                console.log((index+1)+" row:"+item.join('    '));
        })
    }).catch(error=>{
        console.log("************** had error!");
        console.log(error);
    });

    res.send("h回来了-----"); //workSheets

});

module.exports = router;