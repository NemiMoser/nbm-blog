const express = require('express');
const router = express.Router();
const { Post, User, Comments } = require('../../models');
const withAuth = require('../../utils/withAuth');

//add post
router.post('/', withAuth, async (req, res) => {
    try {
        const newPost = await Post.create({
            ...req.body,
            user_id: req.session.user_id,
        });
        res.status(200).json(newPost);
    } catch (err) {
        res.status(400).json(err);
    }
});


//get posts
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

        res.json(posts);
    } catch (err) {
        res.status(500).json(err);
    }
});


//delete post
router.delete('/:id', withAuth, async (req, res) => {
    try {
        const postData = await Post.destroy({
            where: {
                id: req.params.id,
                user_id: req.session.user_id,
            },
        });

        if (!postData) {
            res.status(404).json({ message: 'No post found with this id!' });
            return;
        }

        res.status(204).end();
    } catch (err) {
        res.status(500).json(err);
    }
});


//get individual post
router.get('/:id', async (req, res) => {
    try {
        console.log('Received request for post ID:', req.params.id);

        const postData = await Post.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    attributes: ['id', 'username'],
                },
                // {
                //     model: Comments,
                //     attributes: ['id', 'commentText', 'createdAt'],
                //     include: {
                //         model: User,
                //         attributes: ['id', 'username'],
                //     },
                // },
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


// //add comment
// router.post('/:id/comments', withAuth, async (req, res) => {
//     try {
//         console.log('Request Body:', req.body); 

//         const post = await Post.findByPk(req.params.id);
//         if (!post) {
//             return res.status(404).json({ message: 'Post not found' });
//         }

//         const newComment = await Comments.create({
//             commentText: req.body.commentText,
//             user_id: req.session.user_id,
//             post_id: req.params.id,
//         });

//         res.status(201).json(newComment);
//     } catch (err) {
//         console.error('Error creating comment:', err);
//         res.status(400).json(err);
//     }
// });

module.exports = router;
