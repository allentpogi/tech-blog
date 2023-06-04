const sequelize = require('../config/connection');
const { User, Topic, Comment } = require('../models');

const userData = require('./userData.json');
const topicData = require('./topicData.json');
const commentData = require('./commentData.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  const users = await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  for (const topic of topicData) {
    await Topic.create({
      ...topic,
      user_id: users[Math.floor(Math.random() * users.length)].id,
    });
  }

  for (const comment of commentData) {
    await Comment.create({
      ...comment,
      user_id: users[Math.floor(Math.random() * users.length)].id,
      topic_id: topic[Math.floor(Math.random() * topic.length)].id,
    });
  }

  process.exit(0);
};

seedDatabase();
