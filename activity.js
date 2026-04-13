// Activity State Management
console.log('✅ activity.js loaded');

// State Management for 8-Stage Guided Activity Flow
const ActivityState = {
  currentStage: 1,
  designChallenge: null, // Will be set during initialize
  ideas: [], // Array of 8 ideas
  selectedIdeaIndex: null,
  selectedIdeaJustification: {
    why: '',
    challenges: ''
  },
  aiConversation: {
    messages: [], // Track all AI messages with type: 'user' | 'ai'
    promptTypes: new Set(), // Track types: 'critique', 'expansion', 'alternatives'
    totalMessages: 0
  },
  revisedIdea: null,
  aiReflection: {
    whatHelped: '',
    whatDidntWork: '',
    acceptedSuggestions: ''
  },
  aiDecisionLayer: [],
  
  async initialize() {
    console.log('⚙️ initialize() called');
    // Get a random challenge from the list
    this.getDesignChallenge();
    console.log('✅ Challenge set:', this.designChallenge);
  },

  getDesignChallenge() {
    console.log('🔄 getDesignChallenge() called');
    
    // Predefined list of design challenges
    const challenges = [
      'Design a tool to help users stay connected with friends or family regularly.',
      'Design a tool to help users reduce clutter without throwing things away.',
      'Design a tool to help users remember what they need before leaving home.',
      'Design a tool to help people keep their space organized effortlessly.',
      'Design a tool to help users stay motivated during long tasks.',
      'Design a tool to help people calm down when they feel stressed.',
      'Design a tool to help users build a daily habit.',
      'Design a tool to help people break a bad habit.',
      'Design a tool to help people remember to do small but important tasks.',
      'Design a desk tool to help people stay focused while working.',
      'Design a tool to help users start tasks when they feel unmotivated.'
    ];
    
    // Pick a random challenge from the list
    const randomIndex = Math.floor(Math.random() * challenges.length);
    this.designChallenge = challenges[randomIndex];
    
    console.log('📥 Got random challenge:', this.designChallenge);
    return this.designChallenge;
  },

  goToStage(stageNum) {
    this.currentStage = stageNum;
    this.render();
  },

  addIdea(index, text) {
    this.ideas[index] = text;
    // Update button state dynamically
    this.updateSelectIdeaButton();
  },

  updateSelectIdeaButton() {
    const ideasCount = this.getIdeasCount();
    const btn = document.querySelector('button[onclick="ActivityState.goToStage(3)"]');
    if (btn) {
      btn.disabled = ideasCount < 8;
    }
    // Also update hint text
    const hintText = document.querySelector('.hint-text');
    if (hintText) {
      hintText.textContent = ideasCount < 8 ? `Complete all 8 ideas to continue` : '✓ Ready to continue';
    }
  },

  getIdeasCount() {
    return this.ideas.filter(idea => idea && idea.trim()).length;
  },

  selectIdea(index) {
    this.selectedIdeaIndex = index;
  },

  addAIMessage(role, text, promptType = null) {
    this.aiConversation.messages.push({ role, text, promptType });
    if (role === 'ai') this.aiConversation.totalMessages++;
    if (promptType) this.aiConversation.promptTypes.add(promptType);
  },

  canProceedFromAIStage() {
    return this.aiConversation.totalMessages >= 2;
  },

  shouldShowAISoftCap() {
    return this.aiConversation.totalMessages >= 5;
  },

  render() {
    console.log('🎯 ActivityState.render() called for stage', this.currentStage);
    const mainContent = document.getElementById('main-content');
    console.log('✓ Got main-content element:', !!mainContent);
    
    switch(this.currentStage) {
      case 1:
        console.log('→ Calling StageDesignChallenge.render()');
        StageDesignChallenge.render();
        break;
      case 2:
        StageDivergentThinking.render();
        break;
      case 3:
        StageIdeaSelection.render();
        break;
      case 4:
        StageAICollaboration.render();
        break;
      case 5:
        StageHumanRevision.render();
        break;
      case 6:
        StageAIReflection.render();
        break;
      case 7:
        // Skip stage 7 - go directly to final report
        StageFinalReport.render();
        break;
      case 8:
        StageFinalReport.render();
        break;
      default:
        console.error('❌ Unknown stage:', this.currentStage);
    }
  }
};

