const QUIZ_QUESTIONS = [
  {
    question: "How can practicing creative thinking most significantly impact your work?",
    options: [
      "Contribute ideas more confidently.",
      "Maintain relevance as you use AI more intentionally and creatively.",
      "Strengthen your ability to question and remain an active thinker.",
      "Other"
    ],
    hasOpenEnd: true,
    feedback: "Creative thinking in the workplace helps create a culture of innovation, encourages risk-taking, and enables solving problems efficiently.",
    type: "mixed"
  },
  {
    question: "Which creativity benefit most resonates with you?",
    options: [
      "Using my judgment and considering multiple perspectives.",
      "Making my work more original, meaningful, and human.",
      "Making better decisions, stronger innovation, and new opportunities.",
      "Other"
    ],
    hasOpenEnd: true,
    feedback: "As AI advances, humans will crave more unpredictability and the imperfection of \"human-ness\" in the future of your work.",
    type: "mixed"
  },
  {
    question: "What do you hope this creative agency activity will help you practice most?",
    options: [
      "Generating ideas and directing the creative process while using AI as a tool for iteration.",
      "Strengthening your confidence in your own creative thinking.",
      "Reflecting on when your own judgment matters most.",
      "Other"
    ],
    hasOpenEnd: true,
    feedback: "This journey will promote your strong instincts when using AI. You are ready to move onto the next step.",
    type: "mixed",
    isLastQuestion: true
  }
];

let currentQuestion = 0;
const userAnswers = [null, null, null]; // store answer text for each question

function renderQuestion() {
  const content = document.getElementById('main-content');
  const progressFill = document.getElementById('progress-fill');
  if (progressFill) progressFill.style.width = `${(currentQuestion / QUIZ_QUESTIONS.length) * 100}%`;

  const q = QUIZ_QUESTIONS[currentQuestion];
  const hasTypeBox = currentQuestion === 0 || currentQuestion === 1 || currentQuestion === 2; // all questions have type box
  const isQ3 = currentQuestion === 2; // Question 3 is index 2

  let optionsHTML = q.options.map((option, idx) => {
    // For Q2 and Q3, make option D (idx 3) have an input field
    if (hasTypeBox && idx === 3) {
      return `
        <div style="display: flex; align-items: center; gap: 1.5rem; padding: 1.5rem; background: var(--light-gray); border: 2.5px solid transparent; border-radius: var(--radius); cursor: text; transition: all var(--transition-smooth); box-shadow: var(--shadow-sm);">
          <span style="display: flex; align-items: center; justify-content: center; width: 50px; height: 50px; background: var(--accent-primary); border-radius: var(--radius); font-family: var(--font-mono); font-weight: 900; color: white; flex-shrink: 0; font-size: 1.1rem;">D</span>
          <span style="font-weight: 600; color: var(--ink); flex-shrink: 0; font-size: 1.1rem;">Other:</span>
          <input type="text" id="option-d-input" placeholder="type here..." 
            onkeypress="handleTypeBoxInput(event)"
            style="flex: 1; border: none; background: white; font-family: var(--font-sans); font-size: 1.1rem; padding: 0.5rem; outline: none; color: var(--ink); border-radius: 4px;" />
        </div>
      `;
    }
    return `
      <button class="quiz-option" onclick="selectAnswer(${idx})" data-index="${idx}">
        <span class="option-letter">${String.fromCharCode(65 + idx)}</span>
        <span class="option-text">${option}</span>
      </button>
    `;
  }).join('');

  // Don't add additional open-ended textarea for Q2 or Q3 (they use the type box)
  let openEndHTML = '';
  if (q.hasOpenEnd && !hasTypeBox) {
    openEndHTML = `
      <div style="margin-top: 2rem; padding-top: 2rem; border-top: 2px solid var(--warm-gray);">
        <label style="display: block; margin-bottom: 1rem; font-weight: 600; color: var(--ink);">
          Add your own thought (optional):
        </label>
        <textarea id="open-end-input" placeholder="Type your response here..." 
          style="width: 100%; min-height: 120px; padding: 1rem; border: 2px solid var(--warm-gray); border-radius: var(--radius); font-family: var(--font-sans); font-size: 1rem; resize: none; background: white;"></textarea>
      </div>
    `;
  }

  content.innerHTML = `
    <div class="fade-up">
      <div style="margin-bottom: 2rem;">
        <p style="color: var(--mid-gray); font-size: 0.9rem;">Question ${currentQuestion + 1} of ${QUIZ_QUESTIONS.length}</p>
        <h2 style="font-family: var(--font-serif); font-size: 1.8rem; margin: 1rem 0; line-height: 1.3;">${q.question}</h2>
      </div>

      <div id="options-container" style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.5rem;">
        ${optionsHTML}
      </div>

      ${openEndHTML}

      <div id="feedback-container"></div>
    </div>
  `;

  // Focus on the input field for Q2 and Q3
  if (hasTypeBox) {
    setTimeout(() => {
      const input = document.getElementById('option-d-input');
      if (input) input.focus();
    }, 100);
  }
}

