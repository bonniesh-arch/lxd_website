let refinementData = JSON.parse(localStorage.getItem('refinement-data')) || {};
let allIdeas = JSON.parse(localStorage.getItem('ideas')) || [];
let selectedIdea = JSON.parse(localStorage.getItem('selected-idea')) || {};
let chatMessages = [];
let integrationFinalIdea = '';
const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3001' 
  : '';

function renderIntegrationChat() {
  const content = document.getElementById('main-content');
  const inProgressIdea = refinementData.inProgressIdea || '';
  
  content.innerHTML = `
    <div style="max-width: 900px; margin: 0 auto; width: 100%;">
      <!-- Info Section -->
      <div style="margin-bottom: 2rem;">
        <h1 style="font-family: var(--font-serif); font-size: 1.8rem; margin: 0 0 1rem 0;">Refine with Integration</h1>
        <p style="color: var(--mid-gray); margin-bottom: 1rem;">Let's integrate elements from your other ideas. Chat with our AI researcher as much as you need, then submit your final integrated idea.</p>
        
        <div style="background: var(--accent); color: white; padding: 1.5rem; border-radius: 6px;">
          <div style="font-size: 0.9rem; opacity: 0.9; margin-bottom: 0.5rem;">Your Refined Idea:</div>
          <div style="font-family: var(--font-serif); font-size: 1rem; line-height: 1.6;">${inProgressIdea}</div>
        </div>
      </div>

      <!-- Chat History -->
      <div id="chat-history" style="padding: 1.5rem; background: var(--cream); border-radius: 6px; margin-bottom: 1.5rem; border: 1.5px solid var(--warm-gray);">
        <div id="messages"></div>
      </div>

      <!-- Final Idea Section -->
      <div style="background: var(--accent); color: white; padding: 1.5rem; border-radius: 6px; margin-bottom: 1.5rem;">
        <h3 style="margin: 0 0 0.75rem 0; font-size: 1rem;">Your Integration Refinement</h3>
        <textarea 
          id="integration-final-idea"
          placeholder="Write your final integrated idea here..."
          style="width: 100%; min-height: 100px; padding: 1rem; border: none; border-radius: 4px; font-family: var(--font-sans); font-size: 0.95rem; resize: vertical; box-sizing: border-box; color: var(--ink); background: white;"
        >${integrationFinalIdea}</textarea>
      </div>

      <!-- Input Section -->
      <div id="input-section" style="display: flex; flex-direction: column; gap: 1rem;"></div>

      <!-- Submit and Back Buttons -->
      <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
        <button class="btn btn-secondary" onclick="location.href='integration.html'" style="flex: 1;">Back to Integration</button>
        <button class="btn btn-primary" onclick="submitIntegrationFinalIdea()" style="flex: 1;">Submit Final Idea</button>
      </div>
    </div>
  `;
  
  renderMessages();
  setupInputSection();
}

