class TaskManager {
    constructor() {
        this.tasks = [];
        this.completedTasks = [];
        this.currentTaskIndex = 0;
        this.isRandomMode = false;
    }

    /**
     * Parse raw text into task array.
     * @param {string} text - The raw input text.
     */
    importTasks(text) {
        this.tasks = text.split('\n')
            .map(t => t.trim())
            .filter(t => t.length > 0);
        this.completedTasks = [];
        this.currentTaskIndex = 0;
    }

    /**
     * Get the current task string.
     */
    getCurrentTask() {
        if (this.tasks.length === 0) return null;
        return this.tasks[this.currentTaskIndex];
    }

    /**
     * Get remaining tasks count.
     */
    getRemainingCount() {
        return this.tasks.length;
    }

    /**
     * Mark current task as done and remove from list.
     * Returns true if there are tasks remaining, false if all done.
     */
    completeCurrentTask() {
        if (this.tasks.length === 0) return false;

        const task = this.tasks[this.currentTaskIndex];
        this.completedTasks.push(task);
        this.tasks.splice(this.currentTaskIndex, 1);

        // Adjust index if we removed the last item or to stay in bounds
        if (this.currentTaskIndex >= this.tasks.length) {
            this.currentTaskIndex = 0;
        }

        // If in random mode, pick a new random index after removal
        if (this.isRandomMode && this.tasks.length > 0) {
            this.currentTaskIndex = Math.floor(Math.random() * this.tasks.length);
        }

        return this.tasks.length > 0;
    }

    /**
     * Skip current task (move to end or pick another random).
     */
    skipCurrentTask() {
        if (this.tasks.length <= 1) return; // Can't skip if only 1

        if (this.isRandomMode) {
            // Pick a random index that isn't the current one
            let newIndex;
            do {
                newIndex = Math.floor(Math.random() * this.tasks.length);
            } while (newIndex === this.currentTaskIndex);
            this.currentTaskIndex = newIndex;
        } else {
            // Move current to end of array
            const task = this.tasks.splice(this.currentTaskIndex, 1)[0];
            this.tasks.push(task);
            // Index stays 0 because everything shifted left, and the old head is now at tail
            this.currentTaskIndex = 0;
        }
    }

    setRandomMode(enabled) {
        this.isRandomMode = enabled;
        if (enabled && this.tasks.length > 0) {
            this.currentTaskIndex = Math.floor(Math.random() * this.tasks.length);
        } else {
            this.currentTaskIndex = 0;
        }
    }
}
