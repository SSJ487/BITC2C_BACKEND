let jwt = require("jsonwebtoken")
let secretObj = require("../config/jwt")

//토큰을 이용하여 유저정보 가져오기
function decode(req) {
    const token = req.headers.authorization.split(' ')[1]
    try {
        let decoded = jwt.verify(token, secretObj.secret)
        if (decoded) {
            return decoded
        }
    } catch (e) {
        return e
    }
}
module.exports ={decode}
