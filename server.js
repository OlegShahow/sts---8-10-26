// require('dotenv').config();
// const express = require('express');
// const { MongoClient } = require('mongodb');
// const path = require('path');
// const { ObjectId } = require('mongodb');

// const app = express();
// const PORT = process.env.PORT || 3000;

// app.use(express.json());
// app.use(express.static(path.join(__dirname)));

// const client = new MongoClient(process.env.MONGO_URL);
// let commentsCollection;

// async function start() {
// 	await client.connect();
// 	const db = client.db('smoking_room');
// 	commentsCollection = db.collection('comments');
// 	console.log('MongoDB подключена');

// 	app.listen(PORT, () => {
// 		console.log('Сервер запущен на порту ' + PORT);
// 	});
// }

// // Получить все комментарии
// app.get('/comments', async (req, res) => {
// 	try {
// 		const comments = await commentsCollection
// 			.find()
// 			.sort({ createdAt: -1 })
// 			.toArray();
// 		res.json(comments);
// 	} catch (err) {
// 		res.status(500).json({ error: 'Ошибка чтения' });
// 	}
// });

// // Добавить комментарий
// app.post('/comments', async (req, res) => {
// 	try {
// 		const { name, text } = req.body;
// 		if (!text || text.trim() === '') {
// 			return res.status(400).json({ error: 'Пустой комментарий' });
// 		}
// 		const newComment = {
// 			name: name && name.trim() ? name.trim() : 'Аноним',
// 			text: text.trim(),
// 			createdAt: new Date()
// 		};
// 		await commentsCollection.insertOne(newComment);
// 		res.json({ ok: true, comment: newComment });
// 	} catch (err) {
// 		res.status(500).json({ error: 'Ошибка записи' });
// 	}
// });


// // ====== АДМИНКА ======

// // Проверка пароля и выдача токена
// app.post('/admin/login', (req, res) => {
// 	const { password } = req.body;
// 	if (!password || password !== process.env.ADMIN_PASSWORD) {
// 		return res.status(401).json({ error: 'Неверный пароль' });
// 	}
// 	// Простой токен — сам пароль, закодированный. Для курилки достаточно.
// 	const token = Buffer.from(password).toString('base64');
// 	res.json({ ok: true, token });
// });

// // Удаление комментария (только с правильным токеном)
// app.delete('/comments/:id', async (req, res) => {
// 	try {
// 		const token = req.headers['x-admin-token'];
// 		const expected = Buffer.from(process.env.ADMIN_PASSWORD || '').toString('base64');
// 		if (!token || token !== expected) {
// 			return res.status(401).json({ error: 'Нет доступа' });
// 		}
// 		const { id } = req.params;
// 		await commentsCollection.deleteOne({ _id: new ObjectId(id) });
// 		res.json({ ok: true });
// 	} catch (err) {
// 		console.error('Ошибка удаления:', err);
// 		res.status(500).json({ error: 'Ошибка удаления' });
// 	}
// });

// start();

require('dotenv').config();
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

const client = new MongoClient(process.env.MONGO_URL);
let commentsCollection;

async function start() {
	await client.connect();
	const db = client.db('smoking_room');
	commentsCollection = db.collection('comments');
	console.log('MongoDB подключена');

	app.listen(PORT, () => {
		console.log('Сервер запущен на порту ' + PORT);
	});
}

// Получить все комментарии
app.get('/comments', async (req, res) => {
	try {
		const comments = await commentsCollection
			.find()
			.sort({ createdAt: -1 })
			.toArray();
		res.json(comments);
	} catch (err) {
		console.error('Ошибка чтения:', err);
		res.status(500).json({ error: 'Ошибка чтения' });
	}
});

// Добавить комментарий или ответ
app.post('/comments', async (req, res) => {
	try {
		const { name, text, parentId } = req.body;
		if (!text || text.trim() === '') {
			return res.status(400).json({ error: 'Пустой комментарий' });
		}
		const newComment = {
			name: name && name.trim() ? name.trim() : 'Аноним',
			text: text.trim(),
			parentId: parentId ? new ObjectId(parentId) : null,
			createdAt: new Date()
		};
		await commentsCollection.insertOne(newComment);
		res.json({ ok: true, comment: newComment });
	} catch (err) {
		console.error('Ошибка записи:', err);
		res.status(500).json({ error: 'Ошибка записи' });
	}
});

// ====== АДМИНКА ======

// Проверка пароля и выдача токена
app.post('/admin/login', (req, res) => {
	const { password } = req.body;
	if (!password || password !== process.env.ADMIN_PASSWORD) {
		return res.status(401).json({ error: 'Неверный пароль' });
	}
	const token = Buffer.from(password).toString('base64');
	res.json({ ok: true, token });
});

// Удаление комментария и всех его ответов
app.delete('/comments/:id', async (req, res) => {
	try {
		const token = req.headers['x-admin-token'];
		const expected = Buffer.from(process.env.ADMIN_PASSWORD || '').toString('base64');
		if (!token || token !== expected) {
			return res.status(401).json({ error: 'Нет доступа' });
		}
		const { id } = req.params;
		const _id = new ObjectId(id);

		await commentsCollection.deleteOne({ _id });
		await commentsCollection.deleteMany({ parentId: _id });

		res.json({ ok: true });
	} catch (err) {
		console.error('Ошибка удаления:', err);
		res.status(500).json({ error: 'Ошибка удаления' });
	}
});

start();