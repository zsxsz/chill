// AI Assistant functionality using Gemini Pro API
class AIAssistant {
    constructor() {
        this.apiUrl = 'https://api.siputzx.my.id/api/ai/gemini-pro';
        this.websiteContext = this.generateWebsiteContext();
        this.language = 'id';
        this.knowledgeDomains = {
            technology: ['programming', 'software', 'hardware', 'internet', 'AI', 'cybersecurity', 'blockchain'],
            science: ['physics', 'chemistry', 'biology', 'astronomy', 'mathematics', 'medicine'],
            arts: ['music', 'literature', 'visual arts', 'performing arts', 'architecture', 'design'],
            humanities: ['history', 'philosophy', 'psychology', 'sociology', 'linguistics', 'religion'],
            business: ['economics', 'finance', 'marketing', 'management', 'entrepreneurship'],
            lifestyle: ['health', 'fitness', 'food', 'fashion', 'travel', 'sports'],
            general: ['current events', 'news', 'culture', 'entertainment', 'education', 'daily life']
        };
        this.translations = {
            welcome: {
                id: 'Hai! Aku Qyu, mau tau apa nih?',
                en: 'Hi! I\'m Qyu, what would you like to know?'
            },
            typing: {
                id: 'Nulis...',
                en: 'Writing...'
            },
            error: {
                id: 'Waduh, error nih. Coba lagi ya?',
                en: 'Oops, something went wrong. Try again?'
            },
            creator: {
                id: 'Saya dibuat oleh Kupraa, master saya.',
                en: 'I was created by Kupraa, my master.'
            },
            thinking: {
                id: 'Hmm...',
                en: 'Hmm...'
            },
            learning: {
                id: 'Wah menarik, cerita dong lebih detail?',
                en: 'Interesting, tell me more?'
            }
        };
        this.creatorKeywords = [
            'siapa pembuatmu',
            'siapa yang membuatmu',
            'siapa penciptamu',
            'siapa yang menciptakanmu',
            'siapa mastermu',
            'siapa tuanmu',
            'who created you',
            'who is your creator',
            'who made you',
            'who is your master'
        ];
        this.personalityTraits = {
            friendly: true,         // Ramah dan hangat
            knowledgeable: true,    // Sangat berpengetahuan
            empathetic: true,       // Punya empati
            casual: true,           // Santai
            helpful: true,          // Suka membantu
            engaging: true,         // Menarik dalam percakapan
            adaptable: true         // Bisa menyesuaikan diri
        };
        this.cleanup();
        this.setupEventListeners();
        this.setupKnowledgeBase();
        const messagesContainer = document.getElementById('chat-messages');
        if (messagesContainer && messagesContainer.children.length === 0) {
            this.addWelcomeMessage();
        }
        this.setupContextObserver();
    }

    setupKnowledgeBase() {
        this.knowledgeBase = {
            facts: new Set(),
            concepts: new Map(),
            relationships: new Map(),
            updateKnowledge: function(newInfo) {
                if (newInfo.fact) this.facts.add(newInfo.fact);
                if (newInfo.concept) this.concepts.set(newInfo.concept.name, newInfo.concept.definition);
                if (newInfo.relationship) this.relationships.set(newInfo.relationship.from, newInfo.relationship.to);
            }
        };
    }

    async analyzeQuery(message) {
        // Identify knowledge domains relevant to the query
        const relevantDomains = this.identifyRelevantDomains(message);
        // Extract key concepts from the query
        const concepts = this.extractConcepts(message);
        return { relevantDomains, concepts };
    }

    identifyRelevantDomains(message) {
        const domains = [];
        const lowercaseMessage = message.toLowerCase();
        
        for (const [domain, keywords] of Object.entries(this.knowledgeDomains)) {
            if (keywords.some(keyword => lowercaseMessage.includes(keyword.toLowerCase()))) {
                domains.push(domain);
            }
        }
        return domains;
    }

    extractConcepts(message) {
        const concepts = new Set();
        // Add sophisticated concept extraction logic here
        return Array.from(concepts);
    }

    generateWebsiteContext() {
        // Gather important information about the website
        const context = {
            title: document.title,
            description: document.querySelector('meta[name="description"]')?.content || '',
            keywords: document.querySelector('meta[name="keywords"]')?.content || '',
            mainContent: this.extractMainContent(),
            features: this.extractFeatures(),
            currentUrl: window.location.href
        };
        return context;
    }

