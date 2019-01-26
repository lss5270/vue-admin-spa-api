var db=require('./../global/global.js');
var express = require('express');
var financialList=require('./../global/financialList.js');
var ObjectID = require('mongodb').ObjectID; //查询ID模块

var xlsx = require('node-xlsx');
var fs = require('fs');

var formidable = require('formidable'); //提供上传文件的模块
// var fs=require('fs');   //提供更改名字模块
var path = require("path"); //提供获取获取后罪名的方法

var router = express.Router();


// 财务数据导入 post
router.post('/importFinancialExcel',function(req,res){
    console.log("进来了-----");
    //1.先处理上传
        // 第一步：new一个实例
        var form = new formidable.IncomingForm();
        // 第二步：设置我们的上传路径
        form.uploadDir = "./uploadFile";

        // 第三步：设置全部上传完毕后的执行函数
        form.parse(req, function(n,filename,files){ 
            console.log('--------arguments:',arguments)
            console.log('--------filename:',filename,'--------files:',files.file)

            var oldpath = files.file.path;
            var extname = path.extname(files.file.name);
            var newpath =   oldpath + extname;
            
            fs.rename(oldpath,newpath,function(err){
                console.log('导入报错啦====',err)
            }); //默认重命名
            
            console.log('-------文件路径为：',newpath)
            //定义返回的模拟json数据
            let jsonData = {
                    url: newpath
                }
            //end中必须放字符串
            // res.send( jsonData )
            // res.json(jsonData)

            //excel2json(res,newpath)
            setTimeout(function(){
                excel2json(res,newpath)
            },1234)
            
            //正常此处应该有插表的业务代码，把数据保存在数据库。此处省略。lss 2017/9/5
            
        });


    //2.上传成后解析excel文件成json，
        
    //3.连接数据库，并把数据存入
});

//插入数据表的英文字段
// let arr = ['financialDate','companyIncome','onlinePay','manualDeposit','rechargeTotal'];
let arr = financialList[1];

//提交入参： {"financialDate":"2017-9-19","companyIncome":"22","onlinePay":"22","manualDeposit":"22","manualDeductions":"","expendTotal":"","prepaidUser":"","drawingsUsr":"","watercourse":"","downProfit":null,"depositDiscounts":null,"activityDiscounts":null,"returnMoney":null,"rechargeTotal":66,"ARPPU":66,"rechargeBalance":66,"upProfits":0}
function excel2json(res,excelPath){
    // var xlsx = require('node-xlsx');
    // var fs = require('fs');
    //读取文件内容

    console.log('------11122-',excelPath)
    let _excelPath = path.resolve(__dirname, '../'+excelPath);
    // let obj = xlsx.parse(__dirname+'./../'+excelPath); //2次上传路径 经常解析错误。(目测是文件写入需要时间)
    let obj = xlsx.parse(_excelPath); //2次上传路径 经常解析错误。(目测是文件写入需要时间)

    let excelObj=obj[0].data;
    // console.log('解析的json--------',excelObj);
    /*[ [ '时间', '公司入款', '线上支付', '人工存入', '充值合计' ],
     [ '2017-9-17', '33366', '22', '111', '466' ],
     [ '2017-9-19', '100190', '1', '1', '3' ],
     [ '2017-9-18', '2', '2', '2', '6' ] ]*/

    for(var i = 1, len = excelObj.length;i < len; i++) {
        //定义提交入参
        let insertData = {};
        let item = excelObj[i];

        for(j in item){
            
            insertData[arr[j]] = item[j]
        }
        
        // console.log('=====',insertData)
        // return false;
        // //插入数据的是{}，非数组。多次插入
        financialInsert(insertData)
        
    }
    //定义返回的数据json
    let resData = {
          "resultCode": "0",
          "resultMsg": "插入成！",
          "data": {
            
          }
        };
   
    function financialInsert(insertData){
        insertData.financialDateDate = new Date(insertData.financialDate);
        
        db.insertOne('financialManage',insertData,function(err,result){
            if (err) {
                console.log('报错啦====',err)
            };
            // res.send(resData);
            //res.json(resData );
        }) 
    }
    // setTimeout(function(){
        //给接口回传数据
        res.json(resData );

        //删除上传的文件

        fs.unlink(_excelPath, (err) => {

            if (err) throw err;
            console.log('成功删除',_excelPath);
        });
    // },2222)

    return false;
    
}

// 会员数据导入 post
router.post('/importMemberExcel',function(req,res){
    console.log("进来了-----");
    //1.先处理上传
        // 第一步：new一个实例
        var form = new formidable.IncomingForm();
        // 第二步：设置我们的上传路径
        form.uploadDir = "./uploadFile";

        // 第三步：设置全部上传完毕后的执行函数
        form.parse(req, function(n,filename,files){ 
            console.log('--------arguments:',arguments)
            console.log('--------files:',files)

            var oldpath = files.file.path;
            var extname = path.extname(files.file.name);
            var newpath =   oldpath + extname;
            
            fs.rename(oldpath,newpath,function(err){
                console.log('导入报错啦====',err)
            }); //默认重命名
           
            console.log('-------文件路径为：',newpath)
            //定义返回的模拟json数据
            let jsonData = {
                    url: newpath
                }
            //end中必须放字符串
            // res.send( jsonData )
            // res.json(jsonData)

            //excel2json(res,newpath)
            setTimeout(function(){
                excel2json02(res,newpath)
            },1234)
            
            //正常此处应该有插表的业务代码，把数据保存在数据库。此处省略。lss 2017/9/5
            
        });


    //2.上传成后解析excel文件成json，
        
    //3.连接数据库，并把数据存入
});
//插入数据表的英文字段
let arr02 = ['userName','money','firecrackerNumber','recordDate','isBonus']

