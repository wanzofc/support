const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path'); // Menambahkan modul path untuk menangani path file

const app = express();
const PORT = 8080; // Menghapus penggunaan process.env.PORT

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

class Chatbox {
    constructor() {
        this.args = {
            openButton: document.querySelector('.chatbox__button'),
            chatBox: document.querySelector('.chatbox__support'),
            sendButton: document.querySelector('.send__button'),
        };

        this.state = false;
        this.messages = [];
    }

    display() {
        const { openButton, chatBox, sendButton } = this.args;

        openButton.addEventListener('click', () => this.toggleState(chatBox));

        sendButton.addEventListener('click', () => this.onSendButton(chatBox));

        const node = chatBox.querySelector('input');
        node.addEventListener('keyup', ({ key }) => {
            if (key === 'Enter') {
                this.onSendButton(chatBox);
            }
        });
    }

    toggleState(chatbox) {
        this.state = !this.state;

        // show or hides the box
        if (this.state) {
            chatbox.classList.add('chatbox--active');
        } else {
            chatbox.classList.remove('chatbox--active');
        }
    }

    onSendButton(chatbox) {
        var textField = chatbox.querySelector('input');
        let text1 = textField.value;
        if (text1 === '') {
            return;
        }

        let msg1 = { name: 'User', message: text1 };
        this.messages.push(msg1);

        axios
            .post('http://127.0.0.1:5000/predict', { message: text1 })
            .then((response) => {
                let msg2 = { name: 'Sam', message: response.data.answer };
                this.messages.push(msg2);
                this.updateChatText(chatbox);
                textField.value = '';
            })
            .catch((error) => {
                console.error('Error:', error);
                this.updateChatText(chatbox);
                textField.value = '';
            });
    }

    updateChatText(chatbox) {
        var html = '';
        this.messages
            .slice()
            .reverse()
            .forEach(function (item, index) {
                if (item.name === 'Sam') {
                    html += '<div class="messages__item messages__item--visitor">' + item.message + '</div>';
                } else {
                    html += '<div class="messages__item messages__item--operator">' + item.message + '</div>';
                }
            });

        const chatmessage = chatbox.querySelector('.chatbox__messages');
        chatmessage.innerHTML = html;
    }
}

const chatbox = new Chatbox();
chatbox.display();

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
