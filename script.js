document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const usernameError = document.getElementById('usernameError');
    const passwordError = document.getElementById('passwordError');
    const message = document.getElementById('message');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const showPasswordCheckbox = document.getElementById('showPassword');
    const rememberMeCheck = document.getElementById('rememberMe');

    // Check if there's a saved username/email in localStorage and auto-fill it
    const savedUsername = localStorage.getItem('savedUsername');
    if (savedUsername) {
        usernameInput.value = savedUsername;
        rememberMeCheck.checked = true; // If saved, check the "Remember Me" box
    }

    // Toggle password visibility using the checkbox
    showPasswordCheckbox.addEventListener('change', () => {
        passwordInput.type = showPasswordCheckbox.checked ? 'text' : 'password';
    });

    // Handle form submission
    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent the default form submission

        // Get input values
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        // Clear previous error messages
        usernameError.textContent = '';
        passwordError.textContent = '';
        message.textContent = '';
        loadingSpinner.style.display = 'block';

        // Validate inputs
        let isValid = true;

        if (!username || !/^[\w-]+@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(username)) {
            showError('username', 'Please enter a valid email.');
            isValid = false;
        }

        if (!password || password.length < 6) {
            showError('password', 'Password must be at least 6 characters long.');
            isValid = false;
        }

        if (!isValid) {
            loadingSpinner.style.display = 'none';
            return; // Exit if validation fails
        }

        try {
            // Send API request
            const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                // Handle successful login
                const result = await response.json();
                message.textContent = 'Login successful!';
                message.style.color = 'green';

                // Check if "Remember Me" is checked and save username/email
                if (rememberMeCheck.checked) {
                    localStorage.setItem('savedUsername', username);
                } else {
                    localStorage.removeItem('savedUsername'); // Clear saved data if unchecked
                }
            } else {
                // Handle failed login
                message.textContent = 'Login failed. Please check your credentials.';
                message.style.color = 'red';
            }
        } catch (error) {
            console.error('Error:', error);
            message.textContent = 'An error occurred. Please try again.';
            message.style.color = 'red';
        } finally {
            loadingSpinner.style.display = 'none'; // Hide the spinner
        }
    });

    // Show error function
    function showError(inputId, errorMsg) {
        const errorElement = document.getElementById(`${inputId}Error`);
        errorElement.textContent = errorMsg;
    }
});
