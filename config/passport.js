

/// to set passsport and stratergies
var passport = require('passport');
var User = require('../models/needJobUser');
var LocalStratergy = require('passport-local').Strategy;
var path = require('path');


passport.serializeUser(function(user,done) // how to store user in the session
{
    // here user is the input and done is the callback
    done(null,user.id);  //whenever u want to store the session store it via user id
});

passport.deserializeUser(function(id,done)
{
    User.findById(id,function(err,user)
    {
        done(err,user);
    });
});





passport.use('local.signup',new LocalStratergy({

    usernameField: 'phnNumber',
    passwordField: 'password',
    passReqToCallback:true
},function (req,phnNumber,password,done) {
    var name = req.body.name;
    var age = req.body.age;
    var work = req.body.work;
    var city = req.body.city;
    var img = req.body.img;

    req.checkBody('name').notEmpty();
    req.checkBody('age','Invalid mobile Number').notEmpty().isLength({min:2,max:2});

    req.checkBody('phnNumber','Invalid mobile Number').notEmpty().isMobilePhone("en-IN");
    req.checkBody('work','Enter Work').notEmpty();
    req.checkBody('city','Enter city').notEmpty();

    req.checkBody('password','Invalid password').notEmpty().isLength({min:4});
   // req.checkBody('img','Browse Image').notEmpty();

    var errors = req.validationErrors();
    if(errors){
        var messages  =[];
        errors.forEach((function (error) {
            messages.push(error.msg);
        }));
        return done(null,false,req.flash('error',messages));
    }

    User.findOne({'phnNumber' : phnNumber},function(err,user)
    {
        if(err)
                return done(err);
        if(user)
        {
            return done(null,false,{message:'Mobile Number is already in use;'})
            //false to tell it is not succssful
        }

        var file_url = "";

        if(req.files){
            // console.log(req.files);
            var file = req.files.img;
            console.log(file);
            var extension = path.extname(file.name);
            if(extension !==".png" && extension !==".gif" && extension !==".jpg"){
              res.send("only image are allowed");
            }

            file.mv(__dirname+"/uploads/"+file.name,function(err, result){
                if(err){
                    console.log(err);
                    // res.status(8000).send(err);
                }
                else{
                    console.log(result);
                    res.send('file uploaded');
                }
            });
        }
        console.log(file_url);
        var newUser = new User();
        newUser.name = name;
        newUser.age = age;
        newUser.phnNumber = phnNumber;
        newUser.work = work;
        newUser.city = city;
        newUser.password = newUser.encryptPassword(password);
        newUser.img = "/uploads/" + file.name;
        newUser.save(function(err,result)
        {
            if(err)
            {
                return done(err);
            }
            return done(null,newUser);

        })

    })
}));


passport.use('local.signin',new LocalStratergy({
    usernameField: 'phnNumber',
    passwordField: 'password',
    passReqToCallback:true
},function (req,phnNumber,password,done) {


    User.findOne({'phnNumber' : phnNumber},function(err,user)
    {
        if(err)
            return done(err);
        if(!user)
        {
            return done(null,false,{message:'Cant find user'})
            //false to tell it is not succssful
        }


        user.validPassword(password,function(err,password){
            if(!password)
                return done(null,false,{message:'Wrong password'})
            return done(null,user);
        });
        console.log(user.id);

    });
}));