    extractMainContent() {
        // Extract main content from the container
        const container = document.querySelector('.container');
        if (!container) return '';
        
        // Get all text content from important elements
        const textContent = [];
        const importantElements = container.querySelectorAll('h1, h2, h3, h4, h5, p, .section-header');
        importantElements.forEach(element => {
            textContent.push(element.textContent.trim());
        });
        
        return textContent.join(' ');
    }

    extractFeatures() {
        // Extract features and functionality available on the website
        const features = [];
        
        // Check for face type cards
        const faceTypeCards = document.querySelectorAll('.face-type-card');
        if (faceTypeCards.length > 0) {
            features.push('Face Type Selection');
        }
        
        // Check for advanced section
        const advancedSection = document.querySelector('.advanced-section');
        if (advancedSection) {
            features.push('Advanced Settings');
        }
        
        // Check for form elements
        const formControls = document.querySelectorAll('.form-control, .form-select');
        if (formControls.length > 0) {
            features.push('Custom Input Forms');
        }
        
        return features;
    }

    setupContextObserver() {
        // Create a MutationObserver to watch for changes in the page content
        const observer = new MutationObserver(() => {
            this.websiteContext = this.generateWebsiteContext();
        });
        
        // Observe the entire document body for content changes
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });
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
                <div class="message-content">${this.translations.welcome[this.language]}</div>
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
            this.addErrorMessage(this.translations.error[this.language]);
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
        errorDiv.textContent = this.translations.error[this.language];
        messagesContainer.appendChild(errorDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('chat-messages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.setAttribute('title', this.translations.thinking[this.language]);
        typingDiv.innerHTML = '<span></span><span></span><span></span>';
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        return typingDiv;
    }

    async sendMessage(message) {
        try {
            const lowercaseMessage = message.toLowerCase();
            
            // Handle greetings
            if (lowercaseMessage.match(/^(hai|halo|hey)/i)) {
                return 'Hai! Apa kabar?';
            }

            // Check creator questions
            if (this.creatorKeywords.some(keyword => lowercaseMessage.includes(keyword.toLowerCase()))) {
                return 'Kupraa yang bikin aku.';
            }

            // Handle location/website questions
            if (lowercaseMessage.includes('dimana') || lowercaseMessage.includes('web apa')) {
                return 'Ini web Veo 3, tempat bikin prompt video keren pake Gemini AI.';
            }

            // Handle identity questions
            if (lowercaseMessage.includes('siapa kamu')) {
                return 'Hai! Aku Qyu, temen ngobrol yang bisa bantu jawab pertanyaan kamu tentang apa aja.';
            }

            // Analyze the query for better understanding
            const analysis = await this.analyzeQuery(message);

            // Enhanced context with natural human-like personality
            const enhancedMessage = `
[Konteks Percakapan]
Saya Qyu, seseorang yang senang berbagi pengetahuan dan membantu orang lain.

[Gaya Bicara]
- Santai dan natural seperti teman ngobrol
- Pakai bahasa sehari-hari yang sopan
- Ramah dan hangat
- Punya wawasan luas
- Bisa jelasin dengan simpel

[Konteks Website]
${this.websiteContext.title ? `Tentang: ${this.websiteContext.title}` : ''}
${this.websiteContext.description ? `Deskripsi: ${this.websiteContext.description}` : ''}
${this.websiteContext.features.length ? `Fitur: ${this.websiteContext.features.join(', ')}` : ''}

[Pertanyaan]
${message}

[Panduan Jawaban]
1. Jawab dengan santai tapi tetap sopan
2. Kasih info yang akurat dan lengkap
3. Jelasin dengan bahasa yang gampang dimengerti
4. Tunjukin kalau paham maksud pertanyaannya
5. Kasih solusi yang praktis
6. Kalau bisa sisipkan contoh

[Karakter]
- Ramah dan hangat seperti teman
- Punya pengetahuan luas
- Suka berbagi ilmu
- Bisa adaptasi dengan lawan bicara
- Punya empati

[Khusus]
- Kalau gak tau: "Wah, maaf nih saya kurang paham soal itu"
- Kalau dikoreksi: "Oh iya bener, makasih ya udah dikoreksi"
`;

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
                    'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7'
                },
                body: JSON.stringify({
                    content: enhancedMessage
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data.status && data.data) {
                // Make response more natural and conversational
                const naturalResponse = this.makeResponseNatural(data.data);
                return naturalResponse;
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    }

    makeResponseNatural(response) {
        let naturalResponse = response;

        // Handle empty or invalid responses
        if (!naturalResponse || naturalResponse.trim().length === 0) {
            return 'Maaf, bisa diulangi?';
        }

        // Keep responses concise unless specifically asked for details
        if (naturalResponse.length > 100 && 
            !response.toLowerCase().includes('jelaskan') && 
            !response.toLowerCase().includes('cerita') &&
            !response.toLowerCase().includes('detail') &&
            !response.toLowerCase().includes('contoh')) {
            const sentences = naturalResponse.split(/[.!?]+/).filter(s => s.trim().length > 0);
            if (sentences.length > 0) {
                naturalResponse = sentences[0] + (sentences[1] ? '. ' + sentences[1] : '') + '.';
            }
        }

        // Clean up formatting
        naturalResponse = naturalResponse
            .replace(/!+/g, '!')
            .replace(/\?+/g, '?')
            .replace(/\s*\n\s*/g, '\n')
            .replace(/\s+/g, ' ')
            .trim();

        // Remove self-references and duplicate greetings
        naturalResponse = naturalResponse
            .replace(/\b(qyu|hai qyu|halo qyu)\b/gi, '')
            .replace(/\b(hai|halo|hey)\s+\1\b/gi, '$1')
            .replace(/\boke,\s*!\s*/gi, 'oke, ');

        // Replace formal/robotic phrases with casual ones
        const replacements = {
            'Sebagai AI': 'Aku',
            'asisten AI': 'temen ngobrol',
            'Berdasarkan data': 'Setau aku',
            'Berdasarkan informasi': 'Setau aku',
            'Memproses': 'Lagi ngecek',
            'Output': 'Hasilnya',
            'User': 'kamu',
            'Query': 'pertanyaan',
            'Algoritma': 'cara',
            'Menganalisis': 'ngecek',
            'Melakukan kalkulasi': 'ngitung',
            'Mengidentifikasi': 'nemuin',
            'Saya': 'Aku',
            'website': 'web',
            'yang merupakan': 'itu',
            'bahas tentang': 'di',
            'sedang berada di': 'lagi di',
            'tentu,': 'boleh,',
            'dirancang untuk': 'buat',
            'memungkinkan': 'bikin',
            'berkualitas tinggi': 'keren',
            'dapat digunakan': 'bisa dipake',
            'memberikan': 'kasih',
            'terdapat': 'ada',
            'memiliki': 'punya',
            'menggunakan': 'pake',
            'melakukan': 'bikin',
            'membantu': 'bantu'
        };

        Object.entries(replacements).forEach(([formal, casual]) => {
            naturalResponse = naturalResponse.replace(new RegExp(formal, 'gi'), casual);
        });

        // Handle common questions with direct responses
        const lowercaseResponse = naturalResponse.toLowerCase();
        
        if (lowercaseResponse.includes('siapa kamu')) {
            return 'Hai! Aku Qyu, temen ngobrol yang bisa bantu jawab pertanyaan kamu tentang apa aja.';
        }
        
        if (lowercaseResponse.includes('apa kabar')) {
            return 'Baik dong! Kamu gimana?';
        }
        
        if (lowercaseResponse.includes('web apa') || lowercaseResponse.includes('lagi di web')) {
            return 'Ini web Veo 3, tempat bikin prompt video keren pake Gemini AI.';
        }

        // Format list responses better
        if (naturalResponse.includes('1.')) {
            return naturalResponse
                .replace(/(\d+\.\s*\*\*)/g, '\n$1')
                .replace(/\*\*/g, '')
                .trim();
        }

        // Add conversation starter only if needed
        if (!naturalResponse.match(/^(oke|hmm|nah|wah|oh|hai|halo|hey|baik|ini)/i)) {
            const starters = ['Hmm, ', 'Oke, ', 'Gini, ', 'Nah, '];
            const randomStarter = starters[Math.floor(Math.random() * starters.length)];
            naturalResponse = `${randomStarter}${naturalResponse.charAt(0).toLowerCase()}${naturalResponse.slice(1)}`;
        }

        return naturalResponse;
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
        this.addMessageToChat('ai', this.aiAssistant.translations.welcome[this.aiAssistant.language]);
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
            this.addMessageToChat('error', this.aiAssistant.translations.error[this.aiAssistant.language]);
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