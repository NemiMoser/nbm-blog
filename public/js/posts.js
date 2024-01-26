 //edit post
 async function editButton(event) {
    if (event.target.classList.contains('edit-button')) {
        const id = event.target.getAttribute('data-id');

        try {

        const response = await fetch(`api/posts/${id}`, {
            method: 'PUT',
        });

        if (response.ok) {
            const updatedPostData = await response.json();
            updatedPostTitle(id, updatedPostData.title);
        } else {
            alert('Failed to update post!');
        }
    } catch (error) {
        console.error('Error during edit request:', error);
        alert('Failed to update post!');
    }
}
};
function updatePostTitle(postId, newTitle) {
    const postTitleElement = document.querySelector(`#post-${postId} h4`);
    if (postTitleElement) {
        postTitleElement.innerText = newTitle;
    }
}

    //delete post
async function delButton(event) {
    if (event.target.hasAttribute('data-id')) {
        const id = event.target.getAttribute('data-id');

        const response = await fetch(`api/posts/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            document.querySelector(`#post-${id}`).remove();
            // document.location.reload();
        } else {
            alert('Failed to delete post!');
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM is loaded');
    
    const newPostForm = document.querySelector('.new-post');
    const postList = document.querySelector('.post-list');
    
    if (newPostForm) {
        newPostForm.addEventListener('submit', createNewPost);
    }
    
    if (postList) {
        postList.addEventListener('click', delButton);
        postList.addEventListener('click', editButton);
    }
});
