"use strict";




// const popup = document.querySelector('.galery__body');
// const openBtn = document.querySelector('.bitva');
// const closeBtn = document.querySelector('.bitva--closed');

// openBtn.addEventListener('click', () => {
// 	popup.classList.add('is-open');
// 	document.body.style.overflow = 'hidden';
// });

// closeBtn.addEventListener('click', () => {
// 	popup.classList.remove('is-open');
// 	document.body.style.overflow = '';
// });


/* =========================================================
   ПОПАП ГАЛЕРЕИ + МУЗЫКА
   ========================================================= */

const popup = document.querySelector('.galery__body');
const openBtn = document.querySelector('.bitva');
const closeBtn = document.querySelector('.bitva--closed');

const music = document.getElementById('bgMusic');
const toggleBtn = document.getElementById('musicToggle');
const volume = document.getElementById('volumeSlider');

/* ===== Стартовая громкость музыки ===== */
if (music) {
	music.volume = 0.5;
}

/* =========================================================
   ОТКРЫТИЕ ПОПАПА
   ========================================================= */
openBtn.addEventListener('click', () => {
	popup.classList.add('is-open');
	document.body.style.overflow = 'hidden';

	// запуск музыки по клику (браузер разрешает автоплей после действия пользователя)
	if (music) {
		music.play().catch(err => console.warn('Автоплей заблокирован:', err));
		// синхронизируем иконку кнопки
		updateMusicIcon();
	}
});

/* =========================================================
   ЗАКРЫТИЕ ПОПАПА
   ========================================================= */
closeBtn.addEventListener('click', () => {
	popup.classList.remove('is-open');
	document.body.style.overflow = '';

	// пауза музыки (продолжит с того же места при следующем открытии)
	if (music) {
		music.pause();
		music.currentTime = 0;   // ← перемотка в начало
	}
});

/* =========================================================
   КНОПКА ВКЛ/ВЫКЛ МУЗЫКИ
   ========================================================= */
if (toggleBtn && music) {
	toggleBtn.addEventListener('click', () => {
		if (music.paused) {
			music.play().catch(err => console.warn('Автоплей заблокирован:', err));
		} else {
			music.pause();
		}
		updateMusicIcon();
	});
}

/* Обновление иконки кнопки в зависимости от состояния */
function updateMusicIcon() {
	if (!toggleBtn || !music) return;
	if (music.paused) {
		toggleBtn.textContent = '🔇';
		toggleBtn.classList.add('is-muted');
	} else {
		toggleBtn.textContent = '🔊';
		toggleBtn.classList.remove('is-muted');
	}
}

/* =========================================================
   ПОЛЗУНОК ГРОМКОСТИ
   ========================================================= */
if (volume && music) {
	// при открытии страницы — синхронизируем значение с громкостью
	volume.value = music.volume;

	volume.addEventListener('input', (e) => {
		music.volume = parseFloat(e.target.value);
	});
}

/* =========================================================
   (ОПЦИОНАЛЬНО) Закрытие по Esc
   ========================================================= */
document.addEventListener('keydown', (e) => {
	if (e.key === 'Escape' && popup.classList.contains('is-open')) {
		closeBtn.click();
	}
});