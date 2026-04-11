const QUIZ_QUESTIONS = [
  {
    question: "What is the primary purpose of a learning management system?",
    options: [
      "To organize and deliver educational content",
      "To replace textbooks entirely",
      "To eliminate the need for teachers",
      "To gamify all learning activities"
    ],
    correct: 0,
    explanation: "A learning management system (LMS) is designed to organize, deliver, and track educational content and student progress."
  },
  {
    question: "Which of the following is a key benefit of spaced repetition?",
    options: [
      "It allows instant mastery of all topics",
      "It improves long-term retention by reviewing material at optimal intervals",
      "It reduces the need to study at all",
      "It only works for memorization"
    ],
    correct: 1,
    explanation: "Spaced repetition is proven to enhance long-term memory retention by reviewing material at scientifically-optimized intervals."
  },
  {
    question: "What does 'active learning' emphasize?",
    options: [
      "Passive reading of textbooks",
      "Listening to lectures without interaction",
      "Engaged participation and problem-solving by the learner",
      "Standardized testing only"
    ],
    correct: 2,
    explanation: "Active learning emphasizes that learners engage directly through discussion, problem-solving, and hands-on practice."
  },
  {
    question: "How can immediate feedback improve learning outcomes?",
    options: [
      "It has no effect on learning",
      "It allows learners to identify and correct mistakes quickly",
      "It only works for advanced students",
      "It discourages further learning"
    ],
    correct: 1,
    explanation: "Immediate feedback helps learners understand mistakes right away, enabling them to adjust their understanding and strategies."
  }
];

let currentQuestion = 0;
let score = 0;

function renderQuestion() {
  const content = document.getElementById('main-content');
  const progressFill = document.getElementById('progress-fill');
  progressFill.style.width = `${(currentQuestion / QUIZ_QUESTIONS.length) * 100}%`;

  const q = QUIZ_QUESTIONS[currentQuestion];

  content.innerHTML = `
    <div class="fade-up">
      <div style="margin-bottom: 2rem;">
        <p style="color: var(--mid-gray); font-size: 0.9rem;">Question ${currentQuestion + 1} of ${QUIZ_QUESTIONS.length}</p>
        <h2 style="font-family: var(--font-serif); font-size: 1.8rem; margin: 1rem 0;">${q.question}</h2>
      </div>

      <div id="options-container" style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2rem;">
        ${q.options.map((option, idx) => `
          <button class="quiz-option" onclick="selectAnswer(${idx})" data-index="${idx}">
            <span class="option-letter">${String.fromCharCode(65 + idx)}</span>
            <span class="option-text">${option}</span>
          </button>
        `).join('')}
      </div>

      <div id="feedback-container"></div>
    </div>
  `;
}

function selectAnswer(idx) {
  const q = QUIZ_QUESTIONS[currentQuestion];
  const isCorrect = idx === q.correct;
  const feedbackContainer = document.getElementById('feedback-container');
  const optionsContainer = document.getElementById('options-container');

  // Disable all options
  document.querySelectorAll('.quiz-option').forEach(btn => {
    btn.disabled = true;
  });

  // Highlight selected and correct answers
  document.querySelectorAll('.quiz-option').forEach((btn, i) => {
    if (i === q.correct) {
      btn.classList.add('correct');
    }
    if (i === idx && !isCorrect) {
      btn.classList.add('incorrect');
    }
  });

  // Show feedback
  feedbackContainer.innerHTML = `
    <div class="feedback-box ${isCorrect ? 'feedback-correct' : 'feedback-incorrect'}" style="margin-bottom: 2rem;">
      <div style="display: flex; align-items: center; gap: 0.8rem; margin-bottom: 0.8rem;">
        <span style="font-size: 1.5rem;">${isCorrect ? '✓' : '✗'}</span>
        <span style="font-weight: 600;">${isCorrect ? 'Correct!' : 'Incorrect'}</span>
      </div>
      <p style="margin: 0; color: var(--ink);">${q.explanation}</p>
    </div>
  `;

  if (isCorrect) {
    score++;
  }

  // Show next button
  feedbackContainer.innerHTML += `
    <button class="btn btn-primary" onclick="nextQuestion()" style="width: 100%;">
      ${currentQuestion < QUIZ_QUESTIONS.length - 1 ? 'Next Question' : 'See Results'}
    </button>
  `;
}

function nextQuestion() {
  if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
    currentQuestion++;
    renderQuestion();
  } else {
    showResults();
  }
}

function showResults() {
  const content = document.getElementById('main-content');

  content.innerHTML = `
    <div class="fade-up" style="text-align: center; max-width: 500px; margin: 0 auto;">
      <h2 style="font-family: var(--font-serif); font-size: 2.5rem; margin-bottom: 2rem;">ALL QUESTIONS COMPLETE</h2>

      <p style="color: var(--mid-gray); font-size: 1.1rem; margin-bottom: 3rem;">Ready to begin your creative journey?</p>

      <a href="dashboard.html" class="btn-circle" style="display: inline-flex; text-decoration: none;">
        <span class="arrow">→</span>
      </a>
    </div>
  `;
}

renderQuestion();
