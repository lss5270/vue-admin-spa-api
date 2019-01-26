var db=require('./../global/global.js');
var express = require('express');
var ObjectID = require('mongodb').ObjectID; //查询ID模块

var router = express.Router();


// 查找列表数据
router.get("/v2/queryLotteryRecord",function(req,res){

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
        querySql = {"type": {$regex: req.query.type},"userName": {$regex: req.query.userName, $options:'i'} ,"createDate":{$lte:new Date(req.query.endDate),$gte: new Date(req.query.beginDate)} };
    }else{
        //默认查询全部
        querySql = {"type": {$regex: req.query.type},"userName": {$regex: req.query.userName, $options:'i'} };

    }  
    console.log('-------querySql',querySql)  
    //查找4个参数，在哪个集合查，查什么，查完之后做什么
    db.find('lotteryRecord',querySql,pageJson,function(err,result){
        if(err){
            console.log(err);
        }
        res.send(result);
        
    });
});

//红包开启接口
router.get("/v2/lottery/type1",function(req,res){

    let querySql;
    let pageJson = {
            'pageSize': req.query.pageSize,
            'currPage': req.query.currPage
        }
    
    querySql = {"isBonus": "否","userName": {$regex: req.query.userName} ,"recordDate":{$lte:new Date(req.query.endDate),$gte: new Date(req.query.beginDate)} }; 
    console.log('-------querySql',querySql)  
    //查找4个参数，在哪个集合查，查什么，查完之后做什么
    db.find('memberManage',querySql,pageJson,function(err,result){
        if(err){
            console.log(err);
        }
        console.log('66666',result)
        if(result.data.data.length > 0){
            //插入抽奖记录表
            let data = result.data.data[0]
            let _data = {'userName':data.userName,'money':data.money,'type':'1'}
            db.insertOne('lotteryRecord',_data,function(err,result){
                /*if (err) {
                    console.log(err)
                };
                res.send(result.ops);*/
              
            })
            res.send(result)
        }else{
            let _result = {
                "resultCode": "0",
                "resultMsg": "该用户尚未更新记录,请稍后再试",
            }
            res.send(_result)
        }
        
        
    });
});

//爆竹开启接口

module.exports = router;