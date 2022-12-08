const mysql = require('mysql');
const express = require('express');
const jwt = require('jsonwebtoken');
const moment=require('moment');
const router = express.Router();
const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});


router.get('/', async function (req, res) {
    var cookie = req.cookies.jwt;
    if (cookie == undefined) {
        res.render('list', { message: 'Please Login!!', results: '' });
    }
    else {
        const user = await jwt.verify(cookie, process.env.JWT_SECRET);
        db.query('SELECT * FROM movies where user_email=?', [user._id], async (error, results) => {
            res.render('list', { message: '', results: results });
        });
    }
});

router.get('/register', function (req, res) {
    res.render('register', { message: '' });
});

router.get('/login', function (req, res) {
    res.render('login', { message: '' });
});


router.get('/add', async function (req, res) {
    var cookie = req.cookies.jwt;
    if (cookie == undefined) {
        res.render('add', { message: 'please login to add movies' });
    }
    else {
        const user = await jwt.verify(cookie, process.env.JWT_SECRET);
        res.render('add', { message: '' });
    }
});

router.post('/add', async function (req, res) {
    var cookie = req.cookies.jwt;
    const user = await jwt.verify(cookie, process.env.JWT_SECRET);
    console.log(req.body);
    var dateTime=req.body.releaseDate;
    var date=moment.utc(dateTime).format('YYYY-MM-DD');
    console.log(date);
    db.query('INSERT INTO movies SET ?', { user_email: user._id, name: req.body.name, rating: req.body.rating, cast: req.body.cast, genre: req.body.genre, release_date: date }, (error, results) => {
        res.redirect('/');
    });
});

router.get("/delete/:ID", function (req, res) {
    //using dynamic url by express routing
    const ID = req.params.ID;
    db.query('DELETE FROM movies WHERE ID=?',[ID],(error,resuls)=>{
        res.redirect('/');
    });
});

router.get("/edit/:ID", function (req, res) {
    //using dynamic url by express routing
    const ID = req.params.ID;
    db.query('SELECT * FROM movies where ID=?', [ID], async (error, results) => {
        res.render('edit', {results: results});
    });
});

router.post("/edit/:ID", function (req, res) {
    //using dynamic url by express routing
    const ID = req.params.ID;
    db.query('UPDATE movies SET name=?, rating=?, cast=?, genre=?, release_date=? where ID=?', [req.body.name,req.body.rating,req.body.cast,req.body.genre,req.body.releaseDate,ID], async (error, results) => {
        res.redirect('/');
    });
});

router.get('/logout',(req,res)=>{
    res.clearCookie("jwt");
    res.redirect('/');
});
module.exports = router;