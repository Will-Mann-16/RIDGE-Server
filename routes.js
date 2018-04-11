
var express = require('express');
var crud = require("./crud");
var verifyToken = require("./auth").verifyToken;
var apiRoutes = express.Router();
var studentRoutes = express.Router();
var userRoutes = express.Router();
var locationRoutes = express.Router();
var houseRoutes = express.Router();
var historyRoutes = express.Router();
var calloverRoutes = express.Router();
var calenderRoutes = express.Router();

userRoutes.post("/create",  function (req, res) {
    var user = {
        username: req.body.user.username.toLowerCase(),
        password: req.body.user.password,
        role: req.body.user.role,
        house: req.body.user.house,
        firstname: req.body.user.firstname,
        surname: req.body.user.surname
    }
    var token = req.headers['x-access-token'];
    verifyToken(token, req.body.house, 2, function(authRes, authStat) {
        if(authRes.success){
            crud.createUser(user, function (response, status) {
                res.status(status).json(response);
            });
        }
        else{
            res.status(authStat).json(authRes);
        }

    });
});
userRoutes.post("/read", function (req, res) {
    var jwt_key = req.body.jwt;
    crud.readUser(jwt_key, crud.readConfigUser,function (response, status) {
        res.status(status).json(response);
    });
});
userRoutes.post("/update",  function (req, res) {
    var token = req.headers['x-access-token'];
    verifyToken(token, req.body.house, 3, function(authRes, authStat) {
        if(authRes.success){
            crud.updateUser(req.body.id, req.body.user, function (response, status) {
                res.status(status).json(response);
            });
        }
        else{
            res.status(authStat).json(authRes);
        }

    });
});

userRoutes.get("/delete",  function (req, res) {
    var token = req.headers['x-access-token'];
    verifyToken(token, req.query.house, 3, function(authRes, authStat) {
        if(authRes.success){
            crud.deleteUser(req.query.id, function (response, status) {
                res.status(status).json(response);
            });
        }
        else{
            res.status(authStat).json(authRes);
        }

    });
});
userRoutes.post("/authenticate", function (req, res) {
    var username = req.body.username.toLowerCase();
    var password = req.body.password;
    crud.authenticateUser(username, password, function (response, status) {
        res.status(status).json(response);
    });
});
userRoutes.get("/read-config",  function (req, res) {
    var token = req.headers['x-access-token'];
    verifyToken(token, req.query.house, 3, function(authRes, authStat) {
        if(authRes.success){
            crud.readConfigUser(req.query.house, function (response, status) {
                res.status(status).json(response);
            });
        }
        else{
            res.status(authStat).json(authRes);
        }

    });
});


studentRoutes.post("/create", function (req, res) {
    var token = req.headers['x-access-token'];
    verifyToken(token, req.body.house, 2, function(authRes, authStat) {
        if(authRes.success){
            crud.createStudent(req.body.student, function (response, status) {
                res.status(status).json(response);
            });
        }
        else{
            res.status(authStat).json(authRes);
        }

    });
});

studentRoutes.get("/read", function (req, res) {
    var minor = req.query.minor;
    var house = req.query.house;
    var token = req.headers['x-access-token'];
    verifyToken(token, house, 3, function(authRes, authStat) {
        if(authRes.success){
            crud.readStudents(minor, house, function (response, status) {
                res.status(status).json(response);
            });
        }
        else{
            res.status(authStat).json(authRes);
        }

    });

});

studentRoutes.post("/update", function (req, res) {
    var token = req.headers['x-access-token'];
    verifyToken(token, req.body.house, 2, function(authRes, authStat) {
        if(authRes.success){
            crud.updateStudent(req.body.id, req.body.student, function (response, status) {
                res.status(status).json(response);
            });
        }
        else{
            res.status(authStat).json(authRes);
        }
    });
});

studentRoutes.get("/update-location", function (req, res) {
    var token = req.headers['x-access-token'];
    verifyToken(token, req.query.house, 3, function(authRes, authStat) {
        if(authRes.success){
            crud.updateStudentLocation(req.query.ids, JSON.parse(req.query.location), function (response, status) {
                res.status(status).json(response);
            }, crud.createHistory);
        }
        else{
            res.status(authStat).json(authRes);
        }
    });

});

studentRoutes.get("/delete", function (req, res) {
    var token = req.headers['x-access-token'];
    verifyToken(token, req.query.house, 2, function(authRes, authStat) {
        if(authRes.success){
            crud.deleteStudent(req.query.id, function (response, status) {
                res.status(status).json(response);
            });
        }
        else{
            res.status(authStat).json(authRes);
        }
    });

});
studentRoutes.post("/upload", function (req, res) {
    var token = req.headers['x-access-token'];
    verifyToken(token, req.body.house, 2, function(authRes, authStat) {
        if(authRes.success){
            var sent = false;
            crud.uploadStudents(req.body.json, req.body.house, function (response, status) {
                if (!sent) {
                    res.status(status).json(response);
                    sent = true;
                }
            });
        }
        else{
            res.status(authStat).json(authRes);
        }

    });

});

