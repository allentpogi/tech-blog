const formHandler = async (event) => {
  if (event.target.classList.contains('edit-topic')) {
    editButtonHandler(event);
  } else if (event.target.classList.contains('delete-topic')) {
    delButtonHandler(event);
  }
};

const delButtonHandler = async (event) => {
  event.preventDefault();
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

const createHandler = async (event) => {
  document.location.replace('/api/topics/create');
};

const editButtonHandler = async (event) => {
  event.preventDefault();
  console.log('edit is pressed');
  const id = event.target.getAttribute('data-id');

  document.location.replace('/api/topics/edit/' + id);
};

document.querySelector('.topic-list').addEventListener('click', formHandler);

document
  .querySelector('.create-topic')
  .addEventListener('click', createHandler);
