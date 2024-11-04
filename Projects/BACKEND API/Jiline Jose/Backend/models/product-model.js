const mongoose = require('mongoose');

const product = mongoose.model('product-details',{
    name:{
        type: String,
        require: true
    },
    price:{
        type:String,
        require: true
    },
    quantity:{
        type:String,
        require: true
    }
})

module.exports = product