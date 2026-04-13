let allIdeas = JSON.parse(localStorage.getItem('ideas')) || [];
let selectedIdea = JSON.parse(localStorage.getItem('selected-idea')) || {};
let chatMessages = [];
let currentQuestion = 0;
let userMessageCount = 0; // Count only user messages
let phase = 'refinement'; // 'refinement', 'in-progress', 'integration', 'optional-integration'
let inProgressIdea = '';
let integrationResponse = null;
const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3001' 
  : '';
const questions = REFINEMENT_QUESTIONS;
const MIN_MESSAGES = 2;
const MAX_MESSAGES = 5;

function updateProgressBar() {
  const progressContainer = document.getElementById('progress-container');
  if (!progressContainer) return;
  
  const percentage = Math.min((userMessageCount / MAX_MESSAGES) * 100, 100);
  progressContainer.innerHTML = `
    <div style="margin-bottom: 1rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
        <div style="font-size: 0.85rem; font-weight: 600; color: var(--ink);">Refinement Progress</div>
        <div style="font-size: 0.85rem; color: var(--mid-gray);">${userMessageCount} / ${MAX_MESSAGES}</div>
      </div>
      <div style="width: 100%; height: 8px; background: var(--light-gray); border-radius: 4px; overflow: hidden; box-shadow: 0 2px 8px rgba(212,36,38,0.08);">
        <div style="height: 100%; background: linear-gradient(90deg, var(--accent-primary) 0%, var(--accent-secondary) 100%); width: ${percentage}%; transition: width 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);"></div>
      </div>
      ${userMessageCount < MIN_MESSAGES ? `<div style="font-size: 0.8rem; color: var(--mid-gray); margin-top: 0.5rem;">Send at least ${MIN_MESSAGES - userMessageCount} more message${MIN_MESSAGES - userMessageCount !== 1 ? 's' : ''} to proceed</div>` : ''}
    </div>
  `;
}

function renderAiFeedback() {
  const content = document.getElementById('main-content');
  
  content.innerHTML = `
    <div style="max-width: 900px; margin: 0 auto; width: 100%;">
      <!-- Progress Bar -->
      <div id="progress-container" style="margin-bottom: 1rem;"></div>
      
      <!-- Selected Idea Display -->
      <div style="background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%); color: white; padding: 1.2rem; border-radius: 6px; margin-bottom: 1rem; box-shadow: 0 8px 24px rgba(212, 36, 38, 0.2);">
        <div style="font-size: 0.85rem; opacity: 0.95; margin-bottom: 0.4rem; font-weight: 600;">Your Selected Idea:</div>
        <div style="font-family: var(--font-serif); font-size: 1.1rem; font-weight: 600; line-height: 1.5;">${selectedIdea.idea}</div>
      </div>

      <!-- Chat Container -->
      <div style="margin-bottom: 1rem; background: var(--cream); border-radius: 6px; padding: 1.5rem; border: 1.5px solid var(--warm-gray);">
        <div id="chat-container" style="display: flex; flex-direction: column; gap: 1rem;"></div>
      </div>

      <!-- Input Section -->
      <div id="input-section" style="display: flex; flex-direction: column; gap: 1rem;"></div>
    </div>
  `;
  
  // Initial AI message
  const designTask = localStorage.getItem('design-task') || '';
  const taskContext = designTask ? ` I see you're working on: "${designTask}".` : '';
  addAiMessage(`Hi! I'm your user research expert. I'll help you refine your selected idea into something powerful and polished.${taskContext}\n\nLet me ask you a few questions to deepen your thinking.\n\n${questions[0].q}`);
  
  updateProgressBar();
  
  // Show input for first question
  const inputSection = document.getElementById('input-section');
  inputSection.innerHTML = `
    <textarea id="user-response" placeholder="Type your response..." style="width: 100%; min-height: 100px; padding: 1rem; border: 1.5px solid var(--warm-gray); border-radius: 6px; font-family: var(--font-sans); font-size: 0.95rem; resize: vertical; box-sizing: border-box;"></textarea>
    <button class="btn btn-primary" onclick="submitResponse()" style="align-self: flex-end;">Submit</button>
  `;
}