// ========== STAGE 1: DESIGN CHALLENGE ==========
const StageDesignChallenge = {
  render() {
    console.log('🎨 StageDesignChallenge.render() called');
    const content = document.getElementById('main-content');
    if (!content) {
      console.error('❌ Could not find main-content element');
      return;
    }
    
    console.log('✓ Found main-content, setting HTML');
    const challenge = ActivityState.designChallenge || "Loading your challenge...";
    console.log('Challenge text:', challenge.substring(0, 50) + '...');
    
    content.innerHTML = `
      <div class="stage-container fade-in">
        <div class="stage-progress">
          <div class="progress-dots">
            <div class="dot active" data-stage="1"></div>
            <div class="dot" data-stage="2"></div>
            <div class="dot" data-stage="3"></div>
            <div class="dot" data-stage="4"></div>
            <div class="dot" data-stage="5"></div>
            <div class="dot" data-stage="6"></div>
            <div class="dot" data-stage="8"></div>
          </div>
          <div class="stage-label">Stage 1 of 7: Design Challenge</div>
        </div>

        <div class="stage-content">
          <div class="challenge-card">
            <h1 class="stage-title">Your Design Challenge</h1>
            <p class="stage-subtitle">This is your starting point. Spend a moment understanding the problem, then generate your ideas.</p>
            
            <div class="challenge-prompt">
              ${challenge}
            </div>

            <div class="challenge-guidance">
              <h3>💭 How to think about this:</h3>
              <ul>
                <li>The challenge is intentionally open-ended</li>
                <li>There's no single "right" answer</li>
                <li>Consider different perspectives and contexts</li>
                <li>Let your mind explore possibilities freely</li>
              </ul>
            </div>

            <div style="text-align: center; margin-top: 2rem;">
              <button class="btn btn-primary" onclick="ActivityState.goToStage(2)">
                Begin Ideation →
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    console.log('✅ HTML injected successfully');
  }
};

// ========== STAGE 2: DIVERGENT THINKING ==========
const StageDivergentThinking = {
  render() {
    const content = document.getElementById('main-content');
    const ideasCount = ActivityState.getIdeasCount();

    let ideasHTML = '';
    for (let i = 0; i < 8; i++) {
      const idea = ActivityState.ideas[i] || '';
      const isComplete = idea && idea.trim().length > 0;
      ideasHTML += `
        <div class="idea-input-group">
          <label class="idea-number">Idea ${i + 1}</label>
          <div class="idea-input-wrapper">
            <textarea 
              id="idea-${i}"
              class="idea-textarea ${isComplete ? 'complete' : ''}"
              placeholder="Enter your idea here..."
              onchange="ActivityState.addIdea(${i}, this.value);"
              onkeydown="if(event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); ActivityState.addIdea(${i}, this.value); this.blur(); }"
            >${idea}</textarea>
          </div>
        </div>
      `;
    }

    content.innerHTML = `
      <div class="stage-container fade-in">
        <div class="stage-progress">
          <div class="progress-dots">
            <div class="dot" data-stage="1" onclick="ActivityState.goToStage(1)"></div>
            <div class="dot active" data-stage="2"></div>
            <div class="dot" data-stage="3"></div>
            <div class="dot" data-stage="4"></div>
            <div class="dot" data-stage="5"></div>
            <div class="dot" data-stage="6"></div>
            <div class="dot" data-stage="8"></div>
          </div>
          <div class="stage-label">Stage 2 of 7: Divergent Thinking</div>
        </div>

        <div class="stage-content">
          <div class="divergent-card">
            <div class="divergent-header">
              <div>
                <h1 class="stage-title">Generate 8 Ideas</h1>
                <p class="stage-subtitle">No AI assistance in this step. This is your pure, unfiltered creativity.</p>
              </div>
            </div>

            <div class="challenge-context">
              <div class="challenge-context-item">
                <span class="challenge-context-label">🎯 Your Design Challenge:</span>
                <span class="challenge-context-value">${ActivityState.designChallenge}</span>
              </div>
            </div>

            <div class="ideas-grid">
              ${ideasHTML}
            </div>

            <div style="text-align: center; margin-top: 2rem;">
              <button 
                class="btn btn-primary" 
                onclick="ActivityState.goToStage(3)"
                ${ideasCount < 8 ? 'disabled' : ''}
              >
                Select Best Idea →
              </button>
              <p class="hint-text">${ideasCount < 8 ? `Complete all 8 ideas to continue` : '✓ Ready to continue'}</p>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  updateProgress() {
    // No longer needed - kept for backward compatibility
  },

  confirmIdea(index) {
    const textarea = document.getElementById(`idea-${index}`);
    const text = textarea.value.trim();
    
    if (text.length > 0) {
      // Save the idea
      ActivityState.addIdea(index, text);
      
      // Update button state - find it by class and index
      const btn = document.querySelector(`.idea-check-btn[onclick*="confirmIdea(${index})"]`);
      if (btn) {
        btn.classList.add('active');
      }
      
      // Update textarea styling
      textarea.classList.add('complete');
      
      // Move focus to next empty textarea
      for (let i = index + 1; i < 8; i++) {
        const nextTextarea = document.getElementById(`idea-${i}`);
        if (nextTextarea && !nextTextarea.value.trim()) {
          nextTextarea.focus();
          break;
        }
      }
      
      // Check if all ideas are complete and enable submit button
      if (ActivityState.getIdeasCount() === 8) {
        const submitBtn = document.querySelector('button[onclick*="goToStage(3)"]');
        if (submitBtn) {
          submitBtn.disabled = false;
        }
      }
    }
  }
};

// ========== STAGE 3: IDEA SELECTION ==========
const StageIdeaSelection = {
  updateButtonState() {
    const btn = document.getElementById('collaborate-btn');
    if (btn) {
      const hasWhy = ActivityState.selectedIdeaJustification.why && ActivityState.selectedIdeaJustification.why.trim();
      const hasChallenges = ActivityState.selectedIdeaJustification.challenges && ActivityState.selectedIdeaJustification.challenges.trim();
      btn.disabled = !hasWhy || !hasChallenges;
    }
  },
  render() {
    const content = document.getElementById('main-content');
    const selectedIdea = ActivityState.selectedIdeaIndex !== null ? 
      ActivityState.ideas[ActivityState.selectedIdeaIndex] : '';

    let ideasListHTML = ActivityState.ideas.map((idea, i) => `
      <div class="idea-option ${ActivityState.selectedIdeaIndex === i ? 'selected' : ''}" onclick="ActivityState.selectIdea(${i}); StageIdeaSelection.render();">
        <input type="radio" name="idea-select" value="${i}" ${ActivityState.selectedIdeaIndex === i ? 'checked' : ''} />
        <div class="idea-option-content">
          <div class="idea-option-number">Idea ${i + 1}</div>
          <div class="idea-option-text">${idea}</div>
        </div>
      </div>
    `).join('');

    content.innerHTML = `
      <div class="stage-container fade-in">
        <div class="stage-progress">
          <div class="progress-dots">
            <div class="dot" data-stage="1" onclick="ActivityState.goToStage(1)"></div>
            <div class="dot" data-stage="2" onclick="ActivityState.goToStage(2)"></div>
            <div class="dot active" data-stage="3"></div>
            <div class="dot" data-stage="4"></div>
            <div class="dot" data-stage="5"></div>
            <div class="dot" data-stage="6"></div>
            <div class="dot" data-stage="8"></div>
          </div>
          <div class="stage-label">Stage 3 of 7: Idea Selection & Justification</div>
        </div>

        <div class="stage-content">
          <div class="selection-card">
            <h1 class="stage-title">Which idea resonates with you?</h1>
            <p class="stage-subtitle">Select one idea, then explain your reasoning</p>

            <div class="ideas-selection-list">
              ${ideasListHTML}
            </div>

            ${ActivityState.selectedIdeaIndex !== null ? `
              <div class="justification-section slide-up">
                <h2>Why This Idea?</h2>
                
                <div class="form-group">
                  <label>Why did you choose this idea?</label>
                  <textarea 
                    id="why-textarea"
                    placeholder="Explain what drew you to this idea..."
                    class="form-textarea"
                    oninput="ActivityState.selectedIdeaJustification.why = this.value; StageIdeaSelection.updateButtonState();"
                  >${ActivityState.selectedIdeaJustification.why}</textarea>
                </div>

                <div class="form-group">
                  <label>What uncertainties or challenges do you see in it?</label>
                  <textarea 
                    id="challenges-textarea"
                    placeholder="What questions or concerns do you have?..."
                    class="form-textarea"
                    oninput="ActivityState.selectedIdeaJustification.challenges = this.value; StageIdeaSelection.updateButtonState();"
                  >${ActivityState.selectedIdeaJustification.challenges}</textarea>
                </div>

                <div style="text-align: center; margin-top: 2rem;">
                  <button 
                    id="collaborate-btn"
                    class="btn btn-primary"
                    onclick="ActivityState.goToStage(4)"
                    ${!ActivityState.selectedIdeaJustification.why.trim() || !ActivityState.selectedIdeaJustification.challenges.trim() ? 'disabled' : ''}
                  >
                    Collaborate with AI →
                  </button>
                </div>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }
};

// ========== STAGE 4: AI COLLABORATION ==========
const StageAICollaboration = {
  showDecisionModal() {
    const modal = document.getElementById('decision-modal');
    if (modal) {
      modal.style.display = 'flex';
    }
  },

  hideDecisionModal() {
    const modal = document.getElementById('decision-modal');
    if (modal) {
      modal.style.display = 'none';
    }
  },

  finalizIdea() {
    this.hideDecisionModal();
    ActivityState.goToStage(5);
  },

  continueRefining() {
    this.hideDecisionModal();
    // Just keep the user in this stage - focus on the input
    const input = document.getElementById('ai-input');
    if (input) input.focus();
  },

  toggleSuggestionGroup(groupLabel) {
    const groups = document.querySelectorAll('.suggestion-group');
    groups.forEach(group => {
      if (group.getAttribute('data-group') === groupLabel) {
        group.classList.toggle('collapsed');
      }
    });
  },

  render() {
    const content = document.getElementById('main-content');
    const messagesCount = ActivityState.aiConversation.totalMessages;
    const selectedIdea = ActivityState.ideas[ActivityState.selectedIdeaIndex];
    const designChallenge = ActivityState.designChallenge;
    const readyForNext = messagesCount >= 2; // Show Next button after 2 messages

    // Initialize AI first message if there are no messages yet
    if (ActivityState.aiConversation.messages.length === 0 && ActivityState.aiConversation.totalMessages === 0) {
      const aiGreeting = getAICollaboratorFirstMessage(designChallenge, selectedIdea);
      
      ActivityState.aiConversation.messages.push({ 
        role: 'ai', 
        text: aiGreeting, 
        promptType: null 
      });
      ActivityState.aiConversation.totalMessages = 0; // Don't count initial greeting as a message interaction
    }

    let messagesHTML = ActivityState.aiConversation.messages.map((msg, i) => `
      <div class="message ${msg.role === 'user' ? 'user-message' : 'ai-message'}">
        <div class="message-header">
          <span class="message-role">${msg.role === 'user' ? 'You' : '🤖 AI Collaborator'}</span>
        </div>
        <div class="message-content">${msg.text}</div>
      </div>
    `).join('');

    content.innerHTML = `
      <div class="stage-container fade-in">
        <div class="stage-progress">
          <div class="progress-dots">
            <div class="dot" data-stage="1" onclick="ActivityState.goToStage(1)"></div>
            <div class="dot" data-stage="2" onclick="ActivityState.goToStage(2)"></div>
            <div class="dot" data-stage="3" onclick="ActivityState.goToStage(3)"></div>
            <div class="dot active" data-stage="4"></div>
            <div class="dot" data-stage="5"></div>
            <div class="dot" data-stage="6"></div>
            <div class="dot" data-stage="8"></div>
          </div>
          <div class="stage-label">Stage 4 of 7: AI Collaboration</div>
        </div>

        <div class="stage-content">
          <div class="ai-chat-interface">
            <h1 class="stage-title">Refine Your Idea with AI</h1>
            
            <div class="chat-wrapper">
              <div class="messages-list">
                ${messagesHTML}
              </div>
              
              <div class="chat-input-area">
                <div class="input-with-suggestions">
                  <textarea 
                    id="ai-input"
                    class="chat-textarea"
                    placeholder="Type your question or request for AI..."
                    rows="3"
                  ></textarea>
                  
                  <div class="input-controls">
                    <div class="suggestions-dropdown-wrapper">
                      <button class="suggestions-menu-btn" onclick="StageAICollaboration.toggleSuggestionsMenu(event)">
                        <span style="font-size: 1.1rem;">💬</span>
                        <span>Example prompts</span>
                      </button>
                      
                      <div id="suggestions-menu" class="suggestions-menu hidden">
                        <div class="suggestion-option" onclick="StageAICollaboration.setSuggestion('What are the main weaknesses or risks in this idea?')">
                          What are the main weaknesses or risks in this idea?
                        </div>
                        <div class="suggestion-option" onclick="StageAICollaboration.setSuggestion('What are 2–3 alternative approaches to this idea?')">
                          What are 2–3 alternative approaches to this idea?
                        </div>
                        <div class="suggestion-option" onclick="StageAICollaboration.setSuggestion('How might a user experience this idea? What problems could they face?')">
                          How might a user experience this idea? What problems could they face?
                        </div>
                        <div class="suggestion-option" onclick="StageAICollaboration.setSuggestion('How can I improve this idea while keeping the core concept the same?')">
                          How can I improve this idea while keeping the core concept the same?
                        </div>
                        <div class="suggestion-option" onclick="StageAICollaboration.setSuggestion('In what situations would this idea fail or not work well?')">
                          In what situations would this idea fail or not work well?
                        </div>
                      </div>
                    </div>
                    
                    <button class="btn btn-primary" onclick="StageAICollaboration.sendMessage()">
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>

            ${readyForNext ? `
              <div style="text-align: center; margin-top: 1.5rem;">
                <button class="btn btn-primary" onclick="StageAICollaboration.showDecisionModal()">
                  Next →
                </button>
              </div>
              
              <div id="decision-modal" class="decision-modal">
                <div class="decision-card">
                  <h2>Are you ready to move on?</h2>
                  <p>Do you feel ready to finalize your idea, or do you want to continue refining it with AI?</p>
                  <div class="decision-buttons">
                    <button class="btn btn-primary" onclick="StageAICollaboration.finalizIdea()">
                      Finalize my idea
                    </button>
                    <button class="btn btn-secondary" onclick="StageAICollaboration.continueRefining()">
                      Keep refining with AI
                    </button>
                  </div>
                </div>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  },

  setSuggestion(text) {
    const input = document.getElementById('ai-input');
    const menu = document.getElementById('suggestions-menu');
    if (input) {
      input.value = text;
      input.focus();
    }
    if (menu) {
      menu.classList.add('hidden');
    }
  },

  toggleSuggestionsMenu(event) {
    event.preventDefault();
    event.stopPropagation();
    const menu = document.getElementById('suggestions-menu');
    if (menu) {
      menu.classList.toggle('hidden');
    }
  },

  closeSuggestionsMenu() {
    const menu = document.getElementById('suggestions-menu');
    if (menu) {
      menu.classList.add('hidden');
    }
  },

  async sendMessage() {
    const input = document.getElementById('ai-input');
    const message = input.value.trim();

    if (!message) return;

    // Add user message
    ActivityState.addAIMessage('user', message);
    input.value = '';

    // Get AI response with proper system prompt
    const selectedIdea = ActivityState.ideas[ActivityState.selectedIdeaIndex];
    const designChallenge = ActivityState.designChallenge;
    const allIdeas = ActivityState.ideas.filter(i => i && i.trim());
    
    try {
      const systemPrompt = getAICollaboratorSystemPrompt(designChallenge, selectedIdea, allIdeas);
      
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: message,
          system: systemPrompt,
          conversationHistory: ActivityState.aiConversation.messages.map(m => ({
            type: m.role,
            text: m.text
          }))
        })
      });

      const data = await response.json();
      console.log('API Response:', data);
      
      if (!response.ok) {
        throw new Error(data.error || `API error: ${response.status}`);
      }
      
      if (data.success && data.message) {
        ActivityState.addAIMessage('ai', data.message);
      } else if (data.message) {
        ActivityState.addAIMessage('ai', data.message);
      } else {
        throw new Error('No message in API response');
      }
      
      StageAICollaboration.render();
    } catch (error) {
      console.error('Error getting AI response:', error);
      ActivityState.addAIMessage('ai', 'Sorry, I encountered an error. Please try again.');
      StageAICollaboration.render();
    }
  }
};

