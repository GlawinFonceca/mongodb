const express = require('express');
const { isBuffer } = require('util');
const router = express.Router();
const User = require('../database/schema/User')
const update = require('../helper/userUpdate')
const signup = require('../helper/userSignup')
const bcrypt = require('bcrypt');
const validate = require('validator')

router.get('', (req, res) => {
    res.render('home', {
        title: 'Home Page'
    })
})

router.get('/pageHome', (req, res) => {
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

router.get('/editProfile', (req, res) => {
    res.render('editProfile', {
        title: 'Profile Page'
    })
})

router.post('/userSignup', async (req, res) => {
    try {
        const user = new User(req.body);
        const userName = validate.isAlpha(req.body.name);
        const userEmail = validate.isEmail(req.body.email);
        const userPassword = validate.isStrongPassword(req.body.password,
            { minLength: 6, minUppercase: 1, minSymbols: 1, returnScore: false, minNumbers: 1 });
        const userPhone = validate.isLength(req.body.phone, { min: 10, max: 10 });
        //passing name,email,password and phone number to userSignup function
        const isValid = signup(userName, userEmail, userPassword, userPhone)
        console.log(isValid);
        if (isValid === true) {
            //checking whether email is already present in databse
            User.findOne({ email: req.body.email }, async function (err, result) {
                if (err) {
                    res.send(err.message)
                }
                if (result) {
                    res.render('signup', {
                        message: 'email is already saved'
                    })
                }
                else {
                    //encrypting password and saving the user to the database
                    const saltRounds = 10;
                    user.password = await bcrypt.hash(req.body.password, saltRounds)
                    user.save()
                    res.render('login', {
                        title: 'Login Page'
                    })
                }
            })
        }
        else {
            res.render('signup', {
                message: isValid.message
            })
        }
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
        //fecthing email in databse
        const user = await User.findOne({ email: userEmail })
        if (user) {
            //if present verfying the password
            const validPassword = await bcrypt.compare(req.body.password, user.password);
            if (validPassword == true) {
                res.cookie('UserLogin', req.body.email, { maxAge: 900000, httpOnly: true })
                res.render('home', {
                    message: `Hello ${user.name}`
                })
            } else {
                res.render('login', {
                    title: 'Login Page',
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

router.get('/userProfile', async (req, res) => {
    try {
        const userEmail = req.cookies['UserLogin']
        //fecthing the user in database
        const user = await User.findOne({ email: userEmail })
        if (!user) {
            res.render('login', {
                message: 'User not found please login'
            })
        }
        else {
            res.render('profile', {
                title: 'User Profile',
                message1: user.name,
                message2: user.email,
                message3: user.phone
            })
        }
    }
    catch (e) {
        console.log('failed');
        res.status(404).send({
            message: 'failed',
            data: e.message
        })

    }

})

router.post('/editProfile', async (req, res) => {
    try {
        const userEmail = req.cookies['UserLogin'];
        //fetching user email id in database    
        const user = await User.findOne({ email: userEmail })
        //sending user, name and phone number to userUpdate function
        const data = await update(user, req.body.name, req.body.phone)
        if (data === true) {
            res.render('home', {
                message: 'Successfully updated',
            })

        }
        // if (user) {
        //     //updating user name and phone nuumber
        //     await User.findByIdAndUpdate(user._id, { name: req.body.name, phone: req.body.phone })
        //     res.render('home', {
        //         message: 'Successfully updated',
        //     })
        // }

    }
    catch (e) {
        console.log(e);
        res.render('profile', {
            message: e.message
        })
    }
})

module.exports = router;