function addAiMessage(text) {
  chatMessages.push({ type: 'ai', text });
  const chatContainer = document.getElementById('chat-container');
  const msgDiv = document.createElement('div');
  msgDiv.style.cssText = 'background: white; padding: 1.2rem; border-radius: 6px; border-left: 4px solid var(--accent-primary); box-shadow: 0 2px 8px rgba(212, 36, 38, 0.08);';
  msgDiv.innerHTML = `<div style="color: var(--accent-primary); font-weight: 700; margin-bottom: 0.75rem; font-size: 0.9rem;">AI Researcher</div><div style="color: var(--ink); line-height: 1.6; font-weight: 500;">${text}</div>`;
  chatContainer.appendChild(msgDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function addUserMessage(text) {
  chatMessages.push({ type: 'user', text });
  const chatContainer = document.getElementById('chat-container');
  const msgDiv = document.createElement('div');
  msgDiv.style.cssText = 'background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%); color: white; padding: 1.2rem; border-radius: 6px; margin-left: auto; max-width: 70%; text-align: left; font-weight: 500; box-shadow: 0 4px 12px rgba(212, 36, 38, 0.2);';
  msgDiv.innerHTML = text;
  chatContainer.appendChild(msgDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function askNextQuestion() {
  if (currentQuestion < questions.length) {
    const inputSection = document.getElementById('input-section');
    if (userMessageCount >= MIN_MESSAGES) {
      // Show option to continue or proceed
      inputSection.innerHTML = `
        <textarea id="user-response" placeholder="Type your response..." style="width: 100%; min-height: 100px; padding: 1rem; border: 1.5px solid var(--warm-gray); border-radius: 6px; background: white; font-family: var(--font-sans); font-size: 0.95rem; resize: vertical; box-sizing: border-box;"></textarea>
        <div style="display: flex; gap: 1rem;">
          <button class="btn btn-primary" onclick="submitResponse()" style="flex: 1;">Continue Chatting</button>
          <button class="btn btn-secondary" onclick="proceedToInProgress()" style="flex: 1;">Next Step ➜</button>
        </div>
      `;
    } else {
      // Just show submit button (not at minimum yet)
      inputSection.innerHTML = `
        <textarea id="user-response" placeholder="Type your response..." style="width: 100%; min-height: 100px; padding: 1rem; border: 1.5px solid var(--warm-gray); border-radius: 6px; background: white; font-family: var(--font-sans); font-size: 0.95rem; resize: vertical; box-sizing: border-box;"></textarea>
        <button class="btn btn-primary" onclick="submitResponse()" style="align-self: flex-end;">Submit</button>
      `;
    }
  }
}

function proceedToInProgress() {
  phase = 'in-progress';
  showInProgressForm();
}

function submitResponse() {
  const response = document.getElementById('user-response').value.trim();
  
  if (!response) {
    alert('Please enter a response.');
    return;
  }
  
  addUserMessage(response);
  userMessageCount++; // Increment user message count
  updateProgressBar();
  
  // Disable input while fetching
  document.getElementById('user-response').disabled = true;
  document.querySelector('button[onclick="submitResponse()"]').disabled = true;
  
  // Send to AI for feedback
  fetchAiFeedback(response);
}

async function fetchAiFeedback(userResponse) {
  try {
    const designTask = localStorage.getItem('design-task') || '';
    let prompt;
    
    // Create appropriate prompt based on phase
    if (phase === 'refinement') {
      prompt = getAiResearcherSinglePrompt(selectedIdea.idea, userResponse, designTask);
    } else if (phase === 'optional-integration') {
      const otherIdeas = allIdeas.filter((_, idx) => selectedIdea.index !== idx).map(idea => `- ${idea}`).join('\n');
      prompt = `You are a user research expert and product designer. The user has this refined core idea:\n\n"${inProgressIdea}"\n\nThey want to explore integrating elements from these other ideas:\n\n${otherIdeas}\n\nThey responded: "${userResponse}"\n\nSuggest specific ways to strengthen the main idea by incorporating relevant elements from the other ideas. Keep it focused and actionable. No more than 5 sentences. End with a question to help them think deeper about the integration.`;
    }
    
    // Add thinking indicator
    addAiMessage('🤔 Thinking...');
    
    const apiUrl = API_URL ? `${API_URL}/api/chat` : '/api/chat';
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: prompt,
        conversationHistory: chatMessages
      })
    });

    const data = await response.json();

    // Remove thinking message
    const chatContainer = document.getElementById('chat-container');
    if (chatContainer && chatContainer.lastChild) {
      const lastMessage = chatContainer.lastChild.textContent;
      if (lastMessage.includes('Thinking')) {
        chatContainer.removeChild(chatContainer.lastChild);
      }
    }

    if (data.success && data.message) {
      addAiMessage(data.message);
      currentQuestion++;
      
      // After max messages, force move to next phase
      if (phase === 'refinement' && userMessageCount >= MAX_MESSAGES) {
        setTimeout(() => {
          addAiMessage('Great progress! You\'ve sent the maximum number of messages. Let\'s capture your current thinking.');
          phase = 'in-progress';
          showInProgressForm();
        }, 500);
      } 
      // After min messages, show option to proceed but allow continued chatting
      else if (phase === 'refinement' && userMessageCount >= MIN_MESSAGES) {
        setTimeout(() => {
          const inputSection = document.getElementById('input-section');
          inputSection.innerHTML = `
            <textarea id="user-response" placeholder="Type your response..." style="width: 100%; min-height: 100px; padding: 1rem; border: 1.5px solid var(--warm-gray); border-radius: 6px; font-family: var(--font-sans); font-size: 0.95rem; resize: vertical; box-sizing: border-box;"></textarea>
            <div style="display: flex; gap: 1rem;">
              <button class="btn btn-primary" onclick="submitResponse()" style="flex: 1;">Continue Chatting</button>
              <button class="btn btn-secondary" onclick="proceedToInProgress()" style="flex: 1;">Next Step ➜</button>
            </div>
          `;
        }, 500);
      } 
      // Continue before min messages
      else if (phase === 'refinement') {
        setTimeout(() => {
          askNextQuestion();
        }, 500);
      } else if (phase === 'optional-integration') {
        setTimeout(() => {
          const inputSection = document.getElementById('input-section');
          inputSection.innerHTML = `
            <textarea id="user-response" placeholder="Type your response..." style="width: 100%; min-height: 100px; padding: 1rem; border: 1.5px solid var(--warm-gray); border-radius: 6px; font-family: var(--font-sans); font-size: 0.95rem; resize: vertical; box-sizing: border-box;"></textarea>
            <button class="btn btn-primary" onclick="submitResponse()" style="align-self: flex-end;">Continue Chat</button>
            <button class="btn btn-secondary" onclick="proceedToFinalization()" style="align-self: flex-end;">Finish Refinement</button>
          `;
        }, 500);
      }
    } else {
      const errorMsg = data.error || 'API request failed';
      console.error('API Error:', data);
      addAiMessage(`Sorry, I encountered an error: ${errorMsg}`);
      const inputSection = document.getElementById('input-section');
      inputSection.innerHTML = `
        <textarea id="user-response" placeholder="Type your response..." style="width: 100%; min-height: 100px; padding: 1rem; border: 1.5px solid var(--warm-gray); border-radius: 6px; font-family: var(--font-sans); font-size: 0.95rem; resize: vertical; box-sizing: border-box;"></textarea>
        <button class="btn btn-primary" onclick="submitResponse()" style="align-self: flex-end;">Submit</button>
      `;
    }
  } catch (error) {
    console.error('Error:', error);
    addAiMessage('Connection error. Please ensure your backend server is running or check your deployed service.');
    const inputSection = document.getElementById('input-section');
    inputSection.innerHTML = `
      <textarea id="user-response" placeholder="Type your response..." style="width: 100%; min-height: 100px; padding: 1rem; border: 1.5px solid var(--warm-gray); border-radius: 6px; font-family: var(--font-sans); font-size: 0.95rem; resize: vertical; box-sizing: border-box;"></textarea>
      <button class="btn btn-primary" onclick="submitResponse()" style="align-self: flex-end;">Submit</button>
    `;
  }
}

