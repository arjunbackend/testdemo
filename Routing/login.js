var express = require('express')
var bodyparser = require('body-parser')
var jwt = require('jsonwebtoken')
var user = require('../Models/users')
const config = require('../Config/config')


var app = express()

app.use(bodyparser.urlencoded({extended:true}))
app.use(bodyparser.json())

var middlefun = (req,res,next)=>{
    if(!req.headers['token']){
        res.json({
            message:'Please provide token'
        })
    }
    else{
        jwt.verify(req.headers['token'], config.key,(err,decoded)=>{
            if(err){
                res.json({
                    message:'Invalid Token'
                })
            }
            else{
                req.decoded= decoded
                next()
            }
        })
    }
}

app.get('/',(req,res)=>{
    res.send('Welcome to Test Demo App. Created by Arjun!')
})

app.post('/signup',(req,res)=>{
    if(!req.body.username || !req.body.password1 || !req.body.password2 || !req.body.email ){
        res.json({
            message : 'Please enter user name, email id, password1 and password2' 
        })
    }
    else{
        user.find({user_email:req.body.email},(err,data)=>{
            if(err){
                res.json({
                    message:'Please try leter..... Database Server issue'
                })
            }
            else{
                if(data.length>0){
                    res.json({
                        message: 'Email id alredy registered'
                    })
                }
                else{
                    if(req.body.password1 !== req.body.password2){
                        res.json({
                            message : 'Please Enter metching password in both password field'
                        })
                    }
                    else{
                        var userdata = new user({
                            user_name : req.body.username,
                            user_email: req.body.email,
                            user_id : req.body.id,
                            user_password : req.body.password1
                        })
                        userdata.save((err,data)=>{
                            if(err){
                                res.json({
                                    message: 'Signup Fail !!!!!!!!!!   . Please Try Leter'
                                })
                            }
                            else{
                                res.json({
                                    message: 'sucessfully Sign UP',
                                    user_email : data.user_email
                                })
                            }
                        })
            
                    }
                }
            }
        })
    }
  
})


app.post('/login',(req,res)=>{
    if(!req.body.email || !req.body.password){
        res.json({
            message: 'Please enter email id and password'
        })
    }
    else{
        user.findOne({user_email: req.body.email},(err,data)=>{
            if(err){
                res.json({
                    message : 'err in login'
                })
            }
            else{
                if(!data){
                    res.json({
                        message: 'email id not registred. Please signup first!!!!'
                    })
                }
                else{
                    if(req.body.password != data.user_password){
                        res.json({
                            message: 'Please enter valid password'
                        })
                    }
                    else{
                        var tokenData = {
                            user_name : data.user_name,
                            user_email : data.user_email
                        }
                        var token = jwt.sign(tokenData,'ARJUN')
                        res.json({
                            message : 'Sucessfully Login.',
                            userToken : token,
                            data: data
                        })
                    }
                }
            }
        })
    }
})






module.exports = app