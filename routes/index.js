var express = require('express');
var router = express.Router();
var csurf = require('csurf');
var passport = require('passport');
var User = require('../models/needJobUser.js');
var review = require('../models/review.js');

var csurfProtection = csurf();
router.use(csurfProtection);


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/logout',isLoggedIn, function (req,res,next) {
    req.logout();

    res.redirect('/');
})

router.get('/user/signup',notLoggedIn,function(req,res,next){
	var messages = req.flash('error');
  //  res.render('user/signup',{csrfToken : req.csrfToken()});
	res.render('user/signup',{csrfToken: req.csrfToken(),messages:messages,hasErrors:messages.length>0})

});

router.post('/user/signup',notLoggedIn,passport.authenticate('local.signup',{
	//successRedirect:'/',
    failureRedirect:'/user/signup',	
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

router.get('/type',function(req,res,next){
    User.find().distinct('work',function(err,result){
        res.render('works/work', { data:result });
    })
});
router.get('/work/:type',function(req,res,next){
    User.find({work:req.params.type},function(err,result){
        res.render('works/allworkers',{data:result});
    })
});
router.get('/profile/:id1',function(req,res,next){
        var review1 = [];
        var result1;
    User.findOne({phnNumber:req.params.id1},function(err,result){
        console.log(req.csrfToken());
        result1=result;
        
    });
    var rating = 0;
    var count = 0;
    review.find({phnNumber:req.params.id1},function(err,resul){
        for(var i=0;i<resul.length;i++)
        {
            count++;
            rating  +=  (Number(resul[i].rate)?Number(resul[i].rate): 0);
        }
        console.log(Number(rating)/count + "jjjj");

        res.render('works/profile',{data:result1,csrfToken:req.csrfToken(),number:req.params.id1,review:resul,ratings:Number(rating)/count});
       
        })
   
    
    // review.find(function(err,result){
    //     res.render('works/profile', { data: result });
    // })
});
router.get('/create/review/:phn',function(req,res,next){
    res.render('./works/addReview',{csrfToken:req.csrfToken(),number:req.params.phn});
})

router.post('/create/review/:phn',function(req,res,next){
    var first = new review({
        phnNumber:req.params.phn,
        title:req.body.title,
        disc:req.body.disc,
        author:req.body.author,
        rate:4
    });
    first.save(function(err,result){
        if(err){
            return(err);
        }

    })
    res.redirect('/profile/' + req.params.phn)

})

router.get('/user/signin',function(req,res,next){
	 var messages = req.flash('error');
    res.render('user/signin',{csrfToken: req.csrfToken(),messages:messages,hasErrors:messages.length>0})

});

router.post('/user/signin',passport.authenticate('local.signin', {
 //   successRedirect:'/',
    failureRedirect:'/user/signin',
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
	return res.redirect('/');
}
function notLoggedIn(req,res,next)
{
    if(!req.isAuthenticated()){
        return next();
    }
    return res.redirect(('/'));


}
module.exports = router;
