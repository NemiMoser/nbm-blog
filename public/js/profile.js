
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
                    <p><a href="/post${post.id}">${post.content}</a></p>
                    <p>${createdAt}</p>
                    <button class="btn btn-sm btn-danger" data-id="${post.id}">DELETE</button>
                </div>
            `;
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


    //delete post
    async function delButton(event) {
        if (event.target.hasAttribute('data-id')) {
            const id = event.target.getAttribute('data-id');

            const response = await fetch(`api/posts/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                document.location.reload();
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
        }
    });
