var db=require('./../global/global.js');
var express = require('express');
var ObjectID = require('mongodb').ObjectID; //查询ID模块

var router = express.Router();


// 插入数据
router.get('/v2/addMemberManage',function(req,res){
    //前端的post一共有两种传参方式，
    //一种是body传参，后端通过req.body去拿参数
    //另一种是options传参，后端通过req.query去拿参数
    //正常是：get使用req.query去拿前端传参，post使用req.body
    res.setHeader('Access-Control-Allow-Origin', '*'); //设置接口跨域，提供给第三者使用
    
    let data = req.body; //

    db.insertOne('memberManage',data,function(err,result){
        if (err) {
            console.log(err)
        };
        res.send(result.ops);
      
    })

});

// 查找列表数据
router.get("/v2/queryMember",function(req,res){

    let querySql;
    let pageJson = {
            'pageSize': req.query.pageSize,
            'currPage': req.query.currPage
        }
    /*if(req.query.userName && req.query.beginDate){
        //根据字段 模糊查询
        querySql = {"userName": {$regex: req.query.userName, $options:'i'},"recordDate":{$gte: new Date(req.query.beginDate),$lte:new Date(req.query.endDate)} };

    }else if(req.query.userName){
        querySql = {"userName": {$regex: req.query.userName, $options:'i'} };
    }else*/ 
    if(req.query.beginDate){
        querySql = {"userName": {$regex: req.query.userName, $options:'i'} ,"recordDate":{$gte: new Date(req.query.beginDate),$lte:new Date(req.query.endDate)} };
    }else{
        //默认查询全部
        querySql = {"userName": {$regex: req.query.userName, $options:'i'} };

    }  
    console.log(querySql)  
    //查找4个参数，在哪个集合查，查什么，查完之后做什么
    db.find('memberManage',querySql,pageJson,function(err,result){
        if(err){
            console.log(err);
        }
        res.send(result);
        
    });
});
// 查找单条详情数据
router.get("/v2/queryMemberItem",function(req,res){

    //查找4个参数，在哪个集合查，查什么，查完之后做什么
    db.findItem('memberManage',{"_id": new ObjectID(req.query.id)},function(err,result){
        if(err){
            console.log(err);
        }
        res.send(result);
        
    });
});

//删除
router.get("/v2/delMember",function(req,res){
    
    db.deleteMany("memberManage",{"_id": new ObjectID(req.query.id)},function(err,result){
       if(err){
           console.log(err);
       }
        res.send(result);
    });
});

//修改
router.post("/v2/modifyMember",function(req,res){
    let data = req.body;
    let _id = new ObjectID(data._id);
    
    delete data._id
    console.log('去id后的data=====',data)

    data.recordDate = new Date(data.recordDate)
    data.createDate = new Date(data.createDate)
    db.updateMany(
        "memberManage",         //集合名字

        {
            "_id":  _id     //要改哪里
        },

        {
            $set: data      //改哪些字段  data中不能包含_id,因为id不能修改
        },

        function(err,result){   //改完之后做什么
            if(err){
                console.log(err);
            }
            res.send(result);
        }
    );
});

module.exports = router;