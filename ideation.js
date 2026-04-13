let ideas = Array(8).fill('');
let timerActive = false;
let timeRemaining = 480; // 8 minutes in seconds
let currentTask = '';
let timerInterval = null; // Store interval globally

function generateTask() {
  currentTask = generateRandomTask();
  localStorage.setItem('design-task', currentTask);
}

function startTimer() {
  timerActive = !timerActive;
  
  // Clear any existing interval before starting a new one
  if (timerInterval !== null) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  
  if (timerActive) {
    timerInterval = setInterval(() => {
      if (timerActive && timeRemaining > 0) {
        timeRemaining--;
        updateTimerDisplay();
      } else if (timeRemaining === 0) {
        timerActive = false;
        if (timerInterval !== null) {
          clearInterval(timerInterval);
          timerInterval = null;
        }
      }
    }, 1000);
  }
  updateTimerDisplay();
}

function updateTimerDisplay() {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const display = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  document.getElementById('timer-display').textContent = timerActive ? display : '';
}

function updateIdea(index, value) {
  ideas[index] = value;
}

function renderIdeation() {
  const content = document.getElementById('main-content');

  content.innerHTML = `
    <div class="fade-up" style="max-width: 1000px; margin: 0 auto; display: block;">
      <div style="margin-bottom: 1.5rem; flex-shrink: 0;">
        <h1 style="font-family: var(--font-serif); font-size: 1.8rem; margin-bottom: 0.8rem;">Your Design Challenge</h1>
        <div style="background: var(--accent-primary); color: white; padding: 1.2rem; border-radius: 6px; margin-bottom: 1.5rem;">
          <div style="font-size: 0.9rem; color: rgba(255,255,255,0.9); margin-bottom: 0.5rem;">AI-Generated Task:</div>
          <div style="font-size: 1.2rem; font-family: var(--font-serif); font-weight: 600;">${currentTask}</div>
        </div>

        <h2 style="font-family: var(--font-serif); font-size: 1.1rem; margin-bottom: 0.5rem;">Generate Your 8 Ideas</h2>
        <p style="color: var(--mid-gray); margin: 0; margin-bottom: 1rem; font-size: 0.95rem;">Write down 8 ideas in 8 minutes. Don't overthink—quantity over quality!</p>
        
        <button class="btn ${timerActive ? 'btn-primary' : 'btn-secondary'}" onclick="startTimer()" style="margin-bottom: 1rem;">
          ${timerActive ? '⏸ Pause Timer' : '▶ Start 8-Minute Timer'}
        </button>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
        ${ideas.map((idea, idx) => `
          <div style="display: flex; flex-direction: column;">
            <label style="font-weight: 500; margin-bottom: 0.3rem; color: var(--ink); font-size: 0.9rem;">Idea ${idx + 1}</label>
            <textarea 
              placeholder="Enter your idea..."
              onchange="updateIdea(${idx}, this.value)"
              style="width: 100%; min-height: 80px; padding: 0.8rem; border: 1.5px solid var(--warm-gray); border-radius: 6px; font-family: var(--font-sans); font-size: 0.9rem; resize: none; box-sizing: border-box; background: white;"
            >${idea}</textarea>
          </div>
        `).join('')}
      </div>

      <div style="display: flex; gap: 1rem; justify-content: center; flex-shrink: 0;">
        <button class="btn btn-secondary" onclick="location.href='activity.html'">Back</button>
        <button class="btn btn-primary" onclick="proceedToSelection()">Next</button>
      </div>
    </div>
  `;
}

function proceedToSelection() {
  // Filter out empty ideas
  const filledIdeas = ideas.filter(idea => idea.trim().length > 0);
  
  if (filledIdeas.length === 0) {
    alert('Please enter at least one idea before proceeding.');
    return;
  }
  
  // Save ideas to localStorage
  localStorage.setItem('ideas', JSON.stringify(ideas));
  localStorage.setItem('iterations', JSON.stringify([{ stage: 'initial', ideas: ideas, feedback: '' }]));
  
  location.href = 'selection.html';
}

// Generate task on page load
generateTask();
renderIdeation();
