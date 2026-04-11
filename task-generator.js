/**
 * Task Generator - Uses tasks from ai-prompts.js
 */

function generateRandomTask() {
  const randomIndex = Math.floor(Math.random() * DESIGN_TASKS.length);
  return DESIGN_TASKS[randomIndex];
}

