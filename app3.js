const express = require("express");
const mysql = require('mysql');
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
//checking authenticated
const checkAuth = (req, res, next) => {
    if (req.session.user && req.session.user.isAuthenticated) {
        next();
    } else {
        res.redirect('/login');
    }
};
//create app object to access the functionalities of the express module
var app = express();
var students = [];
var z = null;
app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true })); //as parsing from form

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
//home page
app.get("/", function (req, res) {
    res.render("home");
});
//student dashboard
app.get("/dashboard", checkAuth, function (req, res) {
    res.render("dashboard", { name: req.session.user.name });
});
//admin dashboard
app.get("/admindashboard", checkAuth, function (req, res) {
    res.render("admindashboard", { name: req.session.user.name });
});
//warden dashboard
app.get("/wardendashboard", checkAuth, function (req, res) {
    res.render("wardendashboard", { name: req.session.user.name });
});
//login page
app.get("/login", function (req, res) {
    res.render("login");
});
//login check
var role;
app.post("/login", function (req, res) {
    const email = "'" + req.body.email + "'";
    var password = req.body.password;
    con.query("use hostelmanagement", function (err, result) {
        if (err) throw err;
    });
    //con.query("select * from studentTable where email = '"+userName+"'", function(err,result){
    role = req.body.role;
    if (role === "student") {
        con.query("select * from studentTable where email = " + email, function (err, result) {
            //console.log(result);
            if (result.length > 0) {
                // console.log(password);
                console.log(result[0].password);
                if (password.toString() == result[0].password.toString()) {
                    req.session.user = {
                        isAuthenticated: true,
                        email: result[0].email,
                        name: result[0].FullName
                    };
                    console.log("Login Successful");
                    res.redirect("/dashboard");
                } else {
                    res.locals.errorMessage = "Invalid Password";
                    res.render("login.ejs");
                }
            }
            else {
                res.locals.errorMessage = "Invalid username/ User not found";
                res.render("login.ejs");
            }
        });
    }
    else if (role === "admin") {
        con.query("select * from managingStaff where Login_id = " + email, function (err, result) {
            //console.log(result);
            if (result.length > 0) {
                // console.log(password);
                console.log(result[0].password);
                console.log(password);
                // password = "'"+password+"'";
                // bcrypt.compare("'" + password + "'", result[0].password, function (err, match) {
                if (password.toString() === result[0].password.toString()) {
                    req.session.user = {
                        isAuthenticated: true,
                        email: result[0].Login_id
                    };
                    console.log("Login Successful");
                    console.log(result[0].Emp_Id.toString());
                    con.query("select * from employeeTable where Emp_Id = '" + result[0].Emp_Id.toString() + "'", function (err, resu) {
                        console.log(resu);
                        if (resu[0].Role.toString() === "admin") {
                            res.redirect("/admindashboard");
                        }
                        else if (resu[0].Role.toString() === "warden") {
                            res.redirect("/wardendashboard");
                        }
                    });
                } else {
                    res.locals.errorMessage = "Invalid Password";
                    res.render("login.ejs");
                }
                // });
            }
            else {
                res.locals.errorMessage = "Invalid username/ User not found";
                res.render("login.ejs");
            }
        });
    }
});
//registration page
app.get("/registration", function (req, res) {
    res.render("registration");
});
//register post request loading into database
app.post("/registration", function (req, res) {
    const newStudent = {
        // first_name: "'" + req.body.firstName + "'",
        // middle_name: "'" + req.body.middleName + "'",
        // last_name: "'" + req.body.lastName + "'",
        fullName: "'" + req.body.fullName + "'",
        GuardianName: "'" + req.body.guardianName + "'",
        phone_no: "'" + req.body.phoneNo + "'",
        guardianPhoneNo: "'" + req.body.guardianPhoneNo + "'",
        email: "'" + req.body.emailId + "'",
        dob: "'" + req.body.dob + "'",
        gender: "'" + req.body.gender + "'",
        branch: "'" + req.body.branch + "'",
        roll_no: "'" + req.body.rollNo + "'",
        sem: parseInt(req.body.semester),
        merit_rank: parseInt(req.body.meritRank),
        distance: req.body.distance,
        disabled: "'" + req.body.disabled + "'",
        address: "'" + req.body.address + "'",
        user_name: "'" + req.body.username + "'",
        password: "'" + req.body.password + "'",
        confirm_password: "'" + req.body.confirmPassword + "'",
    };

    // if (!newStudent.fullName || !newStudent.guardianName || newStudent.guardianPhoneNo === null || newStudent.phone_no === null || newStudent.email === null || newStudent.dob === null || newStudent.gender === null || newStudent.branch === null || newStudent.roll_no === null || newStudent.sem === null || newStudent.merit_rank === null || newStudent.address === null || newStudent.password === null) {
    //     res.locals.errorMessage = "Null field is not allowed";
    //     res.render("registration");
    // }
    if (newStudent.password !== newStudent.confirm_password) {
        res.locals.errorMessage = "Password and Confirm Password did not match";
        res.render("registration");
    }
    else {
        // use the firstlogindb database
        con.query("use hostelmanagement", function (err, result) {
            if (err) throw err;
        });

        con.query("CREATE TABLE if not exists studenttable (RollNo varchar(10) primary key, FullName varchar(30), GuardianName varchar(25), Disabled varchar(10), PhoneNo varchar(13), GuardianPhoneNo varchar(13), Email varchar(25) UNIQUE, DOB date, Gender varchar(10), Department varchar(35), Semester int, MeritRank int, Distance float, Address varchar(110), password varchar(300), Room_Id varchar(30), Hostel_Name varchar(30), FOREIGN KEY (Room_Id) REFERENCES roomtable(Room_Id), FOREIGN KEY (Hostel_Name) REFERENCES roomtable(Hostel_Name))", function (err, result) {
            if (err) throw err;
            con.query("INSERT INTO studentTable (Disabled, FullName, GuardianName, PhoneNo, GuardianPhoneNo, Email, DOB, Gender, Department, RollNo, Semester, MeritRank, Distance, Address, password)" + " VALUES (" + newStudent.disabled + "," + newStudent.fullName + "," + newStudent.GuardianName + "," + newStudent.phone_no + "," + newStudent.guardianPhoneNo + "," + newStudent.email + "," + newStudent.dob + "," + newStudent.gender + "," + newStudent.branch + "," + newStudent.roll_no + "," + newStudent.sem + "," + newStudent.merit_rank + "," + newStudent.distance + "," + newStudent.address + "," + newStudent.password + ")", function (err, result) {
                if (err) throw err;
                console.log("1 record inserted");
                res.redirect("/login");
            });
        });
    }
});

