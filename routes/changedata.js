var express = require('express');
var router = express.Router();

let {
    find,
    insert,
    update,
    checkPsw,
    del
} = require('../libs/mysql.js');

router.get('/', (req, res, next) => {
    res.send('changedata');
});

//更新用户信息路由
router.post('/updateUserInfo', async (req, res, next) => {
    let {
        sendNickName,
        sendGender,
        sendUid
    } = req.body;
    //判断当前账号有无信息
    let isInfo = await find('tb_user_info', {
        user_id: sendUid
    })
    if (isInfo.length == 0) {
        await insert('tb_user_info', {
            user_id: sendUid,
            nickname: sendNickName,
            gender: sendGender
        })
        res.send('success');
    } else {
        //昵称重名判断
        let data = await find('tb_user_info', {
            nickname: sendNickName
        });
        if (data.length > 0) {
            await update('tb_user_info', {
                gender: sendGender
            }, {
                    user_id: sendUid
                });
            res.send('nickname already use');
        } else {
            await update('tb_user_info', {
                nickname: sendNickName,
                gender: sendGender
            }, {
                    user_id: sendUid
                });
            res.send('success');
        }
    }
})

//更新用户密码路由
router.post('/updatePassword', async (req, res, next) => {
    let {
        sendOldPsw,
        sendNewPsw,
        sendUid
    } = req.body;
    let data = await checkPsw('tb_user_login', {
        id: sendUid
    }, {
            password: sendOldPsw
        });
    if (data.length > 0) {
        await update('tb_user_login', {
            password: sendNewPsw
        }, {
                id: sendUid
            });
        res.send('success');
    } else {
        res.send('fail');
    }
})

//添加用户地址路由
router.post('/addAddress', async (req, res, next) => {
    let {
        sendUid,
        sendName,
        sendPhone,
        sendAddress
    } = req.body;
    await insert('tb_user_address', {
        user_id: sendUid,
        name: sendName,
        phone: sendPhone,
        address: sendAddress
    });
    res.send('success');
})

//更新用户地址路由
router.post('/upadteAddress', async (req, res, next) => {
    let {
        sendAid,
        sendName,
        sendPhone,
        sendAddress
    } = req.body;
    await update('tb_user_address', {
        name: sendName,
        phone: sendPhone,
        address: sendAddress
    }, {
            id: sendAid
        });
    res.send('success');
})

//删除用户地址路由
router.post('/delAddress', async (req, res, next) => {
    let {
        sendAid
    } = req.body;
    await del('tb_user_address', {
        id: sendAid
    });
    res.send('success');
})

//添加用户订单信息
router.post('/addOrder', async (req, res, next) => {
    let {
        sendOrderNum,
        sendtotalPrice,
        sendName,
        sendPhone,
        sendAddress,
        sendDateTime,
        sendImg,
        sendPlace,
        sendTitle,
        sendUserId,
        sendTicketNum,
        sendPayWay,
        sendPayStatus
    } = req.body;
    await insert('tb_order', {
        l_id: sendOrderNum,
        status: sendPayStatus,
        u_id: sendUserId,
        img: sendImg,
        title: sendTitle,
        date: sendDateTime,
        place: sendPlace,
        price: sendtotalPrice,
        num: sendTicketNum,
        name: sendName,
        phone: sendPhone,
        address: sendAddress,
        way: sendPayWay
    })
    res.send('add order success');
})

//修改订单状态
router.post('/updateOrderStatus', async (req, res, next)=>{
    let {
        sendId
    } = req.body;
    let data = await find('tb_order',{
        id: sendId
    })
    //获取当前订单状态值
    if(data[0].status == '2'){
        await update('tb_order',{
            status: '1'
        },{
            id: sendId
        })
        res.send('update order status success');
    }else if(data[0].status == '3'){
        res.send('update order status defeat');
    }
})
module.exports = router;
