// jual.js - V3.4 (Perbaikan clearError dan Unggah File)
document.addEventListener('DOMContentLoaded', () => {
    // --- Selektor Elemen Utama ---
    const formJual = document.getElementById('formJual');
    const stepIndicatorContainer = document.getElementById('stepIndicatorContainer');
    const formSteps = document.querySelectorAll('.form-step');
    const prevStepButton = document.getElementById('prevStepButton');
    const nextStepButton = document.getElementById('nextStepButton');
    const submitAdButton = document.getElementById('submitAdButton');
    const formSubmissionStatus = document.getElementById('formSubmissionStatus');

    // Langkah 1
    const mainCategorySelect = document.getElementById('mainCategory');
    const subCategorySelect = document.getElementById('subCategory');

    // Langkah 2
    const judulIklanInput = document.getElementById('judulIklan');
    const deskripsiIklanTextarea = document.getElementById('deskripsiIklan');
    const hargaIklanInput = document.getElementById('hargaIklan');
    const negoHargaCheckbox = document.getElementById('negoHarga');
    const fotoIklanInput = document.getElementById('fotoIklan');
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');
    const dropZone = document.getElementById('dropZone');

    // Langkah 3
    const namaPenjualInput = document.getElementById('namaPenjual');
    const nomorTeleponInput = document.getElementById('nomorTelepon');
    const lokasiIklanInput = document.getElementById('lokasiIklan');
    const alamatLengkapTextarea = document.getElementById('alamatLengkap');

    // Langkah 4
    const reviewContainer = document.getElementById('reviewContainer');
    const termsAgreementCheckbox = document.getElementById('termsAgreement');

    // Header
    const profileButtonHeader = document.getElementById('profileButtonHeader');
    const profileDropdownHeader = document.getElementById('profileDropdownHeader');
    const profileImageHeader = document.getElementById('profileImageHeader');
    const chatButtonHeader = document.getElementById('chatButtonHeader');

    // --- State Formulir ---
    let currentStep = 0;
    const totalSteps = formSteps.length > 0 ? formSteps.length : 4;
    let uploadedFiles = [];
    const MAX_IMAGES = 5;
    const MAX_FILE_SIZE_MB = 5;

    const subCategoriesData = {
        mobil: ["Mobil Bekas", "Aksesoris Mobil", "Audio Mobil", "Velg dan Ban", "Sparepart Mobil"],
        motor: ["Motor Bekas", "Helm", "Aksesoris Motor", "Sparepart Motor", "Apparel Riding"],
        properti: ["Rumah Dijual", "Apartemen Dijual", "Tanah Dijual", "Sewa Rumah", "Sewa Apartemen", "Indekos", "Ruko & Komersial"],
        elektronik: ["Handphone", "Tablet", "Laptop", "Komputer PC", "Kamera Digital", "TV & Audio", "Peralatan Elektronik Lain"],
        fashion: ["Pakaian Pria", "Pakaian Wanita", "Sepatu", "Tas", "Jam Tangan", "Aksesoris Fashion"],
        hobi: ["Alat Musik", "Olahraga & Outdoor", "Mainan & Hobi", "Barang Antik & Koleksi", "Buku & Majalah"],
        'rumah-tangga': ["Perabotan Rumah", "Dekorasi", "Peralatan Masak & Makan", "Lampu & Pencahayaan", "Perlengkapan Kebersihan"],
        jasa: ["Jasa Profesional", "Lowongan Kerja", "Jasa Servis & Perbaikan", "Jasa Pendidikan & Kursus"],
        lainnya: ["Lain-lain"]
    };

    const isAuthenticated = () => sessionStorage.getItem('isLoggedIn') === 'true';
    const getUserData = () => {
        try {
            const data = sessionStorage.getItem('userProfileData');
            return data ? JSON.parse(data) : {};
        } catch (e) { console.error("Error parsing userProfileData:", e); return {}; }
    };

    function createStepIndicators() {
        if (!stepIndicatorContainer) { console.warn("stepIndicatorContainer tidak ditemukan."); return; }
        stepIndicatorContainer.innerHTML = '';
        for (let i = 0; i < totalSteps; i++) {
            const stepDiv = document.createElement('div');
            stepDiv.className = 'step-indicator inactive';
            stepDiv.textContent = i + 1;
            stepDiv.setAttribute('role', 'tab');
            stepDiv.setAttribute('aria-selected', 'false');
            stepDiv.setAttribute('aria-label', `Langkah ${i + 1}`);
            stepIndicatorContainer.appendChild(stepDiv);
            if (i < totalSteps - 1) {
                const lineDiv = document.createElement('div');
                lineDiv.className = 'step-line inactive';
                lineDiv.setAttribute('aria-hidden', 'true');
                stepIndicatorContainer.appendChild(lineDiv);
            }
        }
        updateStepIndicator();
    }

    function updateStepIndicator() {
        if (!stepIndicatorContainer) return;
        const indicators = stepIndicatorContainer.querySelectorAll('.step-indicator');
        const lines = stepIndicatorContainer.querySelectorAll('.step-line');
        indicators.forEach((indicator, index) => {
            indicator.classList.remove('active', 'completed', 'inactive');
            indicator.setAttribute('aria-selected', 'false');
            if (index < currentStep) {
                indicator.classList.add('completed');
                indicator.innerHTML = '&#10003;';
            } else if (index === currentStep) {
                indicator.classList.add('active');
                indicator.textContent = index + 1;
                indicator.setAttribute('aria-selected', 'true');
            } else {
                indicator.classList.add('inactive');
                indicator.textContent = index + 1;
            }
        });
        lines.forEach((line, index) => {
            line.classList.remove('active', 'inactive');
            line.classList.add(index < currentStep ? 'active' : 'inactive');
        });
    }

    function showStep(stepIndex) {
        if (formSteps.length === 0) { console.error("Elemen .form-step tidak ditemukan."); return; }
        formSteps.forEach((step, index) => {
            step.classList.toggle('active-step', index === stepIndex);
        });
        currentStep = stepIndex;
        updateStepIndicator();
        updateNavigationButtons();
        const currentStepElement = formSteps[currentStep];
        if (currentStepElement) {
            const firstInput = currentStepElement.querySelector('input:not([type="hidden"]):not([type="file"]), select, textarea');
            if (firstInput) firstInput.focus();
        }
    }

    function updateNavigationButtons() {
        if (prevStepButton) prevStepButton.classList.toggle('hidden', currentStep === 0);
        if (nextStepButton) nextStepButton.classList.toggle('hidden', currentStep === totalSteps - 1);
        if (submitAdButton) submitAdButton.classList.toggle('hidden', currentStep !== totalSteps - 1);
    }

    // --- Fungsi Error Handling ---
    function displayError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.setAttribute('role', 'alert');
        } else {
            console.warn(`[displayError] Elemen error dengan ID "${elementId}" tidak ditemukan.`);
        }
    }

    // PENAMBAHAN FUNGSI clearError
    function clearError(elementId) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.removeAttribute('role');
        }
        // Juga hapus border error dari input terkait jika ada
        const inputElement = document.getElementById(elementId.replace('Error', '')); // Asumsi ID input adalah ID error tanpa 'Error'
        if (inputElement) {
            inputElement.classList.remove('error-border');
        }
    }

    function clearAllErrors() {
        document.querySelectorAll('.error-message').forEach(el => { el.textContent = ''; el.removeAttribute('role'); });
        document.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(el => el.classList.remove('error-border'));
    }
    // --- Akhir Fungsi Error Handling ---


    function validateStep(stepIndex) {
        clearAllErrors(); // Bersihkan semua error sebelum validasi baru
        let isValid = true;
        console.log(`[validateStep] Memvalidasi langkah: ${stepIndex}`);
        switch (stepIndex) {
            case 0:
                if (!mainCategorySelect || !mainCategorySelect.value) {
                    displayError('mainCategoryError', 'Kategori utama wajib dipilih.');
                    mainCategorySelect?.classList.add('error-border'); isValid = false;
                }
                if (subCategorySelect && !subCategorySelect.disabled && !subCategorySelect.value) {
                    displayError('subCategoryError', 'Sub-kategori wajib dipilih.');
                    subCategorySelect.classList.add('error-border'); isValid = false;
                }
                break;
            case 1:
                if (!judulIklanInput || !judulIklanInput.value.trim()) {
                    displayError('judulIklanError', 'Judul iklan wajib diisi.');
                    judulIklanInput?.classList.add('error-border'); isValid = false;
                } else if (judulIklanInput.value.trim().length < 10) {
                    displayError('judulIklanError', 'Judul iklan minimal 10 karakter.');
                    judulIklanInput?.classList.add('error-border'); isValid = false;
                }
                if (!deskripsiIklanTextarea || !deskripsiIklanTextarea.value.trim()) {
                    displayError('deskripsiIklanError', 'Deskripsi iklan wajib diisi.');
                    deskripsiIklanTextarea?.classList.add('error-border'); isValid = false;
                } else if (deskripsiIklanTextarea.value.trim().length < 20) {
                    displayError('deskripsiIklanError', 'Deskripsi iklan minimal 20 karakter.');
                    deskripsiIklanTextarea?.classList.add('error-border'); isValid = false;
                }
                if (!hargaIklanInput || !hargaIklanInput.value || parseFloat(hargaIklanInput.value) <= 0) {
                    displayError('hargaIklanError', 'Harga wajib diisi dan harus lebih dari 0.');
                    hargaIklanInput?.classList.add('error-border'); isValid = false;
                }
                console.log(`[validateStep] Jumlah file diunggah untuk validasi: ${uploadedFiles.length}`);
                if (uploadedFiles.length === 0) {
                    displayError('fotoIklanError', 'Minimal unggah 1 foto.'); isValid = false;
                }
                break;
            case 2:
                if (!namaPenjualInput || !namaPenjualInput.value.trim()) {
                    displayError('namaPenjualError', 'Nama penjual wajib diisi.');
                    namaPenjualInput?.classList.add('error-border'); isValid = false;
                }
                const phoneRegex = /^(^\+62|62|^08)(\d{3,4}-?){2}\d{3,4}$/;
                if (!nomorTeleponInput || !nomorTeleponInput.value.trim()) {
                    displayError('nomorTeleponError', 'Nomor telepon wajib diisi.');
                    nomorTeleponInput?.classList.add('error-border'); isValid = false;
                } else if (!phoneRegex.test(nomorTeleponInput.value.trim())) {
                    displayError('nomorTeleponError', 'Format nomor telepon tidak valid (contoh: 08123456789 atau +628123456789).');
                    nomorTeleponInput?.classList.add('error-border'); isValid = false;
                }
                if (!lokasiIklanInput || !lokasiIklanInput.value.trim()) {
                    displayError('lokasiIklanError', 'Lokasi iklan wajib diisi.');
                    lokasiIklanInput?.classList.add('error-border'); isValid = false;
                }
                break;
            case 3:
                if (!termsAgreementCheckbox || !termsAgreementCheckbox.checked) {
                    displayError('termsAgreementError', 'Anda harus menyetujui Syarat & Ketentuan.'); isValid = false;
                }
                break;
        }
        console.log(`[validateStep] Hasil validasi langkah ${stepIndex}: ${isValid}`);
        return isValid;
    }


    if (mainCategorySelect && subCategorySelect) {
        mainCategorySelect.addEventListener('change', function() {
            const selectedCategory = this.value;
            subCategorySelect.innerHTML = '<option value="">-- Pilih Sub-Kategori --</option>';
            if (selectedCategory && subCategoriesData[selectedCategory]) {
                subCategoriesData[selectedCategory].forEach(subCat => {
                    const option = document.createElement('option');
                    option.value = subCat.toLowerCase().replace(/\s+/g, '-');
                    option.textContent = subCat;
                    subCategorySelect.appendChild(option);
                });
                subCategorySelect.disabled = false;
            } else {
                subCategorySelect.disabled = true;
            }
            if (mainCategorySelect.value) {
                clearError('mainCategoryError'); // Gunakan fungsi clearError yang baru
                mainCategorySelect.classList.remove('error-border');
            }
        });
        subCategorySelect.addEventListener('change', function() {
            if (subCategorySelect.value) {
                clearError('subCategoryError'); // Gunakan fungsi clearError yang baru
                subCategorySelect.classList.remove('error-border');
            }
        });
    }

    function handleFiles(filesToProcess) {
        console.log(`[handleFiles] Dipanggil. Jumlah file diterima: ${filesToProcess ? filesToProcess.length : 'undefined'}. Jumlah file sudah diunggah: ${uploadedFiles.length}`);
        if (!filesToProcess || filesToProcess.length === 0) {
            console.log("[handleFiles] Tidak ada file untuk diproses.");
            if (fotoIklanInput) fotoIklanInput.value = "";
            return;
        }
        clearError('fotoIklanError'); // Panggilan ini sekarang seharusnya berfungsi

        const filesArray = Array.from(filesToProcess);
        let filesSuccessfullyAddedThisTurn = 0;

        for (let i = 0; i < filesArray.length; i++) {
            const file = filesArray[i];
            console.log(`[handleFiles] Memproses file ke-${i + 1}/${filesArray.length}: ${file.name}, Tipe: ${file.type}, Ukuran: ${file.size}`);

            if (uploadedFiles.length >= MAX_IMAGES) {
                displayError('fotoIklanError', `Batas maksimal ${MAX_IMAGES} foto telah tercapai. File "${file.name}" dan selanjutnya tidak ditambahkan.`);
                console.log(`[handleFiles] Batas ${MAX_IMAGES} foto tercapai. Menghentikan pemrosesan file selanjutnya.`);
                break;
            }

            if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
                displayError('fotoIklanError', `File "${file.name}" terlalu besar (maks ${MAX_FILE_SIZE_MB}MB).`);
                continue;
            }
            if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
                displayError('fotoIklanError', `File "${file.name}" (${file.type}) bukan format gambar yang didukung (PNG, JPG, WEBP).`);
                continue;
            }

            const reader = new FileReader();
            console.log(`[handleFiles] Membuat FileReader untuk: ${file.name}`);

            reader.onload = (e) => {
                console.log(`[handleFiles] FileReader.onload untuk: ${file.name}. Hasil: ${e.target.result ? 'Ada data URL' : 'Tidak ada data URL'}`);
                if (uploadedFiles.length < MAX_IMAGES) {
                    const fileId = `img-${Date.now()}-${uploadedFiles.length}`;
                    uploadedFiles.push({ file: file, previewUrl: e.target.result, id: fileId });
                    filesSuccessfullyAddedThisTurn++;
                    console.log(`[handleFiles] File "${file.name}" BERHASIL ditambahkan ke uploadedFiles. Total sekarang: ${uploadedFiles.length}`);
                    renderImagePreviews();
                } else {
                     console.warn(`[handleFiles] Batas maksimal gambar tercapai di dalam reader.onload untuk ${file.name}. Tidak ditambahkan.`);
                }
            };
            reader.onerror = (errorEvent) => {
                console.error(`[handleFiles] FileReader.onerror untuk "${file.name}":`, errorEvent.target.error);
                displayError('fotoIklanError', `Gagal membaca file "${file.name}". Pastikan file tidak rusak.`);
            };
            
            try {
                console.log(`[handleFiles] Memulai reader.readAsDataURL untuk: ${file.name}`);
                reader.readAsDataURL(file);
            } catch (readError) {
                console.error(`[handleFiles] Error saat memanggil readAsDataURL untuk "${file.name}":`, readError);
                displayError('fotoIklanError', `Terjadi kesalahan saat memproses file "${file.name}".`);
            }
        }

        if (fotoIklanInput) {
            fotoIklanInput.value = "";
            console.log("[handleFiles] Input file direset setelah memproses batch.");
        }
        console.log(`[handleFiles] Selesai memproses batch. ${filesSuccessfullyAddedThisTurn} file berhasil ditambahkan. Total diunggah sekarang: ${uploadedFiles.length}`);
    }


    if (fotoIklanInput) {
        fotoIklanInput.addEventListener('change', (event) => {
            console.log("[fotoIklanInput] Event 'change' terdeteksi.");
            if (event.target.files && event.target.files.length > 0) {
                handleFiles(event.target.files);
            } else {
                console.log("[fotoIklanInput] Tidak ada file yang dipilih.");
            }
        });
    }

    if (dropZone) {
        dropZone.addEventListener('dragover', (event) => {
            event.preventDefault();
            dropZone.classList.add('dragover');
        });
        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('dragover');
        });
        dropZone.addEventListener('drop', (event) => {
            event.preventDefault();
            dropZone.classList.remove('dragover');
            console.log("[dropZone] Event 'drop' terdeteksi.");
            if (event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length > 0) {
                handleFiles(event.dataTransfer.files);
            } else {
                 console.log("[dropZone] Tidak ada file yang di-drop.");
            }
        });
    }

    function renderImagePreviews() {
        if (!imagePreviewContainer) { console.warn("[renderImagePreviews] imagePreviewContainer tidak ditemukan."); return; }
        imagePreviewContainer.innerHTML = '';
        console.log(`[renderImagePreviews] Merender ${uploadedFiles.length} preview gambar.`);
        uploadedFiles.forEach((fileData, index) => {
            const previewItem = document.createElement('div');
            previewItem.className = 'image-preview-item group';
            previewItem.innerHTML = `
                <img src="${fileData.previewUrl}" alt="Preview ${index + 1}" class="w-full h-full object-cover">
                <button type="button" class="remove-image-button opacity-0 group-hover:opacity-100 transition-opacity" data-file-id="${fileData.id}" title="Hapus gambar">&times;</button>
            `;
            imagePreviewContainer.appendChild(previewItem);
        });

        imagePreviewContainer.querySelectorAll('.remove-image-button').forEach(button => {
            button.addEventListener('click', function() {
                const fileIdToRemove = this.dataset.fileId;
                console.log(`[renderImagePreviews] Mencoba menghapus file dengan ID: ${fileIdToRemove}`);
                uploadedFiles = uploadedFiles.filter(f => f.id !== fileIdToRemove);
                console.log(`[renderImagePreviews] File setelah dihapus: ${uploadedFiles.length}`);
                renderImagePreviews();
                // Jika setelah dihapus, jumlah foto menjadi valid (lebih dari 0), hapus pesan error foto
                if (uploadedFiles.length > 0 && uploadedFiles.length <= MAX_IMAGES) {
                    clearError('fotoIklanError');
                } else if (uploadedFiles.length === 0 && currentStep === 1) {
                    // Jika tidak ada foto tersisa dan masih di langkah 2, validasi berikutnya akan menampilkan error
                }
            });
        });
    }

    function populateReview() {
        if (!reviewContainer) return;
        const hargaValue = hargaIklanInput ? hargaIklanInput.value : '';
        const formattedPrice = hargaValue ?
            new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(parseFloat(hargaValue)) :
            'Belum diisi';
        const mainCatText = mainCategorySelect && mainCategorySelect.options[mainCategorySelect.selectedIndex] ? mainCategorySelect.options[mainCategorySelect.selectedIndex].text : 'N/A';
        const subCatText = subCategorySelect && subCategorySelect.options[subCategorySelect.selectedIndex] ? subCategorySelect.options[subCategorySelect.selectedIndex].text : 'N/A';

        reviewContainer.innerHTML = `
            <h3 class="text-lg font-medium text-brand-dark border-b pb-2 mb-3">Ringkasan Iklan Anda</h3>
            <p><strong>Kategori:</strong> ${mainCatText} > ${subCatText}</p>
            <p><strong>Judul:</strong> ${judulIklanInput?.value || 'N/A'}</p>
            <p><strong>Deskripsi:</strong></p>
            <p class="text-sm bg-white p-2 border rounded-md whitespace-pre-wrap break-words">${deskripsiIklanTextarea?.value || 'N/A'}</p>
            <p><strong>Harga:</strong> ${formattedPrice} ${negoHargaCheckbox?.checked ? '(Bisa Nego)' : ''}</p>
            <p><strong>Nama Penjual:</strong> ${namaPenjualInput?.value || 'N/A'}</p>
            <p><strong>Nomor Telepon:</strong> ${nomorTeleponInput?.value || 'N/A'}</p>
            <p><strong>Lokasi:</strong> ${lokasiIklanInput?.value || 'N/A'}</p>
            ${alamatLengkapTextarea?.value ? `<p><strong>Alamat Lengkap:</strong> ${alamatLengkapTextarea.value}</p>` : ''}
            <p><strong>Foto (${uploadedFiles.length}):</strong></p>
            <div id="reviewImageList" class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 mt-1">
                ${uploadedFiles.map(f => `<img src="${f.previewUrl}" alt="Review foto" class="w-full h-16 object-cover rounded-md border">`).join('') || '<p class="text-text-muted text-xs col-span-full">Tidak ada foto.</p>'}
            </div>
        `;
    }

    if (nextStepButton) {
        nextStepButton.addEventListener('click', () => {
            console.log(`[Navigasi] Tombol "Berikutnya" diklik pada langkah ${currentStep}`);
            if (validateStep(currentStep)) {
                console.log(`[Navigasi] Langkah ${currentStep} valid.`);
                if (currentStep < totalSteps - 1) {
                    showStep(currentStep + 1);
                    if (currentStep === totalSteps - 1) {
                        populateReview();
                    }
                }
            } else {
                console.log(`[Navigasi] Langkah ${currentStep} TIDAK valid.`);
            }
        });
    }

    if (prevStepButton) {
        prevStepButton.addEventListener('click', () => {
            if (currentStep > 0) {
                showStep(currentStep - 1);
            }
        });
    }

    if (formJual) {
        formJual.addEventListener('submit', async (event) => {
            event.preventDefault();
            console.log("[Submit] Form submit event terdeteksi.");
            if (!validateStep(currentStep)) {
                console.log("[Submit] Validasi langkah terakhir gagal saat submit.");
                return;
            }
            if (submitAdButton) {
                submitAdButton.disabled = true;
                submitAdButton.innerHTML = `
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Memasang Iklan...
                `;
            }
            if (formSubmissionStatus) formSubmissionStatus.innerHTML = '';

            const formData = new FormData();
            formData.append('kategoriUtama', mainCategorySelect?.value || '');
            formData.append('subKategori', subCategorySelect?.value || '');
            formData.append('judul', judulIklanInput?.value || '');
            // ... (append data lainnya)
            uploadedFiles.forEach((fileData, index) => {
                formData.append(`fotoIklan[${index}]`, fileData.file, fileData.file.name);
            });

            console.log("[Submit] FormData siap dikirim.");
            await new Promise(resolve => setTimeout(resolve, 2000));

            if (formSubmissionStatus) {
                formSubmissionStatus.innerHTML = `<div class="form-status-message success">Iklan Anda berhasil dipasang! Anda akan diarahkan...</div>`;
            }
            setTimeout(() => {
                window.location.href = 'home.html?ad_posted=true';
            }, 1500);
        });
    }

    function updateMainHeaderUI() {
        // ... (logika header UI, sama seperti sebelumnya)
        if (!profileImageHeader || !profileDropdownHeader) return;
        profileDropdownHeader.innerHTML = '';
        if (isAuthenticated()) {
            const userData = getUserData();
            const userDisplayIdentifier = userData.email || userData.username || 'Pengguna';
            const initial = userDisplayIdentifier.charAt(0).toUpperCase() || 'U';
            profileImageHeader.src = userData.profilePicture || `https://placehold.co/32x32/00A5EC/FFFFFF?text=${initial}&font=Inter&bold=true`;
            profileImageHeader.alt = `Profil ${userDisplayIdentifier}`;
            profileDropdownHeader.innerHTML = `
                <div class="px-4 py-3">
                    <p class="text-sm font-medium text-text-primary truncate" title="${userDisplayIdentifier}">${userDisplayIdentifier}</p>
                </div>
                <hr class="border-border-default">
                <a href="profile.html" class="block px-4 py-2 text-sm text-text-primary hover:bg-gray-100 transition">Profil Saya</a>
                <a href="settings.html" class="block px-4 py-2 text-sm text-text-primary hover:bg-gray-100 transition">Pengaturan</a>
                <hr class="border-border-default">
                <button id="logoutButtonInHeaderJual" class="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition">Keluar</button>
            `;
            document.getElementById('logoutButtonInHeaderJual')?.addEventListener('click', () => {
                sessionStorage.clear(); window.location.href = "login.html";
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
            event.stopPropagation(); updateMainHeaderUI(); profileDropdownHeader.classList.toggle('hidden');
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
        if (confirm("Anda harus masuk untuk mengakses fitur ini. Masuk sekarang?")) {
            window.location.href = `login.html?redirect=${encodeURIComponent(redirectUrl)}`;
        }
    }
    if (chatButtonHeader) chatButtonHeader.addEventListener('click', () => { if(isAuthenticated()) window.location.href = 'chat.html'; else showHeaderLoginPrompt('chat.html');});

    function initializeJualPage() {
        if (!isAuthenticated()) {
            alert("Anda harus masuk terlebih dahulu untuk memasang iklan.");
            window.location.href = `login.html?redirect=${encodeURIComponent(window.location.href)}`;
            return;
        }
        if (formSteps.length > 0) {
            createStepIndicators(); showStep(0);
        } else {
            console.error("Elemen .form-step tidak ditemukan. Formulir multi-langkah tidak dapat diinisialisasi.");
            if(formSubmissionStatus) formSubmissionStatus.innerHTML = `<div class="form-status-message error">Kesalahan: Struktur formulir tidak lengkap.</div>`;
        }
        updateMainHeaderUI();
        const userData = getUserData();
        if (namaPenjualInput && userData.fullName) namaPenjualInput.value = userData.fullName;
        if (nomorTeleponInput && userData.phoneNumber) nomorTeleponInput.value = userData.phoneNumber;
        if (lokasiIklanInput && userData.location) lokasiIklanInput.value = userData.location;
        console.log("Halaman Jual diinisialisasi (V3.3 - Diagnostik Unggah File).");
    }

    initializeJualPage();
});
