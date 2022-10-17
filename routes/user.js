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
        const saltRounds = 10;
        const user = new User(req.body);
        user.password= await bcrypt.hash(req.body.password,saltRounds)
        user.save()
        res.send(user)

    }
    catch (e) {
        res.send({
            message: 'User already exists',
            data: e.message
        })

    }
})




router.post('/userLogin',async(req, res) => {
    try {
        const userEmail = req.body.email;
        const user= await User.findOne({ email: userEmail })
        console.log({user});
        if (user) {
            const validPassword = await bcrypt.compare(req.body.password, user.password);
            console.log({validPassword});
            if (validPassword) {
                res.send('valid password')
              
            } else {
                res.send('invalid password')
             
            }
          } else {
            res.send('user not found')
            
          }

           
     
    }
    catch (e) {
        console.log('failed',e);
        res.status(404).send({
            message: 'failed',
            data: e.message
        })

    }


})



router.post('/userProfile', (req, res) => {
    try {
        User.findOne({ email: req.body.email }, function (err, result) {
            if (err) {
                res.send(err.message)
            } else {
                res.send(result)
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