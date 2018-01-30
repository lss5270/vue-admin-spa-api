//产品模块路由
var db=require('./../global/global.js');
var express = require('express');
var ObjectID = require('mongodb').ObjectID; //查询ID模块
var router = express.Router();
// 插入数据
router.post('/addproduct',function(req,res){
    //前端的post一共有两种传参方式，
    //一种是body传参，后端通过req.body去拿参数
    //另一种是options传参，后端通过req.query去拿参数
    //正常是：get使用req.query去拿前端传参，post使用req.body
    let data = req.body; //
    db.insertOne('product',data,function(err,result){
        if (err) {
            console.log(err)
        };
        res.send(result.ops);
      
    })
});
// 查找列表数据
router.get("/getprodlist",function(req,res){
    let querySql;
    let pageJson = {
            'pageSize': req.query.pageSize,
            'currPage': req.query.currPage
        }
    if(req.query.productName){
        //根据产品名字 模糊查询
        querySql = {"name": {$regex: req.query.productName, $options:'i'}};

    }else{
        //没有传产品名字，默认查询全部
        queryPar = {};

    }    
    //查找4个参数，在哪个集合查，查什么，查完之后做什么
    db.find('product',querySql,pageJson,function(err,result){
        if(err){
            console.log(err);
        }
        res.send(result);
        
    });
});

//删除
router.get("/delproduct/:id",function(req,res){
   db.deleteMany("product",{"_id": new ObjectID(req.params.id)},function(err,result){
       if(err){
           console.log(err);
       }
        res.send(result);
    });
});
// Checks route params (req.params), ex: /user/:id 
// Checks query string params (req.query), ex: ?id=12 
// Checks urlencoded body params (req.body), ex: id=
//修改


module.exports = router;