const express = require('express');
const fs = require('node:fs');

const app = express();

app.use(express.json());

app.get('/categories', (req, res) => {
    const data = fs.readFileSync('data.json', 'utf-8');
    const jsonData = JSON.parse(data);

    res.json(jsonData);
});

app.get('/categories/:id', (req, res) => {
    res.send('Category read' + req.params.id);
});

app.post('/categories', (req, res) => {
    const category = req.body;
    const data = fs.readFileSync('data.json', 'utf-8');
    const jsonData = JSON.parse(data);
    jsonData.categories.push(category);
    fs.writeFileSync('data.json', JSON.stringify(jsonData, null, 2));
    res.status(201).json({ message: 'Category created' });
});

app.patch('/categories', (req, res) => {
    res.send('Category updated');
});

app.delete('/categories/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const data = fs.readFileSync('data.json', 'utf-8');
    const jsonData = JSON.parse(data);
    jsonData.categories = jsonData.categories.filter(category => category.id !== id);
    fs.writeFileSync('data.json', JSON.stringify(jsonData, null, 2));
    res.send('Category deleted');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
