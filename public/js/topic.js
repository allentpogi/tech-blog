const newCommenthandler = async (event) => {
  event.preventDefault();
  console.log('creating new comment');

  const comment = document.querySelector('#comment').value.trim();

  console.log('comment', comment);

  const str = window.location.href;
  const topic_id = str.slice(str.lastIndexOf('/') + 1);

  if (comment) {
    const response = await fetch(`/api/topics/comment`, {
      method: 'POST',
      body: JSON.stringify({ comment, topic_id }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      document.location.replace('/topic/' + topic_id);
    } else {
      alert('Failed to create comment');
    }
  }
};

document
  .querySelector('.new-comment-form')
  .addEventListener('submit', newCommenthandler);