function showInProgressForm() {
  const inputSection = document.getElementById('input-section');
  inputSection.innerHTML = `
    <div style="background: var(--cream); border: 1.5px solid var(--warm-gray); padding: 1.5rem; border-radius: 6px;">
      <h3 style="margin: 0 0 1rem 0; font-family: var(--font-serif); font-size: 1.1rem; color: var(--ink);">Your In-Progress Idea</h3>
      <p style="color: var(--mid-gray); font-size: 0.95rem; margin: 0 0 1rem 0;">Based on our conversation, write your current refined version of this idea:</p>
      <textarea 
        id="in-progress-idea"
        placeholder="Write your refined idea here..."
        style="width: 100%; min-height: 150px; padding: 1rem; border: 1.5px solid var(--warm-gray); border-radius: 4px; font-family: var(--font-sans); font-size: 0.95rem; resize: vertical; box-sizing: border-box; margin-bottom: 1rem;"
      >${inProgressIdea}</textarea>
      <button class="btn btn-primary" onclick="submitInProgressIdea()" style="width: 100%;">Next: Explore Integration</button>
    </div>
  `;
}

function submitInProgressIdea() {
  inProgressIdea = document.getElementById('in-progress-idea').value.trim();
  
  if (!inProgressIdea) {
    alert('Please write your in-progress idea.');
    return;
  }
  
  // Save refinement data
  const refinementData = {
    selectedIdea: selectedIdea.idea,
    inProgressIdea: inProgressIdea,
    userMessageCount: userMessageCount,
    chatHistory: chatMessages,
    conversations: userMessageCount
  };
  
  localStorage.setItem('refinement-data', JSON.stringify(refinementData));
  
  // Redirect to integration page
  location.href = 'integration.html';
}

