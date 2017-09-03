var express = require('express');
var router = express.Router();
var csurf = require('csurf');
var passport = require('passport');
var User = require('../models/hieruser.js')

var csurfProtection = csurf();


router.use(csurfProtection);




router.get('/logout',isLoggedIn, function (req,res,next) {
    req.logout();
    res.redirect('/');
})

router.get('/hierSignup',function(req,res,next){
	var messages = req.flash('error');
  //  res.render('user/signup',{csrfToken : req.csrfToken()});
	res.render('user/hierSignup',{csrfToken: req.csrfToken(),messages:messages,hasErrors:messages.length>0})

});
router.post('/hierSignup',passport.authenticate('local.hierSignup',{
	successRedirect:'/',
    failureRedirect:'/hierSignup',
    failureFlash:true

}));
router.get('/hierSignin',function(req,res,next){
	 var messages = req.flash('error');
    res.render('user/hierSignin',{csrfToken: req.csrfToken(),messages:messages,hasErrors:messages.length>0})

})
router.post('/hierSignin',passport.authenticate('local.hierSignin',{
	//successRedirect:'/user',
    failureRedirect:'/user/hierSignin',
    failureFlash:true

}),function(req,res,next)
{
    req.session.phnNumber = req.body.phnNumber;
    if(req.session.phnNumber){
        var oldUrl = req.session.phnNumber;
        req.session.phnNumber  =null;
        res.redirect('/profile/' + oldUrl )
    }
    else
    {
        res.redirect('/user/signin')
    }
});

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	};
	res.redirect('/');
}
function notLoggedIn(req,res,next)
{
    if(!req.isAuthenticated()){
        return next();
    }
    res.redirect(('/'));

}
module.exports = router;
