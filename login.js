// Login functionality for Batman extension

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const rememberMeCheckbox = document.getElementById('rememberMe');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');
    const forgotPasswordLink = document.getElementById('forgotPassword');
    const signupLink = document.getElementById('signupLink');

    // Load saved credentials if remember me was checked
    loadSavedCredentials();

    // Handle form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleLogin();
    });

    // Handle forgot password click
    forgotPasswordLink.addEventListener('click', function(e) {
        e.preventDefault();
        handleForgotPassword();
    });

    // Handle signup link click
    signupLink.addEventListener('click', function(e) {
        e.preventDefault();
        handleSignup();
    });

    function handleLogin() {
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const rememberMe = rememberMeCheckbox.checked;

        // Clear previous messages
        hideMessages();

        // Validation
        if (!email || !password) {
            showError('Please fill in all fields');
            return;
        }

        if (!validateEmail(email) && !validateUsername(email)) {
            showError('Please enter a valid email or username');
            return;
        }

        if (password.length < 6) {
            showError('Password must be at least 6 characters');
            return;
        }

        // Simulate login process
        // In a real application, this would make an API call
        authenticateUser(email, password, rememberMe);
    }

    function authenticateUser(email, password, rememberMe) {
        // Simulate API call with setTimeout
        showLoading();

        setTimeout(() => {
            // For demo purposes, accept any credentials
            // In production, validate against backend
            const isAuthenticated = true; // Replace with actual API call result

            if (isAuthenticated) {
                // Save credentials if remember me is checked
                if (rememberMe) {
                    saveCredentials(email);
                } else {
                    clearSavedCredentials();
                }

                // Save authentication token
                saveAuthToken(email);

                // Show success message
                showSuccess('Login successful! Redirecting...');

                // Redirect after 1 second
                setTimeout(() => {
                    // Redirect to main extension page
                    window.location.href = 'popup.html';
                }, 1000);
            } else {
                showError('Invalid email or password');
            }
        }, 1000);
    }

    function saveAuthToken(email) {
        // Save to chrome storage or localStorage
        const token = generateToken(email);
        
        if (typeof chrome !== 'undefined' && chrome.storage) {
            chrome.storage.local.set({
                authToken: token,
                userEmail: email,
                loginTime: new Date().toISOString()
            });
        } else {
            localStorage.setItem('authToken', token);
            localStorage.setItem('userEmail', email);
            localStorage.setItem('loginTime', new Date().toISOString());
        }
    }

    function saveCredentials(email) {
        if (typeof chrome !== 'undefined' && chrome.storage) {
            chrome.storage.local.set({ savedEmail: email, rememberMe: true });
        } else {
            localStorage.setItem('savedEmail', email);
            localStorage.setItem('rememberMe', 'true');
        }
    }

    function loadSavedCredentials() {
        if (typeof chrome !== 'undefined' && chrome.storage) {
            chrome.storage.local.get(['savedEmail', 'rememberMe'], function(result) {
                if (result.rememberMe && result.savedEmail) {
                    emailInput.value = result.savedEmail;
                    rememberMeCheckbox.checked = true;
                }
            });
        } else {
            const savedEmail = localStorage.getItem('savedEmail');
            const rememberMe = localStorage.getItem('rememberMe');
            
            if (rememberMe === 'true' && savedEmail) {
                emailInput.value = savedEmail;
                rememberMeCheckbox.checked = true;
            }
        }
    }

    function clearSavedCredentials() {
        if (typeof chrome !== 'undefined' && chrome.storage) {
            chrome.storage.local.remove(['savedEmail', 'rememberMe']);
        } else {
            localStorage.removeItem('savedEmail');
            localStorage.removeItem('rememberMe');
        }
    }

    function handleForgotPassword() {
        const email = emailInput.value.trim();
        
        if (!email) {
            showError('Please enter your email to reset password');
            emailInput.focus();
            return;
        }

        if (!validateEmail(email)) {
            showError('Please enter a valid email address');
            return;
        }

        // Simulate password reset
        hideMessages();
        showSuccess('Password reset link sent to your email!');
    }

    function handleSignup() {
        // In a real application, redirect to signup page
        alert('Signup functionality - redirect to registration page');
    }

    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function validateUsername(username) {
        // Username should be 3-20 characters, alphanumeric with underscores
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        return usernameRegex.test(username);
    }

    function generateToken(email) {
        // Simple token generation (in production, use proper JWT)
        const timestamp = new Date().getTime();
        return btoa(email + ':' + timestamp);
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        successMessage.style.display = 'none';
    }

    function showSuccess(message) {
        successMessage.textContent = message;
        successMessage.style.display = 'block';
        errorMessage.style.display = 'none';
    }

    function hideMessages() {
        errorMessage.style.display = 'none';
        successMessage.style.display = 'none';
    }

    function showLoading() {
        const button = loginForm.querySelector('.login-button');
        button.textContent = 'Signing in...';
        button.disabled = true;
    }

    // Check if user is already logged in
    checkExistingAuth();

    function checkExistingAuth() {
        if (typeof chrome !== 'undefined' && chrome.storage) {
            chrome.storage.local.get(['authToken'], function(result) {
                if (result.authToken) {
                    // User already logged in, redirect to main page
                    window.location.href = 'popup.html';
                }
            });
        } else {
            const token = localStorage.getItem('authToken');
            if (token) {
                // User already logged in
                window.location.href = 'popup.html';
            }
        }
    }
});