// ========== STAGE 5: HUMAN REVISION ==========
const StageHumanRevision = {
  updateButtonState() {
    const btn = document.getElementById('revision-btn');
    if (btn) {
      btn.disabled = !ActivityState.revisedIdea || !ActivityState.revisedIdea.trim();
    }
  },
  render() {
    const content = document.getElementById('main-content');
    const selectedIdea = ActivityState.ideas[ActivityState.selectedIdeaIndex];

    content.innerHTML = `
      <div class="stage-container fade-in">
        <div class="stage-progress">
          <div class="progress-dots">
            <div class="dot" data-stage="1" onclick="ActivityState.goToStage(1)"></div>
            <div class="dot" data-stage="2" onclick="ActivityState.goToStage(2)"></div>
            <div class="dot" data-stage="3" onclick="ActivityState.goToStage(3)"></div>
            <div class="dot" data-stage="4" onclick="ActivityState.goToStage(4)"></div>
            <div class="dot active" data-stage="5"></div>
            <div class="dot" data-stage="6"></div>
            <div class="dot" data-stage="8"></div>
          </div>
          <div class="stage-label">Stage 5 of 7: Human Revision</div>
        </div>

        <div class="stage-content">
          <div class="revision-card">
            <h1 class="stage-title">Finalize Your Idea</h1>
            <p class="stage-subtitle">This is YOUR synthesis. Incorporate what resonated, discard what didn't. No AI in this step.</p>

            <div class="revision-comparison">
              <div class="comparison-column">
                <h3>Your Original Idea</h3>
                <div class="comparison-box original">
                  ${selectedIdea}
                </div>
              </div>
              <div class="comparison-column">
                <h3>Your Final Revision</h3>
                <textarea 
                  id="revised-idea"
                  class="form-textarea revision-textarea"
                  placeholder="Integrate your thoughts and craft your final idea here..."
                oninput="ActivityState.revisedIdea = this.value; StageHumanRevision.updateButtonState();"
                >${ActivityState.revisedIdea || ''}</textarea>
              </div>
            </div>

            <div style="text-align: center; margin-top: 2rem;">
              <button 
                id="revision-btn"
                class="btn btn-primary"
                onclick="ActivityState.goToStage(6)"
                ${!ActivityState.revisedIdea || !ActivityState.revisedIdea.trim() ? 'disabled' : ''}
              >
                Reflect on AI Usage →
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }
};

// ========== STAGE 6: AI USAGE REFLECTION ==========
const StageAIReflection = {
  updateButtonState() {
    const btn = document.getElementById('reflection-btn');
    if (btn) {
      const hasHelped = ActivityState.aiReflection.whatHelped && ActivityState.aiReflection.whatHelped.trim();
      const hasNotWell = ActivityState.aiReflection.whatDidntWork && ActivityState.aiReflection.whatDidntWork.trim();
      const hasAccepted = ActivityState.aiReflection.acceptedSuggestions && ActivityState.aiReflection.acceptedSuggestions.trim();
      btn.disabled = !hasHelped || !hasNotWell || !hasAccepted;
    }
  },
  render() {
    const content = document.getElementById('main-content');

    content.innerHTML = `
      <div class="stage-container fade-in">
        <div class="stage-progress">
          <div class="progress-dots">
            <div class="dot" data-stage="1" onclick="ActivityState.goToStage(1)"></div>
            <div class="dot" data-stage="2" onclick="ActivityState.goToStage(2)"></div>
            <div class="dot" data-stage="3" onclick="ActivityState.goToStage(3)"></div>
            <div class="dot" data-stage="4" onclick="ActivityState.goToStage(4)"></div>
            <div class="dot" data-stage="5" onclick="ActivityState.goToStage(5)"></div>
            <div class="dot active" data-stage="6"></div>
            <div class="dot" data-stage="8"></div>
          </div>
          <div class="stage-label">Stage 6 of 7: AI Usage Reflection</div>
        </div>

        <div class="stage-content">
          <div class="reflection-card">
            <h1 class="stage-title">Reflect on Your AI Collaboration</h1>
            <p class="stage-subtitle">How did AI help you? What could it do better? What did you actually use?</p>

            <div class="reflection-form">
              <div class="form-group">
                <label>What did AI help you do?</label>
                <textarea 
                  id="reflection-helped"
                  class="form-textarea"
                  placeholder="e.g., Helped me see potential flaws, Expanded my thinking..."
                  oninput="ActivityState.aiReflection.whatHelped = this.value; StageAIReflection.updateButtonState();"
                >${ActivityState.aiReflection.whatHelped}</textarea>
              </div>

              <div class="form-group">
                <label>What did AI NOT do well?</label>
                <textarea 
                  id="reflection-notwell"
                  class="form-textarea"
                  placeholder="e.g., Suggestions were too generic, Didn't understand my context..."
                  oninput="ActivityState.aiReflection.whatDidntWork = this.value; StageAIReflection.updateButtonState();"
                >${ActivityState.aiReflection.whatDidntWork}</textarea>
              </div>

              <div class="form-group">
                <label>Which AI suggestions did you accept vs. reject? Why?</label>
                <textarea 
                  id="reflection-accepted"
                  class="form-textarea"
                  placeholder="e.g., I kept X because... I rejected Y because..."
                  oninput="ActivityState.aiReflection.acceptedSuggestions = this.value; StageAIReflection.updateButtonState();"
                >${ActivityState.aiReflection.acceptedSuggestions}</textarea>
              </div>

              <div style="text-align: center; margin-top: 2rem;">
                <button 
                  id="reflection-btn"
                  class="btn btn-primary"
                  onclick="ActivityState.goToStage(8)"
                  ${!ActivityState.aiReflection.whatHelped.trim() || !ActivityState.aiReflection.whatDidntWork.trim() || !ActivityState.aiReflection.acceptedSuggestions.trim() ? 'disabled' : ''}
                >
                  Generate Report →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
};

// ========== STAGE 7: AI DECISION-MAKING LAYER ==========
const StageAIDecisionMaking = {
  render() {
    const content = document.getElementById('main-content');
    const options = [
      { value: 'brainstorming', label: '🧠 Brainstorming', description: 'Generating new ideas and possibilities' },
      { value: 'refining', label: '✏️ Refining Ideas', description: 'Polishing and improving existing ideas' },
      { value: 'evaluating', label: '🔍 Evaluating Ideas', description: 'Assessing strengths and weaknesses' },
      { value: 'exploring', label: '🗺️ Exploring Alternatives', description: 'Finding different approaches' },
      { value: 'synthesizing', label: '🔗 Synthesizing', description: 'Combining elements into something new' },
      { value: 'challenging', label: '⚡ Challenging Assumptions', description: 'Questioning underlying premises' }
    ];

    let optionsHTML = options.map(opt => `
      <label class="decision-option">
        <input type="checkbox" name="ai-usefulness" value="${opt.value}" 
          ${ActivityState.aiDecisionLayer.includes(opt.value) ? 'checked' : ''}
          onchange="ActivityState.aiDecisionLayer = Array.from(document.querySelectorAll('input[name=\\'ai-usefulness\\']:checked')).map(el => el.value)">
        <div class="option-content">
          <div class="option-label">${opt.label}</div>
          <div class="option-description">${opt.description}</div>
        </div>
      </label>
    `).join('');

    content.innerHTML = `
      <div class="stage-container fade-in">
        <div class="stage-progress">
          <div class="progress-dots">
            <div class="dot" data-stage="1" onclick="ActivityState.goToStage(1)"></div>
            <div class="dot" data-stage="2" onclick="ActivityState.goToStage(2)"></div>
            <div class="dot" data-stage="3" onclick="ActivityState.goToStage(3)"></div>
            <div class="dot" data-stage="4" onclick="ActivityState.goToStage(4)"></div>
            <div class="dot" data-stage="5" onclick="ActivityState.goToStage(5)"></div>
            <div class="dot" data-stage="6" onclick="ActivityState.goToStage(6)"></div>
            <div class="dot active" data-stage="7"></div>
            <div class="dot" data-stage="8"></div>
          </div>
          <div class="stage-label">Stage 7 of 8: AI Decision-Making Layer</div>
        </div>

        <div class="stage-content">
          <div class="decision-card">
            <h1 class="stage-title">When is AI Useful?</h1>
            <p class="stage-subtitle">Based on this experience, select which tasks you'd use AI for in the future</p>

            <div class="decision-options">
              ${optionsHTML}
            </div>

            <div style="text-align: center; margin-top: 2rem;">
              <button class="btn btn-primary" onclick="ActivityState.goToStage(8)">
                View Your Report Card →
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }
};

// ========== STAGE 8: FINAL REPORT CARD ==========
const StageFinalReport = {
  render() {
    const content = document.getElementById('main-content');
    const originalIdea = ActivityState.ideas[ActivityState.selectedIdeaIndex];
    const revisedIdea = ActivityState.revisedIdea;
    const messagesCount = ActivityState.aiConversation.totalMessages;
    const promptTypes = Array.from(ActivityState.aiConversation.promptTypes);

    // Get the justification responses
    const whyChosen = ActivityState.selectedIdeaJustification.why;
    const challenges = ActivityState.selectedIdeaJustification.challenges;

    // Get the reflection responses
    const whatHelped = ActivityState.aiReflection.whatHelped;
    const whatDidntWork = ActivityState.aiReflection.whatDidntWork;
    const acceptedSuggestions = ActivityState.aiReflection.acceptedSuggestions;

    const insights = [
      "How did AI change your thinking process?",
      "When would you choose NOT to use AI in the future?",
      "What would you do differently next time?",
      "How did reflecting on your own choices strengthen your idea?",
      "What surprised you about the ideation process?"
    ];

    content.innerHTML = `
      <div class="stage-container fade-in">
        <div class="stage-progress">
          <div class="progress-dots">
            <div class="dot" data-stage="1" onclick="ActivityState.goToStage(1)"></div>
            <div class="dot" data-stage="2" onclick="ActivityState.goToStage(2)"></div>
            <div class="dot" data-stage="3" onclick="ActivityState.goToStage(3)"></div>
            <div class="dot" data-stage="4" onclick="ActivityState.goToStage(4)"></div>
            <div class="dot" data-stage="5" onclick="ActivityState.goToStage(5)"></div>
            <div class="dot" data-stage="6" onclick="ActivityState.goToStage(6)"></div>
            <div class="dot active" data-stage="8"></div>
          </div>
          <div class="stage-label">Stage 7 of 7: Your Report Card</div>
        </div>

        <div class="stage-content">
          <div class="report-card">
            <div class="report-header">
              <h1 class="stage-title">Your Innovation Journey</h1>
              <p class="stage-subtitle">A summary of your process, insights, and growth</p>
            </div>

            <div class="report-sections">
              <section class="report-section idea-evolution">
                <h2 class="report-section-title">💡 Your Idea Evolution</h2>
                <div class="evolution-comparison">
                  <div class="evolution-item">
                    <div class="evolution-label">Initial Idea</div>
                    <div class="evolution-content">${originalIdea}</div>
                  </div>
                  <div class="evolution-arrow">→</div>
                  <div class="evolution-item">
                    <div class="evolution-label">Final Idea</div>
                    <div class="evolution-content">${revisedIdea}</div>
                  </div>
                </div>
              </section>

              <section class="report-section">
                <h2 class="report-section-title">🤔 Why You Chose This Idea</h2>
                <div class="report-content" style="background: white; padding: 1.5rem; border-radius: 8px; border: 1px solid var(--light-gray);">
                  <p><strong>Your reasoning:</strong></p>
                  <p style="line-height: 1.6;">${whyChosen}</p>
                </div>
              </section>

              <section class="report-section">
                <h2 class="report-section-title">⚠️ Challenges You Identified</h2>
                <div class="report-content" style="background: white; padding: 1.5rem; border-radius: 8px; border: 1px solid var(--light-gray);">
                  <p><strong>Uncertainties & concerns:</strong></p>
                  <p style="line-height: 1.6;">${challenges}</p>
                </div>
              </section>

              <section class="report-section">
                <h2 class="report-section-title">💬 AI Collaboration Exchange</h2>
                <div class="report-content" style="background: white; padding: 1.5rem; border-radius: 8px; border: 1px solid var(--light-gray);">
                  <p><strong>Messages exchanged:</strong> <span style="font-weight: 800; color: var(--accent-primary);">${messagesCount} message${messagesCount !== 1 ? 's' : ''}</span></p>
                </div>
              </section>

              <section class="report-section">
                <h2 class="report-section-title">✨ How AI Helped You</h2>
                <div class="report-content" style="background: white; padding: 1.5rem; border-radius: 8px; border: 1px solid var(--light-gray);">
                  <p style="line-height: 1.6;">${whatHelped}</p>
                </div>
              </section>

              <section class="report-section">
                <h2 class="report-section-title">🎯 Where AI Fell Short</h2>
                <div class="report-content" style="background: white; padding: 1.5rem; border-radius: 8px; border: 1px solid var(--light-gray);">
                  <p style="line-height: 1.6;">${whatDidntWork}</p>
                </div>
              </section>

              <section class="report-section">
                <h2 class="report-section-title">🔄 Your AI Decisions</h2>
                <div class="report-content" style="background: white; padding: 1.5rem; border-radius: 8px; border: 1px solid var(--light-gray);">
                  <p><strong>Suggestions you accepted vs. rejected:</strong></p>
                  <p style="line-height: 1.6;">${acceptedSuggestions}</p>
                </div>
              </section>

            </div>

            <div class="report-footer">
              <button class="btn btn-secondary" onclick="location.href='dashboard.html'">
                Return to Dashboard
              </button>
              <button class="btn btn-primary" onclick="location.reload()">
                Start New Activity
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 DOMContentLoaded fired, initializing activity...');
  console.log('📊 Initial state:', {
    currentStage: ActivityState.currentStage,
    designChallenge: ActivityState.designChallenge,
    mainContentElement: !!document.getElementById('main-content')
  });
  
  try {
    ActivityState.initialize()
      .then(() => {
        console.log('✅ Activity initialized, challenge loaded:', ActivityState.designChallenge);
        console.log('🎨 About to render stage', ActivityState.currentStage);
        ActivityState.render();
        console.log('✅ Render completed');
      })
      .catch((error) => {
        console.error('❌ Initialization error:', error);
        // Fallback render with dummy challenge
        ActivityState.designChallenge = "Reimagine how people interact with everyday digital notifications.";
        console.log('🔄 Rendering with fallback challenge...');
        try {
          ActivityState.render();
        } catch (renderError) {
          console.error('❌ Render failed:', renderError);
          document.getElementById('main-content').innerHTML = '<div style="padding: 3rem; color: red; font-weight: bold;">❌ Failed to render activity. Error: ' + renderError.message + '</div>';
        }
      });
  } catch (error) {
    console.error('❌ Unexpected error in initialization:', error);
    document.getElementById('main-content').innerHTML = '<div style="padding: 3rem; color: red; font-weight: bold;">❌ Unexpected error: ' + error.message + '</div>';
  }
});
