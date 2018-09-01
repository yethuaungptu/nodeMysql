var express = require('express');
var router = express.Router();
var users = require('./users');

router.use(function (req,res,next) {
  if(req.session.user.role == "ADMIN"){
    next();
  }else{
    req.flash('warning','Not allowed user! Please login with admin account');
    res.redirect('/signin');
  }
});

router.get('/',(req,res)=>{
  res.render('members/home',{title:'Admin Home'});
});

router.use('/users', users);

module.exports = router;
