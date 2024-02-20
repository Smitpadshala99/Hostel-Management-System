-- Dummy DATAcreate database hostelmanagement;
use hostelmanagement;

create table hostel (Hostel_Name varchar(30) primary key, Address varchar(100), No_of_rooms int); 
create table roomTable (Room_Id varchar(30), Capacity int, Hostel_Name varchar(30),PRIMARY KEY (Room_Id, Hostel_Name), FOREIGN KEY (Hostel_Name) REFERENCES hostel(Hostel_Name)); 
CREATE TABLE if not exists studenttable (RollNo varchar(10) primary key, FullName varchar(30), GuardianName varchar(25), Disabled varchar(10), PhoneNo varchar(13), GuardianPhoneNo varchar(13), Email varchar(25) UNIQUE, DOB date, Gender varchar(10), Department varchar(35), Semester int, MeritRank int, Distance float, Address varchar(110), password varchar(300), Room_Id varchar(30), Hostel_Name varchar(30), FOREIGN KEY (Room_Id) REFERENCES roomtable(Room_Id), FOREIGN KEY (Hostel_Name) REFERENCES roomtable(Hostel_Name));

CREATE TABLE if not exists employeeTable (Emp_Id varchar(10) primary key, EName varchar(30), Address varchar(100), Salary float, Role varchar(20), email varchar(25), Hostel_Name varchar(30), FOREIGN KEY (Hostel_Name) REFERENCES hostel(Hostel_Name));
CREATE TABLE managingStaff (Emp_Id varchar(10) primary key, Login_id varchar(25), password varchar(30), FOREIGN KEY (Emp_Id) references employeeTable(Emp_Id));
CREATE TABLE inventory (Inv_Id varchar(10), Name varchar(25), Room_Id varchar(30), Hostel_Name varchar(30), FOREIGN KEY (Room_Id) REFERENCES roomtable(Room_Id), FOREIGN KEY (Hostel_Name) REFERENCES roomtable(Hostel_Name)); 
create table applicationTable (Hostel_Name varchar(30), RollNo varchar(10), FOREIGN KEY (Hostel_Name) REFERENCES hostel(Hostel_Name), FOREIGN KEY (RollNo) REFERENCES studenttable(RollNo));

INSERT INTO hostel VALUES ("Boys Hostel","Knowledge Corridor, Raisan Village, PDPU Rd, Gandhinagar, Gujarat 382007",84);
INSERT INTO hostel VALUES ("Girls Hostel","Knowledge Corridor, Raisan Village, PDPU Rd, Gandhinagar, Gujarat 382007",84);
insert into roomTable values ("A001",2,"Boys Hostel");
insert into roomTable values ("A002",2,"Boys Hostel");
insert into roomTable values ("A003",2,"Boys Hostel");
insert into roomTable values ("A004",2,"Boys Hostel");
insert into roomTable values ("A005",2,"Boys Hostel");
insert into roomTable values ("A006",2,"Boys Hostel");
insert into roomTable values ("A007",2,"Boys Hostel");
insert into roomTable values ("A008",2,"Boys Hostel");
insert into roomTable values ("A009",2,"Boys Hostel");
insert into roomTable values ("A010",2,"Boys Hostel");
insert into roomTable values ("A011",2,"Boys Hostel");
insert into roomTable values ("A012",2,"Boys Hostel");
insert into roomTable values ("A013",2,"Boys Hostel");
insert into roomTable values ("A014",2,"Boys Hostel");
insert into roomTable values ("A101",2,"Boys Hostel");
insert into roomTable values ("A102",2,"Boys Hostel");
insert into roomTable values ("A103",2,"Boys Hostel");
insert into roomTable values ("A104",2,"Boys Hostel");
insert into roomTable values ("A105",2,"Boys Hostel");
insert into roomTable values ("A106",2,"Boys Hostel");
insert into roomTable values ("A107",2,"Boys Hostel");
insert into roomTable values ("A108",2,"Boys Hostel");
insert into roomTable values ("A109",2,"Boys Hostel");
insert into roomTable values ("A110",2,"Boys Hostel");
insert into roomTable values ("A111",2,"Boys Hostel");
insert into roomTable values ("A112",2,"Boys Hostel");
insert into roomTable values ("A113",2,"Boys Hostel");
insert into roomTable values ("A114",2,"Boys Hostel");
insert into roomTable values ("A201",2,"Boys Hostel");
insert into roomTable values ("A202",2,"Boys Hostel");
insert into roomTable values ("A203",2,"Boys Hostel");
insert into roomTable values ("A204",2,"Boys Hostel");
insert into roomTable values ("A205",2,"Boys Hostel");
insert into roomTable values ("A206",2,"Boys Hostel");
insert into roomTable values ("A207",2,"Boys Hostel");
insert into roomTable values ("A208",2,"Boys Hostel");
insert into roomTable values ("A209",2,"Boys Hostel");
insert into roomTable values ("A210",2,"Boys Hostel");
insert into roomTable values ("A211",2,"Boys Hostel");
insert into roomTable values ("A212",2,"Boys Hostel");
insert into roomTable values ("A213",2,"Boys Hostel");
insert into roomTable values ("A214",2,"Boys Hostel");

