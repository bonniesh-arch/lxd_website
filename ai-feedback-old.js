let ideas = JSON.parse(localStorage.getItem('ideas')) || [];
let selectedIdeasData = JSON.parse(localStorage.getItem('selected-ideas')) || [];
let chatMessages = [];
let currentQuestion = 0;
const API_URL = 'http://localhost:3001';
// Use questions from ai-prompts.js
const questions = REFINEMENT_QUESTIONS;

function renderAiFeedback() {
  const content = document.getElementById('main-content');
  
  content.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 320px; gap: 2rem; max-width: 1200px; margin: 0 auto;">
      <!-- Chat Section -->
      <div style="display: flex; flex-direction: column;">
        <div style="flex: 1; overflow-y: auto; margin-bottom: 2rem; background: var(--cream); border-radius: 6px; padding: 1.5rem; border: 1.5px solid var(--warm-gray);">
          <div id="chat-container" style="display: flex; flex-direction: column; gap: 1rem;"></div>
        </div>

        <div id="input-section" style="display: flex; flex-direction: column; gap: 1rem;"></div>
      </div>

      <!-- Ideas Reference Panel -->
      <div style="background: var(--light-gray); border: 1.5px solid var(--warm-gray); border-radius: 6px; padding: 1.5rem; height: fit-content; max-height: 70vh; overflow-y: auto;">
        <h3 style="margin: 0 0 1rem 0; font-family: var(--font-serif); text-align: center; font-size: 0.95rem;">Your Ideas</h3>
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          ${ideas.map((idea, idx) => {
            const isSelected = selectedIdeasData.some(s => s.index === idx);
            return `
              <div style="padding: 0.75rem; border-radius: 4px; border: 1.5px solid ${isSelected ? 'var(--accent-dark)' : 'var(--warm-gray)'}; background: ${isSelected ? '#eff6ff' : 'white'};">
                <div style="font-size: 0.75rem; font-weight: 600; color: ${isSelected ? 'var(--accent-dark)' : 'var(--mid-gray)'}; margin-bottom: 0.25rem;">
                  ${isSelected ? '✓ Selected' : 'Idea'} ${idx + 1}
                </div>
                <div style="font-size: 0.75rem; color: var(--ink); line-height: 1.3;">${idea || '<em>Empty</em>'}</div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;
  
  // Initial AI message
  const selectedCount = selectedIdeasData.length;
  addAiMessage(`Hi! I'm your user research expert. I can see you've selected ${selectedCount} ideas. Let me ask you some questions to help you refine and improve them.\n\n${questions[0].q}`);
  
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
  msgDiv.style.cssText = 'background: white; padding: 1rem; border-radius: 6px; border-left: 3px solid var(--accent-dark);';
  msgDiv.innerHTML = `<div style="color: var(--accent-dark); font-weight: 600; margin-bottom: 0.5rem;">AI Researcher</div><div style="color: var(--ink);">${text}</div>`;
  chatContainer.appendChild(msgDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function addUserMessage(text) {
  chatMessages.push({ type: 'user', text });
  const chatContainer = document.getElementById('chat-container');
  const msgDiv = document.createElement('div');
  msgDiv.style.cssText = 'background: var(--accent-dark); color: white; padding: 1rem; border-radius: 6px; margin-left: auto; max-width: 70%;';
  msgDiv.innerHTML = text;
  chatContainer.appendChild(msgDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function askNextQuestion() {
  // Show input form for next response
  const inputSection = document.getElementById('input-section');
  inputSection.innerHTML = `
    <textarea id="user-response" placeholder="Type your response..." style="width: 100%; min-height: 100px; padding: 1rem; border: 1.5px solid var(--warm-gray); border-radius: 6px; font-family: var(--font-sans); font-size: 0.95rem; resize: vertical; box-sizing: border-box;"></textarea>
    <button class="btn btn-primary" onclick="submitResponse()" style="align-self: flex-end;">Submit</button>
  `;
}

function submitResponse() {
  const response = document.getElementById('user-response').value.trim();
  
  if (!response) {
    alert('Please enter a response.');
    return;
  }
  
  addUserMessage(response);
  
  // Disable input while fetching
  document.getElementById('user-response').disabled = true;
  document.querySelector('button[onclick="submitResponse()"]').disabled = true;
  
  // Send to AI for feedback
  fetchAiFeedback(response);
}

async function fetchAiFeedback(userResponse) {
  try {
    const selectedIdeasText = selectedIdeasData.map(s => `- ${s.idea}`).join('\n');
    const designTask = localStorage.getItem('design-task') || '';
    
    const response = await fetch(`${API_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: getAiResearcherPrompt(selectedIdeasText, userResponse, designTask),
        conversationHistory: chatMessages
      })
    });

    const data = await response.json();

    if (data.success) {
      addAiMessage(data.message);
      currentQuestion++;
      
      // After min exchanges, show option to proceed
      if (currentQuestion >= REFINEMENT_CONFIG.MIN_REFINEMENT_EXCHANGES) {
        setTimeout(() => {
          const inputSection = document.getElementById('input-section');
          const proceedBtn = REFINEMENT_CONFIG.ALLOW_OPTIONAL_QUESTIONS 
            ? `<button class="btn btn-secondary" onclick="askNextQuestion()" style="width: 100%;">Ask Another Question</button>`
            : '';
          inputSection.innerHTML = `
            ${proceedBtn}
            <button class="btn btn-primary" onclick="proceedToSynthesis()" style="width: 100%;">Ready to Synthesize</button>
          `;
        }, 500);
      } else {
        setTimeout(() => {
          askNextQuestion();
        }, 500);
      }
    } else {
      addAiMessage('Sorry, I encountered an error. Please try again.');
      askNextQuestion();
    }
  } catch (error) {
    console.error('Error:', error);
    addAiMessage('Connection error. Please ensure your backend server is running on http://localhost:3001');
    askNextQuestion();
  }
}

function proceedToSynthesis() {
  // Save feedback to iterations
  const iterations = JSON.parse(localStorage.getItem('iterations')) || [];
  iterations.push({
    stage: 'ai-feedback',
    selectedIdeas: selectedIdeasData,
    messages: chatMessages
  });
  localStorage.setItem('iterations', JSON.stringify(iterations));
  
  location.href = 'synthesis.html';
}

renderAiFeedback();
