const express = require('express');
const router = express.Router();
const { User } = require('../../models');
const bcrypt = require('bcrypt');
// const withAuth = require('../../utils/withAuth');

//creating user
router.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log('Received signup request with username:', username);
        console.log('Received signup request with password:', password);

        const hashedPassword = await bcrypt.hash(password, 10);

        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            console.log('User with this name already exists');
            return res.status(400).json({ message: 'User with this username already exists' });
        }

        const newUser = await User.create({
            username,
            password: hashedPassword,
        });

        console.log('New User Data:', newUser);

        req.session.user_id = newUser.id;
        req.session.logged_in = true;
        req.session.save(() => {
            res.status(200).json(newUser);
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

//user login
router.post('/login', async (req, res) => {
    try {
        const userData = await User.findOne({ 
            where: { username: req.body.username }
        });

        console.log('User Data:', userData);

        if (!userData) {
            console.log('Login failed. User not found.');
            return res.status(400).json({
                message: 'User not found, please check username and try again.' 
            });
        }

        // Check the provided password against the stored hashed password
        console.log('Received password in login request:', req.body.password);

        const isPasswordValid = await bcrypt.compare(req.body.password.trim(), userData.password);

        if (!isPasswordValid) {
            console.log('Login failed. Incorrect password.');
            return res.status(400).json({
                message: 'Incorrect password, please try again.' 
            });
        }

        req.session.user_id = userData.id;
        console.log('User ID in session after login:', req.session.user_id);

        req.session.logged_in = true;
        req.session.save(() => {
            //res.redirect('/');
            res.status(200).json({ user: userData });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }

        //correct code
    //     if (!userData || !userData.checkPassword(req.body.password)) {
    //         console.log('Login failed. Incorrect username or password.');
    //         res.status(400).json({
    //             message: 'Incorrect username or password, please try again' 
    //         });
    //         return;
    //     }

    //     req.session.user_id = userData.id;
    //     console.log('User ID in session after login:', req.session.user_id);

    //     req.session.logged_in = true;
    //     req.session.save(() => {
    //         res.redirect('/');
    //     });

    // } catch (err) {
    //     console.error(err);
    //     res.status(400).json(err);
    // }
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
