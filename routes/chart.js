var express = require('express');
var router = express.Router();
const models = require('../models');
const sequelize = require("sequelize");


function chart(type){
    var date = new Date();
    var d = date.getDate();
    var M = date.getMonth() + 1; //Months are zero based
    var y = date.getFullYear();
    var h = date.getHours();
    var m = date.getMinutes();

    var date = y + '-' + (M <= 9 ? '0' + M : M) + '-' + (d <= 9 ? '0' + d : d) + ' ' + (h <= 9 ? '0' + h : h) + ':' + (m <= 9 ? '0' + m : m);

    // 최근 한시간중 가장 오래된 것 찾기
    var query1 = 'select * FROM test.tboards where status = "2" and updatedAt >= DATE_SUB(NOW(), INTERVAL 60 MINUTE) and' +
        '((selltoken = "ETH" and buytoken = :TYPE) or (selltoken = :TYPE and buytoken = "ETH")) order by updatedAt asc limit 1';

    // 최근 한시간중 가장 최신 것 찾기
    var query2 = 'select * FROM test.tboards where status = "2" and updatedAt >= DATE_SUB(NOW(), INTERVAL 60 MINUTE) and' +
        '((selltoken = "ETH" and buytoken = :TYPE) or (selltoken = :TYPE and buytoken = "ETH")) order by updatedAt desc limit 1';

    //최근 한시간동안 중 selltoken이 그것 인것
    var query3 = 'select * FROM test.tboards where status = "2" and updatedAt >= DATE_SUB(NOW(), INTERVAL 60 MINUTE) and' +
        '(selltoken = :TYPE and buytoken = "ETH") order by updatedAt';

    //최근 한시간동안 중 buyertoken이 그것 인것
    var query4 = 'select * FROM test.tboards where status = "2" and updatedAt >= DATE_SUB(NOW(), INTERVAL 60 MINUTE) and' +
        '(selltoken = "ETH" and buytoken = :TYPE) order by updatedAt';


    var values = {
        TYPE: type
    }

    var min1, max1, min2, max2;
    var begin = -1, end = -1, low1 = -1, high1 = -1, low2 = -1, high2 = -1;
    var arr = [-1, -1, -1, -1];

    return (new Promise((resolve, reject) => {
        models.sequelize.query(query1, { replacements: values }).spread((results, metadata) => {
            if (results.length > 0) {
                if (results[0].selltoken == 'ETH') {
                    arr[0] = (results[0].selltokenamount / results[0].buytokenamount).toFixed(5);
                } else {
                    arr[0] = (results[0].buytokenamount / results[0].selltokenamount).toFixed(5);
                }
            } else {
                arr[0] = null;
            }

            begin = 1;
            if (begin !== -1 && end !== -1 && low1 !== -1 && high1 !== -1 && low2 !== -1 && high2 !== -1) {

                if (min1 == 0 || min2 == 0) {
                    if (min1 == 0 && min2 == 0)
                        arr[2] = null;
                    else
                        arr[2] = Math.max(min1, min2).toFixed(5);
                }
                else
                    arr[2] = Math.min(min1, min2).toFixed(5);
                if (max1 == 0 && max2 == 0)
                    arr[3] = null;
                else
                    arr[3] = Math.max(max1, max2).toFixed(5);


                models.Chart.create({
                    type: type,
                    begin: arr[0],
                    end: arr[1],
                    low: arr[2],
                    high: arr[3],
                    date: date
                })
                    .then(result => {
                        resolve(result)
                    }).catch(err => {
                        console.log("데이터 추가 실패");
                        console.log(err)
                        resolve(err)
                    })
            }
        })

        models.sequelize.query(query2, { replacements: values }).spread((results, metadata) => {
            if (results.length > 0) {
                if (results[0].selltoken == 'ETH') {
                    arr[1] = (results[0].selltokenamount / results[0].buytokenamount).toFixed(5);
                } else {
                    arr[1] = (results[0].buytokenamount / results[0].selltokenamount).toFixed(5);
                }
            } else {
                arr[1] = null;
            }

            end = 1;
            if (begin !== -1 && end !== -1 && low1 !== -1 && high1 !== -1 && low2 !== -1 && high2 !== -1) {

                if (min1 == 0 || min2 == 0) {
                    if (min1 == 0 && min2 == 0)
                        arr[2] = null;
                    else
                        arr[2] = Math.max(min1, min2).toFixed(5);
                }
                else
                    arr[2] = Math.min(min1, min2).toFixed(5);
                if (max1 == 0 && max2 == 0)
                    arr[3] = null;
                else
                    arr[3] = Math.max(max1, max2).toFixed(5);

                models.Chart.create({
                    type: type,
                    begin: arr[0],
                    end: arr[1],
                    low: arr[2],
                    high: arr[3],
                    date: date
                })
                    .then(result => {
                        resolve(result)
                    }).catch(err => {
                        console.log("데이터 추가 실패");
                        console.log(err)
                        resolve(err)
                    })
            }
        })

        // 해당 토큰이 sellertoken인 경우
        models.sequelize.query(query3, { replacements: values }).spread((results, metadata) => {
            console.log("result: ", results)
            if (results.length > 0) {
                min1 = (results[0].buytokenamount / results[0].selltokenamount).toFixed(5);
                max1 = (results[0].buytokenamount / results[0].selltokenamount).toFixed(5);
                for (ele in results) {
                    min1 = Math.min(min1, (results[ele].buytokenamount / results[ele].selltokenamount).toFixed(5));
                    max1 = Math.max(max1, (results[ele].buytokenamount / results[ele].selltokenamount).toFixed(5));
                }

            } else {
                min1 = 0;
                max1 = 0;
            }

            low1 = 1;
            high1 = 1;
            if (begin !== -1 && end !== -1 && low1 !== -1 && high1 !== -1 && low2 !== -1 && high2 !== -1) {

                if (min1 == 0 || min2 == 0){
                    if (min1 == 0 && min2 == 0)
                        arr[2] = null;
                    else
                        arr[2] = Math.max(min1, min2).toFixed(5);
                }
                else
                    arr[2] = Math.min(min1, min2).toFixed(5);
                if (max1 == 0 && max2 == 0)
                    arr[3] = null;
                else 
                    arr[3] = Math.max(max1, max2).toFixed(5);

                models.Chart.create({
                    type: type,
                    begin: arr[0],
                    end: arr[1],
                    low: arr[2],
                    high: arr[3],
                    date: date
                })
                    .then(result => {
                        resolve(result)
                    }).catch(err => {
                        console.log("데이터 추가 실패");
                        console.log(err)
                        resolve(err)
                    })
            }
        })


        // 해당 토큰이 buyertoken인 경우
        models.sequelize.query(query4, { replacements: values }).spread((results, metadata) => {
            console.log("result: ", results)
            if (results.length > 0) {
                min2 = (results[0].selltokenamount / results[0].buytokenamount).toFixed(5);
                max2 = (results[0].selltokenamount / results[0].buytokenamount).toFixed(5);
                for (ele in results) {
                    min2 = Math.min(min2, (results[ele].selltokenamount / results[ele].buytokenamount).toFixed(5));
                    max2 = Math.max(max2, (results[ele].selltokenamount / results[ele].buytokenamount).toFixed(5));
                }
            } else {
                min2 = 0;
                max2 = 0;
            }

            low2 = 1;
            high2 = 1;
            if (begin !== -1 && end !== -1 && low1 !== -1 && high1 !== -1 && low2 !== -1 && high2 !== -1) {

                if (min1 == 0 || min2 == 0) {
                    if (min1 == 0 && min2 == 0)
                        arr[2] = null;
                    else
                        arr[2] = Math.max(min1, min2).toFixed(5);
                }
                else
                    arr[2] = Math.min(min1, min2).toFixed(5);
                if (max1 == 0 && max2 == 0)
                    arr[3] = null;
                else
                    arr[3] = Math.max(max1, max2).toFixed(5);

                models.Chart.create({
                    type: type,
                    begin: arr[0],
                    end: arr[1],
                    low: arr[2],
                    high: arr[3],
                    date: date
                })
                    .then(result => {
                        resolve(result)
                    }).catch(err => {
                        console.log("데이터 추가 실패");
                        console.log(err)
                        resolve(err)
                    })
            }
        })
    }));

};



