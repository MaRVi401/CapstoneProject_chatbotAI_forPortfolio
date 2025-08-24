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
        const response = await fetch('/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userMessage })
        });
        
        const data = await response.json();
        addMessageToChat('ai', data.reply);
    } catch (error) {
        console.error("Error:", error);
        addMessageToChat('ai', "Maaf, terjadi kesalahan saat berkomunikasi.");
    }
});

// Fungsi untuk menambahkan pesan ke jendela chat
function addMessageToChat(sender, text) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    messageElement.textContent = text;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll
}