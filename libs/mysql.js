var mysql = require('mysql');
var config = require('./config.json');

var pool = mysql.createPool({
    connectionLimit: 6, //连接限制次数
    host: config.host,
    user: config.user,
    password: config.password,
    port: config.port, // 默认是3306
    database: config.database
});

//创建连接
let connect = () => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            //判断是否有错误，有执行reject(err)，无执行resolve(connection)
            err ? reject(err) : resolve(connection);
        });
    })
}

//查
let find = (table, params) => {
    return new Promise(async (resolve, reject) => {
        let connection = await connect();
        //params?'where ?':'' 判断有无where条件传入
        connection.query(`select * from ${table} ${params ? 'where ?' : ''}`, [{
            //对象解构，这种...的形式只能在对象里面解构
            ...params
        }], function (error, results, fields) {
            //判断是否有错误，有执行reject(error)，无执行reslove(results)
            error ? reject(error) : resolve(results)
            connection.release();
        });
    })
}

//index查询
let indexFind = (table, params) => {
    return new Promise(async (resolve, reject) => {
        let connection = await connect();
        //params?'where ?':'' 判断有无where条件传入
        connection.query(`select * from ${table} ${params ? 'where ? and status=0' : 'where status=0'}`, [{
            //对象解构，这种...的形式只能在对象里面解构
            ...params
        }], function (error, results, fields) {
            //判断是否有错误，有执行reject(error)，无执行reslove(results)
            error ? reject(error) : resolve(results)
            connection.release();
        });
    })
}

//classify查询
let classifyFindId = (table, params) => {
    return new Promise(async (resolve, reject) => {
        let connection = await connect();
        if(params){
            //对象变量名数组
            var paramsArr = Object.keys(params);
            if(paramsArr.length == 2){
                //得到对象中的名和值，分别写入新的对象
                //定义空对象
                let params1 = {}
                let params2 = {}
                //获取原对象的属性值
                let paramsValue1 = params[paramsArr[0]];
                let paramsValue2 = params[paramsArr[1]];
                //将变量设置到属性名
                params1[paramsArr[0]] = paramsValue1;
                params2[paramsArr[1]] = paramsValue2;
                connection.query(`select * from ${table} where ? and ? and status=0 order by id`, [{
                    //对象解构，这种...的形式只能在对象里面解构
                    ...params1
                },{
                    ...params2
                }], function (error, results, fields) {
                    //判断是否有错误，有执行reject(error)，无执行reslove(results)
                    error ? reject(error) : resolve(results)
                    connection.release();
                });
            }else if(paramsArr.length == 1){
                connection.query(`select * from ${table} where ? and status=0 order by id`, [{
                    //对象解构，这种...的形式只能在对象里面解构
                    ...params
                }], function (error, results, fields) {
                    //判断是否有错误，有执行reject(error)，无执行reslove(results)
                    error ? reject(error) : resolve(results)
                    connection.release();
                });
            }
        }else{
            connection.query(`select * from ${table} where status=0 order by id`, [{
                //对象解构，这种...的形式只能在对象里面解构
                ...params
            }], function (error, results, fields) {
                //判断是否有错误，有执行reject(error)，无执行reslove(results)
                error ? reject(error) : resolve(results)
                connection.release();
            });
        }
    })
}

let classifyFindDate = (table, params) => {
    return new Promise(async (resolve, reject) => {
        let connection = await connect();
        if(params){
            //对象变量名数组
            var paramsArr = Object.keys(params);
            if(paramsArr.length == 2){
                //得到对象中的名和值，分别写入新的对象
                //定义空对象
                let params1 = {}
                let params2 = {}
                //获取原对象的属性值
                let paramsValue1 = params[paramsArr[0]];
                let paramsValue2 = params[paramsArr[1]];
                //将变量设置到属性名
                params1[paramsArr[0]] = paramsValue1;
                params2[paramsArr[1]] = paramsValue2;
                connection.query(`select * from ${table} where ? and ? and status=0 order by first_play_date`, [{
                    //对象解构，这种...的形式只能在对象里面解构
                    ...params1
                },{
                    ...params2
                }], function (error, results, fields) {
                    //判断是否有错误，有执行reject(error)，无执行reslove(results)
                    error ? reject(error) : resolve(results)
                    connection.release();
                });
            }else if(paramsArr.length == 1){
                connection.query(`select * from ${table} where ? and status=0 order by first_play_date`, [{
                    //对象解构，这种...的形式只能在对象里面解构
                    ...params
                }], function (error, results, fields) {
                    //判断是否有错误，有执行reject(error)，无执行reslove(results)
                    error ? reject(error) : resolve(results)
                    connection.release();
                });
            }
        }else{
            connection.query(`select * from ${table} where status=0 order by first_play_date`, [{
                //对象解构，这种...的形式只能在对象里面解构
                ...params
            }], function (error, results, fields) {
                //判断是否有错误，有执行reject(error)，无执行reslove(results)
                error ? reject(error) : resolve(results)
                connection.release();
            });
        }
    })
}

//category排序查
let categoryOrderBy = (table, params) => {
    return new Promise(async (resolve, reject) => {
        let connection = await connect();
        //params1?'where ?':'' 判断有无where条件传入
        connection.query(`select * from ${table} ${params ? 'where ?' : ''} order by sort`, [{
            //对象解构，这种...的形式只能在对象里面解构
            ...params
        }], function (error, results, fields) {
            //判断是否有错误，有执行reject(error)，无执行reslove(results)
            error ? reject(error) : resolve(results)
            connection.release();
        });
    })
}

//修改密码判断查询
let checkPsw = (table, params1, params2) => {
    return new Promise(async (resolve, reject) => {
        let connection = await connect();
        //params?'where ?':'' 判断有无where条件传入
        connection.query(`select * from ${table} where ? and ?`, [{
            //对象解构，这种...的形式只能在对象里面解构
            ...params1
        },{
            ...params2
        }], function (error, results, fields) {
            //判断是否有错误，有执行reject(error)，无执行reslove(results)
            error ? reject(error) : resolve(results)
            connection.release();
        });
    })
}

//增
let insert = (table, params) => {
    return new Promise(async (resolve, reject) => {
        let connection = await connect();
        connection.query(`insert into ${table} set ?`, [{
            ...params
        }],  (error, results, fields) => {
            error ? reject(error) : resolve(results)
            connection.release();
        })
    })
}
//删
let del = (table, params) => {
    return new Promise(async (resolve, reject) => {
        let connection = await connect();
        connection.query(`delete from ${table} where ?`, [{
            ...params
        }],  (error, results, fields) => {
            error ? reject(error) : resolve(results)
            connection.release();
        })
    })
}
//改
let update = (table, params1, params2) => {
    return new Promise(async (resolve, reject) => {
        let connection = await connect();
        connection.query(`update ${table} set ? where ?`, [{
            ...params1
        }, {
            ...params2
        }], (error, results, fields) => {
            error ? reject(error) : resolve(results)
            connection.release();
        })
    })
}

//ES5导出方法
module.exports = {
    connect,
    find,
    insert,
    del,
    update,
    categoryOrderBy,
    classifyFindId,
    classifyFindDate,
    checkPsw,
    indexFind
}
