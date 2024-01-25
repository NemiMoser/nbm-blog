const router = require('express').Router();
const { User, Post } = require('../models');
const withAuth = require('../utils/withAuth');
const bcrypt = require('bcrypt');


//homepage -- get all posts
router.get('/', async (req, res) => {
    try {
        const postData = await Post.findAll({
            include: [
                {
                    model: User,
                    attributes: ['id','username'],
                },
            ],
        });

        const posts = postData.map((post) => post.get ({
            plain: true 
        }));

        res.render('homepage', {
            posts,
            logged_in: req.session.logged_in,
        });
    } catch (err) {
        res.status(500).json(err);
    }
});


//get individual post
router.get('/post/:id', async (req, res) => {
    try {
        const postData = await Post.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    attributes: [
                        'username',
                    ],
                },
            ],
        });

        if (!postData) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const post = postData.get({ plain: true });

        res.render('post', {
            post: post,
            logged_in: req.session.logged_in,
        });
    } catch (err) {
        res.status(500).json(err);
    }
});


// route for dashboard
router.get('/dashboard', (req, res) => {
    res.redirect('/profile');
  });
  

// profile route
router.get('/profile', withAuth, async (req, res) => {
    try {
        console.log('User Id from session:', req.session.user_id);

        const userData = await User.findByPk(req.session.user_id, {
            attributes: { exclude: ['password'] },
            include: [{ model: Post }],
        });

        if (!userData) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        console.log('userData:', userData);
        const user = userData.get({ plain: true });

        res.render('profile', {
            // ...user,
            id: user.id,
            username: user.username,
            posts: [],
            scriptLoaded: false,
            logged_in: true,
            loggedInUsername: user.username,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' })
    }
});


//get user
router.get('/api/user', withAuth, async (req, res) => {
    try {
        const userId = req.session.user_id;
        const user = await User.findByPk(userId, {
            attributes: ['id', 'username'],
        });

        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


// Get posts for a specific user
router.get('/api/posts/:username', async (req, res) => {
    try {
        const username = req.params.username;
        console.log('Username', username);

        const user = await User.findOne({
            where: { username },
            attributes: ['id', 'username'],
            include: [
                {
                    model: Post,
                    attributes: ['id', 'title', 'content', 'createdAt'],
                },
            ],
        });

        console.log('User:', user);

        if (user) {
            res.status(200).json(user.Posts);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


//login GET
router.get('/login', (req, res) => {
    if (req.session.logged_in) {
        res.redirect('/');
        return;
    }
    res.render('login');
});


module.exports = router;
