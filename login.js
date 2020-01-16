var express = require('express')
var bodyparser = require('body-parser')
var jwt = require('jsonwebtoken')
var user = require('./users')

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
        jwt.verify(req.headers['token'],'ARJUN',(err,decoded)=>{
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
// app.post('/deleteuser',middlefun,(req,res)=>{
//     if(!req.body.user_email){
//         res.json({
//             message: 'please send user id'
//         })
//     }
//     else{
//         user.find({_id:req.body.user_email},() )
//     }
// })

// app.post('/options',middlefun,(req,res)=>{
//     if(!req.body.question_id || !req.body.option_detail){
//         res.json({
//             message:'Please Provide Question id and option'
//         })
//     }
//     else{
//         var option = new options({
//             question_id : req.body.question_id,
//             question_owner_email : req.decoded.user_email,
//             option_detail : req.body.option_detail
//         })

//         option.save()
//         // option.save((err,data)=>{
//         //     // if(err){
//         //     //     res.json({
//         //     //         message: 'Error in saving option details'
//         //     //     })
//         //     // }
//         //     // else{
//         //     //     // questions.findOne({_id : req.body.question_id}, (err, data1)=>{
//         //     //     //     if(err){
//         //     //     //         res.json({
//         //     //     //             message: ' error in finding question'
//         //     //     //         })
//         //     //     //     }
//         //     //     //     else{
//         //     //     //         options.find({question_id : req.body.question_id}, (err, data)=>{
//         //     //     //             if(data){
//         //     //     //                 res.json({
//         //     //     //                     question_detail : data1,
//         //     //     //                     option_detail : data
//         //     //     //                 })
//         //     //     //             }
//         //     //     //         })
//         //     //     //         // res.json({
//         //     //     //         //     question_detail : data1,
//         //     //     //         //     option_detail : data
//         //     //     //         // })
//         //     //     //     }
//         //     //     // })
//         //     //     // res.json({
//         //     //     //     message: 'option set',
//         //     //     //     option_detail : data
//         //     //     // })
//         //     // }
//         // })

//         questions.find({_id : req.body.question_id},{question_detail:1, _id :0,},  (err, data1)=>{
//             if(err){
//                 res.json({
//                     message: ' error in finding question'
//                 })
//             }
//             else{
//                 options.find({question_id : req.body.question_id},{option_detail : 1, _id :0,} , (err, data)=>{
//                     if(data){
//                         res.json({
//                             question_detail : data1,
//                             option_detail : data
//                         })
//                     }
//                 })
//                 // res.json({
//                 //     question_detail : data1,
//                 //     option_detail : data
//                 // })
//             }
//         })
//     }
    

// })

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


// app.post('/question',middlefun,(req,res)=>{
//     if(!req.body.question){
//         res.json({
//             message: 'please enter question first'
//         })
//     }
//     else{
//         var new_question = new questions({
//             question_detail : req.body.question,
//             user_email : req.decoded.user_email
//         })
//         new_question.save((err,data)=>{
//             if(err){
//                 res.json({
//                     message: 'Error in saving Question'
//                 })
//             }
//             else{
//                 res.json({
//                     message:'Question Sucessfully Created',
//                     question : data.question_detail
//                 })
//             }
//         })
//     }
// })

// app.get('/myQuestions',middlefun,(req,res)=>{
//     questions.find({user_email: req.decoded.user_email},(err,data)=>{
//         if(err){
//             res.json({
//                 message : 'Sorry !!!!! Error in Finding your questions.'
//             })
//         }
//         else{
//             if(data.length==0){
//                 res.json({
//                     message : 'No Questions Created Yet. Please Add Questions First.'
//                 })
//             }
//             else{
//                 res.json({
//                     message : 'Your Questions are',
//                     data : data
//                 })
//             }
//         }
//     })
// })

// app.get('/getallusers',middlefun,(req,res)=>{
//     user.find({user_email:{$ne: req.decoded.user_email }} ,(err,data)=>{
//         if(err){
//             res.json({
//                 message:false
//             })
//         }
//         else{
//             res.json({
//                 message: 'data found',
//                 data : data
//             })
//         }
//     })
// })
// app.post('/alluser',(req,res)=>{
//     if(!req.body.email){
//         res.json({
//             message : 'Please send email id'
//         })
//     }
//     else{
//         user.findOne({user_email:req.body.email},(err,data)=>{
//             if(err){
//                 res.json({
//                     message: 'Issue in database'
//                 })
//             }
//             else{
//                 if(!data){
//                     res.json({
//                         message: 'Email id not registered'
//                     })
//                 }
//                 else{
//                     res.json({
//                         message : 'Data found',
//                         User_detail : data.user_email
//                     })
//                 }
//             }
//         })
//     }
// })

// app.get('/mytest',(req,res)=>{
//     if(!req.body.paper_id){
//         res.json({
//             sucess : false,
//             msz: 'Please send paper id'
//         })
//     }
//     else{
//         paper.find({},(err,data)=>{
//             if(!data){
//                 res.json({
//                     sucess :false,
//                     msz : 'Paper not found, please try leter'
//                 })
//             }
//             else{
//                 res.json({
//                     sucess : true,
//                     msz :'please find paper',
//                     data : data
//                 })
//             }
//         })


//     }
// })
module.exports = app