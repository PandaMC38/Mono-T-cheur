// TaskManager is loaded globally via script tag

const taskManager = new TaskManager();

// DOM Elements
const views = {
    input: document.getElementById('input-view'),
    focus: document.getElementById('focus-view'),
    completion: document.getElementById('completion-view')
};

const elements = {
    input: document.getElementById('task-input'),
    startBtn: document.getElementById('start-btn'),
    diceBtn: document.getElementById('dice-mode-btn'),
    currentTaskText: document.getElementById('current-task-text'),
    currentTaskCard: document.getElementById('current-task-card'),
    tasksRemaining: document.getElementById('tasks-remaining'),
    doneBtn: document.getElementById('done-btn'),
    skipBtn: document.getElementById('skip-btn'),
    resetBtn: document.getElementById('reset-btn'),
    newListBtn: document.getElementById('new-list-btn')
};

// Navigation
function switchView(viewName) {
    Object.values(views).forEach(el => {
        el.classList.remove('active');
        el.classList.add('hidden');
    });

    views[viewName].classList.remove('hidden');
    // Force reflow for animation
    void views[viewName].offsetWidth;
    views[viewName].classList.add('active');

    // Show/Hide Reset Button
    if (viewName === 'input') {
        elements.resetBtn.style.display = 'none';
    } else {
        elements.resetBtn.style.display = 'block';
    }
}

// Persistence
window.addEventListener('load', () => {
    const saved = localStorage.getItem('monoTaskerList');
    if (saved) {
        elements.input.value = saved;
    }
});

// Logic Integration
function startFocus(randomMode = false) {
    const text = elements.input.value;
    if (!text.trim()) return;

    localStorage.setItem('monoTaskerList', text);

    taskManager.importTasks(text);
    taskManager.setRandomMode(randomMode);

    updateTaskDisplay();
    switchView('focus');
}

function updateTaskDisplay() {
    const task = taskManager.getCurrentTask();
    const count = taskManager.getRemainingCount();

    if (!task) {
        // All done
        switchView('completion');
        return;
    }

    // Animate Card Out -> In
    elements.currentTaskCard.classList.remove('task-enter');
    void elements.currentTaskCard.offsetWidth; // trigger reflow
    elements.currentTaskCard.classList.add('task-enter');

    elements.currentTaskText.textContent = task;
    elements.tasksRemaining.textContent = count;
}

// Event Listeners
elements.startBtn.addEventListener('click', () => startFocus(false));
elements.diceBtn.addEventListener('click', () => startFocus(true));

elements.doneBtn.addEventListener('click', () => {
    // Animate exit
    elements.currentTaskCard.className = 'focus-card glass-panel task-exit-done';

    setTimeout(() => {
        const hasMore = taskManager.completeCurrentTask();
        elements.currentTaskCard.className = 'focus-card glass-panel'; // Reset class
        if (hasMore) {
            updateTaskDisplay();
        } else {
            switchView('completion');
        }
    }, 300); // Wait for animation
});

elements.skipBtn.addEventListener('click', () => {
    // Animate exit
    elements.currentTaskCard.className = 'focus-card glass-panel task-exit-skip';

    setTimeout(() => {
        taskManager.skipCurrentTask();
        elements.currentTaskCard.className = 'focus-card glass-panel'; // Reset class
        updateTaskDisplay();
    }, 300);
});

elements.resetBtn.addEventListener('click', () => {
    if (confirm('Arrêter et revenir à la liste ?')) {
        switchView('input');
    }
});

elements.newListBtn.addEventListener('click', () => {
    elements.input.value = '';
    switchView('input');
});
