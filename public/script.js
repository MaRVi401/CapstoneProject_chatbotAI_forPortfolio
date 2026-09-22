// Elemen-elemen DOM untuk pop-up
const openChatbotBtn = document.getElementById('open-chatbot-btn');
const closeChatbotBtn = document.getElementById('close-chatbot-btn');
const chatbotPopup = document.getElementById('chatbot-popup');

// Elemen-elemen untuk fungsionalitas chat
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');

// Logika untuk membuka dan menutup pop-up
openChatbotBtn.addEventListener('click', () => {
    chatbotPopup.classList.add('active');
    openChatbotBtn.style.display = 'none';
});

closeChatbotBtn.addEventListener('click', () => {
    chatbotPopup.classList.remove('active');
    openChatbotBtn.style.display = 'flex';
});

// Logika utama untuk mengirim pesan
chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userMessage = chatInput.value;
    if (!userMessage) return;

    addMessageToChat('user', userMessage);
    chatInput.value = '';

    try {
        const response = await fetch('/.netlify/functions/chatbot', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userMessage })
        });
        
        const data = await response.json();
        addMessageToChat('ai', data.reply || data.error);
    } catch (error) {
        console.error("Error:", error);
        addMessageToChat('ai', "Maaf, terjadi kesalahan saat berkomunikasi.");
    }
});

// Fungsi untuk menambahkan pesan ke jendela chat
function addMessageToChat(sender, text) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    
    // Jika pesan dari AI, ubah teks Markdown menjadi HTML yang rapi
    if (sender === 'ai') {
        if (typeof marked !== 'undefined') {
            messageElement.innerHTML = marked.parse(text);
        } else {
            // Fallback sederhana jika marked.js belum terawat
            let formattedText = text
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\n/g, '<br>');
            messageElement.innerHTML = formattedText;
        }
    } else {
        messageElement.textContent = text;
    }

    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll
}