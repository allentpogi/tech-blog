const router = require('express').Router();
const { Comment, Topic, User } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  console.log('hitting homeroute get all topics');

  try {
    // Get all topics and JOIN with user data
    const topicData = await Topic.findAll({
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
      order: [['date_created', 'DESC']],
    });

    console.log('loggedin user', req.session.logged_in);

    // Serialize data so the template can read it
    const topics = topicData.map((topic) => topic.get({ plain: true }));

    console.log('topics from request', topics);

    // Pass serialized data and session flag into template
    res.render('homepage', {
      topics,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/topic/:id', async (req, res) => {
  console.log('hitting get topic by id');
  try {
    const topicData = await Topic.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['name'],
        },
        {
          model: Comment,
          attributes: ['comment', 'date_created'],
          include: [User],
          order: [['date_created', 'DESC']],
        },
      ],
    });

    const topic = topicData.get({ plain: true });

    console.log('topic', topic);

    res.render('topic', {
      ...topic,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Use withAuth middleware to prevent access to route
router.get('/profile', withAuth, async (req, res) => {
  try {
    console.log('hitting profile route');
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Topic }],
      order: [[{ model: Topic }, 'date_created', 'DESC']],
    });

    const user = userData.get({ plain: true });

    res.render('profile', {
      ...user,
      logged_in: true,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }

  res.render('login');
});

module.exports = router;
