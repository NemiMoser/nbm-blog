const express = require('express');
const router = express.Router();
const apiRoutes = require('./api');
const blogRoutes = require('./blogRoutes');

router.get('/', (req, res) => {
    res.render('homepage');
});

router.use('/', blogRoutes);
router.use('/api', apiRoutes);

module.exports = router;