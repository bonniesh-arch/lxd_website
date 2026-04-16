const userProgress = [
  { title: "Learning Basics", completed: 4, total: 5, lastAttempt: "2 days ago" },
  { title: "Advanced Topics", completed: 2, total: 6, lastAttempt: "1 week ago" },
  { title: "Practice Quiz", completed: 3, total: 4, lastAttempt: "Today" }
];

function renderDashboard() {
  const content = document.getElementById('main-content');

  content.innerHTML = `
    <div class="fade-up">
      <div style="margin-bottom: 3rem;">
        <h1 style="font-family: var(--font-serif); font-size: 2rem; margin-bottom: 0.5rem;">Choose an Activity</h1>
        <p style="color: var(--mid-gray);">Select an activity to begin your creative journey.</p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-bottom: 2rem;">
        ${userProgress.map((course, idx) => {
          if (idx === 0) {
            return `
              <div class="progress-card">
                <h3 style="font-family: var(--font-serif); font-size: 1.2rem; margin-bottom: 1rem;">Crazy 8</h3>

                <p style="color: var(--mid-gray); font-size: 0.9rem; margin-bottom: 1rem;">Generate 8 ideas and refine with AI</p>

                <button class="btn btn-primary" onclick="location.href='mission.html'" style="width: 100%;">
                  Start
                </button>
              </div>
            `;
          } else {
            return `
              <div class="progress-card" style="opacity: 0.6; pointer-events: none;">
                <p style="color: var(--mid-gray); font-size: 0.9rem; text-align: center; margin-top: 3rem;">Coming Soon</p>
              </div>
            `;
          }
        }).join('')}
      </div>
    </div>
  `;
}

renderDashboard();
