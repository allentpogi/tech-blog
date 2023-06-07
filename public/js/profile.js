const newFormHandler = async (event) => {
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

const delButtonHandler = async (event) => {
  if (event.target.hasAttribute('data-id')) {
    const id = event.target.getAttribute('data-id');

    const response = await fetch(`/api/topics/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      document.location.replace('/profile');
    } else {
      alert('Failed to delete topic');
    }
  }
};

document
  .querySelector('.new-topic-form')
  .addEventListener('submit', newFormHandler);

document
  .querySelector('.topic-list')
  .addEventListener('click', delButtonHandler);