function renderMessages() {
  const messagesContainer = document.getElementById('messages');
  messagesContainer.innerHTML = '';
  
  chatMessages.forEach((msg, idx) => {
    const isUser = msg.role === 'user';
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
      margin-bottom: 1rem;
      display: flex;
      justify-content: ${isUser ? 'flex-end' : 'flex-start'};
      animation: fadeIn 0.3s ease-in;
    `;
    
    const bubble = document.createElement('div');
    bubble.style.cssText = `
      max-width: 70%;
      padding: 1rem;
      border-radius: 8px;
      background: ${isUser ? 'var(--accent)' : 'white'};
      color: ${isUser ? 'white' : 'var(--ink)'};
      border: ${isUser ? 'none' : '1.5px solid var(--warm-gray)'};
      line-height: 1.6;
      word-wrap: break-word;
    `;
    bubble.textContent = msg.content;
    messageDiv.appendChild(bubble);
    messagesContainer.appendChild(messageDiv);
  });
  
  // Auto scroll to bottom
  const chatHistory = document.getElementById('chat-history');
  if (chatHistory) {
    chatHistory.scrollTop = chatHistory.scrollHeight;
  }
}

function setupInputSection() {
  const inputSection = document.getElementById('input-section');
  inputSection.innerHTML = `
    <textarea id="user-response" placeholder="Type your message..." style="width: 100%; min-height: 80px; padding: 1rem; border: 1.5px solid var(--warm-gray); border-radius: 6px; font-family: var(--font-sans); font-size: 0.95rem; resize: vertical; box-sizing: border-box; background: white;"></textarea>
    <button class="btn btn-primary" onclick="submitChatMessage()" style="align-self: flex-end;">Send Message</button>
  `;
}

function submitChatMessage() {
  const userResponse = document.getElementById('user-response').value.trim();
  
  if (!userResponse) {
    alert('Please type a message.');
    return;
  }
  
  // Add user message
  chatMessages.push({
    role: 'user',
    content: userResponse
  });
  
  document.getElementById('user-response').value = '';
  renderMessages();
  
  // Get AI response
  fetchIntegrationAiResponse(userResponse);
}

async function fetchIntegrationAiResponse(userMessage) {
  const inputSection = document.getElementById('input-section');
  inputSection.innerHTML = '<div style="color: var(--mid-gray); text-align: center; padding: 1rem;">AI Researcher is thinking...</div>';
  
  try {
    const inProgressIdea = refinementData.inProgressIdea || '';
    const otherIdeas = allIdeas.filter((_, idx) => selectedIdea.index !== idx);
    
    const systemPrompt = `You are an expert AI Researcher helping to integrate elements from other ideas into a refined concept. 
The user's current refined idea is: "${inProgressIdea}"

Other ideas available for integration:
${otherIdeas.map((idea, i) => `${i + 1}. ${idea}`).join('\n')}

Help the user explore how elements from other ideas can strengthen their refined concept. Be encouraging and ask clarifying questions about what elements they'd like to integrate.`;

    const apiUrl = API_URL ? `${API_URL}/api/chat` : '/api/chat';
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: userMessage,
        system: systemPrompt,
        conversationHistory: chatMessages.map(msg => ({
          type: msg.role === 'user' ? 'user' : 'ai',
          text: msg.content
        }))
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success || !data.message) {
      throw new Error(data.error || 'No message in response');
    }
    
    const aiMessage = data.message;
    
    chatMessages.push({
      role: 'assistant',
      content: aiMessage
    });
    
    renderMessages();
    setupInputSection();
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to get AI response. Please try again.');
    renderMessages();
    setupInputSection();
  }
}

function submitIntegrationFinalIdea() {
  integrationFinalIdea = document.getElementById('integration-final-idea').value.trim();
  
  if (!integrationFinalIdea) {
    alert('Please write your final integrated idea.');
    return;
  }
  
  // Save final idea to refinement data
  refinementData.finalIdea = integrationFinalIdea;
  refinementData.integrationMessages = chatMessages.length;
  localStorage.setItem('refinement-data', JSON.stringify(refinementData));
  
  // Go to report
  location.href = 'report.html';
}

// Initialize on page load
renderIntegrationChat();

// Start AI conversation
window.addEventListener('load', () => {
  setTimeout(() => {
    const inProgressIdea = refinementData.inProgressIdea || '';
    const otherIdeasCount = allIdeas.filter((_, idx) => selectedIdea.index !== idx).length;
    
    const initialMessage = `Great! Now let's integrate elements from your other ${otherIdeasCount} ideas to strengthen your concept:\n\n"${inProgressIdea}"\n\nWhich elements or features from your other ideas would you like to explore incorporating? Or would you like my suggestions?`;
    
    chatMessages.push({
      role: 'assistant',
      content: initialMessage
    });
    
    renderMessages();
  }, 300);
});
