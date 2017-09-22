var db=require('./../global/global.js');
var express = require('express');
var ObjectID = require('mongodb').ObjectID; //查询ID模块

var userInfoTemplate = require('./../global/userInfo.js');

// console.log('======',userInfoTemplate)

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

//登录 9-21
router.get("/login",function(req,res){
    //查找4个参数，在哪个集合查，查什么，查完之后做什么

    let data = req.query;
    console.log('=======',data)
    db.find('user', {"userName": data.userName}, {},function(err,result){
        if(err){
            console.log(err);
        }
        console.log('查到的账号信息为：',result)
        let itemData = result.data.data[0];

        //定义给登录接口返回的信息模板
        let resData = {
              "resultCode": "0",
              "resultMsg": "登录出错返回信息1",
              "data":{  
                    // "token": "aabbccdd",
                    // "uid": "236e3402dbab51ea17f9f6f360993233",
                           
                }
            };

        if(!itemData){
            //账号不存在
            console.log('账号不存在！')
            resData.resultCode = '-1';
            resData.resultMsg = '账号不存在！';
        }
        else if(itemData._id && itemData.password === data.password){
            //账号 密码正确
            console.log('账号 密码正确')
            resData.resultCode = '0';
            resData.resultMsg = '';
            resData.data.uid = itemData._id;

        }else if(itemData._id && itemData.password !== data.password){
            //账号存在，但是密码不正确
            console.log('账号存在，但是密码不正确')
            resData.resultCode = '-1';
            resData.resultMsg = '密码不正确!';
        }

        res.send(resData);
        // res.send(result);
    });
});

// 根据id查询用户相关信息 9-21
router.get("/getUserInfo",function(req,res){
    let resData = userInfoTemplate;

    //查找4个参数，在哪个集合查，查什么，查完之后做什么
    db.findItem('user',{"_id": new ObjectID(req.query._id)},function(err,result){
        if(err){
            console.log(err);
        }
        let userData = result.data;

        console.log('用户信息为',userData)

        delete userData.password;       //去除密码

        //设置用户基本信息
        resData.data.baseInfo =  userData;       
        resData.data.baseInfo.avatar =  "http://wx4.sinaimg.cn/thumb150/8f9a6d2ely1ffxo1ifuruj21w01w0b2a.jpg";

        //设置菜单权限信息
        resData.data.permissions =  {
                    "/index/readme":true,
                    "/index/personalInfo":true,
                    "/errorpage/401":false,
                    "/errorpage/404":false,
                    "/systemSet/permissionsManage":true,
                    "/systemSet/loginLog":true,
                    "/financialManage/financialAdd":userData.role!=='10012'?true:false,
                    "/financialManage/financialUpdate":userData.role!=='10012'?true:false,
                    "/financialManage/financialList":true,
                    "/financialManage/financialEchart":true,
                    "/user/userList": userData.role=='10010'?true:false,
                    
        };     


        res.send(resData);
        // res.send(result);
    });
});

// 密码校验  9-22
router.get("/validatePassword",function(req,res){
    //查找4个参数，在哪个集合查，查什么，查完之后做什么

    let data = req.query;
    let resData = {
              "resultCode": "0",
              "resultMsg": "登录出错返回信息1",
              "data":{  
                    'result': false
                           
                }
            };

    db.findItem('user',{"_id": new ObjectID(data._id)},function(err,result){
        if(err){
            console.log(err);
        }
        console.log('---',result)

        if(result && result.data.password == data.password){
            resData.data.result = true
        }else{
            resData.data.result = false
        }
        //给前端回传
        res.send(resData);
    });
});

// 密码修改  9-22
router.post("/modifyPassword",function(req,res){
    //查找4个参数，在哪个集合查，查什么，查完之后做什么

    let data = req.body;
    let _id = new ObjectID(data._id);

    // let resData = {
    //           "resultCode": "0",
    //           "resultMsg": "登录出错返回信息1",
    //           "data":{  
    //                 'result': false
                           
    //             }
    //         };

   
    let newData = {
        'oldPassword': data.oldPassword,    //存入旧密码，以便后期对旧密码校验，如腾讯
        'password' : data.newPassword       //把旧密码重置
    };

    db.updateMany(
        "user",         //集合名字

        {
            "_id":  _id     //要改哪里
        },

        {
            $set: newData      //改哪些字段  data中不能包含_id,因为id不能修改
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