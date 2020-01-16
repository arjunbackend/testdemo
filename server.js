const express = require('express')
const bodyparser = require('body-parser')
const mongoose = require('mongoose')
const login_route = require('./Routing/login')
const config = require('./Config/config')



var app = express()
app.use(bodyparser.urlencoded({extended:true}))
app.use(bodyparser.json())

app.listen(config.port,(err,data)=>{
    if(err){
        console.log('Unable to listen with server');
        
    }
    else{
        console.log('Connected on localhost sever');
        
    }
})

mongoose.connect(config.mongo,{useNewUrlParser:true},(err)=>{
    if(err){
        console.log('Unable to connect with database');
        
    }
    else{
        console.log('connected with database');
        
    }
})

app.use('/demo',login_route)
