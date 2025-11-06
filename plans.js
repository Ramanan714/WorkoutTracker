// Workout data structure
const workoutData = {
    monday: {
        title: "Monday (Arms & Shoulders)",
        workouts: [
            { name: "Push-ups", sets: 3, reps: "10–12 reps", type: "reps" },
            { name: "Diamond Push-ups", sets: 2, reps: "10 reps", type: "reps" },
            { name: "Arm Circles", sets: 2, reps: "30 sec forward & backward", type: "time" },
            { name: "Incline Push-ups", sets: 3, reps: "12 reps", type: "reps" }
        ]
    },
    tuesday: {
        title: "Tuesday (Legs & Lower Body)",
        workouts: [
            { name: "Squats", sets: 3, reps: "15 reps", type: "reps" },
            { name: "Lunges", sets: 3, reps: "each leg × 12 reps", type: "reps" },
            { name: "Standing Calf Raises", sets: 3, reps: "20 reps", type: "reps" },
            { name: "Calf Stretch", sets: 2, reps: "30 sec (each leg)", type: "time" },
            { name: "Jump (Vertical / Jump Squats)", sets: 3, reps: "10–12 reps", type: "reps" }
        ]
    },
    wednesday: {
        title: "Wednesday (Rest / Recovery)",
        workouts: [
            { name: "Mission: Drink ≥ 2.5 L water", sets: 1, reps: "Daily", type: "time" },
            { name: "10 min light stretching", sets: 1, reps: "10 minutes", type: "time" },
            { name: "Eat protein-rich meal", sets: 1, reps: "eggs, milk, lentils", type: "time" }
        ]
    },
    thursday: {
        title: "Thursday (Abs & Core)",
        workouts: [
            { name: "Push-ups", sets: 3, reps: "10 reps", type: "reps" },
            { name: "Crunches", sets: 3, reps: "15 reps", type: "reps" },
            { name: "Leg Raises", sets: 3, reps: "12 reps", type: "reps" },
            { name: "Plank", sets: 3, reps: "30–45 sec each", type: "time" }
        ]
    },
    friday: {
        title: "Friday (Back & Posture)",
        workouts: [
            { name: "Plank with Arm Raise", sets: 3, reps: "30 sec", type: "time" },
            { name: "Wall Push-ups", sets: 3, reps: "12 reps", type: "reps" },
            { name: "Cobra Stretch", sets: 2, reps: "hold 20 sec each", type: "time" }
        ]
    },
    saturday: {
        title: "Saturday (Full Body)",
        workouts: [
            { name: "Push-ups", sets: 3, reps: "10–12 reps", type: "reps" },
            { name: "Squats", sets: 3, reps: "15 reps", type: "reps" },
            { name: "Plank", sets: 3, reps: "30–45 sec", type: "time" }
        ]
    },
    sunday: {
        title: "Sunday (Rest & Wellness)",
        workouts: [
            { name: "Mission: Sleep ≥ 8 hours", sets: 1, reps: "Night", type: "time" },
            { name: "Drink 3 L water", sets: 1, reps: "Daily", type: "time" },
            { name: "Light walk", sets: 1, reps: "15–20 min", type: "time" }
        ]
    }
};

// DOM Elements
const dayButtons = document.querySelectorAll('.day-btn');
const workoutDetails = document.getElementById('workout-details');
const editPlanBtn = document.getElementById('edit-plan-btn');
const editModal = document.getElementById('edit-modal');
const closeBtn = document.querySelector('.close-btn');
const daySelect = document.getElementById('day-select');
const workoutEditor = document.getElementById('workout-editor');
const editorDayTitle = document.getElementById('editor-day-title');
const workoutList = document.getElementById('workout-list');
const addWorkoutBtn = document.getElementById('add-workout-btn');
const saveChangesBtn = document.getElementById('save-changes-btn');
const cancelEditBtn = document.getElementById('cancel-edit-btn');

// Current editing state
let currentEditingDay = null;
let editedWorkouts = [];

// Initialize the page
function initPlansPage() {
    // Show Monday's workout by default
    showWorkoutDetails('monday');
    
    // Set up event listeners
    setupEventListeners();
}

