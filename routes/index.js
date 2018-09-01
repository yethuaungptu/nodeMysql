var express = require('express');
var router = express.Router();
var User = require('../models/User');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET signup page. */
router.get('/signup', function(req, res, next) {
  res.render('commons/sign-up', { title: 'Signup' });
});

/* GET signup page. */
router.post('/signup', function(req, res, next) {
  var params = [req.body.name,req.body.email, req.body.password,'USER'];
  User.findByEmail(req.body.email, function (err,rows) {
    if(err) throw err;
    if(rows.length > 0){
      req.flash('warning', 'Duplicated email!!');
      res.redirect('/signup');
    }else {
      User.add(params, function (err2,result) {
        if(err2) throw err2;
        res.render('commons/sign-up-success', {title: 'Signup success'});
      });
    }
  });
});

router.post('/dupemail', function(req, res, next) {
  User.findByEmail(req.body.email, function (err,rows) {
    if(err) throw err;
    console.log(rows);
    if(rows.length > 0){
      console.log('call');
      res.json({ status:true, msg:'Duplicated email!!'});
    }else {
        console.log('true call');
      res.json({status:false});
    }
  });
});

router.get('/signin', function(req, res, next) {
  console.log(req.cookies.email);
  var email = (req.cookies.email)?req.cookies.email:'';
  res.render('commons/sign-in', { title: 'Signin' , email:email});
});

router.post('/signin', function(req, res, next) {
  User.findByEmail(req.body.email, function (err,users) {
    if(err) next(err);
    if(users.length == 0 || !User.compare(req.body.password,users[0].password)){
      req.flash('warning', 'Email not exists or password not matched!!');
      if(req.body.forward) req.flash('forward', req.body.forward);
      res.redirect('/signin');
    }else{
      req.session.user = {uid:users[0].uid, name: users[0].name, email: users[0].email,role : users[0].role };
      console.log(req.body.rememberme);
      if(req.body.rememberme) res.cookie('email',users[0].email, { maxAge: 86400 * 7});
      else res.cookie('email','',{maxAge: 0});

      if(req.body.forward &&
          (users[0].role=='ADMIN' && req.body.forward.startsWith('/admin')||
           users[0].role=='USER' && req.body.forward.startsWith('/members')
          )){
        res.redirect(req.body.forward);
      }else if(users[0].role == 'ADMIN'){
        res.redirect('/admin');
      }else{
        res.redirect('/members');
      }

    }
  });
});

router.get('/login',(req,res,next)=>{
  res.render('commons/login');
})

router.post('/login',(req,res, next)=>{
  User.findByEmail(req.body.email, function (err,users) {
    if(err) next(err);
    if(users.length == 0 || !User.compare(req.body.password,users[0].password)){
      res.json({ status: false, msg: "Email not exists or password not matched!!"});
    }else{
      req.session.user = {uid:users[0].uid, name: users[0].name, email: users[0].email,role : users[0].role };
      res.json({ status : true})
    }
  });
});

router.get('/signout',(req,res,next)=>{
  req.session.destroy();
  res.redirect('/');
});

router.get('/init', function(req, res, next) {
  var params = ['Admin','help@atutu.com', 'Zikimi95','ADMIN'];
      User.add(params, function (err,result) {
        if(err) throw err;
        console.log('init',result);
        res.end('OK');
      });
});

module.exports = router;
