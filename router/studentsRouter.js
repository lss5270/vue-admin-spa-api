var db=require('./../global/global.js');
var express = require('express');
var ObjectID = require('mongodb').ObjectID; //查询ID模块

var router = express.Router();


// 插入数据
router.post('/addStudents',function(req,res){
    //前端的post一共有两种传参方式，
    //一种是body传参，后端通过req.body去拿参数
    //另一种是options传参，后端通过req.query去拿参数
    //正常是：get使用req.query去拿前端传参，post使用req.body
    res.setHeader('Access-Control-Allow-Origin', '*'); //设置接口跨域，提供给第三者使用
    
    let data = req.body; //{name:'你大爷',age:18}

    db.insertOne('students',data,function(err,result){
        if (err) {
            console.log(err)
        };
        res.send(result.ops);
      
    })

});

// 查找列表数据
router.get("/queryStudents",function(req,res){

    //查找4个参数，在哪个集合查，查什么，查完之后做什么
    db.find('students',req.query,function(err,result){
        if(err){
            console.log(err);
        }
        res.send(result);
        
    });
});
// 查找学生单条详情数据
router.get("/queryStudentsItem",function(req,res){

    //查找4个参数，在哪个集合查，查什么，查完之后做什么
    db.findItem('students',{"_id": new ObjectID(req.query.id)},function(err,result){
        if(err){
            console.log(err);
        }
        res.send(result);
        
    });
});

//删除
router.get("/delStudents",function(req,res){
    
    db.deleteMany("students",{"_id": new ObjectID(req.query.id)},function(err,result){
       if(err){
           console.log(err);
       }
        res.send(result);
    });
});

//修改
router.post("/modifyStudents",function(req,res){
    let data = req.body;
    let _id = new ObjectID(data._id);
    
    delete data._id
    console.log('去id后的data=====',data)

    db.updateMany(
        "students",         //集合名字

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