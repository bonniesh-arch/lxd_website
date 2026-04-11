let originalIdeas = JSON.parse(localStorage.getItem('ideas')) || [];
let workingIdeas = originalIdeas.filter(i => i.trim());
let finalIdea = '';

function renderIteration() {
  const content = document.getElementById('main-content');

  content.innerHTML = `
    <div class="fade-up" style="max-width: 800px; margin: 0 auto;">
      <div style="margin-bottom: 2rem;">
        <h1 style="font-family: var(--font-serif); font-size: 2rem; margin-bottom: 0.5rem;">Refine & Combine Ideas</h1>
        <p style="color: var(--mid-gray); margin-bottom: 2rem;">Based on the AI feedback, let's narrow down and merge your ideas into one focused concept.</p>
      </div>

      <div style="margin-bottom: 3rem;">
        <h2 style="font-family: var(--font-serif); font-size: 1.3rem; margin-bottom: 1.5rem;">Your Ideas</h2>
        <div id="ideas-container" style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2rem;"></div>
        
        <div style="background: var(--light-gray); padding: 1.5rem; border-radius: 6px; margin-bottom: 2rem;">
          <h3 style="margin: 0 0 1rem 0; font-weight: 600;">Merge Ideas</h3>
          <p style="color: var(--mid-gray); font-size: 0.95rem; margin: 0 0 1rem 0;">Select 2-3 ideas to combine or discard the ones that don't fit.</p>
          <div style="display: flex; gap: 1rem; flex-wrap: wrap;" id="merge-buttons"></div>
        </div>

        <div style="background: var(--cream); border: 1.5px solid var(--warm-gray); padding: 1.5rem; border-radius: 6px;">
          <h3 style="margin: 0 0 1rem 0; font-weight: 600;">Synthesized Concept</h3>
          <textarea 
            id="synthesized-idea"
            placeholder="Describe your merged concept here..."
            style="width: 100%; min-height: 120px; padding: 1rem; border: 1.5px solid var(--warm-gray); border-radius: 6px; font-family: var(--font-sans); font-size: 0.95rem; resize: vertical; box-sizing: border-box;"
          >${finalIdea}</textarea>
        </div>
      </div>

      <div style="display: flex; gap: 1rem; justify-content: center;">
        <button class="btn btn-secondary" onclick="location.href='ai-feedback.html'">Back</button>
        <button class="btn btn-primary" onclick="proceedToFinalization()">Next</button>
      </div>
    </div>
  `;

  renderIdeasContainer();
  renderMergeButtons();
}

function renderIdeasContainer() {
  const container = document.getElementById('ideas-container');
  container.innerHTML = workingIdeas.map((idea, idx) => `
    <div style="background: linear-gradient(135deg, var(--light-gray) 0%, var(--cream) 100%); padding: 1.2rem; border-radius: 6px; border: 2px solid var(--warm-gray); display: flex; justify-content: space-between; align-items: start; transition: all 0.3s; box-shadow: var(--shadow-sm);">
      <div style="flex: 1;">
        <div style="font-weight: 700; margin-bottom: 0.75rem; color: var(--accent-primary); font-size: 1rem;">Idea ${idx + 1}</div>
        <div style="color: var(--ink); font-weight: 500; line-height: 1.6;">${idea}</div>
      </div>
      <button class="btn btn-secondary" onclick="removeIdea(${idx})" style="margin-left: 1rem; padding: 0.6rem 1.2rem; font-size: 0.85rem; flex-shrink: 0;">Discard</button>
    </div>
  `).join('');
}

function renderMergeButtons() {
  const container = document.getElementById('merge-buttons');
  container.innerHTML = workingIdeas.map((idea, idx) => `
    <button class="btn btn-secondary" onclick="selectIdeaToMerge(${idx})" style="padding: 0.6rem 1rem; font-size: 0.9rem;">
      Idea ${idx + 1}
    </button>
  `).join('');
}

function removeIdea(index) {
  workingIdeas.splice(index, 1);
  renderIteration();
}

function selectIdeaToMerge(index) {
  const idea = workingIdeas[index];
  const textarea = document.getElementById('synthesized-idea');
  if (textarea.value) {
    textarea.value += '\n\n+ ' + idea;
  } else {
    textarea.value = idea;
  }
}

function proceedToFinalization() {
  finalIdea = document.getElementById('synthesized-idea').value.trim();
  
  if (!finalIdea) {
    alert('Please create a synthesized concept before proceeding.');
    return;
  }
  
  // Save iteration
  const iterations = JSON.parse(localStorage.getItem('iterations')) || [];
  iterations.push({
    stage: 'iteration',
    workingIdeas: workingIdeas,
    synthesizedIdea: finalIdea
  });
  localStorage.setItem('iterations', JSON.stringify(iterations));
  localStorage.setItem('synthesized-idea', finalIdea);
  
  location.href = 'finalization.html';
}

renderIteration();
