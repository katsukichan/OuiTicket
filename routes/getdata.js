var express = require('express');
var router = express.Router();

let {
  find,
  indexFind,
  categoryOrderBy,
  classifyFindId,
  classifyFindDate
} = require('../libs/mysql.js');

router.get('/', (req, res, next) => {
  res.send('getdata');
});

//根据分类获取演出数据
router.post('/showByCategory', async (req, res, next) => {
  let {
    type
  } = req.body;
  let data = await indexFind('tb_show', {
    category: type
  });
  res.send(data);
})

//分类页获取演出数据
router.post('/show', async (req, res, next) => {
  let {
    qty,
    currentPage,
    order,
    curCity,
    curCategory
  } = req.body;
  if (order == 'id') {
    //查询orederby id
    if (curCity == '全部' && curCategory == '全部') {
      var resultData = await classifyFindId('tb_show');
    }
    else if (curCity != '全部' && curCategory == '全部') {
      var resultData = await classifyFindId('tb_show', {
        city: curCity
      });
    }
    else if (curCity == '全部' && curCategory != '全部') {
      var resultData = await classifyFindId('tb_show', {
        category: curCategory
      });
    }
    else if (curCity != '全部' && curCategory != '全部') {
      var resultData = await classifyFindId('tb_show', {
        city: curCity,
        category: curCategory
      });
    }
  } else {
    //查询orderby date
    if (curCity == '全部' && curCategory == '全部') {
      var resultData = await classifyFindDate('tb_show');
    }
    else if (curCity != '全部' && curCategory == '全部') {
      var resultData = await classifyFindDate('tb_show', {
        city: curCity
      });
    }
    else if (curCity == '全部' && curCategory != '全部') {
      var resultData = await classifyFindDate('tb_show', {
        category: curCategory
      });
    }
    else if (curCity != '全部' && curCategory != '全部') {
      var resultData = await classifyFindDate('tb_show', {
        city: curCity,
        category: curCategory
      });
    }
  }
  //获取数据总长度
  let len = resultData.length;
  //根据传入数量页码切割数据
  let pageData = resultData.slice((currentPage - 1) * qty, currentPage * qty);
  res.send({
    data: pageData,
    totalLen: len,
    sendQty: qty,
    sendPage: currentPage
  });
})

//分类数据获取
router.get('/category', async (req, res, next) => {
  let data = await categoryOrderBy('tb_category');
  res.send(data);
});

//城市数据
router.get('/city', async (req, res, next) => {
  let data = await find('tb_city');
  res.send(data);
})

//详情页数据获取
router.get('/showById', async (req, res, next) => {
  let {
    sid
  } = req.query;
  let data = await find('tb_show', {
    id: sid
  });
  res.send(data);
})

//获取当前用户信息路由
router.get('/userInfo', async (req, res, next) => {
  let {
    uid
  } = req.query;
  let data = await find('tb_user_info', {
    user_id: uid
  });
  res.send(data);
})

//获取当前用户地址路由
router.get('/userAddress', async (req, res, next) => {
  let {
    sendUid
  } = req.query;
  let data = await find('tb_user_address', {
    user_id: sendUid
  });
  res.send(data);
})

//获取当前用户订单信息
router.get('/userOrder', async (req, res, next) => {
  let {
    sendUid
  } = req.query;
  let data = await find('tb_order', {
    u_id: sendUid
  });
  res.send(data);
})


module.exports = router;
