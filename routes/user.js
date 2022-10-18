const express = require('express');
const { isBuffer } = require('util');
const router = express.Router();
const User = require('../database/schema/User')
const bcrypt = require('bcrypt');



router.get('', (req, res) => {
    res.render('home', {
        title: 'Home Page'
    })
})



router.get('/pageSignup', (req, res) => {
    res.render('signup', {
        title: 'Signup Page'
    })
})




router.get('/pageLogin', (req, res) => {
    res.render('login', {
        title: 'Login Page'
    })
})



router.get('/pageProfile', (req, res) => {
    res.render('profile', {
        title: 'Profile Page'
    })
})




router.post('/userSignup', async (req, res) => {
    try {
        const user = new User(req.body);
        var UserEmail = req.body.email;
        User.findOne({ email: UserEmail }, async function (err, result) {//checking whether email is already present in databse
            if (err) {
                res.send(err)
            }
            if (result) {
                res.render('signup', {
                    message: 'email is already saved'
                })
            }
            else {//encrypting password and saving the user to the database
                const saltRounds = 10;
                user.password = await bcrypt.hash(req.body.password, saltRounds)
                user.save()
                res.render('login')

            }
        })
    }
    catch (e) {
        res.send({
            message: 'failed',
            data: e.message
        })

    }
})




router.post('/userLogin', async (req, res) => {
    try {
        const userEmail = req.body.email;
        const user = await User.findOne({ email: userEmail })//fecthing email in databse
        if (user) {//if present verfying the password
            const validPassword = await bcrypt.compare(req.body.password, user.password);
            if (validPassword == true) {
                res.render('home', {
                    message: `Hello ${user.name}`
                })

            } else {
                res.render('login', {
                    message: 'invalid password'
                })

            }
        } else {
            res.render('signup', {
                message: 'user not found'
            })
            

        }



    }
    catch (e) {
        console.log('failed', e);
        res.status(404).send({
            message: 'failed',
            data: e.message
        })

    }


})



router.post('/userProfile', (req, res) => {
    try {
        User.findOne({ email: req.body.email }, function (err, result) {//fecthing the user in database
            if (err) {
                res.render('login',{
                    message :'User not found please login'
                })
            } else {
                res.render('home',result)
            }
        })



    }
    catch (e) {
        console.log('failed');
        res.status(404).send({
            message: 'failed',
            data: e.message
        })

    }

})

module.exports = router;