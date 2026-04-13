let ideas = JSON.parse(localStorage.getItem('ideas')) || [];
let selectedIdeaIndex = -1;

function toggleIdea(index) {
  const isEmpty = !ideas[index].trim();
  if (isEmpty) return;
  
  // Allow deselecting or selecting a new idea
  if (selectedIdeaIndex === index) {
    selectedIdeaIndex = -1;
  } else {
    selectedIdeaIndex = index;
  }
  
  renderSelection();
}

function renderSelection() {
  const content = document.getElementById('main-content');

  content.innerHTML = `
    <div class="fade-up" style="max-width: 900px; margin: 0 auto;">
      <div style="margin-bottom: 2rem;">
        <h1 style="font-family: var(--font-serif); font-size: clamp(2rem, 4vw, 2.6rem); margin-bottom: 0.5rem; font-weight: 900;">Select Your Resonating Idea</h1>
        <p style="color: var(--mid-gray); margin: 0; margin-bottom: 1.5rem; font-size: 1.05rem; font-weight: 500;">Which idea do you feel most excited about or has the most potential? Pick one.</p>
        <div style="color: var(--accent-primary); font-weight: 700; margin-bottom: 2rem; font-size: 1rem;">Selected: ${selectedIdeaIndex >= 0 ? '1' : '0'} / 1</div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
        ${ideas.map((idea, idx) => {
          const isSelected = selectedIdeaIndex === idx;
          const isEmpty = !idea.trim();
          return `
            <div 
              onclick="${isEmpty ? '' : `toggleIdea(${idx})`}"
              style="cursor: ${isEmpty ? 'not-allowed' : 'pointer'}; padding: 1.5rem; border-radius: 6px; border: 2.5px solid ${isSelected ? 'var(--accent-primary)' : 'var(--warm-gray)'}; background: ${isSelected ? 'rgba(212, 36, 38, 0.06)' : isEmpty ? 'var(--light-gray)' : 'var(--cream)'}; transition: all var(--transition-smooth); opacity: ${isEmpty ? 0.5 : 1}; box-shadow: ${isSelected ? '0 4px 12px rgba(212, 36, 38, 0.12)' : 'var(--shadow-sm)'}; "sm)'}; "
              onmouseover="if(!${isEmpty}) this.style.borderColor='var(--accent-primary)'; this.style.transform='translateY(-2px); this.style.boxShadow='0 6px 16px rgba(212, 36, 38, 0.15)';"
              onmouseout="if(!${isEmpty}) this.style.borderColor='${isSelected ? 'var(--accent-primary)' : 'var(--warm-gray)'}'; this.style.transform='scale(1); this.style.boxShadow='${isSelected ? '0 4px 12px rgba(212, 36, 38, 0.12)' : 'var(--shadow-sm)'}';"
            >
              <div style="display: flex; align-items: start; justify-content: space-between;">
                <div style="flex: 1;">
                  <div style="font-weight: 700; color: var(--ink); margin-bottom: 0.5rem; font-size: 1rem;">Idea ${idx + 1}${isEmpty ? ' (Empty)' : ''}</div>
                  <div style="color: ${isEmpty ? 'var(--mid-gray)' : 'var(--ink)'}; line-height: 1.6; font-size: 0.95rem; font-weight: 500;">${isEmpty ? 'No idea entered' : idea}</div>
                </div>
                ${!isEmpty ? `<div style="margin-left: 1rem; width: 28px; height: 28px; border-radius: 50%; border: 2.5px solid ${isSelected ? 'var(--accent-primary)' : 'var(--warm-gray)'}; background: ${isSelected ? 'var(--accent-primary)' : 'white'}; display: flex; align-items: center; justify-content: center; color: white; font-size: 0.9rem; flex-shrink: 0; font-weight: 700; transition: all 0.2s;">
                  ${isSelected ? '✓' : ''}
                </div>` : ''}
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <div style="display: flex; gap: 1rem; justify-content: center;">
        <button class="btn btn-secondary" onclick="location.href='ideation.html'">Back</button>
        <button class="btn btn-primary" onclick="proceedToRefinement()" style="${selectedIdeaIndex < 0 ? 'opacity: 0.6; cursor: not-allowed;' : ''}">Next</button>
      </div>
    </div>
  `;
}

function proceedToRefinement() {
  if (selectedIdeaIndex < 0) {
    alert('Please select one idea before proceeding.');
    return;
  }
  
  // Save selected idea (single)
  const selectedIdea = {
    index: selectedIdeaIndex,
    idea: ideas[selectedIdeaIndex]
  };
  
  localStorage.setItem('selected-idea', JSON.stringify(selectedIdea));
  
  location.href = 'ai-feedback.html';
}

renderSelection();
