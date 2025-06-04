const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_PATH = path.join(__dirname, 'data', 'content.json');

app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static('public'));

function loadContent() {
  const raw = fs.readFileSync(DATA_PATH, 'utf8');
  return JSON.parse(raw);
}

function saveContent(data) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

function render(template, data) {
  let html = fs.readFileSync(path.join(__dirname, 'views', template), 'utf8');
  for (const [key, value] of Object.entries(data)) {
    const regex = new RegExp(`{{\s*${key}\s*}}`, 'g');
    html = html.replace(regex, value);
  }
  return html;
}

app.get('/', (req, res) => {
  const content = loadContent();
  res.send(render('index.html', content));
});

app.get('/admin', (req, res) => {
  const content = loadContent();
  res.send(render('admin.html', content));
});

app.post('/admin', (req, res) => {
  const { title, welcome, message } = req.body;
  saveContent({ title, welcome, message });
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
