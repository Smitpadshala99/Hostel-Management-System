const express = require("express");
const mysql = require('mysql');
const bcrypt = require("bcrypt");
const session = require('express-session');
//create a connection object to create database connection
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: ""
});
//checking the connection to the database
con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

const checkAuth = (req, res, next) => {
    if (req.session.user && req.session.user.isAuthenticated) {
      next();
    } else {
      res.redirect('/login');
    }
  };
//create app object to access the functionalities of the express module
var app = express();
var hashPassword=null;
var students = [];
app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true })); //as parsing from form
// var example = "Working";
app.use(
    session({
      secret: 'your-secret-key',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 60 * 60 * 1000 // 1 hour
      }
    })
  );
app.get("/", function (req, res) {
    res.render("home");
});
app.get("/login", function (req, res) {
    res.render("login");
});

app.get("/registration", function (req, res) {
    res.render("registration");
});
app.post("/registration", function (req, res) {
    const newStudent = {
        first_name: "'" + req.body.firstName + "'",
        middle_name: "'" + req.body.middleName + "'",
        last_name: "'" + req.body.lastName + "'",
        phone_no: "'" + req.body.phoneNo + "'",
        email: "'" + req.body.emailId + "'",
        dob: "'" + req.body.dob + "'",
        gender: "'" + req.body.gender + "'",
        branch: "'" + req.body.branch + "'",
        roll_no: "'" + req.body.rollNo + "'",
        sem: parseInt(req.body.semester),
        merit_rank: parseInt(req.body.meritRank),
        address: "'" + req.body.address + "'",
        user_name: "'" + req.body.username + "'",
        password: "'" + req.body.password + "'",
        confirm_password: "'" + req.body.confirmPassword + "'",
    };
    if (newStudent.first_name === null || newStudent.middle_name === null || newStudent.last_name === null || newStudent.phone_no === null || newStudent.email === null || newStudent.dob === null || newStudent.gender === null || newStudent.branch === null || newStudent.roll_no === null || newStudent.sem === null || newStudent.merit_rank === null || newStudent.address === null || newStudent.user_name === null || newStudent.password === null) {
        res.locals.errorMessage = "Null field is not allowed";
        res.render("registration");
    }
    else if (newStudent.password !== newStudent.confirm_password) {
        res.locals.errorMessage = "Password and Confirm Password did not match";
        res.render("registration");
    }
    else {
        //const values = Object.values(newUser);
        // create a new database if it doesn't already exist
        
        con.query("CREATE DATABASE if not exists hackvgec", function (err, result) {
            if (err) throw err;
        });
        // use the firstlogindb database
        con.query("use hackvgec", function (err, result) {
            if (err) throw err;
        });
        
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newStudent.password, salt, function(err, hash) {
                hashPassword = "'"+hash+"'";
                con.query("CREATE TABLE if not exists registertable (FirstName varchar(15), MiddleName varchar(15), LastName varchar(15), PhoneNo varchar(10), Email varchar(25), DOB date, Gender varchar(10), Branch varchar(20), RollNo varchar(10), Semester int, MeritRank int, Address varchar(40), UserName varchar(15), password varchar(300))", function (err, result) {
                    if (err) throw err;
                    con.query("INSERT INTO registertable (FirstName, MiddleName, LastName, PhoneNo, Email, DOB, Gender, Branch, RollNo, Semester, MeritRank, Address, UserName, password)" + " VALUES (" + newStudent.first_name + "," + newStudent.middle_name + "," + newStudent.last_name + "," + newStudent.phone_no + "," + newStudent.email + "," + newStudent.dob + "," + newStudent.gender + "," + newStudent.branch + "," + newStudent.roll_no + "," + newStudent.sem + "," + newStudent.merit_rank + "," + newStudent.address + "," + newStudent.user_name + "," + hashPassword + ")", function (err, result) {
                        if (err) throw err;
                        console.log("1 record inserted");
                        res.render("login");
                    });
                });
            });
        });
        
        
    }
});
app.post("/login", function (req, res) {
    const email = "'"+req.body.email+"'";
    const password = req.body.password;
    con.query("use hackvgec", function (err, result) {
        if (err) throw err;
    });
    //con.query("select * from registertable where email = '"+userName+"'", function(err,result){
    con.query("select * from registertable where email = " + email, function (err, result) {
        //console.log(result);
        if (result.length > 0) {
            // console.log(password);
            console.log(result[0].password);
            bcrypt.compare("'"+password+"'", result[0].password, function(err, match) {
                    if (match) {
                        req.session.user = {
                            isAuthenticated: true,
                            email: result[0].email
                          };
                        console.log("Login Successful");
                        res.render("dashboard");
                    } else {
                        res.locals.errorMessage = "Invalid Password";
                        res.render("login.ejs");
                    }
                });

        }
        else {
            res.locals.errorMessage = "Invalid username/ User not found";
            res.render("login.ejs");
        }
    });
});


app.get("/takeleave", function(req,res){
    res.render("takeleave");
});
app.post("/takeleave", function(res,res){
    
}); 
app.get("/attandance", checkAuth, function(req,res){
    con.query("use hackvgec", function (err, result) {
        if (err) throw err;
    });
    con.query("select * from student", function (err, resu) {
        if (resu[0].StudentID.length > 0) {
            for(var x=0; x<5; x++){
                students.push({
                    a: resu[x].StudentID,
                    b: resu[x].Name,
                    c: resu[x].RoomNumber
                })
                }
        } else {
            console.log("nope");
        }
    
    res.render("attandance", {stu : students});
});
    
});
app.post("/attandance", function(req,res){
    con.query("use hackvgec", function (err, result) {
        if (err) throw err;
    });
    // Retrieve the attendance data from the request object
    var attendanceData = [];
    for (var i = 1; i <= students.length; i++) {
        var attendanceStatus = req.body["attendance-" + i];
        var student1 = students[i - 1];
        attendanceData.push([student1.a, student1.b, student1.c, req.body.attendance_date, attendanceStatus]);
    }
    // console.log(attendanceData.req.body.attendance_date);
    con.query("CREATE TABLE if not exists attendance (roll_no varchar(15), student_name varchar(15), room_no varchar(5), date DATE, attendance_status varchar(25))", function (err, result) {
        if (err) throw err;
    });
    // Insert the attendance data into the MySQL table
    var sql = "INSERT INTO attendance (roll_no, student_name, room_no, date, attendance_status) VALUES ?";
    con.query(sql, [attendanceData], function(err, result) {
        if (err) throw err;
        console.log(result);
        
    });
    res.redirect("/attandance");
});
app.listen(3000, function () {
    console.log("Server started");
});
