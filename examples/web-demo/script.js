/**
 * Quran 8 Ilmu API – Web Demo Script
 * Menangani tema, tab ayat, sub‑tab 8 ilmu, dan pemuatan API statik
 */

(function() {
    'use strict';

    /* ========== THEME MANAGER ========== */
    const ThemeManager = {
        STORAGE_KEY: 'quran8ilmu-theme',
        DEFAULT_THEME: 'light',

        getSavedTheme() {
            return localStorage.getItem(this.STORAGE_KEY) || this.DEFAULT_THEME;
        },

        saveTheme(theme) {
            localStorage.setItem(this.STORAGE_KEY, theme);
        },

        applyTheme(theme) {
            document.body.classList.remove('light', 'dark', 'coffee');
            document.body.classList.add(theme);
        },

        setTheme(theme) {
            this.applyTheme(theme);
            this.saveTheme(theme);
        },

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
            const saved = this.getSavedTheme();
            this.applyTheme(saved);
        }
    };

    /* ========== API LOADER ========== */
    const ApiLoader = {
        BASE_URL: 'https://raw.githubusercontent.com/pengurusanemediamasjidkampungs-dotcom/quran-8ilmu-api/main/api/v1/surah/',

        async loadSurah(surahNumber = 1) {
            try {
                const url = `${this.BASE_URL}${surahNumber}.json`;
                const response = await fetch(url);
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                return await response.json();
            } catch (error) {
                console.error('Gagal memuat data surah:', error);
                return null;
            }
        }
    };

    /* ========== RENDERER ========== */
    function renderSurah(surah) {
        const ayahTabsDiv = document.getElementById('ayahTabs');
        const contentArea = document.getElementById('contentArea');
        if (!ayahTabsDiv || !contentArea) return;

        // Bina tab ayat
        ayahTabsDiv.innerHTML = '';
        surah.ayahs.forEach((ayah) => {
            const tab = document.createElement('button');
            tab.className = 'ayah-tab';
            tab.textContent = `Ayat ${ayah.id}`;
            tab.dataset.ayah = ayah.id;
            ayahTabsDiv.appendChild(tab);
        });

        // Aktifkan ayat pertama
        const firstTab = ayahTabsDiv.querySelector('.ayah-tab');
        if (firstTab) firstTab.classList.add('active');

        // Bina kandungan setiap ayat
        contentArea.innerHTML = '';
        surah.ayahs.forEach(ayah => {
            const ayahDiv = document.createElement('div');
            ayahDiv.className = 'ayah-content';
            ayahDiv.id = `ayah-${ayah.id}`;
            if (ayah.id === 1) ayahDiv.classList.add('active');

            // Ayat penuh + terjemahan
            ayahDiv.innerHTML = `
                <div class="ayah-full">${ayah.arabic_full}</div>
                <div class="translation">✨ ${ayah.translation_malay}</div>
            `;

            // Sub‑tab 8 ilmu
            const ilmuContainer = document.createElement('div');
            ilmuContainer.innerHTML = `
                <div class="ilmu-tabs">
                    <button class="ilmu-tab active" data-ilmu="tajwid">📐 Tajwid</button>
                    <button class="ilmu-tab" data-ilmu="makhraj">🗣️ Makhraj</button>
                    <button class="ilmu-tab" data-ilmu="sifat">📝 Sifat</button>
                    <button class="ilmu-tab" data-ilmu="tarannum">🎵 Tarannum</button>
                    <button class="ilmu-tab" data-ilmu="fawasil">🔚 Fawasil</button>
                    <button class="ilmu-tab" data-ilmu="lughah">📚 Lughah</button>
                    <button class="ilmu-tab" data-ilmu="qiraat">📖 Qiraat</button>
                    <button class="ilmu-tab" data-ilmu="tafsir">📜 Tafsir</button>
                </div>
                <div class="ilmu-panel active" data-panel="tajwid"></div>
                <div class="ilmu-panel" data-panel="makhraj"></div>
                <div class="ilmu-panel" data-panel="sifat"></div>
                <div class="ilmu-panel" data-panel="tarannum"></div>
                <div class="ilmu-panel" data-panel="fawasil"></div>
                <div class="ilmu-panel" data-panel="lughah"></div>
                <div class="ilmu-panel" data-panel="qiraat"></div>
                <div class="ilmu-panel" data-panel="tafsir"></div>
            `;
            ayahDiv.appendChild(ilmuContainer);

            // Rujukan panel
            const panels = {
                tajwid: ayahDiv.querySelector('[data-panel="tajwid"]'),
                makhraj: ayahDiv.querySelector('[data-panel="makhraj"]'),
                sifat: ayahDiv.querySelector('[data-panel="sifat"]'),
                tarannum: ayahDiv.querySelector('[data-panel="tarannum"]'),
                fawasil: ayahDiv.querySelector('[data-panel="fawasil"]'),
                lughah: ayahDiv.querySelector('[data-panel="lughah"]'),
                qiraat: ayahDiv.querySelector('[data-panel="qiraat"]'),
                tafsir: ayahDiv.querySelector('[data-panel="tafsir"]')
            };

            // Isi panel Tajwid, Makhraj, Sifat
            ayah.words.forEach(word => {
                const group = document.createElement('div');
                group.className = 'kalimah-group';

                // Tajwid box
                const tajBox = document.createElement('div');
                tajBox.className = 'box tajwid-box';
                tajBox.innerHTML = `<div class="box-title">📐 TAJWID</div><ul>${word.tajwid.rules.map(r => `<li>${r}</li>`).join('')}</ul>`;
                group.appendChild(tajBox);

                // Makhraj box
                const makhBox = document.createElement('div');
                makhBox.className = 'box makhraj-box';
                makhBox.innerHTML = `<div class="box-title">🗣️ MAKHRAJ</div><ul>${word.makhraj.letters.map(l => `<li><strong>${l.letter}</strong>: ${l.makhraj}</li>`).join('')}</ul>`;
                group.appendChild(makhBox);

                // Sifat box
                const sifBox = document.createElement('div');
                sifBox.className = 'box sifat-box';
                sifBox.innerHTML = `<div class="box-title">📝 SIFAT</div><ul>${word.sifat.letters.map(l => {
                    let sifat = `<li><strong>${l.letter}</strong>: ${l.sifat_opposite.join(', ')}`;
                    if (l.sifat_single && l.sifat_single.length) sifat += `; ${l.sifat_single.join(', ')}`;
                    sifat += '</li>';
                    return sifat;
                }).join('')}</ul>`;
                group.appendChild(sifBox);

                // Perkataan Arab + makna
                const wordRow = document.createElement('div');
                wordRow.style.width = '100%';
                wordRow.style.textAlign = 'center';
                wordRow.innerHTML = `<div class="word-arabic">${word.arabic}</div><div class="word-meaning">${word.meaning_malay}</div>`;
                group.appendChild(wordRow);

                panels.tajwid.appendChild(group.cloneNode(true));
                panels.makhraj.appendChild(group.cloneNode(true));
                panels.sifat.appendChild(group.cloneNode(true));
            });

            // Panel Tarannum
            const t = ayah.tarannum_ayat || {};
            panels.tarannum.innerHTML = `
                <div class="ilmu-text">
                    <strong>Maqam cadangan:</strong> ${t.maqam_suggestion || '—'}<br>
                    <strong>Tempo:</strong> ${t.tempo || '—'}<br>
                    <strong>Nota ringkas:</strong> ${t.note_hints ? t.note_hints.join(' – ') : '—'}
                </div>`;

            // Panel Fawasil
            const f = ayah.fawasil || {};
            panels.fawasil.innerHTML = `
                <ul class="ilmu-list">
                    <li><strong>Hujung ayat:</strong> ${f.end_word || '—'}</li>
                    <li><strong>Pola rima:</strong> ${f.rhyme_pattern || '—'}</li>
                    <li><strong>Jenis ayat:</strong> ${f.verse_type || '—'}</li>
                    <li><strong>Nombor dalam surah:</strong> ${f.number_in_surah || ayah.id}</li>
                </ul>`;

            // Panel Lughah
            const l = ayah.lughah || {};
            panels.lughah.innerHTML = `
                <div class="ilmu-text">
                    <strong>Nahwu:</strong> ${l.nahwu || '—'}<br><br>
                    <strong>Sorof:</strong> ${l.sorof || '—'}<br><br>
                    <strong>Balaghah:</strong> ${l.balaghah || '—'}
                </div>`;

            // Panel Qiraat
            if (ayah.qiraat && ayah.qiraat.length) {
                let html = '<ul class="ilmu-list">';
                ayah.qiraat.forEach(q => {
                    html += `<li><strong>${q.qiraat_name}:</strong> ${q.text}<br><small>${q.notes || ''}</small></li>`;
                });
                html += '</ul>';
                panels.qiraat.innerHTML = html;
            } else {
                panels.qiraat.innerHTML = '<div class="ilmu-text">Tiada data qiraat.</div>';
            }

            // Panel Tafsir
            panels.tafsir.innerHTML = `<div class="ilmu-text">${ayah.tafsir || 'Tiada tafsir ringkas.'}</div>`;

            contentArea.appendChild(ayahDiv);
        });

        // Aktifkan event: tab ayat
        document.querySelectorAll('.ayah-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const ayahId = tab.dataset.ayah;
                document.querySelectorAll('.ayah-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                document.querySelectorAll('.ayah-content').forEach(c => c.classList.remove('active'));
                document.getElementById(`ayah-${ayahId}`)?.classList.add('active');
            });
        });

        // Aktifkan event: sub‑tab ilmu
        document.querySelectorAll('.ilmu-tabs').forEach(tabBar => {
            tabBar.addEventListener('click', (e) => {
                if (e.target.classList.contains('ilmu-tab')) {
                    const ilmu = e.target.dataset.ilmu;
                    const parent = e.target.closest('.ayah-content');
                    parent.querySelectorAll('.ilmu-tab').forEach(btn => btn.classList.remove('active'));
                    parent.querySelectorAll('.ilmu-panel').forEach(p => p.classList.remove('active'));
                    e.target.classList.add('active');
                    const panel = parent.querySelector(`[data-panel="${ilmu}"]`);
                    if (panel) panel.classList.add('active');
                }
            });
        });
    }

    /* ========== INIT ========== */
    async function init() {
        ThemeManager.init();
        // Butang tema perlu wujud di HTML
        const surah = await ApiLoader.loadSurah(1);
        if (surah) {
            renderSurah(surah);
        } else {
            document.getElementById('contentArea').innerHTML = '<p style="color:red;">Gagal memuatkan data Al‑Fatihah.</p>';
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