delete from studentTable;
delete from studentTable where RollNo = "21BCP191";
delete from studentTable where RollNo = "1162";
delete from studentTable where RollNo = "21BCP001";
INSERT INTO studentTable (Disabled, FullName, GuardianName, PhoneNo, GuardianPhoneNo, Email, DOB, Gender, Department, RollNo, Semester, MeritRank, Distance, Address, password) VALUES ("yes","Nisarg Jignesh Patel","Bhavika Jignesh Patel","7990270878","8155022415","nisarg123@gmail.com","2003-09-04","male","Computer Science","21BCP191",4,2,24,"MIG-108, K.K. Nagar Part-2, Ghatlodia, Ahmedabad - 380061","nisarg@123");
-- INSERT INTO studentTable (Disabled, FullName, GuardianName, PhoneNo, GuardianPhoneNo, Email, DOB, Gender, Department, RollNo, Semester, MeritRank, Distance, Address, password) VALUES ("yes","Nisarg Jignesh Patel","Bhavika Jignesh Patel","7990270878","8155022415","nisarg123@gmail.com","2003-09-04","male","Computer Science","21BCP191",4,2,24,"MIG-108, K.K. Nagar Part-2, Ghatlodia, Ahmedabad - 380061","nisarg@123"),("no","Ram Patel","Dashrat Patel","7990270871","1155022415","ram123@gmail.com","2003-09-01","male","Computer Science","21BCP001",4,1,24,"MIG-105, K.K. Nagar Part-2, Ghatlodia, Ahmedabad - 380061","ram@123");
INSERT INTO studentTable (Disabled, FullName, GuardianName, PhoneNo, GuardianPhoneNo, Email, DOB, Gender, Department, RollNo, Semester, MeritRank, Distance, Address, password) VALUES ("no","Ram Patel","Dashrat Patel","7990270871","1155022415","ram123@gmail.com","2003-09-01","male","Computer Science","21BCP001",4,1,24,"MIG-105, K.K. Nagar Part-2, Ghatlodia, Ahmedabad - 380061","ram@123");

INSERT INTO employeeTable VALUES ("admin1", "admin123", "Shantikunj Society, Chandkheda, Ahmedabad, Gujarat 382424",800000,"admin","admin123@gmail.com","Boys Hostel");
INSERT INTO employeeTable VALUES ("warden1", "warden123", "101-Shantikunj Society, Chandkheda, Ahmedabad, Gujarat 382424",600000,"admin","warden123@gmail.com","Boys Hostel");
INSERT INTO managingStaff VALUES ("admin1","admin123@gmail.com","admin@123");
update employeetable set EName = "admin123" where Emp_Id="admin1";
-- delete from employeeTable where Emp_Id = "admin1";

