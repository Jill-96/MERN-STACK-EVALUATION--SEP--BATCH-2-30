const mongoose = require('mongoose');

const user = mongoose.model('userDetails',{
    email:{
        type: String,
        require: true
    },
    password:{
        type:String,
        require: true
    },
    cart:{
        type:Array,
        require: true
    }
})

module.exports = user