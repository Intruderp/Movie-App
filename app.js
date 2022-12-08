const express=require('express');
const bodyParser = require('body-parser')
const mysql=require('mysql'); 
const ejs=require('ejs');
const cookieParser=require('cookie-parser');
require('dotenv').config();

const app=express();

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Database Connection 
const db=mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

db.connect((error)=>{
    if(error){
        console.error();
    }
    else{
        console.log("MYSQL Database Connected....")
    }
});


// Define Routes
app.use('/',require('./routes/pages'));
app.use('/auth',require('./routes/auth'));      // if some request starts from /auth -> redirecting to auth.js file


app.listen(process.env.PORT || 3000,function(){
    console.log('Movie Server Started');
});