-- drop table studentTable;
drop table applicationTable;
delete from studenttable;
delete from studenttable where Room_Id = "A101";
INSERT INTO studenttable (RollNo, FullName, GuardianName, Disabled, PhoneNo, GuardianPhoneNo, Email, DOB, Gender, Department, Semester, MeritRank, Distance, Address, password, Room_Id, Hostel_Name)
VALUES ('1159', 'David James', 'Michael James', 'No', '9816512385', '9856347123', 'david.james@gmail.com', '2002-09-12', 'Male', 'Mechanical Engineering', 6, 138, 25.3, '23 Main Street, New York', 'davidjames123', NULL, NULL);

INSERT INTO studenttable (RollNo, FullName, GuardianName, Disabled, PhoneNo, GuardianPhoneNo, Email, DOB, Gender, Department, Semester, MeritRank, Distance, Address, password, Room_Id, Hostel_Name)
VALUES ('1160', 'John Miller', 'William Miller', 'No', '9842156734', '9814763958', 'john.miller@gmail.com', '2003-06-05', 'Male', 'Chemical Engineering', 2, 225, 32.1, '56 Oak Avenue, Los Angeles', 'johnmiller123', NULL, NULL);

INSERT INTO studenttable (RollNo, FullName, GuardianName, Disabled, PhoneNo, GuardianPhoneNo, Email, DOB, Gender, Department, Semester, MeritRank, Distance, Address, password, Room_Id, Hostel_Name)
VALUES ('1161', 'Benjamin Smith', 'Joseph Smith', 'No', '9876543210', '9810123456', 'benjamin.smith@gmail.com', '2001-11-21', 'Male', 'Information and Technology', 5, 80, 18.5, '34 6th Street, Boston', 'benjaminsmith123', NULL, NULL);

INSERT INTO studenttable (RollNo, FullName, GuardianName, Disabled, PhoneNo, GuardianPhoneNo, Email, DOB, Gender, Department, Semester, MeritRank, Distance, Address, password, Room_Id, Hostel_Name)
VALUES ('1162', 'Nicholas White', 'Anthony White', 'No', '9898765432', '9823456789', 'nicholas.white@gmail.com', '2003-02-14', 'Male', 'Mechanical Engineering', 1, 213, 35.2, '87 Maple Road, Chicago', 'nicholaswhite123', NULL, NULL);

INSERT INTO studenttable (RollNo, FullName, GuardianName, Disabled, PhoneNo, GuardianPhoneNo, Email, DOB, Gender, Department, Semester, MeritRank, Distance, Address, password, Room_Id, Hostel_Name)
VALUES ('1163', 'Andrew Martinez', 'Richard Martinez', 'No', '9845678912', '9812345678', 'andrew.martinez@gmail.com', '2001-07-17', 'Male', 'Information and Technology', 8, 118, 15.6, '45 Cedar Street, San Francisco', 'andrewmartinez123', NULL, NULL);

Alter table studenttable modify email char(35);
INSERT INTO studenttable (RollNo, FullName, GuardianName, Disabled, PhoneNo, GuardianPhoneNo, Email, DOB, Gender, Department, Semester, MeritRank, Distance, Address, password, Room_Id, Hostel_Name) 
VALUES ('2023042', 'Vishal Dey', 'Nikhil Dey', 'No', '1234567890', '1234567890', 'vishal42@gmail.com', '2004-06-01', 'Male', 'Chemical Engineering', 2, 379, 4.2, 'GHI Road, MNO', 'vishaldey', null, null);

INSERT INTO studenttable (RollNo, FullName, GuardianName, Disabled, PhoneNo, GuardianPhoneNo, Email, DOB, Gender, Department, Semester, MeritRank, Distance, Address, password, Room_Id, Hostel_Name) 
VALUES ('2023043', 'Partho Sarathi', 'Pradip Kumar', 'No', '1234567890', '1234567890', 'partho43@gmail.com', '2004-07-20', 'Male', 'Chemical Engineering', 2, 383, 5.7, 'DEF Road, ABC', 'parthosarathi', null, null);

INSERT INTO studenttable (RollNo, FullName, GuardianName, Disabled, PhoneNo, GuardianPhoneNo, Email, DOB, Gender, Department, Semester, MeritRank, Distance, Address, password, Room_Id, Hostel_Name) 
VALUES ('2023044', 'Soham Sarkar', 'Subrata Sarkar', 'No', '1234567890', '1234567890', 'soham44@gmail.com', '2004-02-17', 'Male', 'Chemical Engineering', 2, 382, 6.3, 'PQR Road, DEF', 'sohamsarkar', null, null);

