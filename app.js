//jshint esversion:6
require('dotenv').config()

const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const encrypt = require("mongoose-encryption")
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect(process.env.MONGO_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }

);
const userSchema = new mongoose.Schema({
    fname: String,
    lname: String,
    email: String,
    password: String
})

const secret = process.env.USER_AUTH_VERIFY
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ['password'] });

const User = mongoose.model('User', userSchema);


app.get('/', (req, res) => {
    res.render('home');
});
app.get('/login', (req, res) => {
    res.render('login');
});
app.get('/register', (req, res) => {
    res.render('register');
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
})

app.post('/register', (req, res) => {
    const newUser = new User({
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.username,
        password: req.body.password
    });
    newUser
        .save()
        .then(() => {
            res.render('secrets');
        })
        .catch((err) => {
            console.log(err);
        })
})

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ email: username })
        .then((foundUser) => {
            if (foundUser) {
                if (foundUser.password === password) {
                    res.render('secrets')
                }
            }
        })
        .catch((err) => {
            console.log(err);
        })
})




