# vue-admin-spa-api 1.0（qq技术群：645582193）

# 此node项目为两个前端项目（https://github.com/lss5270/vue-admin-spa） 提供在线api接口#

## 如何运行
下载项目
```
 git clone https://github.com/lss5270/vue-admin-spa-api.git
```

进入到vue-admin-spa-api目录
```
 npm run pm2
```

## 此后端代码，主要提供以下功能接口：
- 学生信息模块的增删查改
- 头像上传
- 财务信息模块的增删查改
- 导入导出
- 账户模块的增删查改
- 登录、密码修改校验

（接口不断完善中……）

## 接口使用
```
	学生管理模块
    1.学生信息添加
    请求链接：http://localhost:3000/api/addStudents
    请求方法：post
    请求参数：{name:'张三',se:'man'}
    
    2.学生信息删除
    请求链接：http://localhost:3000/api/delStudents
    请求方法：get
    请求参数：{id:59b27cde2adf8527a45a7a92}
    
    3.学生信息查询
    请求链接：http://localhost:3000/api/queryStudents
    请求方法：get
    请求参数：{studentName:'张三'}
    
    4.学生信息修改
    请求链接：http://localhost:3000/api/modifyStudents
    请求方法：post
    请求参数：{id:59b27cde2adf8527a45a7a92,studentName:'李四'}
    
    5.学生信息详情查询
    请求链接：http://localhost:3000/api/queryStudentsItem
    请求方法：get
    请求参数：{id:59b27cde2adf8527a45a7a92}

	
 	财务管理模块
    1.财务信息添加
    请求链接：http://localhost:3000/api/financialAdd
    请求方法：post
    请求参数：{"companyIncome" : 6701,"onlinePay" : 8513.05,}
    
    2.财务信息删除
    请求链接：http://localhost:3000/api/financialDel
    请求方法：get
    请求参数：{'id':59b27cde2adf8527a45a7a92}
    
    3.财务信息查询
    请求链接：http://localhost:3000/api/financialListQuery
    请求方法：get
    请求参数：{'id':59b27cde2adf8527a45a7a92}
    
    4.财务信息修改
    请求链接：http://localhost:3000/api/financialUpdate
    请求方法：post
    请求参数：{id:59b27cde2adf8527a45a7a92,"companyIncome" : 999}
    
    5.财务信息详情查询
    请求链接：http://localhost:3000/api/queryFinancialItem
    请求方法：get
    请求参数：{id:59b27cde2adf8527a45a7a92}

 	账户模块
    1.账户添加
    请求链接：http://localhost:3000/api/addUser
    请求方法：post
    请求参数：{"userName" : "admin","password" : "43b724755e5f781c3b369d1018847eb6","role" : "10010",}
    
    2.账户删除
    请求链接：http://localhost:3000/api/deleteUser
    请求方法：get
    请求参数：{'id':59b27cde2adf8527a45a7a92}
    
    3.账户查询
    请求链接：http://localhost:3000/api/queryUser
    请求方法：get
    请求参数：{'id':59b27cde2adf8527a45a7a92}
    
    4.账户修改
    请求链接：http://localhost:3000/api/modifyUser
    请求方法：post
    请求参数：{id:59b27cde2adf8527a45a7a92,"companyIncome" : 999}
    
    5.账户详情查询
    请求链接：http://localhost:3000/api/queryUserItem
    请求方法：get
    请求参数：{id:59b27cde2adf8527a45a7a92}

 	6.登录
    请求链接：http://localhost:3000/api/login
    请求方法：get
    请求参数：{"userName" : "admin","password" : "43b724755e5f781c3b369d1018847eb6"}

 	7.查询用户相关信息（含权限）
    请求链接：http://localhost:3000/api/getUserInfo
    请求方法：get
    请求参数：{"userName" : "admin","password" : "43b724755e5f781c3b369d1018847eb6"}

 	8.查询用户相关信息（含权限）
    请求链接：http://localhost:3000/api/getUserInfo
    请求方法：get
    请求参数：{id:59b27cde2adf8527a45a7a92}

 	9.密码校验
    请求链接：http://localhost:3000/api/validatePassword
    请求方法：get
    请求参数：{id:59b27cde2adf8527a45a7a92,"password" : "43b724755e5f781c3b369d1018847eb6"}
	
	10.密码修改（修改前需要校验）
    请求链接：http://localhost:3000/api/modifyPassword
    请求方法：post
    请求参数：{id:59b27cde2adf8527a45a7a92,"oldPassword" : "43b724755e5f781c3b369d1018847eb6","newPassword" : "43b724755e5f781c3b369d1018847eb6"}

 	导入导出
 	1.excel数据导入
    请求链接：http://localhost:3000/api/importFinancialExcel
    请求方法：post
    请求参数：
```
