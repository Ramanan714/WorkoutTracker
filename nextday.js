// Workout data for all days
const workoutData = {
    monday: {
        focus: "Arms & Shoulders",
        exercises: [
            { name: "Push-ups", sets: 3, reps: "10–12 reps" },
            { name: "Diamond Push-ups", sets: 2, reps: "10 reps" },
            { name: "Arm Circles", sets: 2, reps: "30 seconds forward & backward" },
            { name: "Incline Push-ups", sets: 3, reps: "12 reps" }
        ]
    },
    tuesday: {
        focus: "Legs & Lower Body",
        exercises: [
            { name: "Squats", sets: 3, reps: "15 reps" },
            { name: "Lunges", sets: 3, reps: "12 reps each leg" },
            { name: "Standing Calf Raises", sets: 3, reps: "20 reps" },
            { name: "Calf Stretch", sets: 2, reps: "30 seconds each leg" },
            { name: "Jump Squats", sets: 3, reps: "10–12 reps" }
        ]
    },
    wednesday: {
        isRestDay: true,
        activities: [
            "Drink ≥ 2.5 L water",
            "10 min light stretching",
            "Eat protein-rich meal (eggs, milk, lentils)"
        ]
    },
    thursday: {
        focus: "Abs & Core",
        exercises: [
            { name: "Push-ups", sets: 3, reps: "10 reps" },
            { name: "Crunches", sets: 3, reps: "15 reps" },
            { name: "Leg Raises", sets: 3, reps: "12 reps" },
            { name: "Plank", sets: 3, reps: "30–45 seconds each" }
        ]
    },
    friday: {
        focus: "Back & Posture",
        exercises: [
            { name: "Plank with Arm Raise", sets: 3, reps: "30 seconds" },
            { name: "Wall Push-ups", sets: 3, reps: "12 reps" },
            { name: "Cobra Stretch", sets: 2, reps: "hold 20 seconds each" }
        ]
    },
    saturday: {
        focus: "Full Body",
        exercises: [
            { name: "Push-ups", sets: 3, reps: "10–12 reps" },
            { name: "Squats", sets: 3, reps: "15 reps" },
            { name: "Plank", sets: 3, reps: "30–45 seconds" }
        ]
    },
    sunday: {
        isRestDay: true,
        activities: [
            "Sleep ≥ 8 hours",
            "Drink 3 L water",
            "Light walk (15–20 min)"
        ]
    }
};

// DOM Elements
const currentDayElement = document.getElementById('current-day');
const currentDateElement = document.getElementById('current-date');
const displayDayElement = document.getElementById('display-day');
const displayDateElement = document.getElementById('display-date');
const prevDayBtn = document.getElementById('prev-day-btn');
const nextDayBtn = document.getElementById('next-day-btn');
const goalTitle = document.getElementById('goal-title');
const workoutContent = document.getElementById('workout-content');
const planContainer = document.querySelector('.plan-container');

// State
let currentDisplayIndex = 0;
const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Initialize the page
function initNextDayPage() {
    updateCurrentDay(); // Show today in the top box
    setupEventListeners();
    updateDisplayedPlan();
    updateNavigationButtons();
}

// Setup event listeners
function setupEventListeners() {
    prevDayBtn.addEventListener('click', showPreviousDay);
    nextDayBtn.addEventListener('click', showNextDay);
}

// Update current day display in the top box
function updateCurrentDay() {
    const today = new Date();
    const dayIndex = today.getDay();
    const dayName = dayNames[dayIndex];
    const dateNumber = today.getDate();
    const month = today.toLocaleDateString('en-US', { month: 'long' });
    
    currentDayElement.textContent = dayName;
    currentDateElement.textContent = `${month} ${dateNumber}`;
}

// Get day info based on offset from tomorrow
function getDayInfo(offset = 0) {
    const today = new Date();
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + 1 + offset);
    
    const dayIndex = targetDate.getDay();
    const dayName = days[dayIndex];
    const dateNumber = targetDate.getDate();
    const month = targetDate.toLocaleDateString('en-US', { month: 'long' });
    
    return {
        dayName: dayNames[dayIndex],
        dayKey: dayName,
        dateNumber: dateNumber,
        month: month,
        fullDate: targetDate
    };
}

// Show previous day with animation
function showPreviousDay() {
    if (currentDisplayIndex > 0) {
        animateTransition(() => {
            currentDisplayIndex--;
            updateDisplayedPlan();
            updateNavigationButtons();
        });
    }
}

// Show next day with animation
function showNextDay() {
    animateTransition(() => {
        currentDisplayIndex++;
        updateDisplayedPlan();
        updateNavigationButtons();
    });
}

// Animate transition between days
function animateTransition(callback) {
    planContainer.classList.add('fade-out');
    
    setTimeout(() => {
        callback();
        
        planContainer.classList.remove('fade-out');
        planContainer.classList.add('fade-in');
        
        setTimeout(() => {
            planContainer.classList.remove('fade-in');
        }, 300);
    }, 300);
}

// Update navigation buttons state
function updateNavigationButtons() {
    // Disable previous button when at minimum (tomorrow)
    prevDayBtn.disabled = currentDisplayIndex === 0;
    
    // Next button is always enabled (no upper limit)
    nextDayBtn.disabled = false;
}

// Update displayed workout plan
function updateDisplayedPlan() {
    const dayInfo = getDayInfo(currentDisplayIndex);
    const workout = workoutData[dayInfo.dayKey];
    
    // Update display day and date in navigation section
    displayDayElement.textContent = dayInfo.dayName;
    displayDateElement.textContent = `${dayInfo.month} ${dayInfo.dateNumber}`;
    
    // Update goal title based on how far in the future we're looking
    if (currentDisplayIndex === 0) {
        goalTitle.textContent = "Tomorrow's Goal:";
    } else if (currentDisplayIndex === 1) {
        goalTitle.textContent = "Day After Tomorrow's Goal:";
    } else {
        goalTitle.textContent = `${dayInfo.dayName}'s Goal:`;
    }
    
    // Update workout content
    updateWorkoutContent(workout, dayInfo.dayKey);
}

// Update workout content based on day type
function updateWorkoutContent(workout, dayKey) {
    if (workout.isRestDay) {
        displayRestDay(workout);
    } else {
        displayWorkoutDay(workout, dayKey);
    }
}

// Display workout day content
function displayWorkoutDay(workout, dayKey) {
    let html = `
        <div class="workout-focus">${workout.focus}</div>
        <div class="workout-exercises">
    `;
    
    workout.exercises.forEach(exercise => {
        html += `
            <div class="exercise-item">
                <div class="exercise-info">
                    <div class="exercise-name">${exercise.name}</div>
                    <div class="exercise-details">${exercise.reps}</div>
                </div>
                <div class="exercise-sets">${exercise.sets} sets</div>
            </div>
        `;
    });
    
    html += `</div>`;
    workoutContent.innerHTML = html;
}

// Display rest day content
function displayRestDay(workout) {
    let html = `
        <div class="rest-day-content">
            <div class="rest-icon">🌿</div>
            <div class="rest-title">Rest & Recovery Day</div>
            <div class="rest-description">
                Focus on recovery and wellness activities to prepare for your next workout.
            </div>
            <div class="rest-activities">
    `;
    
    workout.activities.forEach(activity => {
        html += `
            <div class="rest-activity">
                ${activity}
            </div>
        `;
    });
    
    html += `
            </div>
        </div>
    `;
    workoutContent.innerHTML = html;
}

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', initNextDayPage);