//提交入参： {"financialDate":"2017-9-19","companyIncome":"22","onlinePay":"22","manualDeposit":"22","manualDeductions":"","expendTotal":"","prepaidUser":"","drawingsUsr":"","watercourse":"","downProfit":null,"depositDiscounts":null,"activityDiscounts":null,"returnMoney":null,"rechargeTotal":66,"ARPPU":66,"rechargeBalance":66,"upProfits":0}
function excel2json02(res,excelPath){
    // var xlsx = require('node-xlsx');
    // var fs = require('fs');
    //读取文件内容

    console.log('------11122-',excelPath)
    let _excelPath = path.resolve(__dirname, '../'+excelPath);
    // let obj = xlsx.parse(__dirname+'./../'+excelPath); //2次上传路径 经常解析错误。(目测是文件写入需要时间)
    let obj = xlsx.parse(_excelPath); //2次上传路径 经常解析错误。(目测是文件写入需要时间)

    let excelObj=obj[0].data;
    console.log('解析的json--------',excelObj);
   
    for(var i = 1, len = excelObj.length;i < len; i++) {
        //定义提交入参
        let insertData = {};
        let item = excelObj[i];

        for(j in item){
            
            insertData[arr02[j]] = item[j]
        }
        
        console.log('=====',insertData)
        // return false;
        // //插入数据的是{}，非数组。多次插入
        //插入会员管理-红包表
        memberInsert(insertData)
        //插入爆竹统计表
        firecrackerInsert(insertData)
    }
    //定义返回的数据json
    let resData = {
          "resultCode": "0",
          "resultMsg": "插入成！",
          "data": {
            
          }
        };
   
    function memberInsert(insertData){
        insertData.recordDate = new Date(insertData.recordDate)
        //insertData.creatDate = new Date()

        db.insertOne('memberManage',insertData,function(err,result){
            if (err) {
                console.log('报错啦====',err)
            };
            // res.send(resData);
            //res.json(resData );
        }) 
    }
    function firecrackerInsert(insertData){
        //先查询统计表内是否含有该用户名，若已经存在则相加，若不存在则直接插入
        let _userName = insertData.userName
        //查找4个参数，在哪个集合查，查什么，查完之后做什么
        db.find('firecrackerCount', {"userName": {$regex: _userName}}, {}, function(err,result){
            if(err){
                console.log(err);
            }
            //res.send(result);
            console.log('查到统计表---',result)
            //若不存在
            if(result.data.total==null || result.data.total==0){
                let _insertData={'userName':_userName,'firecrackerCount':insertData.firecrackerNumber}
                db.insertOne('firecrackerCount',_insertData,function(err,result){
                    if (err) {
                        console.log('报错啦====',err)
                    };
                    
                }) 
            }else{
                console.log('======已经存在啦======',result.data.data)
                //db.firecrackerCount.updateMany({'userName':_userName},{$set:{firecrackerCount:result.data.data+insertData.firecrackerNumber}})
                let data = result.data.data[0];
                let _id = new ObjectID(data._id);
                delete data._id

                let _num = Number(data.firecrackerCount)+Number(insertData.firecrackerNumber)
                console.log('去id后的data=====',data,_num)

                db.updateMany(
                    "firecrackerCount",         //集合名字

                    {
                        "_id":  _id     //要改哪里
                    },

                    {
                        $set: {'firecrackerCount':_num,} //改哪些字段  data中不能包含_id,因为id不能修改
                    },

                    function(err,result){   //改完之后做什么
                        if(err){
                            console.log(err);
                        }
                        /*res.send(result);*/
                    }
                );
            }
        })
        /*db.insertOne('firecrackerCount',insertData,function(err,result){
            if (err) {
                console.log('报错啦====',err)
            };
            
        }) */
    }
    // setTimeout(function(){
        //给接口回传数据
        res.json(resData );

        //删除上传的文件

        fs.unlink(_excelPath, (err) => {

            if (err) throw err;
            console.log('成功删除',_excelPath);
        });
    // },2222)

    return false;
    
}


/*此函数作废*/
function excel2json2(res,excelPath){
    //第二种解析excel表格，
    var ejsExcel=require('ejsexcel');
    var fs=require('fs');
    let exBuf=fs.readFileSync(__dirname+'./../'+excelPath);
    let workSheets;

    ejsExcel.getExcelArr(exBuf).then(exlJson=>{
        console.log("************  read success:getExcelArr");
        let workBook=exlJson;
        workSheets=workBook[0];
        // console.log('解析的json--------',workSheets);

        workSheets.forEach((item,index)=>{
                console.log((index+1)+" row:"+item.join('    '));
        })
    }).catch(error=>{
        console.log("************** had error!");
        console.log(error);

        //出错给接口返回错误信息
        res.json(error)
    });

}

module.exports = router;