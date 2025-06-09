// AI Assistant functionality using Gemini Pro API
class AIAssistant {
    constructor() {
        this.apiUrl = 'https://api.siputzx.my.id/api/ai/gemini-pro';
        this.cleanup();
        this.setupEventListeners();
        // Only add welcome message if messages container is empty
        const messagesContainer = document.getElementById('chat-messages');
        if (messagesContainer && messagesContainer.children.length === 0) {
            this.addWelcomeMessage();
        }
    }

    cleanup() {
        // Clear any existing messages first
        const messagesContainer = document.getElementById('chat-messages');
        if (messagesContainer) {
            messagesContainer.innerHTML = '';
        }
        
        // Remove any existing chat containers except the first one
        const chatContainers = document.querySelectorAll('.chat-container');
        for (let i = 1; i < chatContainers.length; i++) {
            chatContainers[i].remove();
        }
    }

    setupEventListeners() {
        const sendButton = document.querySelector('.chat-send-button');
        const input = document.querySelector('.chat-input');
        
        if (sendButton && input) {
            // Remove any existing event listeners
            const newSendButton = sendButton.cloneNode(true);
            sendButton.parentNode.replaceChild(newSendButton, sendButton);
            
            const newInput = input.cloneNode(true);
            input.parentNode.replaceChild(newInput, input);
            
            // Add new event listeners
            newSendButton.addEventListener('click', () => this.handleSendMessage());
            newInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleSendMessage();
                }
            });
        }
    }

    addWelcomeMessage() {
        const messagesContainer = document.getElementById('chat-messages');
        if (messagesContainer && messagesContainer.children.length === 0) {
            const welcomeMessage = document.createElement('div');
            welcomeMessage.className = 'chat-message ai-message';
            welcomeMessage.innerHTML = `
                <i class="fas fa-robot message-icon"></i>
                <div class="message-content">Halo! Saya asisten AI yang siap membantu Anda. Ada yang bisa saya bantu?</div>
            `;
            messagesContainer.appendChild(welcomeMessage);
        }
    }

    async handleSendMessage() {
        const input = document.querySelector('.chat-input');
        const message = input.value.trim();
        
        if (!message) return;
        
        // Clear input
        input.value = '';
        
        // Add user message
        this.addMessage('user', message);
        
        try {
            // Show typing indicator
            const typingIndicator = this.showTypingIndicator();
            
            // Get AI response
            const response = await this.sendMessage(message);
            
            // Remove typing indicator
            typingIndicator.remove();
            
            // Add AI response
            this.addMessage('ai', response);
        } catch (error) {
            console.error('Error:', error);
            this.addErrorMessage('Maaf, terjadi kesalahan. Silakan coba lagi.');
        }
    }

    addMessage(type, content) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${type}-message`;
        
        if (type === 'ai') {
            messageDiv.innerHTML = `
                <i class="fas fa-robot message-icon"></i>
                <div class="message-content">${content}</div>
            `;
        } else {
            messageDiv.innerHTML = `<div class="message-content">${content}</div>`;
        }
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    addErrorMessage(message) {
        const messagesContainer = document.getElementById('chat-messages');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'chat-message error-message';
        errorDiv.textContent = message;
        messagesContainer.appendChild(errorDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('chat-messages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.innerHTML = '<span></span><span></span><span></span>';
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        return typingDiv;
    }

    async sendMessage(message) {
        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    'Origin': 'https://api.siputzx.my.id',
                    'Referer': 'https://api.siputzx.my.id/post/documentation/',
                    'sec-fetch-site': 'same-origin',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-dest': 'empty',
                    'accept-language': 'en-US,en;q=0.9,id;q=0.8'
                },
                body: JSON.stringify({
                    content: message
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data.status && data.data) {
                return data.data;
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            console.error('Error sending message to AI:', error);
            throw error;
        }
    }
}

// Create a chat interface to interact with the AI
class ChatInterface {
    constructor() {
        this.aiAssistant = new AIAssistant();
        this.setupChatInterface();
    }

    setupChatInterface() {
        // Create chat container if it doesn't exist
        const chatContainer = document.getElementById('chat-container') || this.createChatContainer();
        
        // Create header
        const header = document.createElement('div');
        header.className = 'chat-header';
        header.innerHTML = `
            <div class="chat-title">
                <i class="fas fa-robot"></i>
                Chat with Assistant AI
            </div>
            <button class="chat-close-btn">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Create messages container
        const messagesDiv = document.createElement('div');
        messagesDiv.className = 'chat-messages';
        messagesDiv.id = 'chat-messages';
        
        // Create input container
        const inputContainer = document.createElement('div');
        inputContainer.className = 'chat-input-container';
        
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Ketik pesan Anda...';
        input.className = 'chat-input';
        
        const sendButton = document.createElement('button');
        sendButton.className = 'chat-send-button';
        sendButton.innerHTML = '<i class="fas fa-paper-plane"></i>';
        
        inputContainer.appendChild(input);
        inputContainer.appendChild(sendButton);
        
        // Add all elements to container
        chatContainer.appendChild(header);
        chatContainer.appendChild(messagesDiv);
        chatContainer.appendChild(inputContainer);

        // Add event listeners
        sendButton.addEventListener('click', () => this.sendMessage(input.value));
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage(input.value);
            }
        });
        
        // Add close button functionality
        header.querySelector('.chat-close-btn').addEventListener('click', () => {
            chatContainer.classList.remove('active');
            document.getElementById('chatToggleBtn').style.display = 'flex';
        });

        // Add welcome message
        this.addMessageToChat('ai', 'Halo! Saya asisten AI yang siap membantu Anda. Ada yang bisa saya bantu?');
    }

    createChatContainer() {
        const container = document.createElement('div');
        container.id = 'chat-container';
        container.className = 'chat-container';
        document.body.appendChild(container);
        return container;
    }

    async sendMessage(message) {
        if (!message.trim()) return;

        const input = document.querySelector('.chat-input');
        input.value = '';

        // Add user message to chat
        this.addMessageToChat('user', message);

        try {
            // Show typing indicator
            const typingIndicator = this.addTypingIndicator();
            
            // Get AI response
            const response = await this.aiAssistant.sendMessage(message);
            
            // Remove typing indicator
            typingIndicator.remove();
            
            // Add AI response
            this.addMessageToChat('ai', response);
        } catch (error) {
            this.addMessageToChat('error', 'Maaf, terjadi kesalahan. Silakan coba lagi.');
        }
    }

    addTypingIndicator() {
        const messagesContainer = document.getElementById('chat-messages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat-message ai-message typing-indicator';
        typingDiv.innerHTML = '<span></span><span></span><span></span>';
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        return typingDiv;
    }

    addMessageToChat(type, message) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${type}-message`;
        
        // Add icon for AI messages
        if (type === 'ai') {
            messageDiv.innerHTML = `
                <i class="fas fa-robot message-icon"></i>
                <div class="message-content">${message}</div>
            `;
        } else {
            messageDiv.innerHTML = `<div class="message-content">${message}</div>`;
        }
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

// Single initialization point
let aiAssistantInstance = null;

const initializeChat = () => {
    if (aiAssistantInstance) {
        return;
    }

    const chatToggleBtn = document.getElementById('chatToggleBtn');
    const chatContainer = document.getElementById('chat-container');
    const chatCloseBtn = document.querySelector('.chat-close-btn');
    
    if (chatToggleBtn && chatContainer && chatCloseBtn) {
        // Remove existing event listeners
        const newChatToggleBtn = chatToggleBtn.cloneNode(true);
        chatToggleBtn.parentNode.replaceChild(newChatToggleBtn, chatToggleBtn);
        
        const newChatCloseBtn = chatCloseBtn.cloneNode(true);
        chatCloseBtn.parentNode.replaceChild(newChatCloseBtn, chatCloseBtn);
        
        // Add new event listeners
        newChatToggleBtn.addEventListener('click', () => {
            chatContainer.classList.add('active');
            newChatToggleBtn.style.display = 'none';
        });
        
        newChatCloseBtn.addEventListener('click', () => {
            chatContainer.classList.remove('active');
            newChatToggleBtn.style.display = 'flex';
        });
    }
    
    // Create single instance
    aiAssistantInstance = new AIAssistant();
};

// Initialize only once when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeChat);
} else {
    initializeChat();
} 