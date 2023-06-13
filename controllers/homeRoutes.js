const router = require('express').Router();
const { Comment, Topic, User } = require('../models');
const withAuth = require('../utils/auth');

//route to get all topics
router.get('/', async (req, res) => {
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

    // Serialize data so the template can read it
    const topics = topicData.map((topic) => topic.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render('homepage', {
      topics,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

//route to get a specific topic using the topic id
router.get('/topic/:id', async (req, res) => {
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

    res.render('topic', {
      ...topic,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

//route to display the user profile/dashboard and the list the topics created by the user
router.get('/profile', withAuth, async (req, res) => {
  try {
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

//route to display the login page
router.get('/login', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }

  res.render('login');
});

module.exports = router;
