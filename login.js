document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const togglePasswordButton = document.getElementById('togglePassword');
    const eyeIcon = document.getElementById('eyeIcon');
    const eyeSlashIcon = document.getElementById('eyeSlashIcon');
    const loginButton = document.getElementById('loginButton');
    const loginButtonText = loginButton ? loginButton.querySelector('.button-text') : null;
    const loginButtonLoader = loginButton ? loginButton.querySelector('.button-loader') : null;

    const emailErrorEl = document.getElementById('emailError');
    const passwordErrorEl = document.getElementById('passwordError');
    const formErrorEl = document.getElementById('formError');
    const successMessageEl = document.getElementById('successMessage');

    function displayError(element, message, inputElement) {
        if (element) {
            element.textContent = message;
            element.classList.remove('hidden');
        }
        if (inputElement) {
            inputElement.classList.add('error-border');
            inputElement.setAttribute('aria-invalid', 'true');
            inputElement.setAttribute('aria-describedby', element ? element.id : '');
        }
    }

    function clearError(element, inputElement) {
        if (element) {
            element.textContent = '';
            element.classList.add('hidden');
        }
        if (inputElement) {
            inputElement.classList.remove('error-border');
            inputElement.removeAttribute('aria-invalid');
            inputElement.removeAttribute('aria-describedby');
        }
    }

    function clearAllErrors() {
        clearError(emailErrorEl, emailInput);
        clearError(passwordErrorEl, passwordInput);
        if (formErrorEl) {
            formErrorEl.textContent = '';
            formErrorEl.classList.add('hidden');
        }
        if (successMessageEl) {
            successMessageEl.classList.add('hidden');
            successMessageEl.textContent = '';
        }
    }

    function isValidEmailFormat(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function isValidUsernameFormat(username) {
        const usernameRegex = /^[a-zA-Z0-9_.-]{3,30}$/;
        return !username.includes('@') && usernameRegex.test(username);
    }

    function validateEmailField(showError = true) {
        if (!emailInput) return true;
        const value = emailInput.value.trim();
        clearError(emailErrorEl, emailInput);

        if (value === '') {
            if (showError) displayError(emailErrorEl, 'Email atau username wajib diisi.', emailInput);
            return false;
        }
        if (!isValidEmailFormat(value) && !isValidUsernameFormat(value)) {
            if (showError) displayError(emailErrorEl, 'Format email atau username tidak valid. Contoh: pengguna@olx.co.id atau pengguna_olx', emailInput);
            return false;
        }
        return true;
    }

    function validatePasswordField(showError = true) {
        if (!passwordInput) return true;
        const value = passwordInput.value;
        clearError(passwordErrorEl, passwordInput);

        if (value === '') {
            if (showError) displayError(passwordErrorEl, 'Password wajib diisi.', passwordInput);
            return false;
        }
        if (value.length < 8) {
            if (showError) displayError(passwordErrorEl, 'Password minimal harus 8 karakter.', passwordInput);
            return false;
        }
        return true;
    }

    if (emailInput) {
        emailInput.addEventListener('input', () => {
            if (emailInput.classList.contains('error-border') || emailInput.dataset.touched) {
                validateEmailField(true);
            }
        });
        emailInput.addEventListener('blur', () => {
            emailInput.dataset.touched = 'true';
            validateEmailField(true);
        });
    }

    if (passwordInput) {
        passwordInput.addEventListener('input', () => {
            if (passwordInput.classList.contains('error-border') || passwordInput.dataset.touched) {
                validatePasswordField(true);
            }
        });
        passwordInput.addEventListener('blur', () => {
            passwordInput.dataset.touched = 'true';
            validatePasswordField(true);
        });
    }

    if (togglePasswordButton && passwordInput && eyeIcon && eyeSlashIcon) {
        togglePasswordButton.addEventListener('click', () => {
            const isPassword = passwordInput.type === 'password';
            passwordInput.type = isPassword ? 'text' : 'password';
            eyeIcon.classList.toggle('hidden', isPassword);
            eyeSlashIcon.classList.toggle('hidden', !isPassword);
            togglePasswordButton.setAttribute('aria-label', isPassword ? 'Sembunyikan password' : 'Tampilkan password');
            passwordInput.focus();
        });
    }

    function setLoadingState(isLoading) {
        if (!loginButton || !loginButtonText || !loginButtonLoader) return;

        if (isLoading) {
            loginButton.disabled = true;
            loginButtonText.classList.add('hidden');
            loginButtonLoader.classList.remove('hidden');
            loginButton.setAttribute('aria-busy', 'true');
            loginButton.setAttribute('aria-label', 'Sedang memproses masuk');
        } else {
            loginButton.disabled = false;
            loginButtonText.classList.remove('hidden');
            loginButtonLoader.classList.add('hidden');
            loginButton.removeAttribute('aria-busy');
            loginButton.setAttribute('aria-label', 'Masuk');
        }
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            clearAllErrors();

            const isEmailValid = validateEmailField(true);
            const isPasswordValid = validatePasswordField(true);

            if (isEmailValid && isPasswordValid) {
                setLoadingState(true);
                console.log('Form valid. Simulating login API call...');

                await new Promise(resolve => setTimeout(resolve, 1500));

                try {
                    sessionStorage.setItem('isLoggedIn', 'true');
                    sessionStorage.setItem('userIdentifier', emailInput.value.trim());
                } catch (e) {
                    console.warn("Session storage is not available.", e);
                }

                if (successMessageEl) {
                    successMessageEl.textContent = 'Login berhasil! Anda akan diarahkan...';
                    successMessageEl.classList.remove('hidden');
                    successMessageEl.style.opacity = '1';
                }

                setTimeout(() => {
                    const urlParams = new URLSearchParams(window.location.search);
                    const redirectUrl = urlParams.get('redirect');
                    if (redirectUrl) {
                        window.location.href = decodeURIComponent(redirectUrl);
                    } else {
                        window.location.href = 'index.html';
                    }
                }, 1000);

            } else {
                if (formErrorEl) {
                    displayError(formErrorEl, 'Mohon periksa kembali data yang Anda masukkan.', null);
                }
                if (!isEmailValid && emailInput) {
                    emailInput.focus();
                } else if (!isPasswordValid && passwordInput) {
                    passwordInput.focus();
                }
                setLoadingState(false);
                console.log('Form validation failed.');
            }
        });
    }
});
