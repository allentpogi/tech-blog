const router = require('express').Router();
const { Comment, Topic } = require('../../models');
const withAuth = require('../../utils/auth');

//route to create a new topic
router.post('/', withAuth, async (req, res) => {
  try {
    const newTopic = await Topic.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    res.status(200).json(newTopic);
  } catch (err) {
    res.status(400).json(err);
  }
});

//route to create a new comment
router.post('/comment', withAuth, async (req, res) => {
  try {
    const newComment = await Comment.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    res.status(200).json(newComment);
  } catch (err) {
    res.status(400).json(err);
  }
});

//route to delete a topic
router.delete('/:id', withAuth, async (req, res) => {
  try {
    const topicData = await Topic.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!topicData) {
      res.status(404).json({ message: 'No topic found with this id!' });
      return;
    }

    res.status(200).json(topicData);
  } catch (err) {
    res.status(500).json(err);
  }
});

//route to redirect the user to the create topic page
router.get('/create', (req, res) => {
  // If the user is already logged in, redirect the request to the login page
  if (req.session.logged_in) {
    res.render('createtopic', {
      logged_in: true,
    });
    return;
  }
  res.render('login');
});

//route to redirect the user to the edit topic page with the topic title and description populated
router.get('/edit/:id', withAuth, async (req, res) => {
  try {
    const topicData = await Topic.findByPk(req.params.id, {});
    const topic = topicData.get({ plain: true });

    res.render('edittopic', {
      ...topic,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

//route to update a topic
router.put('/:id', withAuth, async (req, res) => {
  try {
    const topicData = await Topic.update(
      {
        ...req.body,
        user_id: req.session.user_id,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    res.status(200).json({ message: 'Topic updated successfully' });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
