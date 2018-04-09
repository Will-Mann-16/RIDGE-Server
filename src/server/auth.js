var jwt = require("jsonwebtoken");
var config = require("./config");
module.exports.verifyToken = function(token, house, level, next){
    if(!token){
        next({success: false, reason: "No token provided"}, 403);
    }
    jwt.verify(token, config.secretKey, function(err, decoded){
        if(err || house !== decoded.user.house || level > decoded.user.role){
            if((level <= 1 && !err) || (decoded.user.role <= 1 && !err)){
                next({success: true}, 500);
            }else{
                next({success: false, reason: "Failed to authenticate token"}, 403);
            }
        }
        else{
            next({success: true}, 500);
        }
    });

}
module.exports.verifyTokenApp = function(token, next){
    if(!token){
        next({success: false, reason: "No token provided"});
    }
    jwt.verify(token, config.secretKey, function(err, decoded){
        if(err){
            next({success: false, reason: "Failed to authenticate token"});
        }
        else{
            next({success: true, decoded: decoded});
        }
    });

}