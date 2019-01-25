var express=require('express');
var bodyParser = require('body-parser'); //引入body拿参的中间件模块
var app=express();
var fs=require('fs');   //提供更改名字模块

// var cors = require('cors') //跨域资源共享（ CORS ）
// app.use(cors())

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// app.use(express.static('uploadFile'));  //静态资源访问处理
app.use('/static', express.static('uploadFile'));
app.use(express.static('dist'));
// app.use('/static', express.static('dist'));

//引入路由
var StudentsRouter = require('./router/studentsRouter');
var financiaRouter = require('./router/financiaRouter');
var uploadRouter = require('./router/uploadRouter');
var userRouter = require('./router/userRouter');
var productRouter = require('./router/productRouter');
var memberManage = require('./router/memberManage');

function getClientIp(req) {
        return req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    };

//拦截所以api接口设置头部信息（不能放底部，why？）
app.all('*', function(req, res, next) {
  //跨域
  res.header('Access-Control-Allow-Origin', '*');
  res.header("Access-Control-Allow-Headers", "Content-Type,X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5,  Date, X-Api-Version, X-File-Name");
  //设置前端的这些ajax请求方法'GET,POST,PUT,HEAD,DELETE,OPTIONS'，都有权限调接口
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,HEAD,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Credentials', true);

  console.log('前端的请求方法：',req.method,'请求ip为：',getClientIp(req) );
  console.log(req.url,'前端传进来的参数为===：',req.method == 'GET'?req.query:req.body)

  if ('OPTIONS' == req.method) {
      res.send(200);
  } else {
      next();
  }
});

//默认首页路由
app.get('/', function (req, res,next) {
    fs.readFile('./dist/index.html',function(err,data){
        res.writeHead(200,{"Content-type":"text/html;charset=UTF-8"})
        res.end(data);
    })
      
});

app.use('/api', StudentsRouter);
app.use('/api', financiaRouter);
app.use('/api', uploadRouter);
app.use('/api', userRouter);
app.use('/api', productRouter);
app.use('/api', memberManage);

app.listen(3000, '0.0.0.0',function(){
    console.log("您好，你的node服务已启动！请在浏览器窗口打开URL：localhost:3000")
})

//解决ip娶不到的问题:
//http.createServer().listen()的默认是ipv6，你可以改成.listen(port, “0.0.0.0”)强制指定为ipv4.