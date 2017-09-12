# vue-admin-spa-api

# 此node项目为 vue-admin-spa （https://github.com/lss5270/vue-admin-spa） 提供在线api接口#

## 功能()
- 学生信息模块的增删查改
- 头像上传

## 接口使用
```
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
    请求链接：http://localhost:3000/api/studentUpdate
    请求方法：get
    请求参数：{id:59b27cde2adf8527a45a7a92,studentName:'李四'}
    
    5.学生信息详情查询
    请求链接：http://localhost:3000/api/queryStudentsItem
    请求方法：get
    请求参数：{id:59b27cde2adf8527a45a7a92}
```