//takeleave page
app.get("/takeleave", function (req, res) {
    res.render("takeleave");
});
app.post("/takeleave", function (res, res) {

});

//atendance page
app.get("/attandance", checkAuth, function (req, res) {
    con.query("use hostelmanagement", function (err, result) {
        if (err) throw err;
    });
    con.query("select COUNT(*) as c from studenttable where RoomNo IS NOT NULL", function (err, res) {
        console.log(res);
        if (err) throw err;
        z = res[0].c;
        console.log(z);
    })
    con.query("select * from studenttable where RoomNo IS NOT NULL", function (err, resu) {
        console.log(resu);
        console.log(z);

        for (var x = 0; x < z; x++) {
            students.push({
                a: resu[x].RollNo,
                b: resu[x].FullName,
                c: resu[x].RoomNo
            })
        }

        res.render("attandance", { stu: students });
    });
});
app.post("/attandance", function (req, res) {
    con.query("use hostelmanagement", function (err, result) {
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
    con.query("CREATE TABLE if not exists attendance (roll_no varchar(15), student_name varchar(50), room_no varchar(5), date DATE, attendance_status varchar(25))", function (err, result) {
        if (err) throw err;
    });
    // Insert the attendance data into the MySQL table
    var sql = "INSERT INTO attendance (roll_no, student_name, room_no, date, attendance_status) VALUES ?";
    con.query(sql, [attendanceData], function (err, result) {
        if (err) throw err;
        console.log(result);

    });
    res.redirect("/attandance");
});

//allocaterooms page
var arr = [];
var disabled_len = 0;
var not_disabled_len = 0;
app.get("/allocateroom", (req, response) => {
    con.query("use hostelmanagement", function (err, result) {
        if (err) throw err;
    });

    con.query("SELECT RollNo, FullName, Gender, Disabled, Distance, MeritRank, Room_Id, Hostel_Name FROM studentTable where Room_Id IS Null order by Gender DESC, Disabled DESC, Distance DESC, MeritRank ASC", (err, res) => {
        if (err) throw err;
        console.log(res);
        response.render("allocateroom", { ar: res });
    });
});

app.post("/allocateroom", (req, res) => {
    con.query("SELECT count(*) as c from studentTable where Gender='male' and Disabled='yes'", (err, result) => {
        if (err) throw err;
        disabled_len = result[0].c;
        console.log(disabled_len);
    })
    con.query("SELECT count(*) as c from studentTable where Gender='male' and Disabled='no'", (err, result) => {
        if (err) throw err;
        not_disabled_len = result[0].c;
        console.log(not_disabled_len);
    })
    let RoomAllocation;
    let count = 0;

    for (let i = 1; i <= 14 && count < disabled_len;) {
        con.query(`SELECT RollNo FROM studentTable where Gender='male' and Disabled='yes' and Room_Id is Null LIMIT ${count}, 1`, (err, result) => {
            if (err) throw err;
            if (result.length > 0) {
                let rollNo = result[0].RollNo;
                let roomNo = (i < 10) ? `00${i}` : `0${i}`;
                let query = `UPDATE studentTable set Hostel_Name = 'Boys Hostel', Room_Id = 'A${roomNo}' where RollNo = '${rollNo}'`;
                con.query(query, (err, res) => {
                    if (err) throw err;
                });
                count++;
            }
        });
        if(count%2 === 0) {
            i++;
        }
    }

    count = 0;
    for (let i = 15; i <= 28 && count < not_disabled_len;) {
        x = i%14; 
        con.query(`SELECT RollNo FROM studentTable where Gender='male' and Disabled='no' and Room_Id is Null LIMIT ${count}, 1`, (err, result) => {
            if (err) throw err;
            if (result.length > 0) {
                let rollNo = result[0].RollNo;
                let roomNo = (x < 10) ? `10${x}` : `1${x}`;
                let query = `UPDATE studentTable set Hostel_Name = 'Boys Hostel', Room_Id = 'A${roomNo}' where RollNo = '${rollNo}'`;
                con.query(query, (err, res) => {
                    if (err) throw err;
                });
                count++;
            }
        });
        if(count%2 === 0) {
            i++;
        }
    }
    for (let i = 29; i <= 42 && count < not_disabled_len;) {
        x = i%14; 
        con.query(`SELECT RollNo FROM studentTable where Gender='male' and Disabled='no' and Room_Id is Null LIMIT ${count}, 1`, (err, result) => {
            if (err) throw err;
            if (result.length > 0) {
                let rollNo = result[0].RollNo;
                let roomNo = (x < 10) ? `20${x}` : `2${x}`;
                let query = `UPDATE studentTable set Hostel_Name = 'Boys Hostel', Room_Id = 'A${roomNo}' where RollNo = '${rollNo}'`;
                con.query(query, (err, res) => {
                    if (err) throw err;
                });
                count++;
            }
        });
        if(count%2 === 0) {
            i++;
        }
    }

    con.query("SELECT RollNo,FullName,Gender,Disabled,Distance,MeritRank,Room_Id,Hostel_Name FROM studentTable order by Gender DESC,Disabled DESC,Distance DESC,MeritRank ASC", (err, result) => {
        if (err) throw err;
        console.log(result);
        arr = result;
        // for (let i = 0; i < len; i++) {
        //     arr.push({ RollNo: res[i].RollNo, Name: res[i].FullName, Gender: res[i].Gender, Disability: res[i].Disabled, Distance: res[i].Distance, Merit: res[i].MeritRank, RoomNo: null, BlockNo: null, Floor: null });
        // }
        res.render("allocateroom", { ar: arr });
    });
});

app.get("/leave", function (req, res) {
    res.render("leave");
});
app.post("/leave", function (req, res) {
    con.query("use hostelmanagement", function (err, result) {
        if (err) throw err;
    })

    con.query("CREATE TABLE IF NOT EXISTS LeaveApp (id INT AUTO_INCREMENT PRIMARY KEY, email varchar(50), leaveDate DATE, returnDate DATE, duration varchar(10), reason VARCHAR(255), status varchar(15))", function (err, result) {
        if (err) throw err;
        console.log("Leave table created");
    });

    // Retrieve the attendance data from the request object
    const leaveemail = "'" + req.session.user.name + "'"
    const leaveDate = "'" + req.body["leave-date"] + "'";
    const returnDate = "'" + req.body["return-date"] + "'";
    const duration = "'" + req.body.duration + "'";
    const reason = "'" + req.body.reason + "'";

    con.query("INSERT INTO leaveApp (email, leaveDate, returnDate, duration, reason) " + " VALUES (" + leaveemail + "," + leaveDate + "," + returnDate + "," + duration + "," + reason + ")", function (err, result) {
        if (err) throw err;
        console.log("Leave application submitted");
        res.redirect("/dashboard");
    })

});

app.get("/leaveapp", checkAuth, function (req, res) {
    con.query("SELECT * FROM leaveapp", function (err, result) {
        if (err) throw err;
        res.render("leaveapp", { leaveData: result });
    });
});
app.post("/leaveapp", checkAuth, function (req, res) {
    const id = req.body.id;
    con.query("UPDATE leaveapp SET status = 'approved' WHERE id = ?", [id], function (err, result) {
        if (err) throw err;
        console.log("Leave application approved");
        res.redirect("/leaveapp");
    });
});

app.listen(4000, function () {
    console.log("Server started");
});
