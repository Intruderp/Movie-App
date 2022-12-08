const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

exports.register = async (req, res) => {

    const email = req.body.email;
    const password = req.body.password;
    let hashedPassword = await bcrypt.hash(password, 8);
    db.query('SELECT * FROM users where Email=?', [email], async (error, results) => {
        if (error) {
            console.log(error);
        }
        else if (results.length > 0) {
            res.render('register', { message: 'Email is already taken' });
        }
        else {
            const createToken= async()=>{
                const token = await jwt.sign({_id:email},process.env.JWT_SECRET);
                return token;
            }
            const token=await createToken();

            // Cookie
            // res.cookie() function is used to set the cookie name with the value;
            // The value parameter can be string or object converted to JSON
            // syntax : res.cookie(name,value,[options])

            //res.cookie("jwt",token);
            res.cookie("jwt",token,{
                expires: new Date(Date.now()+3000000)
            });
            //console.log(cookie);

            db.query('INSERT INTO users SET ?',{Email:email,Password:hashedPassword,Token:token},(error,results)=>{
                if(error){
                    console.log(error);
                }
                else{
                    res.redirect('/');
                }
            });
        }
    });
}

exports.login = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    db.query('SELECT * FROM users where Email=?', [email], async (error, results) => {
        if (error) {
            console.log(error);
        }
        else if (results.length > 0) {
            const comparision = await bcrypt.compare(password, results[0].Password)
            if (comparision) {

                const createToken= async()=>{
                    const token = await jwt.sign({_id:email},process.env.JWT_SECRET);
                    console.log(token);
                    return token;
                }
                const token=await createToken();
               // res.cookie("jwt",token);
                res.cookie("jwt",token,{
                    expires: new Date(Date.now()+3000000)
                });
                res.redirect('/');
            }
            else {
                res.render('login', { message: "Email and password does not match" });
            }
        }
        else {
            res.render('login', { message: 'Invalid Email' });
        }
    });
}