locationRoutes.post("/create", function (req, res) {
    var token = req.headers['x-access-token'];
    verifyToken(token, req.body.house, 3, function(authRes, authStat) {
        if(authRes.success){
            crud.createLocation(req.body.location, function (response, status) {
                res.status(status).json(response);
            });
        }
        else{
            res.status(authStat).json(authRes);
        }
    });

});
locationRoutes.get("/read", function (req, res) {
    var token = req.headers['x-access-token'];
    verifyToken(token, req.query.house, 3, function(authRes, authStat) {
        if(authRes.success){
            crud.readLocations(req.query.house, function (response, status) {
                res.status(status).json(response);
            });
        }
        else{
            res.status(authStat).json(authRes);
        }
    });
});
locationRoutes.post("/update", function (req, res) {
    var token = req.headers['x-access-token'];
    verifyToken(token, req.body.house, 3, function(authRes, authStat) {
        if(authRes.success){
            crud.updateLocation(req.body.id, req.body.location, function (response, status) {
                res.status(status).json(response);
            });
        }
        else{
            res.status(authStat).json(authRes);
        }
    });
});
locationRoutes.get("/delete", function (req, res) {
    var token = req.headers['x-access-token'];
    verifyToken(token, req.query.house, 3, function(authRes, authStat) {
        if(authRes.success){
            crud.deleteLocation(req.query.id, function (response, status) {
                res.status(status).json(response);
            });
        }
        else{
            res.status(authStat).json(authRes);
        }
    });

});

houseRoutes.post("/create", function (req, res) {
    var token = req.headers['x-access-token'];
    verifyToken(token, req.body.house, 1, function(authRes, authStat) {
        if(authRes.success){
            crud.createHouse(req.body.house, function (response, status) {
                res.status(status).json(response);
            });
        }
        else{
            res.status(authStat).json(authRes);
        }
    });

});
houseRoutes.get("/read", function (req, res) {
    var token = req.headers['x-access-token'];
    verifyToken(token, req.body.house, 3, function(authRes, authStat) {
        if(authRes.success){
            crud.readHouses(function (response, status) {
                res.status(status).json(response);
            });
        }
        else{
            res.status(authStat).json(authRes);
        }
    });
});
houseRoutes.post("/update", function (req, res) {
    var token = req.headers['x-access-token'];
    verifyToken(token, req.body.house, 1, function(authRes, authStat) {
        if(authRes.success){
            crud.updateHouse(req.body.id, req.body.house, function (response, status) {
                res.status(status).json(response);
            });
        }
        else{
            res.status(authStat).json(authRes);
        }
    });

});
houseRoutes.get("/delete", function (req, res) {
    var token = req.headers['x-access-token'];
    verifyToken(token, req.body.house, 1, function(authRes, authStat) {
        if(authRes.success){
            crud.deleteHouse(req.query.id, function (response, status) {
                res.status(status).json(response);
            });
        }
        else{
            res.status(authStat).json(authRes);
        }
    });

});
houseRoutes.post("/update-config", function (req, res) {
    var token = req.headers['x-access-token'];
    verifyToken(token, req.body.house, 2, function(authRes, authStat) {
        if(authRes.success){
            crud.updateHouseConfig(req.body.house, req.body.config, function (response, status) {
                res.status(status).json(response);
            });
        }
        else{
            res.status(authStat).json(authRes);
        }
    });

});

historyRoutes.get("/read", function (req, res) {
    var token = req.headers['x-access-token'];
    verifyToken(token, req.query.house, 3, function(authRes, authStat) {
        if(authRes.success){
            crud.readHistory(req.query.filter, req.query.amount, req.query.house, function (response, status) {
                res.status(status).json(response);
            });
        }
        else{
            res.status(authStat).json(authRes);
        }
    });

});

calloverRoutes.post("/create", function (req, res) {
    var token = req.headers['x-access-token'];
    verifyToken(token, req.body.house, 3, function(authRes, authStat) {
        if(authRes.success){
            crud.createCallover(req.body.callover, function (response, status) {
                res.status(status).json(response);
            });
        }
        else{
            res.status(authStat).json(authRes);
        }
    });

});
calloverRoutes.get("/read", function (req, res) {
    var token = req.headers['x-access-token'];
    verifyToken(token, req.query.house, 3, function(authRes, authStat) {
        if(authRes.success){
            crud.readCallover(req.query.house, function (response, status) {
                res.status(status).json(response);
            });
        }
        else{
            res.status(authStat).json(authRes);
        }
    });
});
calenderRoutes.post("/create",  function (req, res) {
    var token = req.headers['x-access-token'];
    verifyToken(token, req.body.house, 2, function(authRes, authStat) {
        if(authRes.success){
            crud.createCalender(req.body.event, function (response, status) {
                res.status(status).json(response);
            });
        }
        else{
            res.status(authStat).json(authRes);
        }
    });
});
calenderRoutes.get("/read",  function(req, res){
    var token = req.headers['x-access-token'];
    verifyToken(token, req.query.house, 2, function(authRes, authStat) {
        if(authRes.success){
            crud.readCalender(req.query.house, function(response, status){
                res.status(status).json(response);
            });
        }
        else{
            res.status(authStat).json(authRes);
        }
    });

});
calenderRoutes.post("/update",  function(req, res){
    var token = req.headers['x-access-token'];
    verifyToken(token, req.body.house, 2, function(authRes, authStat) {
        if(authRes.success){
            crud.updateCalender(req.body.id, req.body.event, function(response, status){
                res.status(status).json(response);
            });
        }
        else{
            res.status(authStat).json(authRes);
        }
    });

});
calenderRoutes.get("/delete",  function(req, res){
    var token = req.headers['x-access-token'];
    verifyToken(token, req.query.house, 2, function(authRes, authStat) {
        if(authRes.success){
            crud.deleteCalender(req.query.id, function(response, status){
                res.status(status).json(response);
            });
        }
        else{
            res.status(authStat).json(authRes);
        }
    });

});
apiRoutes.use('/students', studentRoutes);
apiRoutes.use('/users', userRoutes);
apiRoutes.use('/locations', locationRoutes);
apiRoutes.use('/houses', houseRoutes);
apiRoutes.use('/history', historyRoutes);
apiRoutes.use('/callover', calloverRoutes);
apiRoutes.use('/calender', calenderRoutes);
module.exports = {
    routes: apiRoutes
}
