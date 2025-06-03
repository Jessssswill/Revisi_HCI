document.addEventListener('DOMContentLoaded', () => {
    const mainHeader = document.getElementById('mainHeader');
    const profileButtonHeader = document.getElementById('profileButtonHeader');
    const profileDropdownHeader = document.getElementById('profileDropdownHeader');
    const profileImageHeader = document.getElementById('profileImageHeader');

    const leftSidebar = document.getElementById('leftSidebar');
    const sidebarItems = leftSidebar ? leftSidebar.querySelectorAll('.sidebar-item') : [];

    const chatListSection = document.getElementById('chatList');
    const searchChatInput = document.getElementById('searchChatInput');
    const chatListContainer = document.getElementById('chatListContainer');
    const noChatsMessage = document.getElementById('noChatsMessage');

    const mainChatArea = document.getElementById('mainChatArea');
    const chatActiveHeader = document.getElementById('chatActiveHeader');
    const backToChatListButton = document.getElementById('backToChatListButton');
    const chattingWithAvatarHeader = document.getElementById('chattingWithAvatarHeader');
    const chattingWithName = document.getElementById('chattingWithName');
    const chattingWithStatus = document.getElementById('chattingWithStatus');
    const chatOptionsButton = document.getElementById('chatOptionsButton');
    const chatOptionsDropdown = document.getElementById('chatOptionsDropdown');

    const messagesArea = document.getElementById('messagesArea');
    const selectChatMessageInfo = document.getElementById('selectChatMessage');
    const noChatSelectedPlaceholder = document.getElementById('noChatSelectedPlaceholder');


    const messageInputFooter = document.getElementById('messageInputFooter');
    const attachmentButton = document.getElementById('attachmentButton');
    const messageInput = document.getElementById('messageInput');
    const sendMessageButton = document.getElementById('sendMessageButton');
    const inputError = document.getElementById('inputError');

    let currentChatId = null;
    let allMockChats = {
        rina: {
            id: "rina",
            name: "Rina (Penjual iPhone)",
            avatarText: "R",
            avatarColor: "6366F1", 
            lastMessage: "Siap, Mas. Ditunggu kabarnya!",
            time: "12:15",
            unread: 0,
            status: "Online",
            messages: [
                { sender: "Rina", text: "Halo, Mas/Mbak. Masih ada iPhone 12 Pro Max yang di iklan? Harganya masih Rp 12 juta?", time: "10:27", type: "received", avatarText: "R" },
                { sender: "User", text: "Halo, Mbak. Iya, ada. Rp 12 juta, nego dikit boleh. Kondisi mulus, RAM 6GB, 128GB, garansi 3 bulan.", time: "10:28", type: "sent", avatarText: "U" },
                { sender: "Rina", text: "Oh, bagus kalau masih mulus. Bisa minta foto tambahan nggak? Terus, apa aja yang dapet kalau beli?", time: "10:29", type: "received", avatarText: "R" },
                { sender: "User", text: "Bisa. Ini foto tambahan. Dapet unit, charger, dus, bonus softcase kalau deal hari ini.", time: "10:30", type: "sent", image: "assets/iphone.png", avatarText: "U" },
                { sender: "Rina", text: "Oke, fotonya jelas. Untuk baterai healthnya berapa persen ya?", time: "10:35", type: "received", avatarText: "R"},
                { sender: "User", text: "Battery health masih 92%, Mbak. Awet seharian kok.", time: "10:36", type: "sent", avatarText: "U"},
                { sender: "Rina", text: "Sip. Kalau COD di daerah Jaksel bisa? Sekitaran Blok M gitu?", time: "10:38", type: "received", avatarText: "R"},
                { sender: "User", text: "Bisa banget, Mbak. Saya sering di Blok M juga. Mau kapan?", time: "10:39", type: "sent", avatarText: "U"},
                { sender: "Rina", text: "Besok siang jam 1 bisa, Mas?", time: "10:40", type: "received", avatarText: "R"},
                { sender: "User", text: "Oke, deal ya Mbak Rina. Besok jam 1 di Starbucks Blok M Plaza?", time: "10:41", type: "sent", avatarText: "U"},
                { sender: "Rina", text: "Deal, Mas! Aku hubungi via WhatsApp ya untuk detailnya. Makasih banyak!", time: "10:42", type: "received", avatarText: "R" },
                { sender: "User", text: "Sama-sama, Mbak. Saya tunggu WA-nya. Makasih juga!", time: "10:43", type: "sent", avatarText: "U" },
                { sender: "Rina", text: "Siap, Mas. Ditunggu kabarnya!", time: "12:15", type: "received", avatarText: "R" }
            ]
        },
        akbar: {
            id: "akbar",
            name: "Akbar (Pembeli Mobil)",
            avatarText: "A",
            avatarColor: "EC4899",
            lastMessage: "Oke, saya pertimbangkan dulu. Nanti saya kabari lagi.",
            time: "13:05",
            unread: 0,
            status: "Offline",
            messages: [
                { sender: "Akbar", text: "Halo, Mas. Mazda CX-5 yang tahun 2022 warna merah itu masih ada?", time: "11:50", type: "received", avatarText: "A" },
                { sender: "User", text: "Halo, Pak Akbar. Masih ada, Pak. Unitnya terawat sekali.", time: "11:52", type: "sent", avatarText: "U" },
                { sender: "Akbar", text: "Harga di iklan Rp 450 juta ya? Bisa kurang lagi nggak, Mas?", time: "11:53", type: "received", avatarText: "A" },
                { sender: "User", text: "Betul, Pak. Untuk harga segitu sudah paling bagus, Pak. Pajak panjang, servis record lengkap di Mazda.", time: "11:55", type: "sent", avatarText: "U" },
                { sender: "Akbar", text: "Hmm, kalau Rp 435 juta gimana? Saya serius nih.", time: "11:58", type: "received", avatarText: "A" },
                { sender: "User", text: "Waduh, belum dapet Pak kalau segitu. Paling saya bisa kasih di Rp 445 juta, itu sudah mentok, Pak. Bonus poles full body sebelum serah terima.", time: "12:00", type: "sent", avatarText: "U" },
                { sender: "Akbar", text: "Kilometernya berapa ya? Ada PR lain nggak mobilnya?", time: "12:02", type: "received", avatarText: "A"},
                { sender: "User", text: "KM baru 15 ribuan, Pak. Jarang pakai. PR nggak ada sama sekali, tinggal gas aja.", time: "12:03", type: "sent", avatarText: "U"},
                { sender: "Akbar", text: "Oke, saya pertimbangkan dulu. Nanti saya kabari lagi.", time: "13:05", type: "received", avatarText: "A" }
            ]
        },
        budi: {
            id: "budi",
            name: "Budi (Jasa Renovasi)",
            avatarText: "B",
            avatarColor: "10B981",
            lastMessage: "Baik, Bu. Terima kasih kembali.",
            time: "Senin",
            unread: 0,
            status: "Online",
            messages: [
                { sender: "User", text: "Selamat pagi, Pak Budi. Saya yang kemarin tanya soal renovasi dapur.", time: "09:15", type: "sent", avatarText: "U" },
                { sender: "Budi", text: "Oh iya, selamat pagi, Bu. Ada yang bisa saya bantu lebih lanjut?", time: "09:16", type: "received", avatarText: "B" },
                { sender: "User", text: "Saya sudah ukur dapurnya, Pak. Kira-kira luasnya 3x4 meter. Pengennya sih pakai konsep minimalis modern.", time: "09:18", type: "sent", avatarText: "U" },
                { sender: "Budi", text: "Baik, Bu. Untuk material kabinet dan top table ada preferensi tertentu? Misalnya HPL, duco, atau granit?", time: "09:20", type: "received", avatarText: "B" },
                { sender: "User", text: "Kalau top table pengennya granit yang hitam. Kabinet mungkin HPL saja biar lebih hemat. Warna putih atau abu muda bagus kayaknya.", time: "09:22", type: "sent", avatarText: "U" },
                { sender: "Budi", text: "Siap, Bu. Saya coba buatkan estimasi kasarnya dulu ya. Nanti sore atau besok pagi saya kirimkan via email atau WA.", time: "09:25", type: "received", avatarText: "B" },
                { sender: "User", text: "Oke, Pak. Ditunggu ya. Terima kasih banyak.", time: "09:26", type: "sent", avatarText: "U" },
                { sender: "Budi", text: "Baik, Bu. Terima kasih kembali.", time: "09:27", type: "received", avatarText: "B" }
            ]
        },
        siti: {
            id: "siti",
            name: "Siti (Pencari Kos)",
            avatarText: "S",
            avatarColor: "F59E0B",
            lastMessage: "Oke kak, makasih infonya!",
            time: "Minggu",
            unread: 1,
            status: "Offline",
            messages: [
                { sender: "Siti", text: "Permisi kak, mau tanya info kos yang di iklan deket kampus UGM itu masih ada kamar kosong?", time: "Sabtu", type: "received", avatarText: "S"},
                { sender: "User", text: "Halo, iya masih ada 1 kamar kosong di lantai 2.", time: "Sabtu", type: "sent", avatarText: "U"},
                { sender: "Siti", text: "Fasilitasnya apa aja ya kak? Terus harga per bulannya berapa?", time: "Sabtu", type: "received", avatarText: "S"},
                { sender: "User", text: "Fasilitas standar: kasur, lemari, meja belajar, kamar mandi dalam. Harga Rp 1.500.000/bulan sudah termasuk listrik dan air.", time: "Sabtu", type: "sent", avatarText: "U"},
                { sender: "Siti", text: "Ada foto kamarnya kak? Boleh minta?", time: "Minggu", type: "received", avatarText: "S"},
                { sender: "User", text: "Ini fotonya ya.", time: "Minggu", type: "sent", image: "assets/kos.png", avatarText: "U"},
                { sender: "Siti", text: "Oke kak, makasih infonya!", time: "Minggu", type: "received", avatarText: "S"}
            ]
        }
    };

    const isAuthenticated = () => sessionStorage.getItem('isLoggedIn') === 'true';
    const getUserIdentifier = () => sessionStorage.getItem('userIdentifier') || 'Pengguna OLX';
    const getUserAvatarText = () => (getUserIdentifier()?.charAt(0)?.toUpperCase() || 'U');

    function renderChatList(filter = "") {
        if (!chatListContainer) return;
        chatListContainer.innerHTML = '';
        const filteredChats = Object.values(allMockChats).filter(chat =>
            chat.name.toLowerCase().includes(filter.toLowerCase()) ||
            chat.messages.some(msg => msg.text.toLowerCase().includes(filter.toLowerCase()))
        );

        if (filteredChats.length === 0) {
            if (noChatsMessage) noChatsMessage.classList.remove('hidden');
        } else {
            if (noChatsMessage) noChatsMessage.classList.add('hidden');
            filteredChats.sort((a, b) => {
                 const timeA = getTimeSortValue(a.time);
                 const timeB = getTimeSortValue(b.time);
                 return timeB - timeA; 
            });

            filteredChats.forEach(chat => {
                const chatItemDiv = document.createElement('div');
                chatItemDiv.className = `chat-item p-3 flex items-center space-x-3 cursor-pointer hover:bg-gray-50 transition border-b border-gray-100 ${chat.id === currentChatId ? 'active' : ''}`;
                chatItemDiv.dataset.chatId = chat.id;

                const avatarColor = chat.avatarColor || '718096';
                chatItemDiv.innerHTML = `
                    <img src="https://placehold.co/40x40/${avatarColor}/FFFFFF?text=${chat.avatarText}&font=Inter" alt="${chat.name}" class="w-10 h-10 rounded-full flex-shrink-0">
                    <div class="flex-1 min-w-0">
                        <div class="flex justify-between items-center">
                            <h3 class="text-sm font-semibold text-text-primary truncate" title="${chat.name}">${chat.name}</h3>
                            <span class="text-xs text-text-muted flex-shrink-0 ml-2">${chat.time}</span>
                        </div>
                        <div class="flex justify-between items-center mt-0.5">
                            <p class="text-xs text-text-secondary truncate">${chat.lastMessage}</p>
                            ${chat.unread > 0 ? `<span class="unread-badge bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full flex-shrink-0 ml-2">${chat.unread}</span>` : ''}
                        </div>
                    </div>
                `;
                chatItemDiv.addEventListener('click', () => selectChat(chat.id));
                chatListContainer.appendChild(chatItemDiv);
            });
        }
    }
    function getTimeSortValue(timeStr) {
        if (timeStr.includes(':')) return 2; 
        if (timeStr.toLowerCase() === 'kemarin') return 1;
        return 0; 
    }


    function renderMessages(chatId) {
        if (!messagesArea || !allMockChats[chatId]) {
            if (selectChatMessageInfo) selectChatMessageInfo.classList.remove('hidden');
            if (messagesArea) messagesArea.innerHTML = '';
            if (noChatSelectedPlaceholder) noChatSelectedPlaceholder.classList.remove('hidden', 'md:flex');
            return;
        }

        if (selectChatMessageInfo) selectChatMessageInfo.classList.add('hidden');
        if (noChatSelectedPlaceholder) noChatSelectedPlaceholder.classList.add('hidden');
        if (noChatSelectedPlaceholder) noChatSelectedPlaceholder.classList.remove('md:flex');

        messagesArea.innerHTML = '';
        const chat = allMockChats[chatId];
        chat.messages.forEach(msg => displayMessage(msg, chat.avatarColor));
        scrollToBottomMessages();
    }

    function displayMessage(message, contactAvatarColor = '6366F1') {
        if (!messagesArea) return;

        const messageWrapper = document.createElement('div');
        messageWrapper.classList.add('flex', 'items-end', 'max-w-xs', 'sm:max-w-md', 'md:max-w-lg', 'new-message-animate');

        const bubbleDiv = document.createElement('div');
        bubbleDiv.classList.add('p-3', 'rounded-lg', 'shadow', 'message-bubble');

        const textP = document.createElement('p');
        textP.classList.add('text-sm', 'text-gray-800');
        textP.textContent = message.text;
        bubbleDiv.appendChild(textP);

        if (message.image) {
            const img = document.createElement('img');
            img.src = message.image;
            img.alt = "Gambar terlampir";
            img.classList.add('rounded-md', 'max-w-full', 'h-auto', 'mt-2', 'cursor-pointer');
            img.addEventListener('click', () => {
                const modalId = 'imageZoomModal';
                let modal = document.getElementById(modalId);
                if (modal) modal.remove();

                modal = document.createElement('div');
                modal.id = modalId;
                modal.style.position = 'fixed';
                modal.style.left = '0';
                modal.style.top = '0';
                modal.style.width = '100%';
                modal.style.height = '100%';
                modal.style.backgroundColor = 'rgba(0,0,0,0.85)';
                modal.style.display = 'flex';
                modal.style.justifyContent = 'center';
                modal.style.alignItems = 'center';
                modal.style.zIndex = '1000'; 
                modal.style.cursor = 'pointer';
                modal.onclick = () => modal.remove();

                const modalImg = document.createElement('img');
                modalImg.src = message.image;
                modalImg.style.maxWidth = '90vw';
                modalImg.style.maxHeight = '90vh';
                modalImg.style.borderRadius = '8px';
                modalImg.style.objectFit = 'contain';
                modal.appendChild(modalImg);
                document.body.appendChild(modal);
            });
            bubbleDiv.appendChild(img);
        }

        const timeSpan = document.createElement('span');
        timeSpan.classList.add('text-xs', 'text-gray-500', 'block', 'text-right', 'mt-1.5');
        timeSpan.textContent = message.time;
        bubbleDiv.appendChild(timeSpan);

        const avatarImg = document.createElement('img');
        avatarImg.classList.add('w-7', 'h-7', 'rounded-full', 'mb-1', 'flex-shrink-0');
        const userAvatarColor = 'FF7E00';

        if (message.type === 'sent') {
            messageWrapper.classList.add('justify-end', 'ml-auto');
            bubbleDiv.classList.add('rounded-br-none', 'bg-message-sent-bg');
            avatarImg.src = `https://placehold.co/28x28/${userAvatarColor}/FFFFFF?text=${getUserAvatarText()}&font=Inter`;
            avatarImg.alt = "User";
            messageWrapper.appendChild(bubbleDiv);
            messageWrapper.appendChild(avatarImg);
            avatarImg.classList.add('ml-2');
        } else {
            messageWrapper.classList.add('mr-auto');
            bubbleDiv.classList.add('rounded-bl-none', 'bg-message-received-bg');
            const senderAvatarText = message.avatarText || allMockChats[currentChatId]?.avatarText || '?';
            const senderAvatarColor = allMockChats[currentChatId]?.avatarColor || contactAvatarColor;
            avatarImg.src = `https://placehold.co/28x28/${senderAvatarColor}/FFFFFF?text=${senderAvatarText}&font=Inter`;
            avatarImg.alt = message.sender;
            messageWrapper.appendChild(avatarImg);
            messageWrapper.appendChild(bubbleDiv);
            avatarImg.classList.add('mr-2');
        }
        messagesArea.appendChild(messageWrapper);
    }

    function scrollToBottomMessages() {
        if (messagesArea) {
            messagesArea.scrollTop = messagesArea.scrollHeight;
        }
    }

    function updateChatHeader(chatId) {
        if (!allMockChats[chatId] || !chattingWithName || !chattingWithStatus || !chattingWithAvatarHeader) return;
        const chat = allMockChats[chatId];
        chattingWithName.textContent = chat.name;
        chattingWithStatus.textContent = chat.status;
        chattingWithStatus.className = `text-xs ${chat.status === 'Online' ? 'text-green-500' : 'text-text-muted'}`;
        const avatarColor = chat.avatarColor || '718096';
        chattingWithAvatarHeader.src = `https://placehold.co/36x36/${avatarColor}/FFFFFF?text=${chat.avatarText}&font=Inter`;
        chattingWithAvatarHeader.alt = chat.name;
    }

    function selectChat(chatId) {
        if (currentChatId === chatId && mainChatArea && !mainChatArea.classList.contains('hidden')) return;

        currentChatId = chatId;
        renderMessages(chatId);
        updateChatHeader(chatId);
        renderChatList(searchChatInput ? searchChatInput.value : "");

        const activeChatItemInList = chatListContainer.querySelector(`.chat-item[data-chat-id="${chatId}"] .unread-badge`);
        if (activeChatItemInList) {
            activeChatItemInList.remove();
            allMockChats[chatId].unread = 0;
        }

        if (mainChatArea) mainChatArea.classList.remove('hidden', 'md:flex');
        if (mainChatArea) mainChatArea.classList.add('flex');
        if (chatListSection && window.innerWidth < 768) {
            chatListSection.classList.add('hidden-on-mobile-when-chat-active');
            chatListSection.classList.add('hidden');
        }
        if (noChatSelectedPlaceholder) noChatSelectedPlaceholder.classList.add('hidden');
        if (noChatSelectedPlaceholder) noChatSelectedPlaceholder.classList.remove('md:flex');

        if(messageInput) messageInput.focus();
    }

    function updateHeaderProfileUI() {
        if (!profileDropdownHeader || !profileImageHeader) return;
        profileDropdownHeader.innerHTML = '';

        if (isAuthenticated()) {
            const userEmail = getUserIdentifier();
            const initial = getUserAvatarText();
            profileImageHeader.src = `https://placehold.co/32x32/00A5EC/FFFFFF?text=${initial}&font=Inter&bold=true`;
            profileImageHeader.alt = `Profil ${userEmail}`;

            profileDropdownHeader.innerHTML = `
                <div class="px-4 py-3">
                    <p class="text-sm font-medium text-text-primary truncate" title="${userEmail}">${userEmail}</p>
                </div>
                <hr class="border-border-default">
                <a href="profile.html" class="block px-4 py-2 text-sm text-text-primary hover:bg-gray-100 transition">Profil Saya</a>
                <button id="logoutButtonHeader" class="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition">Keluar</button>
            `;
            const logoutButton = document.getElementById('logoutButtonHeader');
            if (logoutButton) {
                logoutButton.addEventListener('click', () => {
                    sessionStorage.removeItem('isLoggedIn');
                    sessionStorage.removeItem('userIdentifier');
                    updateHeaderProfileUI();
                    if(profileDropdownHeader) profileDropdownHeader.classList.add('hidden');
                    window.location.href = 'login.html';
                });
            }
        } else {
            profileImageHeader.src = 'https://placehold.co/32x32/D1D5DB/4B5563?text=G&font=Inter&bold=true';
            profileImageHeader.alt = 'Masuk atau Daftar';
            profileDropdownHeader.innerHTML = `
                <div class="p-4 text-center">
                    <a href="login.html" class="w-full inline-block bg-olx-blue text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-700 transition">Masuk / Daftar</a>
                </div>
            `;
        }
    }

    if (profileButtonHeader) {
        profileButtonHeader.addEventListener('click', (event) => {
            event.stopPropagation();
            updateHeaderProfileUI();
            profileDropdownHeader.classList.toggle('hidden');
            profileButtonHeader.setAttribute('aria-expanded', !profileDropdownHeader.classList.contains('hidden'));
        });
    }

    if (sidebarItems.length > 0) {
        sidebarItems.forEach(item => {
            item.addEventListener('click', function(e) {
                if (this.href && this.href !== '#' && !this.href.startsWith('javascript:')) {
                    if (new URL(this.href).pathname !== window.location.pathname) {
                        return;
                    }
                }
                e.preventDefault();
                sidebarItems.forEach(i => i.classList.remove('active', 'bg-chat-list-active-bg', 'text-olx-blue'));
                this.classList.add('active', 'bg-chat-list-active-bg', 'text-olx-blue');
                console.log("Sidebar item clicked:", this.getAttribute('aria-label') || this.textContent.trim());
            });
        });
    }

    if (searchChatInput) {
        searchChatInput.addEventListener('input', (e) => {
            renderChatList(e.target.value);
        });
    }

    if (backToChatListButton && chatListSection && mainChatArea) {
        backToChatListButton.addEventListener('click', () => {
            mainChatArea.classList.add('hidden');
            mainChatArea.classList.remove('flex');
            chatListSection.classList.remove('hidden', 'hidden-on-mobile-when-chat-active');
            currentChatId = null;
            if (noChatSelectedPlaceholder && window.innerWidth >= 768) {
                noChatSelectedPlaceholder.classList.remove('hidden');
                noChatSelectedPlaceholder.classList.add('md:flex');
                 if(selectChatMessageInfo) selectChatMessageInfo.classList.remove('hidden');
                 if(messagesArea) messagesArea.innerHTML = '';
                 if(chattingWithName) chattingWithName.textContent = "Pilih Percakapan";
                 if(chattingWithStatus) chattingWithStatus.textContent = "";
                 if(chattingWithAvatarHeader) chattingWithAvatarHeader.src = "https://placehold.co/36x36/CBD5E0/FFFFFF?text=?&font=Inter";
            } else if (window.innerWidth < 768) {
                if(selectChatMessageInfo) selectChatMessageInfo.classList.remove('hidden');
                if(messagesArea) messagesArea.innerHTML = '';
            }
        });
    }

    if (chatOptionsButton && chatOptionsDropdown) {
        chatOptionsButton.addEventListener('click', (event) => {
            event.stopPropagation();
            if (!currentChatId) {
                alert("Pilih percakapan terlebih dahulu untuk melihat opsi.");
                return;
            }
            chatOptionsDropdown.classList.toggle('hidden');
            chatOptionsButton.setAttribute('aria-expanded', !chatOptionsDropdown.classList.contains('hidden'));
        });
        document.getElementById('viewProfileChatOption')?.addEventListener('click', (e) => { e.preventDefault(); if(currentChatId && allMockChats[currentChatId]) alert(`Lihat profil: ${allMockChats[currentChatId].name}`); chatOptionsDropdown.classList.add('hidden');});
        document.getElementById('blockUserChatOption')?.addEventListener('click', (e) => { e.preventDefault(); if(currentChatId && allMockChats[currentChatId]) alert(`Blokir: ${allMockChats[currentChatId].name}`); chatOptionsDropdown.classList.add('hidden');});
        document.getElementById('clearChatOption')?.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentChatId && allMockChats[currentChatId] && confirm(`Anda yakin ingin menghapus semua pesan dengan ${allMockChats[currentChatId].name}?`)) {
                allMockChats[currentChatId].messages = [];
                allMockChats[currentChatId].lastMessage = "Percakapan dihapus";
                renderMessages(currentChatId);
                renderChatList(searchChatInput ? searchChatInput.value : "");
                alert(`Percakapan dengan ${allMockChats[currentChatId].name} dihapus.`);
            }
            chatOptionsDropdown.classList.add('hidden');
        });
    }

    function handleSendMessage() {
        if (!messageInput) return;
        const text = messageInput.value.trim();
        if (!currentChatId) {
            if (inputError) inputError.textContent = 'Pilih chat terlebih dahulu untuk mengirim pesan.';
            setTimeout(() => { if (inputError) inputError.textContent = ''; }, 2500);
            return;
        }
        if (text === '') {
            if (inputError) inputError.textContent = 'Pesan tidak boleh kosong.';
            setTimeout(() => { if (inputError) inputError.textContent = ''; }, 2500);
            return;
        }

        const newMessage = {
            sender: "User",
            text: text,
            time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
            type: "sent",
            avatarText: getUserAvatarText()
        };

        if (allMockChats[currentChatId]) {
            allMockChats[currentChatId].messages.push(newMessage);
            allMockChats[currentChatId].lastMessage = text;
            allMockChats[currentChatId].time = newMessage.time;
            allMockChats[currentChatId].unread = 0;
        }


        displayMessage(newMessage, allMockChats[currentChatId]?.avatarColor);
        renderChatList(searchChatInput ? searchChatInput.value : "");
        messageInput.value = '';
        if (inputError) inputError.textContent = '';
        scrollToBottomMessages();
        messageInput.focus();
    }

    if (sendMessageButton) {
        sendMessageButton.addEventListener('click', handleSendMessage);
    }
    if (messageInput) {
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
            }
        });
    }

    if (attachmentButton) {
        attachmentButton.addEventListener('click', () => {
            if (!currentChatId) {
                 if (inputError) inputError.textContent = 'Pilih chat terlebih dahulu.';
                 setTimeout(() => { if (inputError) inputError.textContent = ''; }, 2500);
                return;
            }
            alert('Fitur lampiran akan segera hadir!');
        });
    }

    document.addEventListener('click', (event) => {
        if (profileDropdownHeader && !profileDropdownHeader.classList.contains('hidden') &&
            profileButtonHeader && !profileButtonHeader.contains(event.target) &&
            !profileDropdownHeader.contains(event.target)) {
            profileDropdownHeader.classList.add('hidden');
            if(profileButtonHeader) profileButtonHeader.setAttribute('aria-expanded', 'false');
        }
        if (chatOptionsDropdown && !chatOptionsDropdown.classList.contains('hidden') &&
            chatOptionsButton && !chatOptionsButton.contains(event.target) &&
            !chatOptionsDropdown.contains(event.target)) {
            chatOptionsDropdown.classList.add('hidden');
            if(chatOptionsButton) chatOptionsButton.setAttribute('aria-expanded', 'false');
        }
    });

    function initializeChatPage() {
        if (!isAuthenticated()) {
            console.warn("Pengguna belum masuk. Beberapa fitur mungkin terbatas.");
        }
        updateHeaderProfileUI();
        renderChatList();

        if (window.innerWidth < 768) {
            if (mainChatArea) mainChatArea.classList.add('hidden');
            if (mainChatArea) mainChatArea.classList.remove('flex');
            if (noChatSelectedPlaceholder) noChatSelectedPlaceholder.classList.add('hidden');
            if (noChatSelectedPlaceholder) noChatSelectedPlaceholder.classList.remove('md:flex');
            if (selectChatMessageInfo && Object.keys(allMockChats).length > 0) {
                selectChatMessageInfo.classList.add('hidden');
            } else if (selectChatMessageInfo && Object.keys(allMockChats).length === 0) {
                selectChatMessageInfo.classList.remove('hidden');
            }
        } else { 
            if (mainChatArea) mainChatArea.classList.add('hidden');
            if (mainChatArea) mainChatArea.classList.remove('flex');
            if (noChatSelectedPlaceholder) noChatSelectedPlaceholder.classList.remove('hidden');
            if (noChatSelectedPlaceholder) noChatSelectedPlaceholder.classList.add('md:flex');
            if (selectChatMessageInfo) selectChatMessageInfo.classList.add('hidden');
        }

        const urlParams = new URLSearchParams(window.location.search);
        const initialChatId = urlParams.get('chat_id');
        if (initialChatId && allMockChats[initialChatId]) {
            selectChat(initialChatId);
        }
        console.log('Chat page (V3 - Percakapan Lebih Lengkap) scripts loaded.');
    }

    initializeChatPage();
});
