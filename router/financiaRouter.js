var db=require('./../global/global.js');
var express = require('express');
var ObjectID = require('mongodb').ObjectID; //查询ID模块

var router = express.Router();


// 插入数据
router.post('/financialAdd',function(req,res){
    //前端的post一共有两种传参方式，
    //一种是body传参，后端通过req.body去拿参数
    //另一种是options传参，后端通过req.query去拿参数
    //正常是：get使用req.query去拿前端传参，post使用req.body
    res.setHeader('Access-Control-Allow-Origin', '*'); //设置接口跨域，提供给第三者使用
    
    let data = req.body; //{name:'你大爷',age:18}

        data.financialDateDate = new Date(data.financialDate);

    db.insertOne('financialManage',data,function(err,result){
        if (err) {
            console.log(err)
        };
        res.send(result.ops);
      
    })

});

// 查找列表数据
router.get("/financialListQuery",function(req,res){
    let querySql;
    let pageJson = {
            'pageSize': req.query.pageSize,
            'currPage': req.query.currPage
        }
    let json = req.query;

        if(json.beginDate){
            //根据时间段查询数据。未成功~
            //时间查询，数据库字段必须为date，不能是string。
            querySql={"financialDateDate":{$gte: new Date(json.beginDate),$lte:new Date(json.endDate) }}

            console.log('呵呵条件为',querySql)
        }
        else{
            //没有传参，默认查询全部
            querySql = {};

        }

    //查找4个参数，在哪个集合查，查什么，查完之后做什么
    db.find('financialManage',querySql,pageJson,function(err,result){
        if(err){
            console.log(err);
        }
        res.send(result);
        
    });
});
// 查找单条详情数据
router.get("/queryFinancialItem",function(req,res){

    //查找4个参数，在哪个集合查，查什么，查完之后做什么
    db.findItem('financialManage',{"_id": new ObjectID(req.query.id)},function(err,result){
        if(err){
            console.log(err);
        }
        res.send(result);
        
    });
});

//删除
router.get("/financialDel",function(req,res){
    
    db.deleteMany("financialManage",{"_id": new ObjectID(req.query.id)},function(err,result){
       if(err){
           console.log(err);
       }
        res.send(result);
    });
});

//修改
router.post("/financialUpdate",function(req,res){
    let data = req.body;
    let _id = new ObjectID(data._id);
    
    delete data._id
    //置入数据修改时间
    data.updateDate = new Date();

    console.log('去id后的data=====',data)

    db.updateMany(
        "financialManage",         //集合名字

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