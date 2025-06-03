document.addEventListener('DOMContentLoaded', () => {
    // --- Selektor Elemen Global Halaman Profil ---
    const profileTabContent = document.getElementById('profileTabContent');
    const profileNavItems = document.querySelectorAll('.profile-nav-item');
    const profilePageUserImage = document.getElementById('profilePageUserImage');
    const profileImageUpload = document.getElementById('profileImageUpload');
    const profilePageUserName = document.getElementById('profilePageUserName');
    const profilePageUserEmail = document.getElementById('profilePageUserEmail');
    const profilePageVerificationStatus = document.getElementById('profilePageVerificationStatus');
    const logoutButtonSidebar = document.getElementById('logoutButtonSidebar');

    // --- Selektor Header (diasumsikan dari global.js atau direplikasi di sini) ---
    const mainHeader = document.getElementById('mainHeader');
    const profileButtonHeader = document.getElementById('profileButtonHeader');
    const profileDropdownHeader = document.getElementById('profileDropdownHeader');
    const profileImageHeader = document.getElementById('profileImageHeader');
    const chatButtonHeader = document.getElementById('chatButtonHeader');
    const sellButtonHeader = document.getElementById('sellButtonHeader');

    // --- Mock Data Pengguna (Idealnya dari API/Session) ---
    let currentUser = {
        fullName: "Jessen",
        username: "jessen_olx",
        email: "jessen.s@example.com",
        phoneNumber: "081234567890",
        isPhoneVerified: true,
        bio: "Penggemar otomotif dan kolektor barang antik. Suka jual beli barang berkualitas.",
        location: "Jakarta Selatan, DKI Jakarta",
        joinDate: "Januari 2021",
        isVerified: true,
        profilePicture: "https://placehold.co/96x96/00A5EC/FFFFFF?text=BS&font=Inter&bold=true",
        notifications: {
            pesanBaru: true,
            updateIklan: true,
            promosiOlx: false,
        },
        ads: [
            { id: "ad1", title: "Toyota Avanza G 2018 Mulus", price: "Rp 145.000.000", image: "assets/avz.png", status: "aktif", views: 120, date: "2 hari lalu" },
            { id: "ad2", title: "iPhone 11 Pro 256GB Bekas", price: "Rp 7.500.000", image: "assets/ip11.png", status: "nonaktif", views: 305, date: "1 minggu lalu" },
            { id: "ad3", title: "Apartemen Disewakan Bulanan", price: "Rp 3.000.000/bulan", image: "assets/apart.png", status: "terjual", views: 500, date: "1 bulan lalu" },
        ],
        favorites: [
            { id: "fav1", title: "MCLaren", price: "Rp 6.999.000.000", image: "assets/mcl.png", seller: "MobilOke", location: "Bandung" },
            { id: "fav2", title: "Porsche", price: "Rp 4.666.777.000", image: "assets/por.png", seller: "GadgetMurah", location: "Surabaya" },
        ]
    };

    // --- Fungsi Utilitas Global (Bisa dari global.js) ---
    const isAuthenticated = () => sessionStorage.getItem('isLoggedIn') === 'true'; // Cek session
    const storeUserSession = (userData) => {
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('userProfileData', JSON.stringify(userData));
        // Simpan juga identifier untuk header
        sessionStorage.setItem('userIdentifier', userData.email || userData.username);
    };
    const loadUserFromSession = () => {
        const storedUser = sessionStorage.getItem('userProfileData');
        if (storedUser) {
            currentUser = JSON.parse(storedUser);
        } else {
            // Jika tidak ada di session, dan belum login, bisa redirect atau set default guest
            if (!isAuthenticated()) {
                 // Untuk demo, kita gunakan mock data jika tidak ada sesi & belum login
                console.log("Tidak ada sesi, menggunakan mock data awal.");
            }
        }
    };
    const clearUserSession = () => {
        sessionStorage.removeItem('isLoggedIn');
        sessionStorage.removeItem('userProfileData');
        sessionStorage.removeItem('userIdentifier');
    };

    // --- Fungsi Render Konten Tab ---
    function renderTabContent(tabId) {
        if (!profileTabContent) return;
        profileTabContent.innerHTML = '<p class="text-center text-text-muted py-10">Memuat...</p>'; // Loading state
        
        let templateId = '';
        switch (tabId) {
            case 'informasi-akun': templateId = 'templateInformasiAkun'; break;
            case 'iklan-saya': templateId = 'templateIklanSaya'; break;
            case 'favorit-saya': templateId = 'templateFavoritSaya'; break;
            case 'pengaturan-notifikasi': templateId = 'templatePengaturanNotifikasi'; break;
            case 'keamanan-akun': templateId = 'templateKeamananAkun'; break;
            case 'bantuan': templateId = 'templateBantuan'; break;
            default:
                profileTabContent.innerHTML = '<p class="text-red-500">Konten tidak ditemukan.</p>';
                return;
        }

        const template = document.getElementById(templateId);
        if (template) {
            profileTabContent.innerHTML = template.innerHTML;
            // Panggil fungsi inisialisasi spesifik untuk tab setelah konten dirender
            if (tabId === 'informasi-akun') initInformasiAkunForm();
            if (tabId === 'iklan-saya') initIklanSaya();
            if (tabId === 'favorit-saya') initFavoritSaya();
            if (tabId === 'pengaturan-notifikasi') initPengaturanNotifikasi();
            if (tabId === 'keamanan-akun') initKeamananAkun();
        } else {
            profileTabContent.innerHTML = `<p class="text-red-500">Template untuk ${tabId} tidak ditemukan.</p>`;
        }
    }

    // --- Inisialisasi dan Event Listener untuk Setiap Tab ---

    function initInformasiAkunForm() {
        const form = document.getElementById('formInformasiAkun');
        if (!form) return;

        // Isi form dengan data pengguna saat ini
        form.fullName.value = currentUser.fullName || '';
        form.username.value = currentUser.username || '';
        form.email.value = currentUser.email || '';
        form.phoneNumber.value = currentUser.phoneNumber || '';
        form.bio.value = currentUser.bio || '';
        form.location.value = currentUser.location || '';

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            // Simulasi penyimpanan
            currentUser.fullName = form.fullName.value;
            currentUser.username = form.username.value;
            // Email biasanya tidak diubah atau butuh proses verifikasi khusus
            currentUser.phoneNumber = form.phoneNumber.value;
            currentUser.bio = form.bio.value;
            currentUser.location = form.location.value;

            storeUserSession(currentUser); // Simpan perubahan ke session
            loadProfileHeaderData(); // Update data di sidebar profil

            const statusDiv = document.getElementById('profileUpdateStatus');
            if (statusDiv) {
                statusDiv.innerHTML = `<p class="status-message success">Profil berhasil diperbarui!</p>`;
                setTimeout(() => { statusDiv.innerHTML = ''; }, 3000);
            }
            console.log("Profil diperbarui:", currentUser);
        });

        document.getElementById('verifyPhoneNumberButton')?.addEventListener('click', () => {
            alert("Fitur verifikasi nomor telepon akan segera hadir!");
        });
    }

    function initIklanSaya() {
        const container = document.getElementById('daftarIklanContainer');
        const filterStatus = document.getElementById('filterIklanStatus');
        if (!container || !filterStatus) return;

        function renderAds(statusFilter = "semua") {
            container.innerHTML = ''; // Clear previous ads
            const adsToDisplay = currentUser.ads.filter(ad => 
                statusFilter === "semua" || ad.status === statusFilter
            );

            if (adsToDisplay.length === 0) {
                container.innerHTML = '<p class="text-text-muted text-center py-5">Tidak ada iklan yang sesuai dengan filter.</p>';
                return;
            }

            adsToDisplay.forEach(ad => {
                const adElement = document.createElement('div');
                adElement.className = 'ad-card bg-card-bg rounded-lg shadow-sm p-4 flex flex-col sm:flex-row gap-4';
                let statusClass = '';
                let statusText = ad.status.charAt(0).toUpperCase() + ad.status.slice(1);
                if (ad.status === 'aktif') statusClass = 'ad-status-aktif';
                else if (ad.status === 'nonaktif') statusClass = 'ad-status-nonaktif';
                else if (ad.status === 'terjual') statusClass = 'ad-status-terjual';

                adElement.innerHTML = `
                    <img src="${ad.image}" alt="${ad.title}" class="w-full sm:w-32 h-32 sm:h-auto object-cover rounded-md flex-shrink-0">
                    <div class="flex-grow">
                        <h3 class="text-md font-semibold text-brand-dark hover:text-olx-blue transition"><a href="product-detail.html?id=${ad.id}">${ad.title}</a></h3>
                        <p class="text-olx-orange font-bold text-lg my-1">${ad.price}</p>
                        <div class="text-xs text-text-muted mb-2">
                            <span>Dilihat: ${ad.views}</span> | <span>Diposting: ${ad.date}</span>
                        </div>
                        <span class="text-xs font-medium px-2 py-0.5 rounded-full ${statusClass}">${statusText}</span>
                    </div>
                    <div class="flex flex-col sm:items-end space-y-2 sm:space-y-1 mt-3 sm:mt-0 flex-shrink-0">
                        <button data-ad-id="${ad.id}" class="edit-ad-button text-xs text-olx-blue hover:underline">Edit</button>
                        <button data-ad-id="${ad.id}" class="toggle-ad-status-button text-xs text-yellow-600 hover:underline">${ad.status === 'aktif' ? 'Nonaktifkan' : 'Aktifkan'}</button>
                        <button data-ad-id="${ad.id}" class="delete-ad-button text-xs text-red-600 hover:underline">Hapus</button>
                    </div>
                `;
                container.appendChild(adElement);
            });

            container.querySelectorAll('.edit-ad-button').forEach(btn => btn.addEventListener('click', (e) => editAd(e.target.dataset.adId)));
            container.querySelectorAll('.toggle-ad-status-button').forEach(btn => btn.addEventListener('click', (e) => toggleAdStatus(e.target.dataset.adId)));
            container.querySelectorAll('.delete-ad-button').forEach(btn => btn.addEventListener('click', (e) => deleteAd(e.target.dataset.adId)));
        }
        
        filterStatus.addEventListener('change', (e) => renderAds(e.target.value));
        renderAds(); 
    }

    function editAd(adId) { alert(`Fitur edit iklan ${adId} akan segera hadir!`); }
    function toggleAdStatus(adId) {
        const ad = currentUser.ads.find(a => a.id === adId);
        if (ad) {
            ad.status = (ad.status === 'aktif' ? 'nonaktif' : 'aktif');
            storeUserSession(currentUser);
            initIklanSaya(); // Re-render
            showStatusMessage(`Status iklan "${ad.title}" berhasil diubah menjadi ${ad.status}.`, "success");
        }
    }
    function deleteAd(adId) {
        showConfirmationModal(`Anda yakin ingin menghapus iklan ini? Tindakan ini tidak dapat diurungkan.`, () => {
            currentUser.ads = currentUser.ads.filter(a => a.id !== adId);
            storeUserSession(currentUser);
            initIklanSaya(); // Re-render
            showStatusMessage("Iklan berhasil dihapus.", "success");
        });
    }


    function initFavoritSaya() {
        const container = document.getElementById('daftarFavoritContainer');
        if (!container) return;
        container.innerHTML = '';

        if (currentUser.favorites.length === 0) {
            container.innerHTML = '<p class="text-text-muted text-center py-5 col-span-full">Anda belum memiliki iklan favorit.</p>';
            return;
        }

        currentUser.favorites.forEach(fav => {
            const favElement = document.createElement('div');
            favElement.className = 'ad-card bg-card-bg rounded-lg shadow-sm p-4';
            favElement.innerHTML = `
                <a href="product-detail.html?id=${fav.id}">
                    <img src="${fav.image}" alt="${fav.title}" class="w-full h-40 object-cover rounded-md mb-3">
                    <h3 class="text-sm font-semibold text-brand-dark hover:text-olx-blue transition truncate" title="${fav.title}">${fav.title}</h3>
                </a>
                <p class="text-olx-orange font-bold text-md my-1">${fav.price}</p>
                <p class="text-xs text-text-muted truncate">Penjual: ${fav.seller}</p>
                <p class="text-xs text-text-muted truncate">Lokasi: ${fav.location}</p>
                <button data-fav-id="${fav.id}" class="remove-favorite-button w-full mt-3 text-xs text-red-600 hover:bg-red-50 border border-red-300 py-1.5 rounded-md transition">Hapus dari Favorit</button>
            `;
            container.appendChild(favElement);
        });
        container.querySelectorAll('.remove-favorite-button').forEach(btn => btn.addEventListener('click', (e) => removeFavorite(e.target.dataset.favId)));
    }
    function removeFavorite(favId) {
         showConfirmationModal(`Anda yakin ingin menghapus item ini dari favorit?`, () => {
            currentUser.favorites = currentUser.favorites.filter(f => f.id !== favId);
            storeUserSession(currentUser);
            initFavoritSaya(); // Re-render
            showStatusMessage("Item berhasil dihapus dari favorit.", "success");
        });
    }


    function initPengaturanNotifikasi() {
        const form = document.getElementById('formPengaturanNotifikasi');
        if (!form) return;
        form.notifPesanBaru.checked = currentUser.notifications.pesanBaru;
        form.notifUpdateIklan.checked = currentUser.notifications.updateIklan;
        form.notifPromosiOlx.checked = currentUser.notifications.promosiOlx;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            currentUser.notifications.pesanBaru = form.notifPesanBaru.checked;
            currentUser.notifications.updateIklan = form.notifUpdateIklan.checked;
            currentUser.notifications.promosiOlx = form.notifPromosiOlx.checked;
            storeUserSession(currentUser);
            showStatusMessage("Pengaturan notifikasi berhasil disimpan.", "success", profileTabContent);
            console.log("Pengaturan Notifikasi Disimpan:", currentUser.notifications);
        });
    }

    function initKeamananAkun() {
        const formUbahPassword = document.getElementById('formUbahPassword');
        if (formUbahPassword) {
            formUbahPassword.addEventListener('submit', (e) => {
                e.preventDefault();
                const currentPassword = formUbahPassword.currentPassword.value;
                const newPassword = formUbahPassword.newPassword.value;
                const confirmNewPassword = formUbahPassword.confirmNewPassword.value;

                if (newPassword !== confirmNewPassword) {
                    showStatusMessage("Password baru dan konfirmasi password tidak cocok.", "error", profileTabContent);
                    return;
                }
                if (newPassword.length < 8) {
                     showStatusMessage("Password baru minimal 8 karakter.", "error", profileTabContent);
                    return;
                }
                // Simulasi ubah password
                console.log("Password saat ini:", currentPassword, "Password Baru:", newPassword);
                showStatusMessage("Password berhasil diubah (simulasi).", "success", profileTabContent);
                formUbahPassword.reset();
            });
        }
        document.getElementById('setup2FAButton')?.addEventListener('click', () => {
            alert("Fitur pengaturan Autentikasi Dua Faktor (2FA) akan segera hadir!");
        });
    }

    // --- Fungsi Navigasi Tab ---
    profileNavItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // Jika ini tombol logout, jangan proses sebagai tab
            if (e.currentTarget.id === 'logoutButtonSidebar') return;

            e.preventDefault();
            profileNavItems.forEach(nav => nav.classList.remove('active'));
            e.currentTarget.classList.add('active');
            const tabId = e.currentTarget.getAttribute('href').substring(1);
            renderTabContent(tabId);
            // Update URL hash
            window.location.hash = tabId;
        });
    });

    // --- Fungsi untuk memuat data profil ke sidebar ---
    function loadProfileHeaderData() {
        if (profilePageUserImage) profilePageUserImage.src = currentUser.profilePicture || "https://placehold.co/96x96/00A5EC/FFFFFF?text=U&font=Inter&bold=true";
        if (profilePageUserName) profilePageUserName.textContent = currentUser.fullName || "Nama Pengguna";
        if (profilePageUserEmail) profilePageUserEmail.textContent = currentUser.email || "email@contoh.com";
        if (profilePageVerificationStatus) {
            profilePageVerificationStatus.textContent = currentUser.isVerified ? "Terverifikasi" : "Belum Terverifikasi";
            profilePageVerificationStatus.className = `mt-1 inline-block text-xs px-2 py-0.5 rounded-full font-medium ${currentUser.isVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`;
        }
    }

    // --- Upload Gambar Profil ---
    if (profileImageUpload && profilePageUserImage) {
        profileImageUpload.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    profilePageUserImage.src = e.target.result;
                    currentUser.profilePicture = e.target.result; 
                    storeUserSession(currentUser);
                    showStatusMessage("Foto profil berhasil diperbarui (simulasi).", "success");
                }
                reader.readAsDataURL(file);
            }
        });
    }
    
    // --- Fungsi Logout ---
    function logout() {
        clearUserSession();
        // Arahkan ke halaman login atau beranda
        window.location.href = "login.html";
    }
    if (logoutButtonSidebar) {
        logoutButtonSidebar.addEventListener('click', logout);
    }

    // --- Header Interactivity (Replikasi dari halaman lain jika global.js tidak ada) ---
    function updateMainHeaderUI() {
        if (!profileImageHeader || !profileDropdownHeader) return;
        profileDropdownHeader.innerHTML = ''; // Clear

        if (isAuthenticated()) {
            const userEmail = currentUser.email || currentUser.username || 'User';
            const initial = userEmail.charAt(0).toUpperCase() || 'P';
            profileImageHeader.src = currentUser.profilePicture || `https://placehold.co/32x32/00A5EC/FFFFFF?text=${initial}&font=Inter&bold=true`;
            profileImageHeader.alt = `Profil ${userEmail}`;

            profileDropdownHeader.innerHTML = `
                <div class="px-4 py-3">
                    <p class="text-sm font-medium text-text-primary truncate" title="${userEmail}">${userEmail}</p>
                </div>
                <hr class="border-border-default">
                <a href="profile.html#informasi-akun" class="block px-4 py-2 text-sm text-text-primary hover:bg-gray-100 transition">Profil Saya</a>
                <a href="profile.html#iklan-saya" class="block px-4 py-2 text-sm text-text-primary hover:bg-gray-100 transition">Iklan Saya</a>
                <hr class="border-border-default">
                <button id="logoutButtonInHeader" class="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition">Keluar</button>
            `;
            document.getElementById('logoutButtonInHeader')?.addEventListener('click', logout);
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
    document.addEventListener('click', (event) => { // Close dropdown if clicked outside
        if (profileDropdownHeader && !profileDropdownHeader.classList.contains('hidden') &&
            profileButtonHeader && !profileButtonHeader.contains(event.target) &&
            !profileDropdownHeader.contains(event.target)) {
            profileDropdownHeader.classList.add('hidden');
            if(profileButtonHeader) profileButtonHeader.setAttribute('aria-expanded', 'false');
        }
    });
    if (chatButtonHeader) chatButtonHeader.addEventListener('click', () => { if(isAuthenticated()) window.location.href = 'chat.html'; else alert("Silakan masuk untuk mengakses chat.");});
    if (sellButtonHeader) sellButtonHeader.addEventListener('click', () => { if(isAuthenticated()) window.location.href = 'sell.html'; else alert("Silakan masuk untuk memasang iklan.");});


    // --- Fungsi Modal Konfirmasi ---
    const confirmationModal = document.getElementById('confirmationModal');
    const confirmationModalTitle = document.getElementById('confirmationModalTitle');
    const confirmationModalMessage = document.getElementById('confirmationModalMessage');
    const confirmActionButton = document.getElementById('confirmActionButton');
    const cancelConfirmationButton = document.getElementById('cancelConfirmationButton');
    let currentConfirmCallback = null;

    function showConfirmationModal(message, onConfirm, title = "Konfirmasi Tindakan") {
        if (!confirmationModal || !confirmationModalMessage || !confirmActionButton || !cancelConfirmationButton || !confirmationModalTitle) return;
        confirmationModalTitle.textContent = title;
        confirmationModalMessage.textContent = message;
        currentConfirmCallback = onConfirm;
        confirmationModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    if (confirmActionButton) {
        confirmActionButton.addEventListener('click', () => {
            if (typeof currentConfirmCallback === 'function') {
                currentConfirmCallback();
            }
            confirmationModal.classList.add('hidden');
            document.body.style.overflow = '';
            currentConfirmCallback = null;
        });
    }
    if (cancelConfirmationButton) {
        cancelConfirmationButton.addEventListener('click', () => {
            confirmationModal.classList.add('hidden');
            document.body.style.overflow = '';
            currentConfirmCallback = null;
        });
    }

    // --- Fungsi Menampilkan Pesan Status ---
    function showStatusMessage(message, type = "success", container = profileTabContent) {
        if (!container) return;
        const statusDiv = document.createElement('div');
        statusDiv.className = `status-message ${type}`;
        statusDiv.textContent = message;
        
        const oldStatus = container.querySelector('.status-message');
        if(oldStatus) oldStatus.remove();
        
        container.insertBefore(statusDiv, container.firstChild); 
        setTimeout(() => { statusDiv.remove(); }, 4000);
    }


    function initializeProfilePage() {
        if (!isAuthenticated()) {
            console.warn("Pengguna belum login. Menampilkan data profil default/mock.");
            currentUser = { 
                fullName: "Pengguna Tamu", username: "tamu_olx", email: "tamu@olx.co.id",
                profilePicture: "https://placehold.co/96x96/D1D5DB/FFFFFF?text=G&font=Inter", isVerified: false,
                notifications: { pesanBaru: true, updateIklan: true, promosiOlx: false }, ads: [], favorites: []
            };
        } else {
            loadUserFromSession(); 
        }

        loadProfileHeaderData(); 
        updateMainHeaderUI();

        const currentHash = window.location.hash.substring(1) || 'informasi-akun';
        const activeNavItem = document.querySelector(`.profile-nav-item[href="#${currentHash}"]`);
        
        profileNavItems.forEach(nav => nav.classList.remove('active'));
        if (activeNavItem) {
            activeNavItem.classList.add('active');
            renderTabContent(currentHash);
        } else {
            document.querySelector('.profile-nav-item[href="#informasi-akun"]')?.classList.add('active');
            renderTabContent('informasi-akun');
        }
    }

    initializeProfilePage();
});
