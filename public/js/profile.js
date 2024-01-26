
//fetch posts
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM is loaded');

    const newPostForm = document.querySelector('.new-post');
    const postList = document.querySelector('.post-list');

    if (newPostForm) {
        newPostForm.addEventListener('submit', createNewPost);
    }

    if (postList) {
        postList.addEventListener('click', delButton);
    }
    
    let response;
    // Fetch posts for the current user
    try {
        response = await fetch('/api/user', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            // const user = await response.json();
            // const username = user.username;
    
            // console.log('loggedInUsername:', loggedInUsername);

            const postsResponse = await fetch('/api/posts/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log('Posts Response:', postsResponse);

            if (postsResponse.ok) {
                const posts = await postsResponse.json();

                console.log('Fetched posts:', posts);

                const postsWithUsers = posts.map(post => {
                    return {
                        ...post,
                        username: post.user ? post.user.username : 'Unknown User',
                    };
                });

                console.log('Before calling displayPosts function');
                displayPosts(postsWithUsers);
            } else {
                console.error('Failed to fetch posts:', postsResponse.statusText);
            }
        } else {
            console.error('Failed to fetch user:', response.statusText);
        }
    } catch (error) {
        console.error('Error during fetch:', error);
    
        if (response) {
            console.log('Response status:', response.status);
    
            // Check if the body is already used
            if (!response.bodyUsed) {
                try {
                    const responseText = await response.text();
                    console.log('Response content:', responseText);
                } catch (textError) {
                    console.error('Error reading response text:', textError);
                }
            } else {
                console.log('Response body already used');
            }
        } else {
            console.log('No response received');
        }
    }
});


//display posts
function displayPosts(posts) {
    console.log('Displaying posts:', posts);

    const postList = document.querySelector('.post-list');

    console.log('Inside displayPosts function');
    console.log('Posts data:', posts);

    if (postList) {
        // Clear existing posts
        postList.innerHTML = '';

        // Render each post
        posts.forEach((post) => {
            const postElement = document.createElement('div');
            postElement.classList.add('row', 'mb-2');

            // const username = post.user ? post.user.username : 'Unknown User';

            // Format createdAt date
            const createdAt = new Date(post.createdAt).toLocaleString();

            postElement.innerHTML = `
                <div class="col-md-8">
                    <h5><a href="/post/${post.id}">${post.title}</a></h5>
                </div>
                <div class="col-md-4">
                    <p><a href="/post${post.id}">
                    <button class="btn btn-sm btn-danger" data-id="${post.id}">DELETE</button>
                    </a></p>
                    <p>${createdAt}</p>
                    
                </div>
            `;
            // 
            postList.appendChild(postElement);
        });
    }
    }


//new post
   async function createNewPost(event) {
        event.preventDefault();

        const title = document.querySelector('#post-title').value.trim();
        const content = document.querySelector('#post-content').value.trim();

        if (title && content) {
            try {
                const response = await fetch(`/api/posts`, {
                    method: 'POST',
                    body: JSON.stringify({ title, content }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    document.location.reload();
                } else {
                    const responseBody = await response.text();
                    console.error('Failed to create post:', responseBody);
                    alert('Failed to create post, please try again');
                }
            } catch (error) {
                console.error('Error during new post:', error);
            }
        }
    }

// //new comment
// const commentButtons = document.querySelectorAll('.btn-primary');
//     commentButtons.forEach(button => {
//         button.addEventListener('click', createComment);
//     });

// async function createComment(event) {
//     event.preventDefault();

//     const postId = event.target.dataset.postId;
//     console.log('postId:', postId);

//     const commentTextarea = document.querySelector(`#post-comment-${postId}`);
//     console.log('commentTextarea:', commentTextarea);
//     const commentText = commentTextarea.value.trim();

//     if (commentText) {
//         try {
//             const response = await fetch(`/api/posts/${postId}/comments`, {
//                 method: 'POST',
//                 body: JSON.stringify({ commentText }),
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//             });

//             console.log('Response:', response);

//             if (response.ok) {
//                 document.location.reload();
//             } else {
//                 const responseBody = await response.text();
//                 console.error('Failed to create comment:', responseBody);
//                 alert('Failed to create comment, please try again');
//             }
//         } catch (error) {
//             console.error('Error during new comment:', error);
//         }
//     }
// }



// Delete and Edit event handler
function handleButtonClick(event) {
    const target = event.target.closest('.btn-danger, .edit-button');

    if (target) {
        if (target.classList.contains('btn-danger')) {
            delButton(target);
        } else if (target.classList.contains('edit-button')) {
            editButton(target);
        }
    }
}

// Delete post
async function delButton(event) {
    const id = event.target.getAttribute('data-id');

    console.log('Clicked delete button. Post ID:', id);

    if (id) {
        const response = await fetch(`/api/posts/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            window.location.href = '/';
        } else {
            alert('Failed to delete post!');
        }
    }
}

// Edit post
async function editButton(event) {
    const id = event.target.getAttribute('data-id');

    console.log('Clicked edit button. Post ID:', id);

    try {
        console.log('GET URL:', `/api/posts/${id}`);
        // Fetch the existing post data
        const response = await fetch(`/api/posts/${id}`, {
            method: 'GET',
        });

        if (response.ok) {
            const postData = await response.json();

            // Prompt the user for the updated title
            const updatedTitle = prompt('Enter updated title:', postData.title);
            const updatedContent = prompt('Enter updated content:', postData.content);

            // Send the updated data in the PUT request
            const updateResponse = await fetch(`/api/posts/${id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    title: updatedTitle,
                    content: updatedContent,
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (updateResponse.ok) {
                document.location.replace(`/post/${id}`);
                // const updatedPostData = await updateResponse.json();
                // updatePostTitle(id, updatedPostData.title);
            } else {
                alert('Failed to update post!');
            }
        } else {
            alert('Failed to fetch existing post data!');
        }
    } catch (error) {
        console.error('Error during edit request:', error);
        alert('Failed to update post!');
    }
}

    
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOM is loaded');

        const newPostForm = document.querySelector('.new-post');
        const postList = document.querySelector('.post-list');

        if (newPostForm) {
            newPostForm.addEventListener('submit', createNewPost);
        }

        if (postList) {
            postList.addEventListener('click', handleButtonClick);
        }

        // const commentForm = document.querySelector('.new-comment');
        // if (commentForm) {
        //     commentForm.addEventListener('submit', createComment);
        // }

        // Add event listeners for delete and edit buttons in post.handlebars
        const deleteButtonPostView = document.querySelector('.btn-danger');
        if (deleteButtonPostView) {
            deleteButtonPostView.addEventListener('click', delButton);
        }

        const editButtonPostView = document.querySelector('.edit-button');
        if (editButtonPostView) {
            editButtonPostView.addEventListener('click', editButton);
        }
    });

