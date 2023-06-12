const newTopichandler = async (event) => {
  event.preventDefault();

  const title = document.querySelector('#topic-name').value.trim();
  const content = document.querySelector('#topic-desc').value.trim();

  console.log('topic name', title);
  console.log('topic desc', content);

  if (title && content) {
    const response = await fetch(`/api/topics`, {
      method: 'POST',
      body: JSON.stringify({ title, content }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      document.location.replace('/profile');
    } else {
      alert('Failed to create topic');
    }
  }
};

const backToprofile = async (event) => {
  event.preventDefault();
  document.location.replace('/profile');
};

document
  .querySelector('.create-topic')
  .addEventListener('click', newTopichandler);

document
  .querySelector('.cancel-create')
  .addEventListener('click', backToprofile);
