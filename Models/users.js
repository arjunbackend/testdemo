var mongoose = require('mongoose')
var Schema = mongoose.Schema

var user = new Schema({
    user_name : String,
    user_email : String,
    user_password : String,
    isDeleted : {type : Number, default : 0},
    user_id : String,
    created_date : {type : Date, default : Date.now},
    isDeleted : {type: Number, default : 0}
})



module.exports = mongoose.model('user', user)