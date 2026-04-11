let selectedIdeasData = JSON.parse(localStorage.getItem('selected-ideas')) || [];
let finalIdea = '';

function renderSynthesis() {
  const content = document.getElementById('main-content');

  content.innerHTML = `
    <div class="fade-up" style="max-width: 800px; margin: 0 auto;">
      <div style="margin-bottom: 2rem;">
        <h1 style="font-family: var(--font-serif); font-size: 2rem; margin-bottom: 0.5rem;">Merge Your Ideas</h1>
        <p style="color: var(--mid-gray); margin-bottom: 2rem;">Based on your refinement, combine your selected ideas into one final, integrated concept.</p>
      </div>

      <div style="margin-bottom: 2rem;">
        <h2 style="font-family: var(--font-serif); font-size: 1.2rem; margin-bottom: 1rem;">Your Selected Ideas</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
          ${selectedIdeasData.map((item, idx) => `
            <div style="background: var(--cream); border: 1.5px solid var(--accent-dark); padding: 1.5rem; border-radius: 6px;">
              <div style="font-weight: 600; color: var(--accent-dark); margin-bottom: 0.75rem;">Idea ${item.index + 1}</div>
              <div style="color: var(--ink); line-height: 1.5;">${item.idea}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <div style="background: var(--cream); border: 1.5px solid var(--warm-gray); padding: 2rem; border-radius: 6px;">
        <h2 style="margin: 0 0 1rem 0; font-weight: 600;">Your Final Concept</h2>
        <p style="color: var(--mid-gray); font-size: 0.95rem; margin: 0 0 1rem 0;">Combine the strongest elements from your ideas into one polished concept:</p>
        <textarea 
          id="final-idea-text"
          placeholder="Describe your merged concept here..."
          style="width: 100%; min-height: 150px; padding: 1.5rem; border: 1.5px solid var(--warm-gray); border-radius: 6px; font-family: var(--font-sans); font-size: 1rem; resize: vertical; box-sizing: border-box;"
        >${finalIdea}</textarea>
      </div>

      <div style="margin-top: 2rem; display: flex; gap: 1rem; justify-content: center;">
        <button class="btn btn-secondary" onclick="location.href='ai-feedback.html'">Back</button>
        <button class="btn btn-primary" onclick="proceedToFinalization()">Next</button>
      </div>
    </div>
  `;
}

function proceedToFinalization() {
  finalIdea = document.getElementById('final-idea-text').value.trim();
  
  if (!finalIdea) {
    alert('Please describe your final concept before proceeding.');
    return;
  }
  
  // Save synthesis
  const iterations = JSON.parse(localStorage.getItem('iterations')) || [];
  iterations.push({
    stage: 'synthesis',
    selectedIdeas: selectedIdeasData,
    synthesizedIdea: finalIdea
  });
  localStorage.setItem('iterations', JSON.stringify(iterations));
  localStorage.setItem('final-idea', finalIdea);
  
  location.href = 'finalization.html';
}

renderSynthesis();
