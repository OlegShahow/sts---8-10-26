
"use strict";

const commentsEl = document.getElementById('comments');

async function loadComments() {
	try {
		const res = await fetch('/comments');
		const comments = await res.json();
		renderComments(comments);
	} catch (err) {
		commentsEl.innerHTML = '<div class="empty">Ошибка загрузки</div>';
	}
}

function renderComments(comments) {
	if (!comments.length) {
		commentsEl.innerHTML = '<div class="empty">Пока комментариев нет. Будьте первым!</div>';
		return;
	}
	commentsEl.innerHTML = comments.map(c => {
		const date = new Date(c.createdAt).toLocaleString('ru-RU');
		const name = escapeHtml(c.name || 'Аноним');
		const text = escapeHtml(c.text || '');
		return `
	<div class="comment">
		<span class="name">${name}</span>
		<span class="date">${date}</span>
		<div class="text">${text}</div>
	</div>
	`;
	}).join('');
}

function escapeHtml(str) {
	return str
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

async function sendComment() {
	const name = document.getElementById('name').value.trim();
	const text = document.getElementById('text').value.trim();
	if (!text) {
		alert('Напишите комментарий');
		return;
	}
	try {
		const res = await fetch('/comments', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ name, text })
		});
		if (res.ok) {
			document.getElementById('text').value = '';
			document.getElementById('name').value = '';      // ← ВОТ ЭТА СТРОКА
			loadComments();
		} else {
			alert('Ошибка отправки');
		}
	} catch (err) {
		alert('Ошибка соединения');
	}
}

loadComments();
