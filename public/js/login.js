// document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM is loaded');

    // Login form function
    const loginForm = async (event) => {
        event.preventDefault();

        const usernameInput = document.querySelector('#username-login');
        const passwordInput = document.querySelector('#password-login');
        const loginForm = document.querySelector('.form.login-form');
        const signupForm = document.querySelector('.form.signup-form');

        console.log('usernameInput:', usernameInput);
        console.log('passwordInput:', passwordInput);
        console.log('loginForm:', loginForm);
        console.log('signupForm:', signupForm);

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (username && password) {
            try {
                const response = await fetch('/api/users/login', {
                    method: 'POST',
                    body: JSON.stringify({ username, password }),
                    headers: { 'Content-Type': 'application/json' },
                });

                if (response.ok) {
                    document.location.replace('/profile');
                } else {
                    alert('An error occurred during login. Please try again');
                }
            } catch (error) {
                console.error('Error during login:', error);
            }
        }
    };

    // Signup form function
    const signUpForm = async (event) => {
        event.preventDefault();

        const username = document.querySelector('#username-signup').value.trim();
        const password = document.querySelector('#password-signup').value.trim();

        if (username && password) {
            const response = await fetch('/api/users', {
                method: 'POST',
                body: JSON.stringify({ username, password }),
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.ok) {
                document.location.replace('/profile');
            } else {
                alert(response.statusText);
            }
        }
    };

    // window.addEventListener('load', (event) => {

    // Event listeners
    document
    .querySelector('.login-form')
    .addEventListener('submit', loginForm);
    document
    .querySelector('.signup-form')
    .addEventListener('submit', signUpForm);
// })

// });
