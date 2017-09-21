var db=require('./../global/global.js');
var express = require('express');
var ObjectID = require('mongodb').ObjectID; //查询ID模块

var router = express.Router();

// 插入数据
router.post('/addUser',function(req,res){
    
    let data = req.body; 

    db.insertOne('user',data,function(err,result){
        if (err) {
            console.log(err)
        };
        res.send(result.ops);
      
    })

});

// 查找列表数据
router.get("/queryUser",function(req,res){
    let querySql;
    let pageJson = {
        'pageSize': req.query.pageSize,
        'currPage': req.query.currPage
    }
    if(req.query.userName){
        //根据用户名 模糊查询
        console.log("---------",req.query.userName);
        querySql = {"userName": {$regex: req.query.userName, $options:'i'}};

    }else{
        //没有传用户名，默认查询全部
        queryPar = {};

    }    
    //查找4个参数，在哪个集合查，查什么，查完之后做什么
    db.find('user', querySql, pageJson, function(err,result){
        if(err){
            console.log(err);
        }
        res.send(result);
        
    });
});

//判断账户是否重复
router.get("/existUser",function(req,res){
    //查找4个参数，在哪个集合查，查什么，查完之后做什么
    db.findExistUser('user', {"userName": req.query.userName}, function(err,result){
        if(err){
            console.log(err);
        }
        res.send(result);
    });
});

// 查找学生单条详情数据
router.get("/queryUserItem",function(req,res){
    //查找4个参数，在哪个集合查，查什么，查完之后做什么
    db.findItem('user',{"_id": new ObjectID(req.query.id)},function(err,result){
        if(err){
            console.log(err);
        }
        res.send(result);
    });
});

//删除
router.get("/deleteUser",function(req,res){
    db.deleteMany("user",{"_id": new ObjectID(req.query.id)},function(err,result){
       if(err){
           console.log(err);
       }
        res.send(result);
    });
});

//修改
router.post("/modifyUser",function(req,res){
    let data = req.body;
    let _id = new ObjectID(data._id);
    console.log('前端传进来的data=====',data)
    delete data._id
    console.log('去id后的data=====',data)

    db.updateMany(
        "user",         //集合名字

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