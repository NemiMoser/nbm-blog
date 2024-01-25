const express = require('express');
const router = express.Router();
const { User } = require('../../models');
const bcrypt = require('bcrypt');
// const withAuth = require('../../utils/withAuth');

// CREATE new user
router.post('/', async (req, res) => {
    try {
      const userData = await User.create({
        username: req.body.username,
        password: req.body.password,
      });
  
      // Set up sessions with a 'loggedIn' variable set to `true`
      req.session.save(() => {
        req.session.loggedIn = true;
  
        res.status(200).json(userData);
      });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });

//user login
router.post('/login', async (req, res) => {
    try {
        const userData = await User.findOne({ 
            where: { username: req.body.username }
        });

        console.log('User Data:', userData);

        if (!userData || !userData.checkPassword(req.body.password)) {
            console.log('Login failed. Incorrect username or password.');
            res.status(400).json({
                message: 'Incorrect username or password, please try again' 
            });
            return;
        }

        req.session.user_id = userData.id;
        console.log('User ID in session after login:', req.session.user_id);

        req.session.logged_in = true;
        req.session.save(() => {
            res.redirect('/');
        });

        // req.session.save(() => {
        //     req.session.logged_in = true;
        //     // res.status(200).json({ user: userData, message: 'Login successful!' });
        //     res.redirect('/profile');
        // });
    } catch (err) {
        console.error(err);
        res.status(400).json(err);
    }
});


//logout
router.post('/logout', (req, res) => {
    if (req.session.logged_in) {
        req.session.destroy(() => {
            // res.status(204).end();
            res.redirect('/');
        });
    } else {
        res.status(204).end();
    }
});

module.exports = router;