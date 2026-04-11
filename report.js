let allIdeas = JSON.parse(localStorage.getItem('ideas')) || [];
let selectedIdea = JSON.parse(localStorage.getItem('selected-idea')) || {};
let refinementData = JSON.parse(localStorage.getItem('refinement-data')) || {};
let finalIdeaNotes = JSON.parse(localStorage.getItem('final-idea-notes')) || {};
let finalIdea = refinementData.finalIdea || localStorage.getItem('final-idea') || refinementData.inProgressIdea || '';
let designTask = localStorage.getItem('design-task') || 'Creative Design Task';

function renderReport() {
  const content = document.getElementById('main-content');
  const initialIdeas = allIdeas.filter(i => i.trim());

  content.innerHTML = `
    <div class="fade-up" style="max-width: 1000px; margin: 0 auto;">
      <div style="margin-bottom: 3rem; text-align: center;">
        <h1 style="font-family: var(--font-display); font-size: clamp(2.4rem, 6vw, 3.4rem); margin-bottom: 1rem; color: var(--accent-primary); font-weight: 900;">🎉 Activity Complete!</h1>
        <p style="color: var(--mid-gray); font-size: 1.1rem; margin: 0; font-weight: 500;">You successfully refined a core idea through AI-guided research and collaborative thinking.</p>
      </div>

      <!-- Design Task -->
      <div style="background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%); color: white; padding: 2rem; border-radius: 6px; margin-bottom: 2rem; text-align: center; box-shadow: 0 8px 24px rgba(212, 36, 38, 0.2);">
        <div style="font-size: 0.9rem; opacity: 0.95; margin-bottom: 0.75rem; font-weight: 600;">Your Design Challenge:</div>
        <div style="font-family: var(--font-serif); font-size: 1.5rem; font-weight: 700;">${designTask}</div>
      </div>

      <!-- Journey Summary -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1.2rem; margin-bottom: 3rem; padding-bottom: 2rem; border-bottom: 2px solid var(--warm-gray);">
        <div style="background: linear-gradient(135deg, var(--light-gray) 0%, var(--cream) 100%); padding: 1.5rem; border-radius: 6px; border: 2px solid var(--warm-gray); text-align: center; transition: all 0.3s; box-shadow: 0 4px 12px rgba(212, 36, 38, 0.08);">
          <div style="font-family: var(--font-mono); font-size: 2.8rem; color: var(--accent-primary); font-weight: 900; margin-bottom: 0.5rem;">${initialIdeas.length}</div>
          <div style="color: var(--mid-gray); font-size: 0.9rem; font-weight: 600;">Initial Ideas</div>
        </div>
        
        <div style="background: linear-gradient(135deg, var(--light-gray) 0%, var(--cream) 100%); padding: 1.5rem; border-radius: 6px; border: 2px solid var(--warm-gray); text-align: center; transition: all 0.3s; box-shadow: 0 4px 12px rgba(212, 36, 38, 0.08);">
          <div style="font-family: var(--font-mono); font-size: 2.8rem; color: var(--accent-primary); font-weight: 900; margin-bottom: 0.5rem;">1</div>
          <div style="color: var(--mid-gray); font-size: 0.9rem; font-weight: 600;">Selected Idea</div>
        </div>
        
        <div style="background: linear-gradient(135deg, var(--light-gray) 0%, var(--cream) 100%); padding: 1.5rem; border-radius: 6px; border: 2px solid var(--warm-gray); text-align: center; transition: all 0.3s; box-shadow: 0 4px 12px rgba(212, 36, 38, 0.08);">
          <div style="font-family: var(--font-mono); font-size: 2.8rem; color: var(--accent-primary); font-weight: 900; margin-bottom: 0.5rem;">${refinementData.conversations || 0}</div>
          <div style="color: var(--mid-gray); font-size: 0.9rem; font-weight: 600;">Refinement Exchanges</div>
        </div>
        
        <div style="background: linear-gradient(135deg, var(--light-gray) 0%, var(--cream) 100%); padding: 1.5rem; border-radius: 6px; border: 2px solid var(--warm-gray); text-align: center; transition: all 0.3s; box-shadow: 0 4px 12px rgba(212, 36, 38, 0.08);">
          <div style="font-family: var(--font-mono); font-size: 2.8rem; color: var(--accent-primary); font-weight: 900; margin-bottom: 0.5rem;">1</div>
          <div style="color: var(--mid-gray); font-size: 0.9rem; font-weight: 600;">Final Concept</div>
        </div>
      </div>

      <!-- All 8 Initial Ideas -->
      <div style="margin-bottom: 3rem;">
        <h2 style="font-family: var(--font-serif); font-size: 1.3rem; margin-bottom: 1rem;">All 8 Initial Ideas</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem;">
          ${initialIdeas.map((idea, idx) => {
            const isSelected = selectedIdea.index === idx;
            return `
              <div style="background: ${isSelected ? 'rgba(212, 36, 38, 0.08)' : 'white'}; border: 2.5px solid ${isSelected ? 'var(--accent-primary)' : 'var(--warm-gray)'}; padding: 1.25rem; border-radius: 6px; font-size: 0.9rem; line-height: 1.6; color: var(--ink); transition: all 0.3s; box-shadow: ${isSelected ? '0 4px 12px rgba(212, 36, 38, 0.12)' : 'var(--shadow-sm)'};">
                <div style="font-weight: 700; color: ${isSelected ? 'var(--accent-primary)' : 'var(--mid-gray)'}; margin-bottom: 0.5rem; font-size: 0.95rem;">
                  ${isSelected ? '⭐ Selected' : 'Idea'} ${idx + 1}
                </div>
                <div style="font-weight: 500;">${idea.substring(0, 120)}${idea.length > 120 ? '...' : ''}</div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Selected Idea Details -->
      <div style="background: rgba(212, 36, 38, 0.06); border: 2.5px solid var(--accent-primary); padding: 2rem; border-radius: 6px; margin-bottom: 3rem; box-shadow: 0 8px 24px rgba(212, 36, 38, 0.1);">
        <h2 style="font-family: var(--font-serif); font-size: 1.5rem; margin: 0 0 1.2rem 0; color: var(--accent-primary); font-weight: 700;">Your Resonating Idea</h2>
        <div style="background: white; padding: 1.8rem; border-radius: 6px; color: var(--ink); line-height: 1.9; border-left: 5px solid var(--accent-primary); font-size: 1.05rem; font-weight: 500;">
          ${selectedIdea.idea || 'No idea selected'}
        </div>
      </div>

      <!-- Refinement Journey -->
      <div style="margin-bottom: 3rem;">
        <h2 style="font-family: var(--font-serif); font-size: 1.3rem; margin-bottom: 1rem;">Refinement Journey</h2>
        
        <!-- In-Progress Idea -->
        ${refinementData.inProgressIdea ? `
          <div style="margin-bottom: 2rem;">
            <h3 style="font-family: var(--font-serif); font-size: 1.1rem; color: var(--ink); margin-bottom: 0.75rem;">Your In-Progress Idea (After ${refinementData.conversations || 0} exchanges)</h3>
            <div style="background: var(--cream); border: 1.5px solid var(--warm-gray); padding: 1.5rem; border-radius: 6px; color: var(--ink); line-height: 1.8;">
              ${refinementData.inProgressIdea}
            </div>
          </div>
        ` : ''}
        
        <!-- Refinement Stats -->
        <div style="background: var(--cream); border: 1.5px solid var(--warm-gray); padding: 1.5rem; border-radius: 6px;">
          <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
            <div><strong>AI Refinement Exchanges:</strong></div>
            <div style="color: var(--mid-gray);">${refinementData.conversations || 0} messages</div>
          </div>
          <div style="display: flex; gap: 1rem;">
            <div><strong>Integration Applied:</strong></div>
            <div style="color: ${refinementData.integrationApplied ? 'var(--accent-dark)' : 'var(--mid-gray)'};">
              ${refinementData.integrationApplied === true ? '✓ Yes - Elements from other ideas incorporated' : refinementData.integrationApplied === false ? 'No - Focused on core idea' : '—'}
            </div>
          </div>
        </div>
      </div>

      <!-- Final Concept -->
      <div style="background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%); padding: 2.2rem; border-radius: 6px; border: 3px solid var(--accent-dark); margin-bottom: 2rem; color: white; box-shadow: 0 12px 40px rgba(212, 36, 38, 0.25);">
        <h2 style="font-family: var(--font-serif); font-size: 1.5rem; margin: 0 0 1.2rem 0; font-weight: 700;">✨ Your Final Concept</h2>
        <div style="background: rgba(255,255,255,0.18); padding: 1.8rem; border-radius: 6px; color: white; line-height: 1.9; font-size: 1.1rem; font-family: var(--font-serif); font-weight: 500; border-left: 4px solid rgba(255,255,255,0.4);">
          ${finalIdea}
        </div>
      </div>

      <!-- Download & Navigation -->
      <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
        <button class="btn btn-secondary" onclick="downloadReport()">📥 Download Report</button>
        <button class="btn btn-primary" onclick="location.href='dashboard.html'">Return to Dashboard</button>
      </div>
    </div>
  `;
}

function downloadReport() {
  let reportText = `CRAZY 8S ACTIVITY - REPORT CARD\n`;
  reportText += `${'='.repeat(70)}\n\n`;
  
  reportText += `DESIGN CHALLENGE:\n`;
  reportText += `${'-'.repeat(70)}\n${designTask}\n\n`;
  
  reportText += `CREATIVE JOURNEY:\n`;
  reportText += `${'-'.repeat(70)}\n`;
  reportText += `Initial Ideas Generated: ${allIdeas.filter(i => i.trim()).length}\n`;
  reportText += `Selected Resonating Idea: 1\n`;
  reportText += `AI Refinement Exchanges: ${refinementData.conversations || 0}\n`;
  reportText += `Integration Applied: ${refinementData.integrationApplied ? 'Yes' : 'No'}\n\n`;
  
  reportText += `ALL 8 INITIAL IDEAS:\n`;
  reportText += `${'-'.repeat(70)}\n`;
  allIdeas.forEach((idea, idx) => {
    const marker = selectedIdea.index === idx ? '★ ' : '  ';
    reportText += `${marker}${idx + 1}. ${idea || '(Empty)'}\n`;
  });
  reportText += `\n`;
  
  reportText += `SELECTED RESONATING IDEA:\n`;
  reportText += `${'-'.repeat(70)}\n${selectedIdea.idea || 'No idea selected'}\n\n`;
  
  reportText += `REFINEMENT PROCESS:\n`;
  reportText += `${'-'.repeat(70)}\n`;
  reportText += `Number of AI-guided conversations: ${refinementData.conversations || 0} messages\n`;
  
  if (refinementData.inProgressIdea) {
    reportText += `\nIN-PROGRESS IDEA (after refinement):\n`;
    reportText += `${'-'.repeat(70)}\n${refinementData.inProgressIdea}\n`;
  }
  
  reportText += `\nIntegration of other ideas: ${refinementData.integrationApplied === true ? 'Yes - Elements incorporated from other ideas' : refinementData.integrationApplied === false ? 'No - Focused on core idea' : 'Not applied'}\n\n`;
  
  reportText += `FINAL POLISHED CONCEPT:\n`;
  reportText += `${'-'.repeat(70)}\n${finalIdea}\n\n`;
  
  reportText += `${'='.repeat(70)}\n`;
  reportText += `Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}\n`;

  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(reportText));
  element.setAttribute('download', 'Crazy8s_Report.txt');
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

renderReport();
