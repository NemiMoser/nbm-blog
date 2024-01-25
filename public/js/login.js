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

        console.log('Logging in with:', { username, password });

        if (username && password) {
            try {

                const response = await fetch('/api/users/login', {
                    method: 'POST',
                    body: JSON.stringify({ username, password }),
                    headers: { 'Content-Type': 'application/json' },
                });
                console.log('signup is logging');

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

        const usernameInput = document.querySelector('#username-signup');
        const passwordInput = document.querySelector('#password-signup');

        console.log('usernameInput:', usernameInput);
        console.log('passwordInput:', passwordInput);

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (username && password) {
            try {
            const response = await fetch('/api/users/signup', {
                method: 'POST',
                body: JSON.stringify({ username, password }),
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.ok) {
                document.location.replace('/profile');
            } else {
                const responseBody = await response.text();
                console.error('Failed to create user:', responseBody);
                alert(responseBody); 
            }
        } catch (error) {
            console.error('Error during signup:', error);
            alert('An error occurred during signup. Please try again');
        }
    }
    };


    // Event listeners
    document
    .querySelector('.login-form')
    .addEventListener('submit', loginForm);
    document
    .querySelector('.signup-form')
    .addEventListener('submit', signUpForm);
