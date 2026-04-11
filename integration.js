let allIdeas = JSON.parse(localStorage.getItem('ideas')) || [];
let selectedIdea = JSON.parse(localStorage.getItem('selected-idea')) || {};
let refinementData = JSON.parse(localStorage.getItem('refinement-data')) || {};
const API_URL = 'http://localhost:3001';

function renderIntegration() {
  const content = document.getElementById('main-content');
  const inProgressIdea = refinementData.inProgressIdea || '';
  
  content.innerHTML = `
    <div class="fade-up" style="max-width: 1000px; margin: 0 auto;">
      <div style="margin-bottom: 2rem; text-align: center;">
        <h1 style="font-family: var(--font-serif); font-size: clamp(1.8rem, 5vw, 2.4rem); margin-bottom: 1rem; font-weight: 900;">Integrate Your Ideas?</h1>
        <p style="color: var(--mid-gray); margin-bottom: 2rem; font-size: 1.05rem; font-weight: 500;">Would you like to integrate elements from your other ideas to strengthen your refined concept?</p>
      </div>

      <!-- Your Refined Idea -->
      <div style="background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%); color: white; padding: 2.2rem; border-radius: 6px; margin-bottom: 3rem; box-shadow: 0 12px 40px rgba(212, 36, 38, 0.25);">
        <div style="font-size: 0.95rem; opacity: 0.95; margin-bottom: 1rem; font-weight: 600;">Your Refined Idea (from ${refinementData.userMessageCount || 0} exchanges):</div>
        <div style="font-family: var(--font-serif); font-size: 1.3rem; font-weight: 700; line-height: 1.7;">${inProgressIdea}</div>
      </div>

      <!-- All 8 Ideas Reference -->
      <div style="margin-bottom: 3rem;">
        <h2 style="font-family: var(--font-serif); font-size: 1.5rem; margin-bottom: 1.5rem; font-weight: 700;">Your Other 7 Ideas</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
          ${allIdeas.map((idea, idx) => {
            const isSelected = selectedIdea.index === idx;
            return `
              <div style="background: ${isSelected ? 'rgba(212, 36, 38, 0.06)' : 'white'}; border: ${isSelected ? '2.5px solid var(--accent-primary)' : '2px solid var(--warm-gray)'}; padding: 1.5rem; border-radius: 6px; transition: all 0.3s; box-shadow: ${isSelected ? '0 4px 12px rgba(212, 36, 38, 0.12)' : 'var(--shadow-sm)'};">
                <div style="font-weight: 700; color: ${isSelected ? 'var(--accent-primary)' : 'var(--mid-gray)'}; margin-bottom: 0.75rem; font-size: 0.95rem;">
                  ${isSelected ? '⭐ Refined Idea' : 'Idea'} ${idx + 1}
                </div>
                <div style="color: var(--ink); line-height: 1.6; font-size: 0.95rem; font-weight: 500;">${idea || '<em>Empty</em>'}</div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Decision Buttons -->
      <div style="background: linear-gradient(135deg, var(--light-gray) 0%, var(--cream) 100%); border: 2.5px solid var(--warm-gray); padding: 2.2rem; border-radius: 6px; text-align: center; box-shadow: var(--shadow-lg);">
        <p style="color: var(--ink); font-size: 1.05rem; margin: 0 0 1.5rem 0; font-weight: 600;">What would you like to do?</p>
        <div style="display: flex; gap: 1.5rem; justify-content: center; flex-wrap: wrap;">
          <button class="btn btn-primary" onclick="chooseIntegration(true)" style="min-width: 200px;">Yes, Integrate Ideas</button>
          <button class="btn btn-secondary" onclick="chooseIntegration(false)" style="min-width: 200px;">No, Keep As Is</button>
        </div>
      </div>
    </div>
  `;
}

function chooseIntegration(wantsIntegration) {
  // Save integration choice
  refinementData.integrationApplied = wantsIntegration;
  localStorage.setItem('refinement-data', JSON.stringify(refinementData));
  
  if (wantsIntegration) {
    // Go to integration chat page
    location.href = 'integration-chat.html';
  } else {
    // Skip to report
    location.href = 'report.html';
  }
}

renderIntegration();
