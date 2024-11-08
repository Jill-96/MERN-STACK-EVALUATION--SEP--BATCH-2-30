var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const mongoose = require('mongoose');

//connect mongodb
mongoose.connect('mongodb://localhost:27017/server')
.then(result => {
    console.log("Mongo DB is running.");
}).catch((err) => {
console.log("err : "+ err);
})
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var userRouter = require('./routes/user');
var adminRouter = require('./routes/admin');
// var productRouter = require('./routes/product');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/user', userRouter);
app.use('/admin', adminRouter);
// app.use('/product',productRouter);

module.exports = app;
