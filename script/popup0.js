"use strict";

/* =========================================================
   ПОПАП ГАЛЕРЕИ (страница 9)
   ========================================================= */

const popup = document.querySelector('.galery__body');
const openBtn = document.querySelector('.bitva');
const closeBtn = document.querySelector('.bitva--closed');

/* =========================================================
   ОТКРЫТИЕ ПОПАПА
   ========================================================= */
openBtn.addEventListener('click', () => {
	popup.classList.add('is-open');
	document.body.style.overflow = 'hidden';
});

/* =========================================================
   ЗАКРЫТИЕ ПОПАПА
   ========================================================= */
closeBtn.addEventListener('click', () => {
	popup.classList.remove('is-open');
	document.body.style.overflow = '';
});

/* =========================================================
   Закрытие по Esc
   ========================================================= */
document.addEventListener('keydown', (e) => {
	if (e.key === 'Escape' && popup.classList.contains('is-open')) {
		closeBtn.click();
	}
});