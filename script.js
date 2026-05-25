/**
 * Quran 8 Ilmu API - Web Demo Script
 * Dibina untuk kegunaan bersama API Statik Quran 8 Ilmu
 * Versi 1.0
 */

// ==================== KONFIGURASI ====================
const API_BASE = 'https://raw.githubusercontent.com/pengurusanemediamasjidkampungs-dotcom/quran-8ilmu-api/main/api/v1';
const SURAH_NUMBER = 1; // Al-Fatihah
let surahData = null;

// ==================== DOM ELEMEN ====================
const contentArea = document.getElementById('content-area');
const tabsContainer = document.getElementById('tab-buttons');
const themeLightBtn = document.getElementById('theme-light');
const themeDarkBtn = document.getElementById('theme-dark');
const themeCoffeeBtn = document.getElementById('theme-coffee');
const loadingIndicator = document.getElementById('loading');

// ==================== FUNGSI UTAMA ====================

/**
 * Muat data surah dari API
 */
async function loadSurah() {
    try {
        const response = await fetch(`${API_BASE}/surah/${SURAH_NUMBER}.json`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        surahData = await response.json();
        buildUI();
        loadingIndicator.style.display = 'none';
    } catch (error) {
        console.error('Gagal memuat data surah:', error);
        showError('Tidak dapat memuat data. Sila cuba lagi.');
    }
}

/**
 * Bina keseluruhan UI selepas data dimuatkan
 */
function buildUI() {
    // Bina tab navigasi
    buildTabs();
    
    // Paparkan ayat pertama secara automatik
    showAyah(1);
}

/**
 * Bina butang tab untuk setiap ayat
 */
function buildTabs() {
    surahData.ayahs.forEach((ayah, index) => {
        const button = document.createElement('button');
        button.className = 'tab-btn';
        button.textContent = `Ayat ${index + 1}`;
        button.dataset.ayah = index + 1;
        button.addEventListener('click', () => showAyah(index + 1));
        tabsContainer.appendChild(button);
    });
    
    // Aktifkan tab pertama
    tabsContainer.firstChild.classList.add('active');
}

/**
 * Paparkan analisis untuk satu ayat
 */
function showAyah(ayahNumber) {
    // Kembali ke atas halaman
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Kemaskini tab aktif
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.tab-btn[data-ayah="${ayahNumber}"]`)?.classList.add('active');
    
    const ayah = surahData.ayahs[ayahNumber - 1];
    if (!ayah) return;
    
    let html = '';
    
    // Ayat penuh
    html += `<div class="ayat-penuh">${ayah.arabic_full}</div>`;
    html += '<hr>';
    
    // Analisis kalimah
    ayah.words.forEach(word => {
        html += buildKalimahGroup(word);
    });
    
    // Terjemahan penuh
    html += `<div class="terjemahan-penuh">✨ ${ayah.translation_malay}</div>`;
    
    // Panel tambahan (lughah, fawasil, qiraat) - boleh dikembangkan
    if (ayah.lughah || ayah.fawasil || ayah.qiraat) {
        html += '<hr><h3>📚 Ilmu Tambahan</h3>';
        html += buildAdditionalPanels(ayah);
    }
    
    contentArea.innerHTML = html;
}

/**
 * Bina kumpulan analisis untuk satu kalimah
 */
function buildKalimahGroup(word) {
    return `
        <div class="kalimah-group">
            <div class="kalimah-box">
                <div class="box-title">📐 TAJWID</div>
                <ul class="tajwid">${word.tajwid.rules.map(r => `<li>${r}</li>`).join('')}</ul>
            </div>
            <div class="makhraj-box">
                <div class="box-title">🗣️ MAKHRAJ</div>
                <ul class="makhraj">${word.makhraj.letters.map(l => `<li><strong>${l.letter}</strong>: ${l.makhraj}</li>`).join('')}</ul>
            </div>
            <div class="sifat-box">
                <div class="box-title">📝 SIFAT</div>
                <ul class="sifat">${word.sifat.letters.map(l => {
                    let sifatText = l.sifat_opposite.join(', ');
                    if (l.sifat_single.length) sifatText += ' + ' + l.sifat_single.join(', ');
                    return `<li><strong>${l.letter}</strong>: ${sifatText}</li>`;
                }).join('')}</ul>
            </div>
            <div style="width:100%; text-align:center; margin:5px 0;">
                <div class="arab-kalimah">${word.arabic}</div>
                <div class="makna">${word.meaning_malay}</div>
            </div>
        </div>
    `;
}

/**
 * Bina panel tambahan (lughah, fawasil, qiraat)
 */
function buildAdditionalPanels(ayah) {
    let html = '<div class="additional-panels">';
    
    if (ayah.lughah) {
        html += `
            <div class="panel">
                <h4>📖 Lughah (Bahasa Arab)</h4>
                <p><strong>Nahwu:</strong> ${ayah.lughah.nahwu || 'Tiada'}</p>
                <p><strong>Sorof:</strong> ${ayah.lughah.sorof || 'Tiada'}</p>
                <p><strong>Balaghah:</strong> ${ayah.lughah.balaghah || 'Tiada'}</p>
            </div>
        `;
    }
    
    if (ayah.fawasil) {
        html += `
            <div class="panel">
                <h4>🏁 Fawasil (Hujung Ayat)</h4>
                <p><strong>Akhir kata:</strong> ${ayah.fawasil.end_word}</p>
                <p><strong>Pola rima:</strong> ${ayah.fawasil.rhyme_pattern}</p>
                <p><strong>Jenis:</strong> ${ayah.fawasil.verse_type}</p>
            </div>
        `;
    }
    
    if (ayah.qiraat && ayah.qiraat.length) {
        html += `
            <div class="panel">
                <h4>🔊 Qiraat</h4>
                ${ayah.qiraat.map(q => `<p><strong>${q.qiraat_name}:</strong> ${q.notes || ''}</p>`).join('')}
            </div>
        `;
    }
    
    if (ayah.tarannum_ayat) {
        html += `
            <div class="panel">
                <h4>🎵 Tarannum</h4>
                <p><strong>Maqam:</strong> ${ayah.tarannum_ayat.maqam_suggestion || 'Tiada'}</p>
                <p><strong>Tempo:</strong> ${ayah.tarannum_ayat.tempo || 'Tiada'}</p>
                ${ayah.tarannum_ayat.note_hints ? `<p><strong>Nota:</strong> ${ayah.tarannum_ayat.note_hints.join(' - ')}</p>` : ''}
            </div>
        `;
    }
    
    html += '</div>';
    return html;
}

/**
 * Tunjukkan mesej ralat
 */
function showError(message) {
    loadingIndicator.textContent = message;
    loadingIndicator.style.color = 'red';
}

// ==================== PENGURUSAN TEMA ====================

function setTheme(theme) {
    document.body.classList.remove('light', 'dark', 'coffee');
    document.body.classList.add(theme);
    localStorage.setItem('quran8ilmu-theme', theme);
}

// Event listeners untuk butang tema
themeLightBtn.addEventListener('click', () => setTheme('light'));
themeDarkBtn.addEventListener('click', () => setTheme('dark'));
themeCoffeeBtn.addEventListener('click', () => setTheme('coffee'));

// Muat tema tersimpan
const savedTheme = localStorage.getItem('quran8ilmu-theme') || 'light';
setTheme(savedTheme);

// ==================== MULA APLIKASI ====================
document.addEventListener('DOMContentLoaded', loadSurah);
