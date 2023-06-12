const updateTopichandler = async (event) => {
  event.preventDefault();

  const title = document.querySelector('#topic-name').value.trim();
  const content = document.querySelector('#topic-desc').value.trim();
  const str = window.location.href;
  const id = str.slice(str.lastIndexOf('/') + 1);

  console.log('topic name', title);
  console.log('topic desc', content);

  if (title && content) {
    const response = await fetch(`/api/topics/` + id, {
      method: 'PUT',
      body: JSON.stringify({ title, content }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      document.location.replace('/profile');
    } else {
      alert('Failed to update topic');
    }
  }
};

const backToprofile = async (event) => {
  event.preventDefault();
  document.location.replace('/profile');
};

document
  .querySelector('.update-topic')
  .addEventListener('click', updateTopichandler);

document
  .querySelector('.cancel-update')
  .addEventListener('click', backToprofile);
