document.addEventListener('DOMContentLoaded', () => {
    console.log('Global OLX scripts (V1) loaded.');

    window.OLX = window.OLX || {}; 

    window.OLX.isAuthenticated = () => {
        return sessionStorage.getItem('isLoggedIn') === 'true';
    };

    window.OLX.getUserIdentifier = () => {
        return sessionStorage.getItem('userIdentifier'); 
    };

    window.OLX.redirectToLogin = (redirectUrl = window.location.href) => {
        window.location.href = `login.html?redirect=${encodeURIComponent(redirectUrl)}`;
    };

    window.OLX.logoutUser = () => {
        sessionStorage.removeItem('isLoggedIn');
        sessionStorage.removeItem('userIdentifier');
        console.log('User logged out (global function).');
        if (typeof updateHeaderUI === 'function') { 
            updateHeaderUI();
        }
    };
});