router.get('/getdata', function (req, res) {
    var query = 'select type, begin, end, low, high, date FROM test.charts where type = :TYPE';
    var values = {
        TYPE: req.param('token')
    }

    models.sequelize.query(query, { replacements: values }).spread((results, metadata) => {
        res.json(results);
    });
});




// router.get('/tradedata', function (req, res) {
//     var date = new Date();
//     var d = date.getDate();
//     var M = date.getMonth() + 1; //Months are zero based
//     var y = date.getFullYear();
//     var h = date.getHours();
//     var m = date.getMinutes();

//     var date = y + '-' + (M <= 9 ? '0' + M : M) + '-' + (d <= 9 ? '0' + d : d) + ' ' + (h <= 9 ? '0' + h : h) + ':' + (m <= 9 ? '0' + m : m);

//     // 최근 한시간중 가장 오래된 것 찾기
//     var query1 = 'select * FROM test.tboards where updatedAt >= DATE_SUB(NOW(), INTERVAL 120 MINUTE) and' +
//         '((selltoken = "ETH" and buytoken = :TYPE) or (selltoken = :TYPE and buytoken = "ETH")) order by updatedAt asc limit 1';

//     // 최근 한시간중 가장 최신 것 찾기
//     var query2 = 'select * FROM test.tboards where updatedAt >= DATE_SUB(NOW(), INTERVAL 120 MINUTE) and' +
//         '((selltoken = "ETH" and buytoken = :TYPE) or (selltoken = :TYPE and buytoken = "ETH")) order by updatedAt desc limit 1';

