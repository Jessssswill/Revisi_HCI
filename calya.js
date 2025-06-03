document.addEventListener('DOMContentLoaded', () => {
    const isAuthenticated = () => sessionStorage.getItem('isLoggedIn') === 'true';
    const getUserIdentifier = () => sessionStorage.getItem('userIdentifier');

    function showLoginPrompt(redirectUrl = window.location.href) {
        const loginModal = document.getElementById('loginPromptModalOverlay');
        const loginButton = document.getElementById('goToLoginButtonFromModal');
        if (loginModal) {
            if (loginButton && typeof login !== 'undefined' && login.html) { 
                 loginButton.href = `login.html?redirect=${encodeURIComponent(redirectUrl)}`;
            } else if (loginButton) {
                loginButton.href = `login.html?redirect=${encodeURIComponent(redirectUrl)}`; 
            }
            loginModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        } else {
            console.warn("Modal login tidak ditemukan. Mengarahkan langsung ke halaman login.");
            window.location.href = `login.html?redirect=${encodeURIComponent(redirectUrl)}`;
        }
    }

    const dismissLoginPromptButton = document.getElementById('dismissLoginPromptButton');
    const loginPromptModalOverlay = document.getElementById('loginPromptModalOverlay');

    if (dismissLoginPromptButton && loginPromptModalOverlay) {
        dismissLoginPromptButton.addEventListener('click', () => {
            loginPromptModalOverlay.classList.add('hidden');
            document.body.style.overflow = '';
        });
        loginPromptModalOverlay.addEventListener('click', (event) => {
            if (event.target === loginPromptModalOverlay) {
                loginPromptModalOverlay.classList.add('hidden');
                document.body.style.overflow = '';
            }
        });
    }
    const galleryThumbsContainer = document.querySelector('.gallery-thumbs');
    const galleryTopContainer = document.querySelector('.gallery-top');

    if (galleryThumbsContainer && galleryTopContainer) {
        const galleryThumbs = new Swiper(galleryThumbsContainer, {
            spaceBetween: 8,
            slidesPerView: 4, 
            freeMode: true,
            watchSlidesProgress: true,
            observer: true, 
            observeParents: true, 
            breakpoints: {
                320: { slidesPerView: 3, spaceBetween: 6 },
                640: { slidesPerView: 4, spaceBetween: 8 },
                768: { slidesPerView: 5, spaceBetween: 8 },
            }
        });

        const mainGallery = new Swiper(galleryTopContainer, {
            spaceBetween: 10,
            navigation: {
                nextEl: '.gallery-top .swiper-button-next',
                prevEl: '.gallery-top .swiper-button-prev',
            },
            pagination: {
                el: '.gallery-top .swiper-pagination',
                clickable: true,
            },
            thumbs: {
                swiper: galleryThumbs
            },
            loop: false, 
            observer: true, 
            observeParents: true, 
        });
    }

    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => {
                btn.classList.remove('active', 'border-olx-blue', 'text-olx-blue', 'bg-blue-50');
                btn.classList.add('text-text-muted', 'hover:text-text-secondary', 'hover:border-gray-300');
                btn.setAttribute('aria-selected', 'false');
            });
            tabContents.forEach(content => content.classList.add('hidden'));

            button.classList.add('active', 'border-olx-blue', 'text-olx-blue', 'bg-blue-50');
            button.classList.remove('text-text-muted', 'hover:text-text-secondary', 'hover:border-gray-300');
            button.setAttribute('aria-selected', 'true');

            const tabId = button.dataset.tab;
            const activeContent = document.getElementById(tabId);
            if (activeContent) {
                activeContent.classList.remove('hidden');
            }
        });
    });

    const favoriteButton = document.getElementById('favoriteButton');
    const favoriteIcon = document.getElementById('favoriteIcon');
    const favoriteText = document.getElementById('favoriteText');
    let isFavorited = false; 

    if (favoriteButton && favoriteIcon && favoriteText) {

        favoriteButton.addEventListener('click', () => {
            if (!isAuthenticated()) {
                showLoginPrompt(window.location.href); 
                return;
            }
            isFavorited = !isFavorited;
            updateFavoriteButtonUI();
            if (isFavorited) {
                console.log('Produk ditambahkan ke favorit');
            } else {
                console.log('Produk dihapus dari favorit');
            }
        });

        function updateFavoriteButtonUI() {
            favoriteButton.classList.toggle('favorited', isFavorited);
            favoriteButton.setAttribute('aria-pressed', isFavorited.toString());
            if (isFavorited) {
                favoriteIcon.setAttribute('fill', '#EF4444'); 
                favoriteIcon.setAttribute('stroke', '#EF4444');
                favoriteText.textContent = 'Disimpan';
            } else {
                favoriteIcon.setAttribute('fill', 'none');
                favoriteIcon.setAttribute('stroke', 'currentColor');
                favoriteText.textContent = 'Simpan Favorit';
            }
        }
    }
    const chatPenjualButton = document.getElementById('chatPenjualButton');
    if (chatPenjualButton) {
        chatPenjualButton.addEventListener('click', () => {
            const sellerId = "beastcar"; 
            const productId = "calya2020"; 
            if (!isAuthenticated()) {
                showLoginPrompt(`chat.html?productId=${productId}&sellerId=${sellerId}`);
                return;
            }
            console.log(`Mengarahkan ke chat dengan penjual ${sellerId} untuk produk ${productId}...`);
            window.location.href = `chat.html?productId=${productId}&sellerId=${sellerId}`;
        });
    }

    const teleponPenjualButton = document.getElementById('teleponPenjualButton');
    const sellerPhoneNumber = "0812-3456-7890"; 
    const phoneModal = document.getElementById('phoneModal');
    const sellerPhoneNumberDisplay = document.getElementById('sellerPhoneNumberDisplay');
    const copyPhoneNumberButton = document.getElementById('copyPhoneNumberButton');
    const closePhoneModalButton = document.getElementById('closePhoneModalButton');

    if (teleponPenjualButton && phoneModal && sellerPhoneNumberDisplay && copyPhoneNumberButton && closePhoneModalButton) {
        teleponPenjualButton.addEventListener('click', () => {
            sellerPhoneNumberDisplay.textContent = sellerPhoneNumber;
            phoneModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            console.log('Menampilkan modal nomor telepon penjual.');
        });

        closePhoneModalButton.addEventListener('click', () => {
            phoneModal.classList.add('hidden');
            document.body.style.overflow = '';
        });
        phoneModal.addEventListener('click', (event) => {
            if (event.target === phoneModal) {
                phoneModal.classList.add('hidden');
                document.body.style.overflow = '';
            }
        });

        copyPhoneNumberButton.addEventListener('click', () => {
            const targetId = copyPhoneNumberButton.dataset.copyTarget;
            const targetElement = document.getElementById(targetId);
            if (targetElement && targetElement.textContent !== '-') {
                navigator.clipboard.writeText(targetElement.textContent)
                    .then(() => {
                        copyPhoneNumberButton.textContent = 'Berhasil Disalin!';
                        setTimeout(() => {
                            copyPhoneNumberButton.textContent = 'Salin Nomor';
                        }, 2000);
                    })
                    .catch(err => {
                        console.error('Gagal menyalin nomor: ', err);
                        try {
                            const success = document.execCommand('copy'); 
                            if(success) {
                                copyPhoneNumberButton.textContent = 'Disalin (Fallback)!';
                                setTimeout(() => { copyPhoneNumberButton.textContent = 'Salin Nomor'; }, 2000);
                            } else {
                                alert('Gagal menyalin. Salin manual: ' + targetElement.textContent);
                            }
                        } catch (e) {
                             alert('Gagal menyalin. Salin manual: ' + targetElement.textContent);
                        }
                    });
            } else {
                alert('Nomor telepon tidak tersedia untuk disalin.');
            }
        });
    }

    const locationButtonHeader = document.getElementById('locationButtonHeader');
    const locationDropdownHeader = document.getElementById('locationDropdownHeader');
    const currentLocationHeader = document.getElementById('currentLocationHeader');

    if (locationButtonHeader && locationDropdownHeader && currentLocationHeader) {
        locationButtonHeader.addEventListener('click', (event) => {
            event.stopPropagation();
            const isHidden = locationDropdownHeader.classList.toggle('hidden');
            locationButtonHeader.setAttribute('aria-expanded', !isHidden);
        });
        locationDropdownHeader.addEventListener('click', (event) => {
            const target = event.target.closest('.location-item-header');
            if (target) {
                event.preventDefault();
                currentLocationHeader.textContent = target.dataset.location || target.textContent;
                locationDropdownHeader.classList.add('hidden');
                locationButtonHeader.setAttribute('aria-expanded', 'false');
                console.log(`Lokasi di header diubah ke: ${currentLocationHeader.textContent}`);
            }
        });
    }

    const profileButtonHeader = document.getElementById('profileButtonHeader');
    const profileDropdownHeader = document.getElementById('profileDropdownHeader');
    const profileImageHeader = document.getElementById('profileImageHeader');

    function updateHeaderProfileUI() {
        if (!profileDropdownHeader || !profileImageHeader) return;
        profileDropdownHeader.innerHTML = '';

        if (isAuthenticated()) {
            const userEmail = getUserIdentifier() || 'Pengguna OLX';
            const initial = userEmail.charAt(0).toUpperCase() || 'P';
            profileImageHeader.src = `https://placehold.co/32x32/00A5EC/FFFFFF?text=${initial}&font=Inter&bold=true`;
            profileImageHeader.alt = `Profil ${userEmail}`;

            profileDropdownHeader.innerHTML = `
                <div class="px-4 py-3">
                    <p class="text-sm font-medium text-text-primary truncate" title="${userEmail}">${userEmail}</p>
                </div>
                <hr class="border-border-default">
                <a href="profile.html" class="block px-4 py-2 text-sm text-text-primary hover:bg-gray-100 transition">Profil Saya</a>
                <a href="sell.html" class="block px-4 py-2 text-sm text-text-primary hover:bg-gray-100 transition">Iklan Saya</a>
                <hr class="border-border-default">
                <button id="logoutButtonHeader" class="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition">Keluar</button>
            `;
            const logoutButton = document.getElementById('logoutButtonHeader');
            if (logoutButton) {
                logoutButton.addEventListener('click', () => {
                    sessionStorage.removeItem('isLoggedIn');
                    sessionStorage.removeItem('userIdentifier');
                    updateHeaderProfileUI();
                    profileDropdownHeader.classList.add('hidden');
                    window.location.reload();
                });
            }
        } else {
            profileImageHeader.src = 'https://placehold.co/32x32/D1D5DB/4B5563?text=G&font=Inter&bold=true';
            profileImageHeader.alt = 'Masuk atau Daftar';
            profileDropdownHeader.innerHTML = `
                <div class="p-4 text-center">
                    <p class="text-sm text-text-secondary mb-2">Anda belum masuk.</p>
                    <a href="login.html?redirect=${encodeURIComponent(window.location.href)}" class="w-full inline-block bg-olx-blue text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-700 transition">Masuk</a>
                    <p class="mt-2 text-xs text-text-muted">Belum punya akun? <a href="register.html" class="text-olx-blue hover:underline">Daftar</a></p>
                </div>
            `;
        }
    }

    if (profileButtonHeader && profileDropdownHeader) {
        profileButtonHeader.addEventListener('click', (event) => {
            event.stopPropagation();
            updateHeaderProfileUI();
            const isHidden = profileDropdownHeader.classList.toggle('hidden');
            profileButtonHeader.setAttribute('aria-expanded', !isHidden);
        });
    }

    document.addEventListener('click', (event) => {
        if (locationDropdownHeader && !locationDropdownHeader.classList.contains('hidden') &&
            locationButtonHeader && !locationButtonHeader.contains(event.target) &&
            !locationDropdownHeader.contains(event.target)) {
            locationDropdownHeader.classList.add('hidden');
            if(locationButtonHeader) locationButtonHeader.setAttribute('aria-expanded', 'false');
        }
        if (profileDropdownHeader && !profileDropdownHeader.classList.contains('hidden') &&
            profileButtonHeader && !profileButtonHeader.contains(event.target) &&
            !profileDropdownHeader.contains(event.target)) {
            profileDropdownHeader.classList.add('hidden');
            if(profileButtonHeader) profileButtonHeader.setAttribute('aria-expanded', 'false');
        }
    });

    const chatButtonHeader = document.getElementById('chatButtonHeader');
    const notificationButtonHeader = document.getElementById('notificationButtonHeader');
    const sellButtonHeader = document.getElementById('sellButtonHeader');

    if(chatButtonHeader) {
        chatButtonHeader.addEventListener('click', () => {
            if (!isAuthenticated()) { showLoginPrompt('chat.html'); return; }
            window.location.href = 'chat.html';
        });
    }
    if(notificationButtonHeader) {
        notificationButtonHeader.addEventListener('click', () => {
            if (!isAuthenticated()) { showLoginPrompt('notifications.html'); return; }
            alert('Fitur notifikasi akan segera hadir!');
        });
    }
    if(sellButtonHeader) {
        sellButtonHeader.addEventListener('click', () => {
            if (!isAuthenticated()) { showLoginPrompt('sell.html'); return; }
            window.location.href = 'sell.html'; 
        });
    }
    const searchInputHeader = document.getElementById('searchInputHeader');
    if (searchInputHeader) {
        searchInputHeader.addEventListener('keypress', (event) => {
            if (event.key === 'Enter' && searchInputHeader.value.trim() !== '') {
                window.location.href = `search.html?q=${encodeURIComponent(searchInputHeader.value.trim())}`;
            }
        });
    }

    updateHeaderProfileUI(); 

    console.log('Product detail page (V3 - Interaktif dan Layout Ditingkatkan) scripts loaded.');
});
