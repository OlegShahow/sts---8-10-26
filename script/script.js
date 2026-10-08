"use strict";



const header = document.querySelector('.header');
const wrapper = document.querySelector('.wrapper');
const nav = document.querySelector('.nav');
const sizefont = document.querySelector('.sizefont');

// const headercontainer = document.querySelector('.header__container'); // пока не скрываем


document.addEventListener('DOMContentLoaded', () => {


	if (!wrapper || !header) {
		console.error('Не найден .wrapper или .header');
		return;
	}

	console.log('Скрипт запустился, элементы найдены');


	const elementsToHide = [nav, sizefont].filter(el => el !== null);

	const SCROLL_THRESHOLD = 150;
	const NORMAL_HEIGHT = '70px';
	const SMALL_HEIGHT = '0px';



	let lastScroll = 0;
	let isCompressed = false;

	const updateHeader = () => {
		const scrollY = wrapper.scrollTop;           // ← берём scrollTop с wrapper
		const scrollingDown = scrollY > lastScroll;

		let shouldCompress;

		if (scrollingDown) {
			shouldCompress = scrollY > SCROLL_THRESHOLD;
		} else {
			shouldCompress = false; // при скролле вверх сразу разворачиваем
		}

		if (shouldCompress !== isCompressed) {
			isCompressed = shouldCompress;

			if (isCompressed) {
				header.style.height = SMALL_HEIGHT;
				elementsToHide.forEach(el => {
					el.style.opacity = '0';
					el.style.pointerEvents = 'none';
				});
			} else {
				header.style.height = NORMAL_HEIGHT;
				elementsToHide.forEach(el => {
					el.style.opacity = '1';
					el.style.pointerEvents = 'auto';
				});
			}

			console.log(`Изменено: height → ${header.style.height}, compressed = ${isCompressed}`);
		}

		lastScroll = scrollY;
	};

	// Запускаем при загрузке
	updateHeader();

	// Слушаем скролл именно на wrapper
	wrapper.addEventListener('scroll', updateHeader);


});

// -------------------------  кнопка меню  и закрытие меню по нажатию на эпизоды 

const navbutton = document.querySelector('.nav--button');
const navlist = document.querySelector('.nav--list');

navlist.style.display = "none";   // ← ВОТ ЭТА СТРОКА убирает двойной клик

navbutton.addEventListener("click", (e) => {

	// обязательно остановить событие для того чтоб в дальнейшем не мешало 
	e.stopPropagation();

	if (navlist.style.display === "none") {
		navlist.style.display = "flex";
	}

	else {
		navlist.style.display = "none";
	}
})

// закрыть меню при клике на эпизоды


const nava = document.querySelectorAll('.nav--list a');

nava.forEach((a) => {
	a.addEventListener("click", () => {
		navlist.style.display = "none";
	});
});

// закрыть меню при клике вне меню

document.addEventListener("click", () => {
	if (navlist.style.display === "flex") {
		navlist.style.display = "none";
	}
})
// ----------------------------------------------------------------------------------------------------------------

// --------------------------  кнопка "техническое описание"





// ----------------------------------------------------------------

const wrap = document.querySelector(".wrapper");

const buttons = document.querySelectorAll(".tehnical__text");

buttons.forEach(b => {

	b.addEventListener("click", () => {

		const id = b.dataset.open;
		const block = document.getElementById(id);

		block.style.top = "0";
		wrap.style.overflow = "hidden";

	});

});

const closes = document.querySelectorAll(".tehbody__img");

closes.forEach(cl => {

	cl.addEventListener("click", () => {

		cl.closest(".tehnical__block").style.top = "-130%";
		wrap.style.overflow = "auto";

	});

});





// ----------------------------------------   запуска звука в начале титульная страница +  кнопка вкл\выкл музыки   ----------------------------

document.querySelectorAll('.run__video').forEach(video => {
	video.muted = true;
	video.play().catch(() => { });
});

const audio = document.querySelector('.run__audio');

if (audio) {
	audio.volume = 1;

	const runButton = document.querySelector('.run__button button');
	if (runButton) {
		runButton.addEventListener('click', () => {
			audio.play();
			document.querySelector('.run')?.classList.add('fade-out');
		});
	}

	const soundBtn = document.querySelector('.sound-toggle');
	if (soundBtn) {
		soundBtn.addEventListener('click', () => {
			audio.muted = !audio.muted;
			soundBtn.classList.toggle('muted', audio.muted);
		});
	}
}







// -----------------------------------  появление заголовка эпизода  0 --------------------------



// document.addEventListener('DOMContentLoaded', function () {
// 	var wrapper = document.querySelector('.wrapper');
// 	if (!wrapper) return;

// 	var episodes = wrapper.querySelectorAll('.episodone');
// 	if (!episodes.length) return;

// 	function checkVisibility() {
// 		var wrapperRect = wrapper.getBoundingClientRect();
// 		var middle = wrapperRect.top + wrapper.clientHeight / 2;

// 		episodes.forEach(function (episode) {
// 			var rect = episode.getBoundingClientRect();
// 			var episodeMiddle = rect.top + rect.height / 2;

// 			if (episodeMiddle <= middle && !episode.classList.contains('visible')) {
// 				episode.classList.add('visible');
// 			}
// 		});
// 	}

// 	wrapper.addEventListener('scroll', checkVisibility);
// 	checkVisibility();
// });

// -----------------------------------   анимация летящих звёзд  ------------------------------


var layerCount = 5;
var starCount = 400;
var maxTime = 30;
var universe = document.getElementById("universe");
var w = window;
var d = document;
var e = d.documentElement;
var g = d.getElementsByTagName("body")[0];
var width = w.innerWidth || e.clientWidth || g.clientWidth;
var height = w.innerHeight || e.clientHeight || g.clientHeight;
for (var i = 0; i < starCount; ++i) {
	var ypos = Math.round(Math.random() * height);
	var star = document.createElement("div");
	var speed = 1000 * (Math.random() * maxTime + 1);
	star.setAttribute("class", "star" + (3 - Math.floor(speed / 1000 / 8)));
	star.style.backgroundColor = "white";

	universe.appendChild(star);
	star.animate(
		[
			{
				transform: "translate3d(" + width + "px, " + ypos + "px, 0)"
			},
			{
				transform:
					"translate3d(-" + Math.random() * 256 + "px, " + ypos + "px, 0)"
			}
		],
		{
			delay: Math.random() * -speed,
			duration: speed,
			iterations: 1000
		}
	);
}

var elem = document.querySelector(".pulse");
var animation = elem.animate(
	{
		opacity: [0.5, 1],
		transform: ["scale(0.5)", "scale(1)"]
	},
	{
		direction: "alternate",
		duration: 500,
		iterations: Infinity
	}
);
// --------------------------------------------  остановка видео на малых экранах ------------------------------

function handleVideoByScreenSize() {
	const video = document.querySelector('.run__video');
	const bgvideo = document.querySelector('.bg - video');
	const isMobile = window.matchMedia('(max-width: 900px)').matches;

	if (isMobile) {
		video.pause();
		bgvideo.pause();
	} else {
		video.play().catch(() => { });
		bgvideo.play().catch(() => { });
	}
}

handleVideoByScreenSize();
window.addEventListener('resize', handleVideoByScreenSize);

// =============================================================================================