//     //최근 한시간동안 중 selltoken이 그것 인것
//     var query3 = 'select * FROM test.tboards where updatedAt >= DATE_SUB(NOW(), INTERVAL 120 MINUTE) and' +
//         '(selltoken = :TYPE and buytoken = "ETH") order by updatedAt';

//     //최근 한시간동안 중 buyertoken이 그것 인것
//     var query4 = 'select * FROM test.tboards where updatedAt >= DATE_SUB(NOW(), INTERVAL 120 MINUTE) and' +
//         '(selltoken = "ETH" and buytoken = :TYPE) order by updatedAt';

//     var values = {
//         TYPE: req.param('type')
//     }

//     var begin = -1, end = -1, low1 = -1, high1 = -1, low2 = -1, high2 = -1;
//     var arr = [-1, -1, -1, -1];

//     res.json(new Promise(((resolve, reject) => {
//         models.sequelize.query(query1, { replacements: values }).spread((results, metadata) => {
//             if (results.length > 0) {
//                 if (results[0].selltoken == 'ETH') {
//                     arr[0] = (results[0].selltokenamount / results[0].buytokenamount).toFixed(5);
//                 } else {
//                     arr[0] = (results[0].buytokenamount / results[0].selltokenamount).toFixed(5);
//                 }
//             } else {
//                 arr[0] = 0;
//             }

//             begin = 1;
//             if (begin !== -1 && end !== -1 && low1 !== -1 && high1 !== -1 && low2 !== -1 && high2 !== -1) {
//                 arr[2] = Math.min(min1, min2).toFixed(5);
//                 arr[3] = Math.max(max1, max2).toFixed(5);

//                 models.Chart.create({
//                     type: req.param('type'),
//                     begin: arr[0],
//                     end: arr[1],
//                     low: arr[2],
//                     high: arr[3],
//                     date: date
//                 })
//                     .then(result => {
//                         models.Chart.findAll({
//                             type: req.param('type')
//                         }).then(result => {
//                             resolve(result.dataValues)
//                         }).catch(err => {
//                             console.log(err);
//                         })
//                     }).catch(err => {
//                         console.log("데이터 추가 실패");
//                         console.log(err)
//                         resolve(err)
//                     })
//             }
//         })

//         models.sequelize.query(query2, { replacements: values }).spread((results, metadata) => {
//             if (results.length > 0) {
//                 if (results[0].selltoken == 'ETH') {
//                     arr[1] = (results[0].selltokenamount / results[0].buytokenamount).toFixed(5);
//                 } else {
//                     arr[1] = (results[0].buytokenamount / results[0].selltokenamount).toFixed(5);
//                 }
//             } else {
//                 arr[1] = 0;
//             }

