let ideas = Array(8).fill('');
let timerActive = false;
let timeRemaining = 480; // 8 minutes in seconds
let currentTask = '';

function generateTask() {
  currentTask = generateRandomTask();
  localStorage.setItem('design-task', currentTask);
}

function startTimer() {
  timerActive = !timerActive;
  if (timerActive) {
    const timerInterval = setInterval(() => {
      if (timerActive && timeRemaining > 0) {
        timeRemaining--;
        updateTimerDisplay();
      } else if (timeRemaining === 0) {
        timerActive = false;
        clearInterval(timerInterval);
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
    <div class="fade-up" style="max-width: 800px; margin: 0 auto;">
      <div style="margin-bottom: 2rem;">
        <h1 style="font-family: var(--font-serif); font-size: 2rem; margin-bottom: 1rem;">Your Design Challenge</h1>
        <div style="background: var(--accent); color: white; padding: 1.5rem; border-radius: 6px; margin-bottom: 2rem;">
          <div style="font-size: 0.9rem; color: rgba(255,255,255,0.9); margin-bottom: 0.5rem;">AI-Generated Task:</div>
          <div style="font-size: 1.3rem; font-family: var(--font-serif); font-weight: 600;">${currentTask}</div>
        </div>

        <h2 style="font-family: var(--font-serif); font-size: 1.3rem; margin-bottom: 1rem;">Generate Your 8 Ideas</h2>
        <p style="color: var(--mid-gray); margin: 0; margin-bottom: 1.5rem;">Write down 8 ideas in 8 minutes. Don't overthink—quantity over quality!</p>
        
        <button class="btn ${timerActive ? 'btn-primary' : 'btn-secondary'}" onclick="startTimer()" style="margin-bottom: 2rem;">
          ${timerActive ? '⏸ Pause Timer' : '▶ Start 8-Minute Timer'}
        </button>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
        ${ideas.map((idea, idx) => `
          <div style="display: flex; flex-direction: column;">
            <label style="font-weight: 500; margin-bottom: 0.5rem; color: var(--ink);">Idea ${idx + 1}</label>
            <textarea 
              placeholder="Enter your idea..."
              onchange="updateIdea(${idx}, this.value)"
              style="width: 100%; min-height: 120px; padding: 1rem; border: 1.5px solid var(--warm-gray); border-radius: 6px; font-family: var(--font-sans); font-size: 0.95rem; resize: vertical; box-sizing: border-box;"
            >${idea}</textarea>
          </div>
        `).join('')}
      </div>

      <div style="display: flex; gap: 1rem; justify-content: center;">
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
