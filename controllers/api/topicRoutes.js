const router = require('express').Router();
const { Comment, Topic } = require('../../models');
const withAuth = require('../../utils/auth');

router.post('/', withAuth, async (req, res) => {
  console.log('hitting post api/topics');
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

router.post('/comment', withAuth, async (req, res) => {
  console.log('hitting post api/topics/comment');
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

router.get('/create', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.render('createtopic', {
      logged_in: true,
    });
    return;
  }

  res.render('login');
});

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
    console.log(err);
  }
});

module.exports = router;