//             end = 1;
//             if (begin !== -1 && end !== -1 && low1 !== -1 && high1 !== -1 && low2 !== -1 && high2 !== -1) {
//                 arr[2] = Math.min(min1, min2).toFixed(5);
//                 arr[3] = Math.max(max1, max2).toFixed(5);

//                 models.Chart.create({
//                     type: req.param('type'),
//                     begin: arr[0],
//                     end: arr[1],
//                     low: arr[2],
//                     high: arr[3],
//                     date: date
//                 })
//                     .then(result => {
//                         models.Chart.findAll({
//                             type: req.param('type')
//                         }).then(result => {
//                             resolve(result.dataValues)
//                         }).catch(err => {
//                             console.log(err);
//                         })
//                     }).catch(err => {
//                         console.log("데이터 추가 실패");
//                         console.log(err)
//                         resolve(err)
//                     })
//             }
//         })

//         var min1, max1;
//         // 해당 토큰이 sellertoken인 경우
//         models.sequelize.query(query3, { replacements: values }).spread((results, metadata) => {
//             console.log("result: ", results)
//             if (results.length > 0) {
//                 min1 = (results[0].buytokenamount / results[0].selltokenamount).toFixed(5);
//                 max1 = (results[0].buytokenamount / results[0].selltokenamount).toFixed(5);
//                 for (ele in results) {
//                     min1 = Math.min(min1, (results[ele].buytokenamount / results[ele].selltokenamount).toFixed(5));
//                     max1 = Math.max(max1, (results[ele].buytokenamount / results[ele].selltokenamount).toFixed(5));
//                 }

//             } else {
//                 min1 = null;
//                 max1 = null;
//             }

//             low1 = 1;
//             high1 = 1;
//             if (begin !== -1 && end !== -1 && low1 !== -1 && high1 !== -1 && low2 !== -1 && high2 !== -1) {
//                 arr[2] = Math.min(min1, min2).toFixed(5);
//                 arr[3] = Math.max(max1, max2).toFixed(5);

//                 models.Chart.create({
//                     type: req.param('type'),
//                     begin: arr[0],
//                     end: arr[1],
//                     low: arr[2],
//                     high: arr[3],
//                     date: date
//                 })
//                     .then(result => {
//                         models.Chart.findAll({
//                             type: req.param('type')
//                         }).then(result => {
//                             resolve(result.dataValues)
//                         }).catch(err => {
//                             console.log(err);
//                         })
//                     }).catch(err => {
//                         console.log("데이터 추가 실패");
//                         console.log(err)
//                         resolve(err)
//                     })
//             }
//         })

//         var min2, max2;
//         // 해당 토큰이 buyertoken인 경우
//         models.sequelize.query(query4, { replacements: values }).spread((results, metadata) => {
//             console.log("result: ", results)
//             if (results.length > 0) {
//                 min2 = (results[0].selltokenamount / results[0].buytokenamount).toFixed(5);
//                 max2 = (results[0].selltokenamount / results[0].buytokenamount).toFixed(5);
//                 for (ele in results) {
//                     min2 = Math.min(min2, (results[ele].selltokenamount / results[ele].buytokenamount).toFixed(5));
//                     max2 = Math.max(max2, (results[ele].selltokenamount / results[ele].buytokenamount).toFixed(5));
//                 }
//             } else {
//                 min2 = null;
//                 max2 = null;
//             }

//             low2 = 1;
//             high2 = 1;
//             if (begin !== -1 && end !== -1 && low1 !== -1 && high1 !== -1 && low2 !== -1 && high2 !== -1) {
//                 arr[2] = Math.min(min1, min2).toFixed(5);
//                 arr[3] = Math.max(max1, max2).toFixed(5);

//                 models.Chart.create({
//                     type: req.param('type'),
//                     begin: arr[0],
//                     end: arr[1],
//                     low: arr[2],
//                     high: arr[3],
//                     date: date
//                 })
//                     .then(result => {
//                         models.Chart.findAll({
//                             type: req.param('type')
//                         }).then(result => {
//                             resolve(result.dataValues)
//                         }).catch(err => {
//                             console.log(err);
//                         })
//                     }).catch(err => {
//                         console.log("데이터 추가 실패");
//                         console.log(err)
//                         resolve(err)
//                     })
//             }
//         })
//     })));

// });


module.exports = {router, chart};
