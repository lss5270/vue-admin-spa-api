var db=require('./../global/global.js');
var express = require('express');
var financialList=require('./../global/financialList.js');
// var ObjectID = require('mongodb').ObjectID; //查询ID模块

var xlsx = require('node-xlsx');
var fs = require('fs');

var formidable = require('formidable'); //提供上传文件的模块
// var fs=require('fs');   //提供更改名字模块
var path = require("path"); //提供获取获取后罪名的方法

var router = express.Router();


// 数据导入 post
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
            console.log('--------filename:',filename,'--------path:',files.file.path)

            var oldpath = files.file.path;
            var extname = path.extname(files.file.name);
            var newpath =   oldpath + extname;
            
            fs.rename(oldpath,newpath); //默认重命名
           
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
<<<<<<< HEAD
    console.log('------11122-',excelPath)
    let _excelPath = path.resolve(__dirname, '../'+excelPath);
    // let obj = xlsx.parse(__dirname+'./../'+excelPath); //2次上传路径 经常解析错误。(目测是文件写入需要时间)
    let obj = xlsx.parse(_excelPath); //2次上传路径 经常解析错误。(目测是文件写入需要时间)
=======
    console.log('------1112-',excelPath)
    let obj = xlsx.parse('./../'+excelPath); //2次上传路径 经常解析错误。(目测是文件写入需要时间)
>>>>>>> b09c47013e3801e4b33638e30ed612ea6028a61c
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
<<<<<<< HEAD
        fs.unlink(_excelPath, (err) => {
=======
        fs.unlink('./../'+excelPath, (err) => {
>>>>>>> b09c47013e3801e4b33638e30ed612ea6028a61c
            if (err) throw err;
            console.log('成功删除',_excelPath);
        });
    // },2222)

    return false;
    
}
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