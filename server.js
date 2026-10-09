require('dotenv').config();
const express = require('express');
const { MongoClient } = require('mongodb');
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
		res.status(500).json({ error: 'Ошибка чтения' });
	}
});

// Добавить комментарий
app.post('/comments', async (req, res) => {
	try {
		const { name, text } = req.body;
		if (!text || text.trim() === '') {
			return res.status(400).json({ error: 'Пустой комментарий' });
		}
		const newComment = {
			name: name && name.trim() ? name.trim() : 'Аноним',
			text: text.trim(),
			createdAt: new Date()
		};
		await commentsCollection.insertOne(newComment);
		res.json({ ok: true, comment: newComment });
	} catch (err) {
		res.status(500).json({ error: 'Ошибка записи' });
	}
});

start();