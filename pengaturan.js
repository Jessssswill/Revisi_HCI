// settings.js - V5 (Diagnostik dan Perbaikan Render Konten Tab)
document.addEventListener('DOMContentLoaded', () => {
    console.log("[DOMContentLoaded] Event terpicu. Memulai inisialisasi skrip pengaturan (V5).");

    // --- Selektor Elemen ---
    const settingsTabContent = document.getElementById('settingsTabContent');
    const settingsNavItems = document.querySelectorAll('.settings-nav-item');

    const profileButtonHeader = document.getElementById('profileButtonHeader');
    const profileDropdownHeader = document.getElementById('profileDropdownHeader');
    const profileImageHeader = document.getElementById('profileImageHeader');
    const chatButtonHeader = document.getElementById('chatButtonHeader');
    const sellButtonHeader = document.getElementById('sellButtonHeader');

    // --- Mock Data Pengaturan Pengguna ---
    let userSettings = {
        language: "id",
        theme: "system",
        defaultRegion: "Jakarta Selatan",
        profileVisibility: "public",
        saveSearchHistory: true,
        notifications: {
            pesanBaru: true,
            updateIklan: true,
            promosiOlx: false,
        },
        connectedAccounts: {
            google: null,
            facebook: { name: "User Facebook Name", email: "user.facebook@example.com" }
        },
        appVersion: "1.2.5 (Build 20250601)"
    };

    // --- Fungsi Utilitas Global & Manajemen Sesi ---
    const isAuthenticated = () => sessionStorage.getItem('isLoggedIn') === 'true';

    const getUserData = () => {
        let profileData = {};
        let settingsDataFromSession = {};
        try {
            profileData = JSON.parse(sessionStorage.getItem('userProfileData')) || {};
            const storedSettings = sessionStorage.getItem('userSettingsData');
            settingsDataFromSession = storedSettings ? JSON.parse(storedSettings) : userSettings;
        } catch (error) {
            console.error("[getUserData] Error parsing data dari sessionStorage:", error);
            settingsDataFromSession = userSettings;
        }
        return {
            ...profileData,
            settings: {
                ...userSettings,
                ...settingsDataFromSession,
                notifications: {
                    ...(userSettings.notifications || {}),
                    ...(settingsDataFromSession.notifications || {})
                }
            }
        };
    };

    const storeUserSettings = (settingsToStore) => {
        try {
            sessionStorage.setItem('userSettingsData', JSON.stringify(settingsToStore));
            let profileData = JSON.parse(sessionStorage.getItem('userProfileData'));
            if (profileData) {
                profileData.notifications = settingsToStore.notifications;
                sessionStorage.setItem('userProfileData', JSON.stringify(profileData));
            }
            console.log("[storeUserSettings] Pengaturan pengguna berhasil disimpan ke session.");
        } catch (error) {
            console.error("[storeUserSettings] Error menyimpan user settings ke sessionStorage:", error);
        }
    };

     const loadUserSettingsFromSession = () => {
        try {
            const storedSettings = sessionStorage.getItem('userSettingsData');
            if (storedSettings) {
                const parsedSettings = JSON.parse(storedSettings);
                userSettings = { ...userSettings, ...parsedSettings };
                if (parsedSettings.notifications) {
                    userSettings.notifications = { ...userSettings.notifications, ...parsedSettings.notifications };
                }
                console.log("[loadUserSettingsFromSession] Pengaturan pengguna berhasil dimuat dari session.");
            } else {
                console.log("[loadUserSettingsFromSession] Tidak ada sesi pengaturan, menggunakan mock data awal atau default.");
            }
        } catch (error) {
            console.error("[loadUserSettingsFromSession] Error memuat user settings dari sessionStorage:", error);
        }
    };

    // --- Fungsi Render Konten Tab ---
    function renderSettingsTabContent(tabId) {
        console.log(`[renderSettingsTabContent] Memulai render untuk tab ID: "${tabId}"`);
        if (!settingsTabContent) {
            console.error("[renderSettingsTabContent] KRITIKAL: Elemen #settingsTabContent tidak ditemukan di HTML. Render dibatalkan.");
            return;
        }
        // Tampilkan pesan loading sementara
        settingsTabContent.innerHTML = '<p class="text-center text-text-muted py-10">Memuat konten...</p>';

        let templateId = '';
        switch (tabId) {
            case 'preferensi-akun': templateId = 'templatePreferensiAkun'; break;
            case 'privasi': templateId = 'templatePrivasi'; break;
            case 'notifikasi': templateId = 'templateNotifikasi'; break;
            case 'akun-terhubung': templateId = 'templateAkunTerhubung'; break;
            case 'tentang-aplikasi': templateId = 'templateTentangAplikasi'; break;
            default:
                console.warn(`[renderSettingsTabContent] Tab ID tidak dikenal: "${tabId}".`);
                settingsTabContent.innerHTML = '<p class="text-red-500 text-center py-10">Konten pengaturan tidak valid atau tidak ditemukan.</p>';
                return;
        }

        console.log(`[renderSettingsTabContent] Mencari template dengan ID: "${templateId}"`);
        const template = document.getElementById(templateId);

        if (template && template.content) {
            console.log(`[renderSettingsTabContent] Template "${templateId}" ditemukan.`);
            try {
                const clonedContent = template.content.cloneNode(true);
                settingsTabContent.innerHTML = ''; // Hapus pesan "Memuat..."
                settingsTabContent.appendChild(clonedContent);
                console.log(`[renderSettingsTabContent] Konten untuk "${tabId}" berhasil di-clone dan di-append.`);

                // Gunakan requestAnimationFrame untuk memastikan DOM update sebelum init
                requestAnimationFrame(() => {
                    console.log(`[renderSettingsTabContent] Memanggil fungsi init untuk tab "${tabId}" setelah rAF.`);
                    if (tabId === 'preferensi-akun') initPreferensiAkun();
                    else if (tabId === 'privasi') initPrivasi();
                    else if (tabId === 'notifikasi') initNotifikasiSettings();
                    else if (tabId === 'akun-terhubung') initAkunTerhubung();
                    else if (tabId === 'tentang-aplikasi') initTentangAplikasi();
                    console.log(`[renderSettingsTabContent] Selesai inisialisasi untuk tab "${tabId}"`);
                });

            } catch (error) {
                console.error(`[renderSettingsTabContent] Error saat merender atau menginisialisasi tab "${tabId}":`, error);
                settingsTabContent.innerHTML = `<p class="text-red-500 text-center py-10">Terjadi kesalahan saat memuat konten untuk "${tabId}". Cek konsol.</p>`;
            }
        } else {
            console.error(`[renderSettingsTabContent] KRITIKAL: Template dengan ID "${templateId}" untuk tab "${tabId}" TIDAK ditemukan atau TIDAK valid (tidak ada .content). Pastikan ID template di HTML benar dan merupakan tag <template>.`);
            settingsTabContent.innerHTML = `<p class="text-red-500 text-center py-10">Template untuk "${tabId}" tidak dapat ditemukan. Periksa ID template di HTML.</p>`;
        }
    }

    // --- Inisialisasi dan Event Listener untuk Setiap Tab ---

    function initPreferensiAkun() {
        console.log("[initPreferensiAkun] Memulai...");
        const form = document.getElementById('formPreferensiAkun');
        if (!form) { console.error("[initPreferensiAkun] Form 'formPreferensiAkun' tidak ditemukan."); return; }
        console.log("[initPreferensiAkun] Form ditemukan, mengisi nilai...");
        if (form.language) form.language.value = userSettings.language || 'id';
        if (form.theme) form.theme.value = userSettings.theme || 'system';
        if (form.region) form.region.value = userSettings.defaultRegion || '';

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            userSettings.language = form.language.value;
            userSettings.theme = form.theme.value;
            userSettings.defaultRegion = form.region.value;
            storeUserSettings(userSettings);
            showSettingsStatusMessage("Preferensi akun berhasil disimpan.", "success");
            console.log("[initPreferensiAkun] Preferensi disimpan. Tema:", userSettings.theme);
            document.documentElement.classList.remove('dark-theme-active', 'light-theme-active');
            if (userSettings.theme === 'dark') document.documentElement.classList.add('dark-theme-active');
            else if (userSettings.theme === 'light') document.documentElement.classList.add('light-theme-active');
        });
        console.log("[initPreferensiAkun] Selesai.");
    }

    function initPrivasi() {
        console.log("[initPrivasi] Memulai...");
        const profileVisibilitySelect = document.getElementById('profileVisibility');
        const saveSearchHistoryToggle = document.getElementById('saveSearchHistory');
        const clearSearchHistoryButton = document.getElementById('clearSearchHistoryButton');
        const savePrivacyButton = document.getElementById('savePrivacySettings');

        if (!profileVisibilitySelect || !saveSearchHistoryToggle || !clearSearchHistoryButton || !savePrivacyButton) {
            console.error("[initPrivasi] Satu atau lebih elemen form privasi tidak ditemukan.");
            return;
        }
        console.log("[initPrivasi] Elemen form privasi ditemukan.");

        profileVisibilitySelect.value = userSettings.profileVisibility || 'public';
        saveSearchHistoryToggle.checked = userSettings.saveSearchHistory === true;

        clearSearchHistoryButton.addEventListener('click', () => {
            if (window.showConfirmationModal) {
                window.showConfirmationModal("Anda yakin ingin menghapus seluruh riwayat pencarian Anda?", () => {
                    console.log("Riwayat pencarian dihapus (simulasi).");
                    showSettingsStatusMessage("Riwayat pencarian berhasil dihapus.", "success");
                });
            } else if (confirm("Anda yakin ingin menghapus seluruh riwayat pencarian Anda?")) {
                console.log("Riwayat pencarian dihapus (simulasi).");
                showSettingsStatusMessage("Riwayat pencarian berhasil dihapus.", "success");
            }
        });
        savePrivacyButton.addEventListener('click', () => {
            userSettings.profileVisibility = profileVisibilitySelect.value;
            userSettings.saveSearchHistory = saveSearchHistoryToggle.checked;
            storeUserSettings(userSettings);
            showSettingsStatusMessage("Pengaturan privasi berhasil disimpan.", "success");
        });
        console.log("[initPrivasi] Selesai.");
    }

    function initNotifikasiSettings() {
        console.log("[initNotifikasiSettings] Memulai...");
        const form = document.getElementById('formNotifikasiSettings');
        if (!form) { console.error("[initNotifikasiSettings] Form 'formNotifikasiSettings' tidak ditemukan."); return; }
        console.log("[initNotifikasiSettings] Form ditemukan, mengisi nilai...");

        const notifications = userSettings.notifications || {};
        if(form.settingsNotifPesanBaru) form.settingsNotifPesanBaru.checked = notifications.pesanBaru === true;
        if(form.settingsNotifUpdateIklan) form.settingsNotifUpdateIklan.checked = notifications.updateIklan === true;
        if(form.settingsNotifPromosiOlx) form.settingsNotifPromosiOlx.checked = notifications.promosiOlx === true;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            userSettings.notifications = {
                pesanBaru: form.settingsNotifPesanBaru ? form.settingsNotifPesanBaru.checked : false,
                updateIklan: form.settingsNotifUpdateIklan ? form.settingsNotifUpdateIklan.checked : false,
                promosiOlx: form.settingsNotifPromosiOlx ? form.settingsNotifPromosiOlx.checked : false,
            };
            storeUserSettings(userSettings);
            showSettingsStatusMessage("Pengaturan notifikasi berhasil disimpan.", "success");
        });
        console.log("[initNotifikasiSettings] Selesai.");
    }

    function initAkunTerhubung() {
        console.log("[initAkunTerhubung] Memulai...");
        const googleStatus = document.getElementById('googleConnectStatus');
        const googleButton = document.getElementById('connectGoogleButton');
        const facebookStatus = document.getElementById('facebookConnectStatus');
        const facebookAuthButton = document.getElementById('facebookAuthButton'); // Pastikan ID ini konsisten dengan HTML

        if (!googleStatus || !googleButton || !facebookStatus || !facebookAuthButton) {
            console.error("[initAkunTerhubung] Satu atau lebih elemen akun terhubung tidak ditemukan.");
            return;
        }
        console.log("[initAkunTerhubung] Elemen akun terhubung ditemukan.");

        // Google
        if (userSettings.connectedAccounts.google) {
            googleStatus.textContent = `Terhubung sebagai ${userSettings.connectedAccounts.google.name}`;
            googleButton.textContent = 'Putuskan Google';
            googleButton.classList.replace('btn-secondary-outline', 'btn-danger-outline');
            googleButton.onclick = handleGoogleDisconnect;
        } else {
            googleStatus.textContent = 'Belum terhubung';
            googleButton.textContent = 'Hubungkan Google';
            googleButton.classList.replace('btn-danger-outline', 'btn-secondary-outline');
            googleButton.onclick = handleGoogleConnect;
        }

        // Facebook
        if (userSettings.connectedAccounts.facebook) {
            facebookStatus.textContent = `Terhubung sebagai ${userSettings.connectedAccounts.facebook.name}`;
            facebookAuthButton.textContent = 'Putuskan Facebook';
            facebookAuthButton.classList.replace('btn-secondary-outline', 'btn-danger-outline');
            facebookAuthButton.onclick = handleFacebookDisconnect;
        } else {
            facebookStatus.textContent = 'Belum terhubung';
            facebookAuthButton.textContent = 'Hubungkan Facebook';
            facebookAuthButton.classList.replace('btn-danger-outline', 'btn-secondary-outline');
            facebookAuthButton.onclick = handleFacebookConnect;
        }
        console.log("[initAkunTerhubung] Selesai.");
    }

    function handleGoogleConnect() {
        userSettings.connectedAccounts.google = { name: "Pengguna Google Terverifikasi", email: "verified.user@gmail.com" };
        storeUserSettings(userSettings);
        showSettingsStatusMessage("Berhasil terhubung dengan Google.", "success");
        initAkunTerhubung();
    }
    function handleGoogleDisconnect() {
        userSettings.connectedAccounts.google = null;
        storeUserSettings(userSettings);
        showSettingsStatusMessage("Koneksi Google berhasil diputuskan.", "success");
        initAkunTerhubung();
    }
    function handleFacebookConnect(){
        userSettings.connectedAccounts.facebook = { name: "Pengguna Facebook Asli", email: "real.user.fb@example.com" };
        storeUserSettings(userSettings);
        showSettingsStatusMessage("Berhasil terhubung dengan Facebook.", "success");
        initAkunTerhubung();
    }
    function handleFacebookDisconnect() {
        userSettings.connectedAccounts.facebook = null;
        storeUserSettings(userSettings);
        showSettingsStatusMessage("Koneksi Facebook berhasil diputuskan.", "success");
        initAkunTerhubung();
    }

    function initTentangAplikasi() {
        console.log("[initTentangAplikasi] Memulai...");
        const appVersionEl = document.getElementById('appVersion');
        if (appVersionEl) {
            appVersionEl.textContent = userSettings.appVersion || "Versi tidak diketahui";
        } else {
            console.error("[initTentangAplikasi] Elemen 'appVersion' tidak ditemukan.");
        }
        console.log("[initTentangAplikasi] Selesai.");
    }

    // --- Fungsi Navigasi Tab ---
    if (settingsNavItems.length > 0) {
        settingsNavItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const targetHref = e.currentTarget.getAttribute('href');
                if (!targetHref) {
                    console.warn("[Navigasi Tab] Item navigasi tidak memiliki href.");
                    return;
                }
                console.log(`[Navigasi Tab] Item diklik: ${targetHref}`);
                settingsNavItems.forEach(nav => nav.classList.remove('active'));
                e.currentTarget.classList.add('active');
                const tabId = targetHref.substring(1);
                renderSettingsTabContent(tabId);
                try {
                    window.location.hash = tabId;
                } catch(error) {
                    console.warn("[Navigasi Tab] Gagal mengubah hash URL:", error);
                }
            });
        });
    } else {
        console.warn("[Inisialisasi] Tidak ada item navigasi pengaturan (.settings-nav-item) yang ditemukan.");
    }

    // --- Header Interactivity ---
    function updateMainHeaderUI() {
        if (!profileImageHeader || !profileDropdownHeader) {
            return;
        }
        profileDropdownHeader.innerHTML = '';
        if (isAuthenticated()) {
            const userData = getUserData();
            const userDisplayIdentifier = userData.email || userData.username || 'Pengguna';
            const initial = userDisplayIdentifier.charAt(0).toUpperCase() || 'U';
            profileImageHeader.src = userData.profilePicture || userData.settings?.profilePicture || `https://placehold.co/32x32/00A5EC/FFFFFF?text=${initial}&font=Inter&bold=true`;
            profileImageHeader.alt = `Profil ${userDisplayIdentifier}`;
            profileDropdownHeader.innerHTML = `
                <div class="px-4 py-3">
                    <p class="text-sm font-medium text-text-primary truncate" title="${userDisplayIdentifier}">${userDisplayIdentifier}</p>
                </div>
                <hr class="border-border-default">
                <a href="profile.html" class="block px-4 py-2 text-sm text-text-primary hover:bg-gray-100 transition">Profil Saya</a>
                <a href="settings.html" class="block px-4 py-2 text-sm text-text-primary hover:bg-gray-100 transition font-medium bg-gray-50">Pengaturan</a>
                <hr class="border-border-default">
                <button id="logoutButtonInHeaderSettings" class="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition">Keluar</button>
            `;
            document.getElementById('logoutButtonInHeaderSettings')?.addEventListener('click', () => {
                sessionStorage.clear();
                window.location.href = "login.html";
            });
        } else {
             profileImageHeader.src = 'https://placehold.co/32x32/D1D5DB/4B5563?text=G&font=Inter&bold=true';
            profileImageHeader.alt = 'Masuk atau Daftar';
            profileDropdownHeader.innerHTML = `
                <div class="p-4 text-center">
                    <p class="text-sm text-text-secondary mb-2">Anda belum masuk.</p>
                    <a href="login.html?redirect=${encodeURIComponent(window.location.href)}" class="w-full inline-block bg-olx-blue text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-700 transition">Masuk</a>
                </div>
            `;
        }
    }
    if (profileButtonHeader) {
        profileButtonHeader.addEventListener('click', (event) => {
            event.stopPropagation();
            updateMainHeaderUI();
            profileDropdownHeader.classList.toggle('hidden');
            profileButtonHeader.setAttribute('aria-expanded', !profileDropdownHeader.classList.contains('hidden'));
        });
    }
    document.addEventListener('click', (event) => {
        if (profileDropdownHeader && !profileDropdownHeader.classList.contains('hidden') &&
            profileButtonHeader && !profileButtonHeader.contains(event.target) &&
            !profileDropdownHeader.contains(event.target)) {
            profileDropdownHeader.classList.add('hidden');
            if(profileButtonHeader) profileButtonHeader.setAttribute('aria-expanded', 'false');
        }
    });

    function showHeaderLoginPrompt(redirectUrl) {
        if (typeof window.showGlobalLoginPrompt === 'function') {
            window.showGlobalLoginPrompt(redirectUrl);
        } else if (confirm("Anda harus masuk untuk mengakses fitur ini. Masuk sekarang?")) {
            window.location.href = `login.html?redirect=${encodeURIComponent(redirectUrl)}`;
        }
    }
    if (chatButtonHeader) chatButtonHeader.addEventListener('click', () => { if(isAuthenticated()) window.location.href = 'chat.html'; else showHeaderLoginPrompt('chat.html');});
    if (sellButtonHeader) sellButtonHeader.addEventListener('click', () => { if(isAuthenticated()) window.location.href = 'jual.html'; else showHeaderLoginPrompt('jual.html');});

    // --- Fungsi Menampilkan Pesan Status ---
    function showSettingsStatusMessage(message, type = "success") {
        if (!settingsTabContent) {
            console.warn("[showSettingsStatusMessage] settingsTabContent tidak ditemukan, pesan tidak dapat ditampilkan.");
            return;
        }
        const statusDiv = document.createElement('div');
        statusDiv.className = `status-message-settings ${type} p-3 mb-4 rounded-md text-sm`;
        statusDiv.textContent = message;
        
        const oldStatus = settingsTabContent.querySelector('.status-message-settings');
        if(oldStatus) oldStatus.remove();
        
        settingsTabContent.insertBefore(statusDiv, settingsTabContent.firstChild);
        setTimeout(() => {
            if (statusDiv.parentNode) {
                statusDiv.remove();
            }
        }, 4000);
    }
    
    // --- Inisialisasi Halaman ---
    function initializeSettingsPage() {
        console.log("[initializeSettingsPage] Memulai inisialisasi halaman pengaturan (V5).");
        if (!isAuthenticated()) {
            console.warn("[initializeSettingsPage] Pengguna belum login. Menampilkan pengaturan default/terbatas.");
             userSettings = {
                language: "id", theme: "system", defaultRegion: "",
                profileVisibility: "public", saveSearchHistory: true,
                notifications: { pesanBaru: true, updateIklan: true, promosiOlx: false },
                connectedAccounts: { google: null, facebook: null },
                appVersion: "1.2.5 (Build 20250601)"
            };
        } else {
            loadUserSettingsFromSession();
        }

        updateMainHeaderUI();

        const currentHash = window.location.hash.substring(1) || 'preferensi-akun';
        console.log(`[initializeSettingsPage] Hash URL saat ini: "${currentHash}"`);
        
        if (settingsNavItems.length === 0) {
            console.error("[initializeSettingsPage] KRITIKAL: Tidak ada item navigasi (.settings-nav-item) yang ditemukan. Navigasi tab tidak akan berfungsi.");
            if (settingsTabContent) renderSettingsTabContent('preferensi-akun'); // Coba render default jika konten ada
            return;
        }
        
        let activeNavItem = document.querySelector(`.settings-nav-item[href="#${currentHash}"]`);
        settingsNavItems.forEach(nav => nav.classList.remove('active'));

        if (activeNavItem) {
            console.log(`[initializeSettingsPage] Item navigasi aktif ditemukan untuk hash: "${currentHash}"`);
            activeNavItem.classList.add('active');
            renderSettingsTabContent(currentHash);
        } else {
            console.warn(`[initializeSettingsPage] Item navigasi untuk hash "${currentHash}" tidak ditemukan. Menggunakan default "preferensi-akun".`);
            const firstNavItem = document.querySelector('.settings-nav-item[href="#preferensi-akun"]');
            if (firstNavItem) {
                firstNavItem.classList.add('active');
                 renderSettingsTabContent('preferensi-akun');
            } else {
                console.error("[initializeSettingsPage] Item navigasi default '#preferensi-akun' juga tidak ditemukan. Tidak bisa merender konten tab awal.");
                if(settingsTabContent) settingsTabContent.innerHTML = '<p class="text-red-500 text-center py-10">Kesalahan konfigurasi: Navigasi tab tidak ditemukan.</p>';
            }
        }
        console.log("[initializeSettingsPage] Inisialisasi halaman pengaturan selesai.");
    }

    // Pastikan semua elemen utama ada sebelum melanjutkan
    if (settingsTabContent && settingsNavItems) {
        initializeSettingsPage();
    } else {
        console.error("KRITIKAL: Elemen dasar halaman pengaturan (settingsTabContent atau settingsNavItems) tidak ditemukan. Skrip tidak dapat berjalan dengan benar.");
        if (settingsTabContent) { // Jika hanya navigasi yang hilang
            settingsTabContent.innerHTML = '<p class="text-red-500 text-center py-10">Kesalahan: Komponen navigasi pengaturan tidak ditemukan.</p>';
        }
    }
});