INSERT INTO studenttable (RollNo, FullName, GuardianName, Disabled, PhoneNo, GuardianPhoneNo, Email, DOB, Gender, Department, Semester, MeritRank, Distance, Address, password, Room_Id, Hostel_Name) 
VALUES ('2023045', 'Arnab Mondal', 'Prabir Mondal', 'No', '1234567890', '1234567890', 'arnab45@gmail.com', '2004-03-05', 'Male', 'Chemical Engineering', 2, 377, 7.1, 'ABC Road, XYZ', 'arnabmondal', null, null);

INSERT INTO studenttable (RollNo, FullName, GuardianName, Disabled, PhoneNo, GuardianPhoneNo, Email, DOB, Gender, Department, Semester, MeritRank, Distance, Address, password, Room_Id, Hostel_Name) 
VALUES ('2023046', 'Sukanta Roy', 'Sujit Roy', 'No', '1234567890', '1234567890', 'sukanta46@gmail.com', '2004-01-28', 'Male', 'Chemical Engineering', 2, 381, 8.8, 'LMN Road, PQR', 'sukantaroy', null, null);


INSERT INTO studenttable (RollNo, FullName, GuardianName, Disabled, PhoneNo, GuardianPhoneNo, Email, DOB, Gender, Department, Semester, MeritRank, Distance, Address, password, Room_Id, Hostel_Name) VALUES
('CSE001', 'Abhishek Sharma', 'Ravi Sharma', 'No', '9900157890', '8899157790', 'abhishek.sharma@example.com', '1998-07-12', 'Male', 'Computer Engineering', 3, 20, 11.5, '123, ABC Society, XYZ Road, Mumbai', 'password1', null, null),
('CSE002', 'Vikas Singh', 'Rajiv Singh', 'No', '9900157891', '8899157791', 'vikas.singh@example.com', '1999-05-10', 'Male', 'Computer Engineering', 3, 18, 10.5, '124, ABC Society, XYZ Road, Mumbai', 'password2', null, null),
('CSE003', 'Manish Patel', 'Mukesh Patel', 'No', '9900157892', '8899157792', 'manish.patel@example.com', '1998-12-02', 'Male', 'Computer Engineering', 3, 22, 9.5, '125, ABC Society, XYZ Road, Mumbai', 'password3', null, null),
('CSE004', 'Aman Gupta', 'Anil Gupta', 'No', '9900157893', '8899157793', 'aman.gupta@example.com', '1999-04-27', 'Male', 'Computer Engineering', 3, 17, 7.5, '126, ABC Society, XYZ Road, Mumbai', 'password4', null, null),
('CSE005', 'Rohit Verma', 'Rakesh Verma', 'No', '9900157894', '8899157794', 'rohit.verma@example.com', '2000-02-15', 'Male', 'Computer Engineering', 3, 14, 6.5, '127, ABC Society, XYZ Road, Mumbai', 'password5', null, null),
('CSE006', 'Ankit Singh', 'Vijay Singh', 'No', '9900157895', '8899157795', 'ankit.singh@example.com', '2000-07-22', 'Male', 'Computer Engineering', 3, 15, 10.0, '128, ABC Society, XYZ Road, Mumbai', 'password6', null, null),
('CSE007', 'Prakash Jha', 'Amit Jha', 'No', '9900157896', '8899157796', 'prakash.jha@example.com', '1999-01-01', 'Male', 'Computer Engineering', 3, 25, 7.0, '129, ABC Society, XYZ Road, Mumbai', 'password7', null, null),
('CSE008', 'Yash Gupta', 'Anil Gupta', 'No', '9900157897', '8899157797', 'yash.gupta@example.com', '1998-09-18', 'Male', 'Computer Engineering', 3, 23, 6.0, '130, ABC Society, XYZ Road, Mumbai', 'password8', null, null);