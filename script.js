/**
 * Quran 8 Ilmu API - Main Script
 * Menangani tema, tab navigasi, dan pemuatan data dari API statik
 */

( function() {
    'use strict';

    /* ========== THEME MANAGER ========== */
    const ThemeManager = {
        STORAGE_KEY: 'alfatihah-theme',
        DEFAULT_THEME: 'light',

        // Dapatkan tema dari localStorage atau default
        getSavedTheme() {
            return localStorage.getItem(this.STORAGE_KEY) || this.DEFAULT_THEME;
        },

        // Simpan tema ke localStorage
        saveTheme(theme) {
            localStorage.setItem(this.STORAGE_KEY, theme);
        },

        // Terapkan tema ke body
        applyTheme(theme) {
            document.body.classList.remove('light', 'dark', 'coffee');
            document.body.classList.add(theme);
        },

        // Tukar tema
        setTheme(theme) {
            this.applyTheme(theme);
            this.saveTheme(theme);
        },

        // Init event listeners untuk butang tema
        init() {
            const buttons = {
                light: document.getElementById('theme-light'),
                dark: document.getElementById('theme-dark'),
                coffee: document.getElementById('theme-coffee')
            };

            for (const [theme, btn] of Object.entries(buttons)) {
                if (btn) {
                    btn.addEventListener('click', () => this.setTheme(theme));
                }
            }

            // Muat tema tersimpan
            const saved = this.getSavedTheme();
            this.applyTheme(saved);
        }
    };

    /* ========== TAB MANAGER ========== */
    const TabManager = {
        tabButtons: null,
        contentDivs: null,

        init() {
            this.tabButtons = document.querySelectorAll('.tab-btn');
            this.contentDivs = document.querySelectorAll('.ayat-content');

            this.tabButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    const ayatNumber = btn.getAttribute('data-ayat');
                    this.switchTab(ayatNumber);
                });
            });

            // Aktifkan tab pertama secara default
            if (this.tabButtons.length > 0) {
                this.switchTab('1');
            }
        },

        switchTab(ayatNumber) {
            // Nyahaktifkan semua
            this.tabButtons.forEach(b => b.classList.remove('active'));
            this.contentDivs.forEach(d => d.classList.remove('active'));

            // Aktifkan yang dipilih
            const activeBtn = document.querySelector(`.tab-btn[data-ayat="${ayatNumber}"]`);
            const activeContent = document.getElementById(`ayat-${ayatNumber}`);

            if (activeBtn) activeBtn.classList.add('active');
            if (activeContent) activeContent.classList.add('active');
        }
    };

    /* ========== API LOADER (OPTIONAL) ========== */
    const ApiLoader = {
        BASE_URL: 'https://raw.githubusercontent.com/pengurusanemediamasjidkampungs-dotcom/quran-8ilmu-api/main/api/v1/surah/',

        // Muat data surah dari API statik dan pulangkan sebagai objek
        async loadSurah(surahNumber = 1) {
            try {
                const url = `${this.BASE_URL}${surahNumber}.json`;
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return await response.json();
            } catch (error) {
                console.error('Gagal memuat data surah:', error);
                return null;
            }
        },

        // Render data surah ke dalam DOM (menggantikan kandungan statik)
        renderSurahToDOM(data, containerId = 'contentArea') {
            if (!data || !data.ayahs) return;

            const container = document.getElementById(containerId);
            if (!container) return;

            // Kosongkan kandungan sedia ada
            container.innerHTML = '';

            // Bina semula struktur ayat
            data.ayahs.forEach((ayah, index) => {
                const ayahDiv = document.createElement('div');
                ayahDiv.className = 'ayat-content';
                ayahDiv.id = `ayat-${ayah.id}`;
                if (index === 0) ayahDiv.classList.add('active');

                // Ayat penuh
                const ayatPenuh = document.createElement('div');
                ayatPenuh.className = 'ayat-penuh';
                ayatPenuh.textContent = ayah.arabic_full;
                ayahDiv.appendChild(ayatPenuh);

                ayahDiv.appendChild(document.createElement('hr'));

                // Kalimah groups
                ayah.words.forEach(word => {
                    const group = document.createElement('div');
                    group.className = 'kalimah-group';

                    // Kotak Tajwid
                    const tajwidBox = document.createElement('div');
                    tajwidBox.className = 'kalimah-box';
                    tajwidBox.innerHTML = `
                        <div class="box-title">📐 TAJWID</div>
                        <ul class="tajwid">
                            ${word.tajwid.rules.map(r => `<li>${r}</li>`).join('')}
                        </ul>`;
                    group.appendChild(tajwidBox);

                    // Kotak Makhraj
                    const makhrajBox = document.createElement('div');
                    makhrajBox.className = 'makhraj-box';
                    makhrajBox.innerHTML = `
                        <div class="box-title">🗣️ MAKHRAJ</div>
                        <ul class="makhraj">
                            ${word.makhraj.letters.map(l => `<li><strong>${l.letter}</strong>: ${l.makhraj}</li>`).join('')}
                        </ul>`;
                    group.appendChild(makhrajBox);

                    // Kotak Sifat
                    const sifatBox = document.createElement('div');
                    sifatBox.className = 'sifat-box';
                    sifatBox.innerHTML = `
                        <div class="box-title">📝 SIFAT</div>
                        <ul class="sifat">
                            ${word.sifat.letters.map(l => {
                                let sifatText = `<strong>${l.letter}</strong>: ${l.sifat_opposite.join(', ')}`;
                                if (l.sifat_single && l.sifat_single.length > 0) {
                                    sifatText += `; ${l.sifat_single.join(', ')}`;
                                }
                                return `<li>${sifatText}</li>`;
                            }).join('')}
                        </ul>`;
                    group.appendChild(sifatBox);

                    // Teks Arab dan makna
                    const wordRow = document.createElement('div');
                    wordRow.style.width = '100%';
                    wordRow.style.textAlign = 'center';
                    wordRow.style.margin = '5px 0';
                    wordRow.innerHTML = `
                        <div class="arab-kalimah" style="display:inline-block; margin:0 10px;">${word.arabic}</div>
                        <div class="makna" style="display:inline-block;">${word.meaning_malay}</div>`;
                    group.appendChild(wordRow);

                    ayahDiv.appendChild(group);
                });

                // Terjemahan penuh
                const terjemahan = document.createElement('div');
                terjemahan.className = 'terjemahan-penuh';
                terjemahan.textContent = '✨ ' + ayah.translation_malay;
                ayahDiv.appendChild(terjemahan);

                ayahDiv.appendChild(document.createElement('hr'));
                const footnote = document.createElement('p');
                footnote.className = 'footnote';
                footnote.textContent = `Ayat ${ayah.id}`;
                ayahDiv.appendChild(footnote);

                container.appendChild(ayahDiv);
            });

            // Reset tab manager selepas render
            TabManager.init();
        }
    };

    /* ========== INITIALIZATION ========== */
    function init() {
        ThemeManager.init();
        TabManager.init();

        // Jika mahu memuat secara dinamik dari API (nyahkomen baris di bawah):
        // ApiLoader.loadSurah(1).then(data => {
        //     if (data) ApiLoader.renderSurahToDOM(data);
        // });
    }

    // Jalankan apabila DOM sudah sedia
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
