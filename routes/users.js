var express = require('express');
var router = express.Router();

let {
  find,
  insert
} = require('../libs/mysql.js');
var token = require("../libs/token.js");

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

//注册路由
router.post('/registe', async (req, res, next) => {
  let {
    inputPhone,
    inputPassword
  } = req.body;
  let phoneIsUse = await find('tb_user_login', {
    login_phone: inputPhone
  })
  if (phoneIsUse.length > 0) {
    res.send({
      status: "fail"
    });
  } else {
    insert('tb_user_login', {
      login_phone: inputPhone,
      password: inputPassword
    })
    //获取新添加用户id
    let newUser = await find('tb_user_login',{
      login_phone: inputPhone
    })
    let newId = newUser[0].id;
    insert('tb_user_info',{
      user_id: newId
    })
    res.send({
      status: "success"
    })
  }
})

//登录路由
router.post('/login', async (req, res, next) => {
  let {
    inputPhone,
    inputPassword
  } = req.body;
  let data = await find('tb_user_login', {
    login_phone: inputPhone
  })
  if (data.length > 0 && data[0].password == inputPassword) {
    let userId = data[0].id;
    res.send({
      status: "success",
      token: token.createToken({
        userId,
        inputPhone,
        inputPassword
      }, 7200)
    });
  } else {
    res.send({
      status: "fail",
    });
  }
})

//登录判断路由
router.post('/isLogin', async (req, res, next) => {
  var tokenObj = token.decodeToken(req.headers.token);
  if(tokenObj){
    // 根据tokenObj.userId 查 tb_user_info 表
    var curUserId = tokenObj.payload.data.userId;
    let data = await find('tb_user_info',{
      user_id: curUserId
    })
    var curNickName = '';
    if(data.length>0){
      curNickName = data[0].nickname;
    }else{
      curNickName = '用户您好'
    }
    res.send({
      status: token.checkToken(req.headers.token),
      nickname: curNickName,
      uid : curUserId
    })
  }else{
    res.send({
      status: token.checkToken(req.headers.token)
    })
  }
})

module.exports = router;