function chooseIntegration(wantsIntegration) {
  if (wantsIntegration) {
    integrationResponse = true;
    addAiMessage(`Great! Let's explore integrating elements from your other ideas. Looking at your refined idea:\n\n"${inProgressIdea}"\n\nWhat aspects or features from your other ideas feel most valuable or exciting to include?`);
    phase = 'optional-integration';
    
    setTimeout(() => {
      const inputSection = document.getElementById('input-section');
      inputSection.innerHTML = `
        <textarea id="user-response" placeholder="Type your response..." style="width: 100%; min-height: 100px; padding: 1rem; border: 1.5px solid var(--warm-gray); border-radius: 6px; font-family: var(--font-sans); font-size: 0.95rem; resize: vertical; box-sizing: border-box;"></textarea>
        <button class="btn btn-primary" onclick="submitResponse()" style="align-self: flex-end;">Continue Chat</button>
        <button class="btn btn-secondary" onclick="proceedToFinalization()" style="align-self: flex-end;">Finish Refinement</button>
      `;
    }, 500);
  } else {
    integrationResponse = false;
    addAiMessage('Perfect! Let\'s finalize your refined idea as is.');
    setTimeout(() => {
      proceedToFinalization();
    }, 1000);
  }
}

function proceedToFinalization() {
  // Save refinement data including in-progress idea and integration response
  const refinementData = {
    selectedIdea: selectedIdea.idea,
    inProgressIdea: inProgressIdea,
    userMessageCount: userMessageCount,
    integrationApplied: integrationResponse,
    chatHistory: chatMessages,
    conversations: userMessageCount
  };
  
  localStorage.setItem('refinement-data', JSON.stringify(refinementData));
  
  // Skip finalization page and go directly to report
  location.href = 'integration.html';
}

renderAiFeedback();