// Set up all event listeners
function setupEventListeners() {
    // Day buttons
    dayButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const day = btn.dataset.day;
            setActiveDay(day);
            showWorkoutDetails(day);
        });
    });
    
    // Edit plan button
    editPlanBtn.addEventListener('click', openEditModal);
    
    // Modal controls
    closeBtn.addEventListener('click', closeEditModal);
    cancelEditBtn.addEventListener('click', closeEditModal);
    
    // Day selection in modal
    daySelect.addEventListener('change', handleDaySelect);
    
    // Add workout button
    addWorkoutBtn.addEventListener('click', addNewWorkout);
    
    // Save changes button
    saveChangesBtn.addEventListener('click', saveChanges);
    
    // Close modal when clicking outside
    editModal.addEventListener('click', (e) => {
        if (e.target === editModal) {
            closeEditModal();
        }
    });
}

// Set active day button
function setActiveDay(day) {
    dayButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.day === day) {
            btn.classList.add('active');
        }
    });
}

// Show workout details for selected day
function showWorkoutDetails(day) {
    const data = workoutData[day];
    if (!data) return;
    
    let html = `
        <h3 class="workout-day-title">${data.title}</h3>
        <div class="workout-list">
    `;
    
    data.workouts.forEach(workout => {
        html += `
            <div class="workout-item">
                <div class="workout-info">
                    <div class="workout-name">${workout.name}</div>
                    <div class="workout-sets">${workout.sets} sets × ${workout.reps}</div>
                </div>
            </div>
        `;
    });
    
    html += `</div>`;
    workoutDetails.innerHTML = html;
}

// Open edit modal
function openEditModal() {
    editModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close edit modal
function closeEditModal() {
    editModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    resetEditor();
}

// Handle day selection in modal
function handleDaySelect() {
    const selectedDay = daySelect.value;
    
    if (selectedDay) {
        currentEditingDay = selectedDay;
        editedWorkouts = [...workoutData[selectedDay].workouts];
        showWorkoutEditor(selectedDay);
    } else {
        workoutEditor.style.display = 'none';
    }
}

// Show workout editor for selected day
function showWorkoutEditor(day) {
    const data = workoutData[day];
    editorDayTitle.textContent = `${capitalizeFirst(day)}'s Workout`;
    renderWorkoutList();
    workoutEditor.style.display = 'block';
}

// Render workout list in editor
function renderWorkoutList() {
    workoutList.innerHTML = '';
    
    editedWorkouts.forEach((workout, index) => {
        const workoutElement = document.createElement('div');
        workoutElement.className = 'workout-item';
        workoutElement.innerHTML = `
            <div class="workout-info">
                <div class="workout-name">${workout.name}</div>
                <div class="workout-sets">${workout.sets} sets × ${workout.reps}</div>
            </div>
            <button class="delete-workout" data-index="${index}">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        workoutList.appendChild(workoutElement);
    });
    
    // Add event listeners to delete buttons
    document.querySelectorAll('.delete-workout').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.currentTarget.dataset.index);
            deleteWorkout(index);
        });
    });
}

// Add new workout
function addNewWorkout() {
    const name = document.getElementById('workout-name').value.trim();
    const sets = parseInt(document.getElementById('workout-sets').value);
    const reps = document.getElementById('workout-reps').value.trim();
    const type = document.getElementById('workout-type').value;
    
    if (!name || !sets || !reps) {
        alert('Please fill in all fields');
        return;
    }
    
    const newWorkout = {
        name,
        sets,
        reps: type === 'time' ? reps : `${reps} reps`,
        type
    };
    
    editedWorkouts.push(newWorkout);
    renderWorkoutList();
    
    // Clear form
    document.getElementById('workout-name').value = '';
    document.getElementById('workout-sets').value = '';
    document.getElementById('workout-reps').value = '';
}

// Delete workout
function deleteWorkout(index) {
    if (confirm('Are you sure you want to delete this workout?')) {
        editedWorkouts.splice(index, 1);
        renderWorkoutList();
    }
}

// Save changes
function saveChanges() {
    if (!currentEditingDay) return;
    
    // Update the workout data
    workoutData[currentEditingDay].workouts = [...editedWorkouts];
    
    // Update the display if this day is currently shown
    const activeDay = document.querySelector('.day-btn.active').dataset.day;
    if (activeDay === currentEditingDay) {
        showWorkoutDetails(currentEditingDay);
    }
    
    // Show success message
    alert('Workout plan updated successfully!');
    closeEditModal();
}

// Reset editor
function resetEditor() {
    daySelect.value = '';
    workoutEditor.style.display = 'none';
    currentEditingDay = null;
    editedWorkouts = [];
    
    // Clear form
    document.getElementById('workout-name').value = '';
    document.getElementById('workout-sets').value = '';
    document.getElementById('workout-reps').value = '';
}

// Utility function to capitalize first letter
function capitalizeFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', initPlansPage);