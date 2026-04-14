const QUIZ_QUESTIONS = [
  {
    question: "Why does human creativity and divergent thinking still matter in a world with AI?",
    options: [
      "It allows us to use our judgment and consider multiple perspectives.",
      "It makes our work more original, meaningful, and human.",
      "It can lead to better decisions, stronger innovation, and new opportunities."
    ],
    feedback: "The World Economic Forum notes that as AI advances, humans will crave more unpredictability and the imperfection of \"human-ness,\" and this will be valued in the future of work.",
    type: "multiple_choice"
  },
  {
    question: "How can practicing creative thinking impact your work?",
    options: [
      "It can help you contribute ideas more confidently.",
      "It can help you maintain relevance as you use AI more intentionally and creatively.",
      "It can strengthen your ability to question and remain an active thinker."
    ],
    feedback: "Research shows that creative thinking in the workplace helps create a culture of innovation, encourages risk-taking, and enables solving problems efficiently.",
    type: "multiple_choice"
  },
  {
    question: "What do you hope this learning experience will help you practice?",
    options: [
      "Generating ideas without giving up your creative agency.",
      "Directing the creative process while using AI as a tool for iteration.",
      "Strengthening your confidence in your own creative thinking.",
      "Other"
    ],
    hasOpenEnd: true,
    feedback: "There is no right or wrong answer. All responses help you reflect on your creative practice and how you'll work with AI.",
    type: "mixed",
    isLastQuestion: true
  }
];

let currentQuestion = 0;

function renderQuestion() {
  const content = document.getElementById('main-content');
  const progressFill = document.getElementById('progress-fill');
  progressFill.style.width = `${(currentQuestion / QUIZ_QUESTIONS.length) * 100}%`;

  const q = QUIZ_QUESTIONS[currentQuestion];
  const isQ3 = currentQuestion === 2; // Question 3 is index 2

  let optionsHTML = q.options.map((option, idx) => {
    // For question 3, make option D (idx 3) have an input field
    if (isQ3 && idx === 3) {
      return `
        <div style="display: flex; align-items: center; gap: 1.5rem; padding: 1.5rem; background: var(--light-gray); border: 2.5px solid transparent; border-radius: var(--radius); cursor: text; transition: all var(--transition-smooth); box-shadow: var(--shadow-sm);">
          <span style="display: flex; align-items: center; justify-content: center; width: 50px; height: 50px; background: var(--accent-primary); border-radius: var(--radius); font-family: var(--font-mono); font-weight: 900; color: white; flex-shrink: 0; font-size: 1.1rem;">D</span>
          <span style="font-weight: 600; color: var(--ink); flex-shrink: 0; font-size: 1.1rem;">Other:</span>
          <input type="text" id="option-d-input" placeholder="type here..." 
            onkeypress="handleQ3Input(event)"
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

  // Don't add additional open-ended textarea for Q3
  let openEndHTML = '';
  if (q.hasOpenEnd && !isQ3) {
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

  // Focus on the input field for Q3
  if (isQ3) {
    setTimeout(() => {
      const input = document.getElementById('option-d-input');
      if (input) input.focus();
    }, 100);
  }
}

function selectAnswer(idx) {
  const q = QUIZ_QUESTIONS[currentQuestion];

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

function handleQ3Input(event) {
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
    // Special button for question 3 - only show button, no text
    modalContent.innerHTML = `
      <a href="dashboard.html" class="btn btn-primary" style="display: inline-block; width: auto; padding: 1rem 2rem; font-size: 1rem; text-decoration: none;">
        Ready to start?
      </a>
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

function showResults() {
  const content = document.getElementById('main-content');
  const header = document.getElementById('header');

  // Hide header
  header.style.display = 'none';

  content.innerHTML = `
    <div class="fade-up" style="text-align: center; max-width: 500px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh;">
      <h2 style="font-family: var(--font-serif); font-size: 2.5rem; margin-bottom: 2rem;">ALL QUESTIONS COMPLETE</h2>

      <p style="color: var(--mid-gray); font-size: 1.1rem; margin-bottom: 3rem; line-height: 1.6;">Ready to begin your creative journey?</p>

      <a href="dashboard.html" class="btn-circle" style="display: inline-flex; text-decoration: none;">
        <span class="arrow">→</span>
      </a>
    </div>
  `;
}

renderQuestion();
