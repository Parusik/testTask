const router = require('koa-router')(),
  { authRoutes } = require('./authRoutes'),
  { apiRoutes } = require('./apiRoutes');

router.use('/auth', authRoutes);
router.use('/api', apiRoutes);

module.exports = router;
