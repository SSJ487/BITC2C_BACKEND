var express = require('express');
const models = require('../models');
var router = express.Router();



router.post('/create', function (req, res, next) {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;

    let body = req.body;
   
    
    models.TBoard.create({
        type: body.type,
        amount: body.amount,
        price: body.price,
        method: body.method,
        status: body.status,
        sellerId: body.sellerId,
        buyerId: body.buyerId,
        createdAt: today,
        updatedAt: today
    })
        .then(result => {
            console.log("데이터 추가 완료");
            res.send(JSON.stringify(result));
        })
        .catch(err => {
            console.log("데이터 추가 실패");

        })
});









router.get("/pasing/:cur", function (req, res) {

    //페이지당 게시물 수 : 한 페이지 당 10개 게시물
    var page_size = 10;
    //페이지의 갯수 : 1 ~ 10개 페이지
    var page_list_size = 10;
    //limit 변수
    var no = "";
    //전체 게시물의 숫자
    var totalPageCount = 0;

    var queryString = 'select count(*) as cnt from tradeboards'
    getConnection().query(queryString, function (error2, data) {
        if (error2) {
            console.log(error2 + "메인 화면 mysql 조회 실패");
            return
        }
        //전체 게시물의 숫자
        totalPageCount = data[0].cnt

        //현제 페이지
        var curPage = req.params.cur;

        console.log("현재 페이지 : " + curPage, "전체 페이지 : " + totalPageCount);


        //전체 페이지 갯수
        if (totalPageCount < 0) {
            totalPageCount = 0
        }

        var totalPage = Math.ceil(totalPageCount / page_size);// 전체 페이지수
        var totalSet = Math.ceil(totalPage / page_list_size); //전체 세트수
        var curSet = Math.ceil(curPage / page_list_size) // 현재 셋트 번호
        var startPage = ((curSet - 1) * 10) + 1 //현재 세트내 출력될 시작 페이지
        var endPage = (startPage + page_list_size) - 1; //현재 세트내 출력될 마지막 페이지


        //현재페이지가 0 보다 작으면
        if (curPage < 0) {
            no = 0
        } else {
            //0보다 크면 limit 함수에 들어갈 첫번째 인자 값 구하기
            no = (curPage - 1) * 10
        }

        console.log('[0] curPage : ' + curPage + ' | [1] page_list_size : ' + page_list_size + ' | [2] page_size : ' + page_size + ' | [3] totalPage : ' + totalPage + ' | [4] totalSet : ' + totalSet + ' | [5] curSet : ' + curSet + ' | [6] startPage : ' + startPage + ' | [7] endPage : ' + endPage)

        var result2 = {
            "curPage": curPage,
            "page_list_size": page_list_size,
            "page_size": page_size,
            "totalPage": totalPage,
            "totalSet": totalSet,
            "curSet": curSet,
            "startPage": startPage,
            "endPage": endPage
        };


        fs.readFile('list.html', 'utf-8', function (error, data) {

            if (error) {
                console.log("ejs오류" + error);
                return
            }
            console.log("몇번부터 몇번까지냐~~~~~~~" + no)

            var queryString = 'select * from products order by id desc limit ?,?';
            getConnection().query(queryString, [no, page_size], function (error, result) {
                if (error) {
                    console.log("페이징 에러" + error);
                    return
                }
                res.send(ejs.render(data, {
                    data: result,
                    pasing: result2
                }));
            });
        });


    })

})


module.exports = router;
