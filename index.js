// home.js - V4 (Interaktivitas Ditingkatkan)
// Logika JavaScript spesifik untuk Halaman Beranda OLX

document.addEventListener('DOMContentLoaded', () => {
    // --- Selektor Elemen DOM ---
    const heroSwiperContainer = document.querySelector('#heroBanner .swiper-container');
    const loginPromptModalOverlay = document.getElementById('loginPromptModalOverlay');
    const dismissLoginPromptButton = document.getElementById('dismissLoginPromptButton');
    const goToLoginButtonFromModal = document.getElementById('goToLoginButtonFromModal');

    const locationButton = document.getElementById('locationButton');
    const locationDropdown = document.getElementById('locationDropdown');
    const currentLocationSpan = document.getElementById('currentLocation');

    const profileButton = document.getElementById('profileButton');
    const profileDropdown = document.getElementById('profileDropdown');
    const profileImage = document.getElementById('profileImage');

    const chatButton = document.getElementById('chatButton');
    const notificationButton = document.getElementById('notificationButton');
    const sellButton = document.getElementById('sellButton');

    const categoryNavContainer = document.getElementById('categoryNavigation');
    const productListContainer = document.getElementById('productList');
    const loadMoreButton = document.getElementById('loadMoreButton');

    const searchInputDesktop = document.getElementById('searchInputDesktop');
    const searchInputMobile = document.getElementById('searchInputMobile');


    // --- Fungsi Utilitas Global (Sebaiknya ada di global.js jika dipakai di banyak halaman) ---
    const isAuthenticated = () => sessionStorage.getItem('isLoggedIn') === 'true';
    const getUserIdentifier = () => sessionStorage.getItem('userIdentifier'); // Bisa email atau username

    // --- Inisialisasi Swiper untuk Hero Banner ---
    if (heroSwiperContainer) {
        new Swiper(heroSwiperContainer, {
            loop: true,
            autoplay: {
                delay: 4500, // Durasi autoplay
                disableOnInteraction: false,
            },
            pagination: {
                el: '#heroBanner .swiper-pagination',
                clickable: true,
                dynamicBullets: true,
            },
            navigation: {
                nextEl: '#heroBanner .swiper-button-next',
                prevEl: '#heroBanner .swiper-button-prev',
            },
            effect: 'fade',
            fadeEffect: {
                crossFade: true
            },
            grabCursor: true,
            watchOverflow: true,
        });
    }

    // --- Logika Modal Prompt Login ---
    function showLoginPrompt(redirectAfterLogin = window.location.href) {
        if (loginPromptModalOverlay && !isAuthenticated()) {
            // Simpan URL redirect ke login.html
            if (goToLoginButtonFromModal) {
                goToLoginButtonFromModal.href = `login.html?redirect=${encodeURIComponent(redirectAfterLogin)}`;
            }
            loginPromptModalOverlay.classList.remove('hidden');
            document.body.style.overflow = 'hidden'; // Mencegah scroll di background
        }
    }

    function hideLoginPrompt() {
        if (loginPromptModalOverlay) {
            loginPromptModalOverlay.classList.add('hidden');
            document.body.style.overflow = ''; // Mengaktifkan kembali scroll
        }
    }

    if (dismissLoginPromptButton) {
        dismissLoginPromptButton.addEventListener('click', () => {
            hideLoginPrompt();
            sessionStorage.setItem('loginPromptDismissed_home', 'true');
        });
    }

    if (loginPromptModalOverlay) {
        loginPromptModalOverlay.addEventListener('click', (event) => {
            if (event.target === loginPromptModalOverlay) { // Klik pada overlay (backdrop)
                hideLoginPrompt();
                sessionStorage.setItem('loginPromptDismissed_home', 'true');
            }
        });
    }
    // Fungsi ini bisa dipanggil dari global.js atau elemen lain
    window.showHomePageLoginPrompt = showLoginPrompt;


    // --- Logika Dropdown (Lokasi & Profil) ---
    function toggleDropdown(button, dropdown) {
        const isExpanded = dropdown.classList.toggle('hidden');
        button.setAttribute('aria-expanded', !isExpanded);
    }

    // Event listener untuk menutup dropdown jika diklik di luar
    document.addEventListener('click', (event) => {
        // Tutup dropdown lokasi jika klik di luar
        if (locationButton && locationDropdown && !locationButton.contains(event.target) && !locationDropdown.contains(event.target)) {
            if (!locationDropdown.classList.contains('hidden')) {
                locationDropdown.classList.add('hidden');
                locationButton.setAttribute('aria-expanded', 'false');
            }
        }
        // Tutup dropdown profil jika klik di luar
        if (profileButton && profileDropdown && !profileButton.contains(event.target) && !profileDropdown.contains(event.target)) {
            if (!profileDropdown.classList.contains('hidden')) {
                profileDropdown.classList.add('hidden');
                profileButton.setAttribute('aria-expanded', 'false');
            }
        }
    });

    // Dropdown Lokasi
    if (locationButton && locationDropdown && currentLocationSpan) {
        locationButton.addEventListener('click', (event) => {
            event.stopPropagation(); // Mencegah event click sampai ke document listener di atas
            toggleDropdown(locationButton, locationDropdown);
        });

        locationDropdown.addEventListener('click', (event) => {
            if (event.target.classList.contains('location-item')) {
                event.preventDefault();
                const selectedLocation = event.target.dataset.location || event.target.textContent.trim();
                currentLocationSpan.textContent = selectedLocation;
                console.log('Lokasi dipilih:', selectedLocation);
                // Di sini bisa ditambahkan logika untuk filter berdasarkan lokasi
                locationDropdown.classList.add('hidden');
                locationButton.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // --- Logika Header Berdasarkan Status Login ---
    function updateHeaderUI() {
        if (profileDropdown && profileImage) {
            profileDropdown.innerHTML = ''; // Kosongkan dropdown sebelum mengisi ulang

            if (isAuthenticated()) {
                const userEmail = getUserIdentifier() || 'Pengguna OLX';
                // Ambil inisial dari email/username jika ada, jika tidak default 'P'
                const initial = userEmail.charAt(0).toUpperCase() || 'P';
                profileImage.src = `https://placehold.co/32x32/00A5EC/FFFFFF?text=${initial}&font=Inter&bold=true`;
                profileImage.alt = `Profil ${userEmail}`;

                profileDropdown.innerHTML = `
                    <div class="px-4 py-3">
                        <p class="text-sm font-medium text-text-primary truncate" title="${userEmail}">${userEmail}</p>
                        <p class="text-xs text-text-secondary">Pengguna Terverifikasi (Contoh)</p>
                    </div>
                    <hr class="border-border-default">
                    <a href="profile.html" class="block px-4 py-2 text-sm text-text-primary hover:bg-gray-100 transition">Profil Saya</a>
                    <a href="sell.html" class="block px-4 py-2 text-sm text-text-primary hover:bg-gray-100 transition">Iklan Saya</a>
                    <a href="pengaturan.html" class="block px-4 py-2 text-sm text-text-primary hover:bg-gray-100 transition">Pengaturan</a>
                    <hr class="border-border-default">
                    <button id="logoutButton" class="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition">Keluar</button>
                `;

                const logoutButton = document.getElementById('logoutButton');
                if (logoutButton) {
                    logoutButton.addEventListener('click', () => {
                        sessionStorage.removeItem('isLoggedIn');
                        sessionStorage.removeItem('userIdentifier');
                        sessionStorage.removeItem('loginPromptDismissed_home'); // Reset prompt
                        console.log('Pengguna berhasil keluar.');
                        updateHeaderUI(); // Perbarui UI header
                        profileDropdown.classList.add('hidden');
                        profileButton.setAttribute('aria-expanded', 'false');
                        // Bisa redirect ke halaman utama atau refresh
                        // window.location.reload();
                    });
                }
            } else {
                profileImage.src = 'https://placehold.co/32x32/D1D5DB/4B5563?text=G&font=Inter&bold=true'; // Gambar guest
                profileImage.alt = 'Masuk atau Daftar';
                profileDropdown.innerHTML = `
                    <div class="p-4 text-center">
                        <p class="text-sm text-text-secondary mb-2">Anda belum masuk.</p>
                        <a href="login.html" class="w-full inline-block bg-olx-blue text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-700 transition">Masuk</a>
                        <p class="mt-2 text-xs text-text-muted">Belum punya akun? <a href="register.html" class="text-olx-blue hover:underline">Daftar</a></p>
                    </div>
                `;
            }
        }
    }

    // Dropdown Profil
    if (profileButton && profileDropdown) {
        profileButton.addEventListener('click', (event) => {
            event.stopPropagation();
            updateHeaderUI(); 
            toggleDropdown(profileButton, profileDropdown);
        });
    }

    if (chatButton) {
        chatButton.addEventListener('click', () => {
            if (isAuthenticated()) {
                console.log('Navigasi ke halaman Chat...');
                window.location.href = 'chat.html'; 
            } else {
                showLoginPrompt('chat.html'); 
            }
        });
    }

    if (notificationButton) {
        notificationButton.addEventListener('click', () => {
            if (isAuthenticated()) {
                console.log('Menampilkan notifikasi...');
                // Implementasi logika tampil notifikasi (misal: dropdown atau halaman baru)
                alert('Fitur notifikasi akan segera hadir!');
            } else {
                showLoginPrompt('notifications.html'); // Redirect ke notifikasi setelah login
            }
        });
    }

    if (sellButton) {
        sellButton.addEventListener('click', () => {
            if (isAuthenticated()) {
                console.log('Navigasi ke halaman Jual Barang...');
                window.location.href = 'sell.html'; 
            } else {
                showLoginPrompt('sell.html'); 
            }
        });
    }

    if (categoryNavContainer) {
        categoryNavContainer.addEventListener('click', function(event) {
            const targetItem = event.target.closest('.category-nav-item');
            if (targetItem) {
                event.preventDefault(); // Hentikan navigasi default jika ini filter AJAX

                // Hapus kelas aktif dari semua item
                this.querySelectorAll('.category-nav-item').forEach(item => {
                    item.classList.remove('active', 'bg-olx-blue', 'text-white');
                });

                // Tambahkan kelas aktif ke item yang diklik
                targetItem.classList.add('active', 'bg-olx-blue', 'text-white');

                const category = targetItem.dataset.category;
                console.log('Kategori dipilih:', category);
                // Implementasikan logika filter produk berdasarkan kategori di sini
                // Contoh: fetchProducts(category);
                alert(`Memfilter untuk kategori: ${category}`);
            }
        });
        // Tandai kategori aktif berdasarkan parameter URL (jika ada)
        const urlParams = new URLSearchParams(window.location.search);
        const currentCategory = urlParams.get('category');
        if (currentCategory) {
            const activeCategoryLink = categoryNavContainer.querySelector(`.category-nav-item[data-category="${currentCategory}"]`);
            if (activeCategoryLink) {
                activeCategoryLink.classList.add('active', 'bg-olx-blue', 'text-white');
            } else if (currentCategory === 'semua') {
                 const allCategoryLink = categoryNavContainer.querySelector(`.category-nav-item[data-category="semua"]`);
                 if(allCategoryLink) allCategoryLink.classList.add('active', 'bg-olx-blue', 'text-white');
            }
        } else {
            // Default ke "Semua Kategori" jika tidak ada parameter
            const allCategoryLink = categoryNavContainer.querySelector(`.category-nav-item[data-category="semua"]`);
            if(allCategoryLink) allCategoryLink.classList.add('active', 'bg-olx-blue', 'text-white');
        }
    }

    // --- Pencarian ---
    function handleSearch(query) {
        if (query.trim() === '') {
            alert('Masukkan kata kunci pencarian.');
            return;
        }
        console.log('Mencari untuk:', query);
        // Redirect ke halaman hasil pencarian
        window.location.href = `search-results.html?q=${encodeURIComponent(query)}`;
    }

    if (searchInputDesktop) {
        searchInputDesktop.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                handleSearch(searchInputDesktop.value);
            }
        });
    }
    if (searchInputMobile) {
         searchInputMobile.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                handleSearch(searchInputMobile.value);
            }
        });
    }


    // --- Tombol "Muat Lebih Banyak Rekomendasi" ---
    let productsLoadedCount = 0;
    const productsPerLoad = 5; // Jumlah produk yang dimuat setiap kali

    function createProductCard(product) {
        // Fungsi untuk membuat elemen kartu produk (contoh)
        const card = document.createElement('a');
        card.href = product.url || `product-detail.html?id=${product.id}`;
        card.className = 'product-card group bg-bg-card rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out flex flex-col overflow-hidden';
        card.innerHTML = `
            <div class="relative aspect-[4/3] overflow-hidden">
                <img src="${product.image || 'https://placehold.co/300x225/E5E7EB/4B5563?text=Produk+Baru&font=Inter'}" alt="${product.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                ${product.isFeatured ? '<span class="absolute top-2.5 left-2.5 bg-olx-orange text-white text-[10px] px-2 py-0.5 rounded-sm font-semibold uppercase tracking-wider shadow">Unggulan</span>' : ''}
            </div>
            <div class="p-3.5 sm:p-4 flex flex-col flex-grow">
                <h3 class="font-semibold text-sm sm:text-base text-brand-dark truncate group-hover:text-olx-blue transition-colors mb-1" title="${product.name}">${product.name}</h3>
                <p class="text-olx-orange font-bold text-base sm:text-lg">${product.price}</p>
                <p class="text-xs text-text-secondary mt-1.5 truncate">${product.location}</p>
                <p class="text-xs text-text-muted mt-auto pt-2">${product.postedDate}</p>
            </div>
        `;
        return card;
    }

    if (loadMoreButton && productListContainer) {
        loadMoreButton.addEventListener('click', () => {
            console.log('Memuat lebih banyak produk...');
            loadMoreButton.textContent = 'Memuat...';
            loadMoreButton.disabled = true;

            // Simulasi pemanggilan API
            setTimeout(() => {
                const newProducts = [ // Contoh data produk baru
                    { id: `new${productsLoadedCount + 1}`, name: 'Produk Baru Keren', price: 'Rp 1.000.000', location: 'Jakarta Utara', postedDate: 'Baru saja', image: 'https://placehold.co/300x225/10B981/FFFFFF?text=New+Item+1&font=Inter' },
                    { id: `new${productsLoadedCount + 2}`, name: 'Item Istimewa Lainnya', price: 'Rp 2.500.000', location: 'Bekasi', postedDate: '1 jam lalu', image: 'https://placehold.co/300x225/F59E0B/FFFFFF?text=Special+2&font=Inter', isFeatured: true },
                    { id: `new${productsLoadedCount + 3}`, name: 'Barang Langka Dicari', price: 'Rp 500.000', location: 'Depok', postedDate: '30 menit lalu', image: 'https://placehold.co/300x225/6366F1/FFFFFF?text=Rare+Find&font=Inter' },
                ];

                newProducts.forEach(product => {
                    productListContainer.appendChild(createProductCard(product));
                });
                productsLoadedCount += newProducts.length;

                loadMoreButton.textContent = 'Muat Lebih Banyak Rekomendasi';
                loadMoreButton.disabled = false;

                if (productsLoadedCount >= 10) { // Contoh batas maksimal
                    loadMoreButton.textContent = 'Semua produk telah dimuat';
                    loadMoreButton.disabled = true;
                }
            }, 1000);
        });
    }


    // --- Inisialisasi UI Awal ---
    updateHeaderUI(); // Perbarui header sesuai status login saat halaman dimuat

    // Tampilkan prompt login jika belum login dan belum di-dismiss (setelah sedikit delay)
    if (typeof window.showHomePageLoginPrompt === 'function' && !sessionStorage.getItem('loginPromptDismissed_home')) {
       setTimeout(window.showHomePageLoginPrompt, 1200);
    }

    console.log('Home page (V4 - Interaktif) specific scripts loaded.');
});
