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
    res.render("admindashboard", { name: req.session.user.name, rooms_allocated: req.session.user.rooms_allocated, rooms_left: req.session.user.rooms_left });
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
let allocated_rooms;
let left_rooms;
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
                con.query("SELECT COUNT(DISTINCT Room_Id) as c FROM studenttable", function (err, result) {
                    if (err) throw err;
                    allocated_rooms = result[0].c;
                    left_rooms = (82-allocated_rooms);
                });
                // password = "'"+password+"'";
                // bcrypt.compare("'" + password + "'", result[0].password, function (err, match) {
                if (password.toString() === result[0].password.toString()) {
                    console.log("Login Successful");
                    console.log(result[0].Emp_Id.toString());
                    con.query("select * from employeeTable where Emp_Id = '" + result[0].Emp_Id.toString()+"'", function (err, resu) {
                        req.session.user = {
                            isAuthenticated: true,
                            email: result[0].email,
                            name: resu[0].EName,
                            rooms_allocated: allocated_rooms,
                            rooms_left: left_rooms
                        };
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
var len = 0;
app.get("/allocateroom", (req, response) => {
    con.query("use hostelmanagement", function (err, result) {
        if (err) throw err;
    });
    con.query("SELECT count(*) as c from studentTable where Gender='male'", (err, res) => {
        if (err) throw err;
        len = res[0].c;
    })
    // if (arr.length === 0) {
        con.query("SELECT RollNo,FullName,Gender,Disabled,Distance,MeritRank,Room_Id,Hostel_Name FROM studentTable where Room_Id IS Null order by Gender DESC,Disabled DESC,Distance DESC,MeritRank ASC", (err, res) => {
            if (err) throw err;
            console.log(res);
            arr = res;
            // for (let i = 0; i < len; i++) {
            //     arr.push({ RollNo: res[i].RollNo, Name: res[i].FullName, Gender: res[i].Gender, Disability: res[i].Disabled, Distance: res[i].Distance, Merit: res[i].MeritRank, RoomNo: null, BlockNo: null, Floor: null });
            // }
            response.render("allocateroom", { ar: arr });
        });
    // }
    // else {
    //     con.query("SELECT RollNo,FullName,Gender,Disabled,Distance,MeritRank,Room_Id,Hostel_Name FROM studentTable where Room_Id IS Null order by Gender DESC,Disabled DESC,Distance DESC,MeritRank ASC", (err, res) => {
    //         if (err) throw err;
    //         console.log(res);
    //         arr = res;
    //         // for (let i = 0; i < len; i++) {
    //         //     arr.push({ RollNo: res[i].RollNo, Name: res[i].FullName, Gender: res[i].Gender, Disability: res[i].Disabled, Distance: res[i].Distance, Merit: res[i].MeritRank, RoomNo: null, BlockNo: null, Floor: null });
    //         // }
    //         response.render("allocateroom", { ar: arr });
    //     });
    // }
});
app.post("/allocateroom", (req, res) => {
    let BlockCapacity = 2;
    let j = 0;
    let flag = 0;
    let floors = 0;
    let temp1 = 0;
    let temp2 = 1;
    let count = 0;
    let RoomAllocation;
    let BlocksCount = 0;
    let Blocks = ["A", "B"];
    //StudentsDataBase.push({Disability:"YES",Gender:"MALE"},{Disability:"YES",Gender:"MALE"},{Disability:"YES",Gender:"MALE"},{Disability:"No",Gender:"MALE"},{Disability:"No",Gender:"MALE"},{Disability:"No",Gender:"MALE"});
    let dis = arr.map(el => el.Disability).lastIndexOf("yes");
    let nodis = arr.map(el => el.Gender).lastIndexOf("male");
    while (j < BlockCapacity) {
        for (let i = 1; i <= 14;) {
            if (count <= dis) {
                flag = 1;
                if (count % 2 == 0 && count != 0) {
                    i++;
                    temp2 = i;
                }
                //arr[count].Room_Id = Blocks[BlocksCount] + floors + i;
                RoomAllocation = { RoomNo: i, Blocks: Blocks[BlocksCount], Floor: floors };
                if(i<10) {
                    con.query("update studentTable set Hostel_Name = 'Boys Hostel', Room_Id = '" + Blocks[BlocksCount] + floors +"0"+ i + "' where RollNo = '" + arr[count].RollNo + "'", (err, res) => {
                        if (err) throw err;
                        console.log(arr[count].RollNo);
                    })
                }
                else {
                    con.query("update studentTable set Hostel_Name = 'Boys Hostel', Room_Id = '" + Blocks[BlocksCount] + floors + i + "' where RollNo = '" + arr[count].RollNo + "'", (err, res) => {
                        if (err) throw err;
                        console.log(arr[count].RollNo);
                    })
                }
                count++;
            }
            else {
                temp1 = BlocksCount;

                break;
            }
        }
        j++;

        if (flag === 0) {
            temp1 = -1;
            continue;
        }
        BlocksCount++;
        floors = Math.floor(j / 2);
    }
    j = 0;
    temp1 = 0;
    BlocksCount = 0;
    while (j < BlockCapacity) {
        for (let i = 1; i < 42;) {
            if (count <= nodis) {
                if (BlocksCount < temp1 && i < 15) {
                    i = 15;
                    floors++;
                    //arr[count].Room_Id = Blocks[BlocksCount] + floors + i;
                    RoomAllocation = { RoomNo: i, Blocks: Blocks[BlocksCount], Floor: floors };
                    if(i<10) {
                        con.query("update studentTable set Hostel_Name = 'Boys Hostel', Room_Id = '" + Blocks[BlocksCount] + floors +"0"+ i + "' where RollNo = '" + arr[count].RollNo + "'", (err, res) => {
                            if (err) throw err;
                        })
                    }
                    else {
                        con.query("update studentTable set Hostel_Name = 'Boys Hostel', Room_Id = '" + Blocks[BlocksCount] + floors + i + "' where RollNo = '" + arr[count].RollNo + "'", (err, res) => {
                            if (err) throw err;
                        })
                    }
                    count++;
                }
                else if (BlocksCount == temp1 && i <= temp2 && flag == 1) {
                    if ((count) % 2 == 0 && count != 0) {
                        i = temp2 + 1;
                        if (i % 14 == 1) {
                            floors++;
                        }
                        //arr[count].Room_Id = Blocks[BlocksCount] + floors + i;
                        RoomAllocation = { RoomNo: i, Blocks: Blocks[BlocksCount], Floor: floors };
                        if(i<10) {
                            con.query("update studentTable set Hostel_Name = 'Boys Hostel', Room_Id = '" + Blocks[BlocksCount] + floors +"0"+ i + "' where RollNo = '" + arr[count].RollNo + "'", (err, res) => {
                                if (err) throw err;
                            })
                        }
                        else {
                            con.query("update studentTable set Hostel_Name = 'Boys Hostel', Room_Id = '" + Blocks[BlocksCount] + floors + i + "' where RollNo = '" + arr[count].RollNo + "'", (err, res) => {
                                if (err) throw err;
                            })
                        }
                        count++;
                    }
                    else {
                        i = temp2;
                        //arr[count].Room_Id = Blocks[BlocksCount] + floors + i;
                        RoomAllocation = { RoomNo: i, Blocks: Blocks[BlocksCount], Floor: floors };
                        if(i<10) {
                            con.query("update studentTable set Hostel_Name = 'Boys Hostel', Room_Id = '" + Blocks[BlocksCount] + floors +"0"+ i + "' where RollNo = '" + arr[count].RollNo + "'", (err, res) => {
                                if (err) throw err;
                            })
                        }
                        else {
                            con.query("update studentTable set Hostel_Name = 'Boys Hostel', Room_Id = '" + Blocks[BlocksCount] + floors + i + "' where RollNo = '" + arr[count].RollNo + "'", (err, res) => {
                                if (err) throw err;
                            })
                        }
                        count++;
                    }
                }
                else {
                    if (count % 2 == 0 && count != 0) {
                        i++;
                        if (i % 14 == 1 && i != 1) {
                            floors++;
                        }
                    }
                    //arr[count].Room_Id = Blocks[BlocksCount] + floors + i;
                    RoomAllocation = { RoomNo: i, Blocks: Blocks[BlocksCount], Floor: floors };
                    if(i<10) {
                        con.query("update studentTable set Hostel_Name = 'Boys Hostel', Room_Id = '" + Blocks[BlocksCount] + floors +"0"+ i + "' where RollNo = '" + arr[count].RollNo + "'", (err, res) => {
                            if (err) throw err;
                        })
                    }
                    else {
                        con.query("update studentTable set Hostel_Name = 'Boys Hostel', Room_Id = '" + Blocks[BlocksCount] + floors + i + "' where RollNo = '" + arr[count].RollNo + "'", (err, res) => {
                            if (err) throw err;
                        })
                    }
                    count++;
                }
            }
            else {
                break;
            }
        }
        j++;
        BlocksCount++;
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

app.get("/studentinfo", function (req, res) {
    con.query("use hostelmanagement", function (err, result) {
        if (err) throw err;
    });
    con.query("select COUNT(*) as c from studenttable where Room_Id IS NOT NULL", function (err, res) {
        console.log(res);
        if (err) throw err;
        z = res[0].c;
        console.log(z);
    })
    con.query("select * from studenttable where Room_Id IS NOT NULL", function (err, resu) {
        console.log(resu);
        console.log(z);

        for (var x = 0; x < z; x++) {
            students.push({
                a: resu[x].RollNo,
                b: resu[x].FullName,
                c: resu[x].Room_Id,
                d: resu[x].PhoneNo,
                e: resu[x].DOB,
                f: resu[x].Email
            })
        }


        res.render("studentinfo", { stu: students });
    });
});

let employees=[];
app.get("/employee", function (req, res) {
    con.query("use hostelmanagement", function (err, result) {
        if (err) throw err;
    });
    con.query("select COUNT(*) as c from employeetable where Emp_Id IS NOT NULL", function (err, res) {
        console.log(res);
        if (err) throw err;
        z = res[0].c;
        console.log(z);
    })
    con.query("select * from employeetable where Emp_Id IS NOT NULL", function (err, resu) {
        console.log(resu);
        console.log(z);

        for (var x = 0; x < z; x++) {
            employees.push({
                a: resu[x].Emp_Id,
                b: resu[x].EName,
                c: resu[x].Address,
                d: resu[x].Salary,
                e: resu[x].Role,
                f: resu[x].email,
                g:resu[x].Hostel_Name
            })
        }


        res.render("employee", { stud: employees});
});
});
let id,name,address,salary,hostel_name;
let employeesupdate=[];
app.post("/employee",function(req,res){
    id="'"+req.body.one+"'";
    name="'"+req.body.two+"'";
    address="'"+req.body.three+"'";
    salary=req.body.four;
    role="'"+req.body.five+"'";
    email="'"+req.body.six+"'";
    hostel_name="'"+req.body.seven+"'";
    // con.query("use hostelmanagement");
    con.query("use hostelmanagement", function (err, result) {
        if (err) throw err;
    });
    if(name.toString() !== '\'\'')
    {
        con.query("update employeetable set Ename="+name+" where Emp_Id="+id,function(err,res){
            if(err) throw err;
        });
    }
    else if(address!='\'\'')
    {
        con.query("update employeetable set address="+address+"where Emp_Id="+id,function(err,res){
            if(err) throw err;
        });
    }
    else if(salary)
    {
        salary=parseInt(salary);
        con.query("update employeetable set salary="+salary+" where Emp_Id="+id,function(err,res){
            if(err) throw err;
        });
    }
    else if(role!='\'\'')
    {
        con.query("update employeetable set role="+role+"where Emp_Id="+id,function(err,res){
            if(err) throw err;
        });
    }
    else if(hostel_name!='\'\'')
    {
        con.query("update employeetable set hostel_name="+hostel_name+"where Emp_Id="+id,function(err,res){
            if(err) throw err;
        });
    }
    con.query("select COUNT(*) as c from employeetable where Emp_Id IS NOT NULL", function (err, res) {
        console.log(res);
        if (err) throw err;
        z = res[0].c;
        console.log(z);
    })
    con.query("select * from employeetable where Emp_Id IS NOT NULL", function (err, resu) {
        console.log(resu);
        console.log(z);

        for (var x = 0; x < z; x++) {
            employeesupdate.push({
                a: resu[x].Emp_Id,
                b: resu[x].EName,
                c: resu[x].Address,
                d: resu[x].Salary,
                e: resu[x].Role,
                f: resu[x].email,
                g:resu[x].Hostel_Name
            })
        }


        res.render("employee", { stud: employeesupdate});
    
});});
app.listen(4000, function () {
    console.log("Server started");
});