function selectAnswer(idx) {
  const q = QUIZ_QUESTIONS[currentQuestion];

  // Store the answer text
  if (idx === 3) {
    // Type box answer
    const input = document.getElementById('option-d-input');
    userAnswers[currentQuestion] = (input && input.value.trim()) ? input.value.trim() : 'Other';
  } else {
    userAnswers[currentQuestion] = q.options[idx];
  }

  // Disable all options
  document.querySelectorAll('.quiz-option').forEach(btn => {
    btn.disabled = true;
  });

  // Highlight selected answer (only if it's a quiz-option button)
  const options = document.querySelectorAll('.quiz-option');
  if (idx < options.length) {
    options[idx].classList.add('selected');
  }

  // Show feedback modal
  const isQ3 = currentQuestion === 2;
  showFeedbackModal(q.feedback, isQ3);
}

function handleTypeBoxInput(event) {
  // Trigger selectAnswer on Enter key
  if (event.key === 'Enter') {
    event.preventDefault();
    selectAnswer(3); // Option D is index 3
  }
}

function showFeedbackModal(feedbackText, isQ3 = false) {
  // Remove existing modal if any
  const existingModal = document.getElementById('feedback-modal');
  if (existingModal) {
    existingModal.remove();
  }

  // Create modal overlay
  const modal = document.createElement('div');
  modal.id = 'feedback-modal';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.3s ease-out;
  `;

  // Create modal content
  const modalContent = document.createElement('div');
  modalContent.style.cssText = `
    background: white;
    padding: 3rem;
    border-radius: var(--radius);
    max-width: 600px;
    width: 90%;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    text-align: center;
    animation: slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  `;

  if (isQ3) {
    const q3 = QUIZ_QUESTIONS[2];
    modalContent.innerHTML = `
      <p style="font-size: 1.05rem; line-height: 1.8; color: var(--ink); margin: 0 0 2rem 0;">${q3.feedback}</p>
      <button class="btn btn-primary" onclick="showAgentReport()" style="display: inline-block; width: auto; padding: 1rem 2rem; font-size: 1rem;">
        See My Agent Report
      </button>
    `;
  } else {
    // Regular next button for questions 1 and 2
    modalContent.innerHTML = `
      <p style="font-size: 1.05rem; line-height: 1.8; color: var(--ink); margin: 0 0 3rem 0;">${feedbackText}</p>
      <button class="btn btn-primary" onclick="nextQuestion()" style="width: 100%; padding: 1rem 2rem; font-size: 1rem;">
        Next Question
      </button>
    `;
  }

  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  // Add animation styles if not already present
  if (!document.getElementById('quiz-animations')) {
    const style = document.createElement('style');
    style.id = 'quiz-animations';
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes slideUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);
  }
}

function nextQuestion() {
  // Remove modal
  const modal = document.getElementById('feedback-modal');
  if (modal) {
    modal.remove();
  }

  if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
    currentQuestion++;
    renderQuestion();
  } else {
    showResults();
  }
}

function showAgentReport() {
  // Remove modal
  const modal = document.getElementById('feedback-modal');
  if (modal) modal.remove();

  // Persist quiz answers for use in the Innovation Journey report
  localStorage.setItem('agentReportAnswers', JSON.stringify(
    QUIZ_QUESTIONS.map((q, i) => ({ question: q.question, answer: userAnswers[i] || '—' }))
  ));

  const content = document.getElementById('main-content');

  const answersHTML = QUIZ_QUESTIONS.map((q, i) => `
    <div style="margin-bottom: 1.5rem; padding: 1.2rem 1.5rem; background: var(--light-gray); border: 1.5px solid #E43D12; border-radius: var(--radius); text-align: left;">
      <p style="font-size: 0.95rem; color: var(--ink); font-weight: 600; margin: 0 0 0.5rem 0; line-height: 1.5;">Q${i + 1}: ${q.question}</p>
      <p style="font-size: 1rem; color: #E43D12; margin: 0; line-height: 1.6;">${userAnswers[i] || '—'}</p>
    </div>
  `).join('');

  content.innerHTML = `
    <div class="fade-up" style="max-width: 640px; margin: 0 auto; padding-bottom: 3rem;">
      ${answersHTML}

      <div style="margin: 2.5rem 0; padding-top: 2rem; border-top: 2px solid var(--warm-gray);">
        <p style="font-size: 1.05rem; line-height: 1.8; color: var(--ink); margin: 0 0 1.2rem 0;">AI cannot replicate your original thoughts. The professionals who thrive with AI aren't the ones who use it most. They're the ones who know how to use it, and when not to. As you discover more about AI and creative thinking, keep your answers in mind and reflect on:</p>
        <ul style="font-size: 1.05rem; line-height: 1.8; color: var(--ink); margin: 0 0 2.5rem 1.5rem; padding: 0;">
          <li style="margin-bottom: 0.5rem;">Your personal relationship with AI</li>
          <li style="margin-bottom: 0.5rem;">What AI is useful for in your work</li>
          <li style="margin-bottom: 0.5rem;">How you would like to or like not to leverage AI in the digital age</li>
        </ul>
        <a href="dashboard.html" class="btn btn-primary" style="display: inline-block; width: 100%; padding: 1rem 2rem; font-size: 1rem; text-decoration: none; text-align: center; box-sizing: border-box;">
          Ready to Start
        </a>
      </div>
    </div>
  `;
}

function showResults() {
  showAgentReport();
}

renderQuestion();
