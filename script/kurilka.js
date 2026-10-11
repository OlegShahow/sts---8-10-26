
"use strict";

// const commentsEl = document.getElementById('comments');

// async function loadComments() {
// 	try {
// 		const res = await fetch('/comments');
// 		const comments = await res.json();
// 		renderComments(comments);
// 	} catch (err) {
// 		commentsEl.innerHTML = '<div class="empty">Ошибка загрузки</div>';
// 	}
// }

// function renderComments(comments) {
// 	if (!comments.length) {
// 		commentsEl.innerHTML = '<div class="empty">Пока комментариев нет. Будьте первым!</div>';
// 		return;
// 	}
// 	commentsEl.innerHTML = comments.map(c => {
// 		const date = new Date(c.createdAt).toLocaleString('ru-RU');
// 		const name = escapeHtml(c.name || 'Аноним');
// 		const text = escapeHtml(c.text || '');
// 		return `
// 	<div class="comment">
// 		<span class="name">${name}</span>
// 		<span class="date">${date}</span>
// 		<div class="text">${text}</div>
// 	</div>
// 	`;
// 	}).join('');
// }

// function escapeHtml(str) {
// 	return str
// 		.replace(/&/g, '&amp;')
// 		.replace(/</g, '&lt;')
// 		.replace(/>/g, '&gt;')
// 		.replace(/"/g, '&quot;');
// }

// async function sendComment() {
// 	const name = document.getElementById('name').value.trim();
// 	const text = document.getElementById('text').value.trim();
// 	if (!text) {
// 		alert('Напишите комментарий');
// 		return;
// 	}
// 	try {
// 		const res = await fetch('/comments', {
// 			method: 'POST',
// 			headers: { 'Content-Type': 'application/json' },
// 			body: JSON.stringify({ name, text })
// 		});
// 		if (res.ok) {
// 			document.getElementById('text').value = '';
// 			document.getElementById('name').value = '';      // ← ВОТ ЭТА СТРОКА
// 			loadComments();
// 		} else {
// 			alert('Ошибка отправки');
// 		}
// 	} catch (err) {
// 		alert('Ошибка соединения');
// 	}
// }

// loadComments();


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

// Группируем: родители + их ответы
function groupComments(comments) {
	const parents = comments.filter(c => !c.parentId);
	const replies = comments.filter(c => c.parentId);

	return parents.map(p => ({
		...p,
		replies: replies.filter(r => String(r.parentId) === String(p._id))
	}));
}

function renderComments(comments) {
	if (!comments.length) {
		commentsEl.innerHTML = '<div class="empty">Пока комментариев нет. Будьте первым!</div>';
		return;
	}

	const tree = groupComments(comments);

	commentsEl.innerHTML = tree.map(c => {
		const date = new Date(c.createdAt).toLocaleString('ru-RU');
		const name = escapeHtml(c.name || 'Аноним');
		const text = escapeHtml(c.text || '');

		const repliesHtml = c.replies.map(r => {
			const rDate = new Date(r.createdAt).toLocaleString('ru-RU');
			const rName = escapeHtml(r.name || 'Аноним');
			const rText = escapeHtml(r.text || '');
			return `
				<div class="reply">
					<span class="name">${rName}</span>
					<span class="date">${rDate}</span>
					<div class="text">${rText}</div>
				</div>
			`;
		}).join('');

		return `
			<div class="comment" data-id="${c._id}">
				<span class="name">${name}</span>
				<span class="date">${date}</span>
				<div class="text">${text}</div>

				<button class="reply-btn" onclick="toggleReplyForm('${c._id}')">Ответить</button>

				<div class="reply-form" id="reply-form-${c._id}">
					<input type="text" class="reply-name" placeholder="Ваше имя (необязательно)" maxlength="50">
					<textarea class="reply-text" placeholder="Ваш ответ..." maxlength="2000"></textarea>
					<button onclick="sendReply('${c._id}')">Отправить</button>
				</div>

				${repliesHtml ? `<div class="replies">${repliesHtml}</div>` : ''}
			</div>
		`;
	}).join('');
}

function escapeHtml(str) {
	return String(str)
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
			document.getElementById('name').value = '';
			loadComments();
		} else {
			alert('Ошибка отправки');
		}
	} catch (err) {
		alert('Ошибка соединения');
	}
}

// Показать/скрыть форму ответа
function toggleReplyForm(id) {
	const form = document.getElementById('reply-form-' + id);
	if (!form) return;
	form.classList.toggle('open');
	if (form.classList.contains('open')) {
		const input = form.querySelector('.reply-name');
		if (input) input.focus();
	}
}

// Отправить ответ
async function sendReply(parentId) {
	const form = document.getElementById('reply-form-' + parentId);
	if (!form) return;
	const name = form.querySelector('.reply-name').value.trim();
	const text = form.querySelector('.reply-text').value.trim();

	if (!text) {
		alert('Напишите ответ');
		return;
	}

	try {
		const res = await fetch('/comments', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ name, text, parentId })
		});
		if (res.ok) {
			loadComments();
		} else {
			alert('Ошибка отправки');
		}
	} catch (err) {
		alert('Ошибка соединения');
	}
}

loadComments();