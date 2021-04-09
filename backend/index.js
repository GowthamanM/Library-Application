const express = require('express');
const fetch = require('node-fetch');
var uuid = require("uuid");
var mysql = require('mysql');
var cors = require('cors')
var nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const firebase = require('firebase');
var logType="";
var localUser ="";
var bookString="";
let books = "";

//mysql connection
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "e-lib"
});

//firebase connection configuration
var config = {
  apiKey: "AIzaSyCn-X13JjPaog4mW2kyrZhOEzXARhtcufg",
  authDomain: "e-lib1.firebaseapp.com",
  databaseURL: "https://e-lib1-default-rtdb.firebaseio.com",
};
firebase.initializeApp(config);
let firebaseDB = firebase.database();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//get all the available books
app.get('/books', (req, res) => {
  //Select all books and return the result object:
  con.query("SELECT * FROM book_model", function (err, result) {
    if (err) throw err;
    console.log(result);
    res.json(result);
  });
});


//adding a new book
app.post('/books/addBook', (req, res) => {
  var data = req.body;
  con.query("insert INTO book_model(book_id,book_name,quantity) VALUES('" + data.book_id + "','" + data.book_name + "'," + data.quantity + ")"
    , function (err, result) {
      if (err) throw err;
    });
});

//getting all the students
app.get('/getStudents', (req, res) => {
  con.query("SELECT * FROM student_model", function (err, result) {
    if (err) throw err;
    res.json(result);
  });
})

// save student 
app.post('/getStudents/save', (req, res) => {
  var data = req.body;
  con.query("INSERT INTO `student_model` (`name`, `dept`, `year`, `status`, `email`, `rfid_tag`, `books`, `total_amount`, `due_amount`) VALUES ('" + data.name + "','" + data.dept + "', '" + data.year + "','" + data.status + "', '" + data.email + "', '" + data.rfid_tag + "', '" + data.books + "', '" + data.total_amount + "', '" + data.due_amount + "')",
    function (err, result) {
      if (err) throw err;
    });
  console.log(data);
  // res.sendStatus(200);
})

//user Validation
function validateUser(data) {
  var user;
  var str = data.Tag_Tx.split(",");
  con.query("SELECT * FROM student_model WHERE rfid_tag='" + str[1] + "'", function (err, result) {
    if (err) throw err;
    // var stuID=result[0].rfid_tag;
    console.log(result.length);
    console.log(result);
    if (data.Tag_Tx !== "") {
      if (result.length === 0) {
        sendCheckInResponse("20", data);
      } else if(result[0].status === 1){
        
        if(str[0] === 'IN'){
          if(result[0].books >= 4){
            sendCheckInResponse("40",data);
          }else{
            sendCheckInResponse("50", data);
            localUser = result[0].rfid_tag;
            logType = "IN";
          }
        }else{
          sendCheckInResponse("50", data);
            localUser = result[0].rfid_tag;
            logType = "OUT";
        }
      }else{
        sendCheckInResponse("30", data);
      }
    }


    if(localUser !== "" && data.Book_in !== ""){
      console.log("entered");
      firebaseDB.ref("CheckIn/").set({
        Ack: data.Ack,
        Book_in: "",
        Tag_Tx: ""
      });
      bookString = data.Book_in.split(",");
      var today = new Date();
      var time = String(today.getHours()).padStart(2,'0') + ":" + String(today.getMinutes()).padStart(2,'0');
      if(logType === "IN"){
        for(var a=0;a < bookString.length;a++){
          con.query("INSERT INTO book_log(student_id,book_id,checkIn_date,status) VALUES ('"+localUser+"','"+bookString[a]+"','"+time+"',0)",function(err,result1){
            if(err) throw err;
          });
          con.query("select quantity from book_model where book_id='"+bookString[a]+"'",function(err,result){
            con.query("update book_model set quantity="+(result[0].quantity - 1));
          });
          
        }
      }else{
        for(var a=0;a < bookString.length;a++){
          con.query("update book_log set status = 1 where book_id='"+bookString[a]+"' and student_id='"+localUser+"'",function(err,result1){
            if(err) throw err;
          });
          con.query("select quantity from book_model where book_id='"+bookString[a]+"'",function(err,result){
            con.query("update book_model set quantity="+(result[0].quantity + 1));
          });
        }
      }
      
      console.log('book-->'+bookString+' user-->'+localUser);
      localUser = "";
      bookString="";

    }
  });
}


//save the log
async function saveLog(logType, date, time, id) {
  var student_data;
  await con.query("select * from student_model where rfid_tag='" + id + "'", function (err, result) {
    console.log(JSON.parse(JSON.stringify(result))[0].name);
    con.query("Insert into log_model(student_id,student_name,time,date,in_out) values('" + id + "','" + JSON.parse(JSON.stringify(result))[0].name + "','" + time + "','" + date + "','" + logType + "')",
      function (err, result) {
        if (err) throw err;
      });
  });

}


