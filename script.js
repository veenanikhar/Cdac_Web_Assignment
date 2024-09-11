// script.js
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const usernameError = document.getElementById('usernameError');
    const passwordError = document.getElementById('passwordError');
    const message = document.getElementById('message');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const showPasswordCheckbox = document.getElementById('showPassword');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Reset errors and message
        usernameError.textContent = '';
        passwordError.textContent = '';
        message.textContent = '';
        loadingSpinner.style.display = 'block';

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        let isValid = true;

        // Client-side validation
        if (!username) {
            usernameError.textContent = 'Username/Email is required.';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(username)) {
            usernameError.textContent = 'Enter a valid email.';
            isValid = false;
        }

        if (!password) {
            passwordError.textContent = 'Password is required.';
            isValid = false;
        } else if (password.length < 6) {
            passwordError.textContent = 'Password must be at least 6 characters long.';
            isValid = false;
        }

        if (isValid) {
            // API call
            try {
                const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: username,
                        password: password
                    })
                });

                if (response.ok) {
                    const result = await response.json();
                    message.textContent = 'Login successful!';
                    message.style.color = 'green';
                } else {
                    message.textContent = 'Login failed. Please try again.';
                    message.style.color = 'red';
                }
            } catch (error) {
                message.textContent = 'An error occurred. Please try again.';
                message.style.color = 'red';
            } finally {
                loadingSpinner.style.display = 'none';
            }
        } else {
            loadingSpinner.style.display = 'none';
        }
    });

    // Show/hide password functionality
    showPasswordCheckbox.addEventListener('change', () => {
        if (showPasswordCheckbox.checked) {
            passwordInput.type = 'text';
        } else {
            passwordInput.type = 'password';
        }
    });
});
