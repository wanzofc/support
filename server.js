const express = require('express');
const cors = require('cors');
const path = require('path'); // Untuk menangani path file

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Menyediakan path langsung untuk file HTML, JS, dan CSS
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'base.html')); // Mengarahkan ke base.html
});

app.get('/app.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'app.js')); // Mengarahkan ke app.js
});

app.get('/style.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'style.css')); // Mengarahkan ke style.css
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