app.post('/getStudents/pay',(req,res)=>{
  console.log(req.body);
  con.query("select total_amount,due_amount from student_model where rfid_tag='"+req.body[0].rfid_tag+"'",function(err,result){
    console.log(result);
    console.log(result[0].due_amount + result[0].total_amount);
    con.query("update student_model set total_amount="+(result[0].due_amount + result[0].total_amount)+ " where rfid_tag='"+req.body[0].rfid_tag+"'",function(err,result1){
      if(err) throw err;
    });
    con.query("update student_model set due_amount=0 where rfid_tag='"+req.body[0].rfid_tag+"'",function(err,result1){});

  })
  res.sendStatus(200);
})

//get Logs
app.post('/getLogs', (req, res) => {
  console.log(req.body);
  con.query("Select * from log_model where date='"+req.body.date+"'",function(err,result){
    res.json(result);
  });
})

app.post('/getStudents/books',(req,res)=>{
  con.query("select * from book_log where student_id='"+req.body[0].rfid_tag+"' and status=0",(err,result)=>{
    if(err) throw err;
    res.json(result);
  })
})
//checkInResponse
function sendCheckInResponse(data, userData) {
  userData.Ack = data;
  firebaseDB.ref("CheckIn/").set({
    Ack: data,
    Book_in: userData.Book_in,
    Tag_Tx: ""
  })
}

//logUser Function
function logUser(data) {
  if(data.Tag_Tx !== ""){
    con.query("SELECT * FROM student_model WHERE rfid_tag='" + data.Tag_Tx + "'", function (err, result) {
      if (err) throw err;
      if (result.length === 0) {
        sendAttendanceResponse("20");
      } else {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth()+1).padStart(2, '0');
        var yyyy = today.getFullYear();
        date = yyyy + '-' + mm + '-' + dd;
        var time = String(today.getHours()).padStart(2,'0')+ ":" + String(today.getMinutes()).padStart(2,'0');
        console.log(date + '-->' + time+'-->'+data.in_out);
        saveLog(data.in_out, date, time, data.Tag_Tx);
        sendAttendanceResponse("30");
      }
    });
  }
}

//delete book
app.post('/books/delete',(req,res)=>{
  con.query("delete from book_model where book_id = '"+req.body.book_id+"'",(err,result)=>{
    if(err) throw err;
  })
  res.sendStatus(200);
});

//send LogResponse
function sendAttendanceResponse(data){
  firebaseDB.ref("Attendance/").set({
        Ack: data,
        in_out: "",
        Tag_Tx: ""
      })
}

app.listen(3000, () => {
  console.log('PORT 3000');

  con.connect(function (err) {
    if (err) throw err;
    console.log('Connected!');
  });

  function checkInData() {
    var data;
    fetch('https://e-lib1-default-rtdb.firebaseio.com/Attendance.json')
      .then(res => res.json())
      .then(json => {
        console.log("First user in the array:");
        console.log(json);
        logUser(json);
      })
  }
  setInterval(checkInData, 3000);
  setInterval(checkBookResponse,10000);
  setInterval(notifier,60000);
});

//Book Log
function checkBookResponse(){
  fetch('https://e-lib1-default-rtdb.firebaseio.com/CheckIn.json')
  .then(res => res.json())
      .then(json => {
        console.log("First user in the array:");
        console.log(json);
        validateUser(json);
      })
      console.log(localUser);
      console.log(bookString);
}

// mail sender
function notifier(){
  con.query("select * from book_log where status=0",function(err,result){
    for(var a=0;a<result.length;a++){
      var today = new Date();
      var hour = result[a].checkIn_date.split(":");
      console.log(parseInt(today.getMinutes() - parseInt(hour[1])));
      if(parseInt(today.getMinutes() - parseInt(hour[1])) > 1){
        con.query("update book_log set due_amount="+ (parseInt(result[a].due_amount) + 1) +" where student_id='"+result[a].student_id+"' AND book_id='"+result[a].book_id+"'",function(err,result1){
          if(err) throw err;
        });

      }
    }
    console.log(result);
  });
  con.query("select rfid_tag from student_model",function(err,result){
    console.log(result);
    for(var a=0;a<result.length;a++){
      con.query("update student_model set due_amount = (SELECT SUM(due_amount) FROM book_log WHERE student_id='"+result[a].rfid_tag+"')where rfid_tag='"+result[a].rfid_tag+"'",function(err,result1){
        if(err) throw err;
      })
    }
  });
  con.query("select * from student_model where due_amount > 0",function(err,result){
    if(err) throw err;

    console.log(result);
    for(var a=0;a<result.length;a++){
      con.query("select book_id from book_log where status = 0 and due_amount > 1 and student_id = '"+result[a].rfid_tag+"'",function(err,result1){
        console.log(result1);
        for(var b=0;b<result1.length;b++){
          con.query("select book_name from book_model where book_id='"+result1[b].book_id+"'",function(err,result2){
            if(err) throw err;
          //  setBooksName(result2[0].book_name);
          });
        }
      });
    console.log(books);
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'gowthamankyuku@gmail.com',
          pass: 'pemdcxwqfeqxztpu'
        }
      });
      
      var mailOptions = {
        from: 'gowthamankyuku@gmail.com',
        to: result[a].email,
        subject: 'Remainder From E-Lib',
        text: 'Kindly submit the books along with your due amount ₹'+result[a].due_amount+'.Every day ₹1 will be added to your due amount if failed to submit your books within 15 days!'
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
        books="";
      });
    }
  });


}