const express=require('express');
const authController=require('../controllers/auth');

const router=express.Router();



// we're in auth file => /register is similar to auth/register
router.post('/register',authController.register);
router.post('/login',authController.login);

module.exports=router;