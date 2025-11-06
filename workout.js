// Workout data (same as plans.js but simplified for workout tracking)
const workoutData = {
    monday: {
        title: "Monday's Workout (Arms & Shoulders)",
        workouts: [
            { name: "Push-ups", sets: 3, reps: "10–12 reps", type: "reps" },
            { name: "Diamond Push-ups", sets: 2, reps: "10 reps", type: "reps" },
            { name: "Arm Circles", sets: 2, reps: "30 seconds", type: "time", duration: 30 },
            { name: "Incline Push-ups", sets: 3, reps: "12 reps", type: "reps" }
        ]
    },
    tuesday: {
        title: "Tuesday's Workout (Legs & Lower Body)",
        workouts: [
            { name: "Squats", sets: 3, reps: "15 reps", type: "reps" },
            { name: "Lunges", sets: 3, reps: "12 reps each leg", type: "reps" },
            { name: "Standing Calf Raises", sets: 3, reps: "20 reps", type: "reps" },
            { name: "Calf Stretch", sets: 2, reps: "30 seconds", type: "time", duration: 30 },
            { name: "Jump Squats", sets: 3, reps: "10–12 reps", type: "reps" }
        ]
    },
    wednesday: {
        title: "Wednesday's Plan (Rest & Recovery)",
        isRestDay: true,
        workouts: [
            { name: "Drink ≥ 2.5 L water", type: "info" },
            { name: "10 min light stretching", type: "info" },
            { name: "Eat protein-rich meal", type: "info" }
        ]
    },
    thursday: {
        title: "Thursday's Workout (Abs & Core)",
        workouts: [
            { name: "Push-ups", sets: 3, reps: "10 reps", type: "reps" },
            { name: "Crunches", sets: 3, reps: "15 reps", type: "reps" },
            { name: "Leg Raises", sets: 3, reps: "12 reps", type: "reps" },
            { name: "Plank", sets: 3, reps: "30–45 seconds", type: "time", duration: 35 }
        ]
    },
    friday: {
        title: "Friday's Workout (Back & Posture)",
        workouts: [
            { name: "Plank with Arm Raise", sets: 3, reps: "30 seconds", type: "time", duration: 30 },
            { name: "Wall Push-ups", sets: 3, reps: "12 reps", type: "reps" },
            { name: "Cobra Stretch", sets: 2, reps: "20 seconds", type: "time", duration: 20 }
        ]
    },
    saturday: {
        title: "Saturday's Workout (Full Body)",
        workouts: [
            { name: "Push-ups", sets: 3, reps: "10–12 reps", type: "reps" },
            { name: "Squats", sets: 3, reps: "15 reps", type: "reps" },
            { name: "Plank", sets: 3, reps: "30–45 seconds", type: "time", duration: 35 }
        ]
    },
    sunday: {
        title: "Sunday's Plan (Rest & Wellness)",
        isRestDay: true,
        workouts: [
            { name: "Sleep ≥ 8 hours", type: "info" },
            { name: "Drink 3 L water", type: "info" },
            { name: "Light walk (15–20 min)", type: "info" }
        ]
    }
};

// DOM Elements
const workoutDayTitle = document.getElementById('workout-day-title');
const currentDateTime = document.getElementById('current-datetime');
const workoutActionBtn = document.getElementById('workout-action-btn');
const currentWorkoutName = document.getElementById('current-workout-name');
const workoutCounter = document.getElementById('workout-counter');
const progressFill = document.getElementById('progress-fill');
const timerDisplay = document.getElementById('timer-display');
const timerValue = document.getElementById('timer-value');
const restDayMessage = document.getElementById('rest-day-message');
const restDayDescription = document.getElementById('rest-day-description');
const finishRestBtn = document.getElementById('finish-rest-btn');
const completionModal = document.getElementById('completion-modal');
const completedWorkouts = document.getElementById('completed-workouts');
const totalExercises = document.getElementById('total-exercises');
const workoutDuration = document.getElementById('workout-duration');
const dailyAchievementsGrid = document.getElementById('daily-achievements-grid');

// ADD THIS NEW DOM ELEMENT
const workoutPlanExercises = document.getElementById('workout-plan-exercises');

// Workout State
let currentWorkout = null;
let currentDay = null;
let currentExerciseIndex = 0;
let currentSet = 0;
let totalSetsCompleted = 0;
let totalExercisesCompleted = 0;
let workoutStartTime = null;
let timerInterval = null;
let remainingTime = 0;
let isWorkoutStarted = false;

// ADD ACHIEVEMENT SYSTEM FUNCTIONS HERE (ADDED WITHOUT REMOVING ANYTHING)

// Complete function to update ALL achievements when workout is completed
function updateAllAchievementsOnWorkoutComplete() {
    const workoutHistory = JSON.parse(localStorage.getItem('workoutHistory') || '[]');
    const userAchievements = JSON.parse(localStorage.getItem('userAchievements') || '{}');
    const userStats = JSON.parse(localStorage.getItem('userStats') || '{"streak": 0, "totalWorkouts": 0}');
    const monthlyScores = JSON.parse(localStorage.getItem('monthlyScores') || '{}');
    
    const today = new Date().toISOString().split('T')[0];
    const todayWorkout = workoutHistory.find(workout => workout.date === today);
    
    if (!todayWorkout || !todayWorkout.completed) return;
    
    // All achievements data
    const allAchievements = {
        daily: [
            {
                id: 'daily_complete',
                name: 'Daily Warrior',
                description: 'Complete today\'s workout',
                icon: '⚔️',
                points: 10,
                type: 'daily'
            },
            {
                id: 'daily_early',
                name: 'Early Bird',
                description: 'Complete workout before 8 AM',
                icon: '🌅',
                points: 15,
                type: 'daily'
            },
            {
                id: 'daily_perfect',
                name: 'Perfect Form',
                description: 'Complete all sets with perfect form',
                icon: '💯',
                points: 20,
                type: 'daily'
            }
        ],
        weekly: [
            {
                id: 'weekly_3',
                name: 'Week Starter',
                description: 'Complete 3 workouts in a week',
                icon: '🏁',
                points: 50,
                type: 'weekly',
                required: 3
            },
            {
                id: 'weekly_5',
                name: 'Consistency King',
                description: 'Complete 5 workouts in a week',
                icon: '👑',
                points: 100,
                type: 'weekly',
                required: 5
            },
            {
                id: 'weekly_perfect',
                name: 'Perfect Week',
                description: 'Complete all 7 days in a week',
                icon: '⭐',
                points: 150,
                type: 'weekly',
                required: 7
            },
            {
                id: 'weekly_rest',
                name: 'Rest Day Champion',
                description: 'Complete all rest days in a week',
                icon: '🌿',
                points: 75,
                type: 'weekly',
                required: 2
            }
        ],
        monthly: [
            {
                id: 'monthly_15',
                name: 'Monthly Dedication',
                description: 'Complete 15 workouts in a month',
                icon: '📅',
                points: 200,
                type: 'monthly',
                required: 15
            },
            {
                id: 'monthly_20',
                name: 'Fitness Fanatic',
                description: 'Complete 20 workouts in a month',
                icon: '🔥',
                points: 300,
                type: 'monthly',
                required: 20
            },
            {
                id: 'monthly_streak',
                name: 'Month Streak',
                description: 'Maintain a 7-day streak in a month',
                icon: '⚡',
                points: 250,
                type: 'monthly',
                required: 7
            }
        ],
        additional: [
            {
                id: 'total_50',
                name: 'Fitness Journey',
                description: 'Complete 50 total workouts',
                icon: '🚀',
                points: 500,
                type: 'additional',
                required: 50
            },
            {
                id: 'total_100',
                name: 'Fitness Master',
                description: 'Complete 100 total workouts',
                icon: '🏆',
                points: 1000,
                type: 'additional',
                required: 100
            },
            {
                id: 'streak_30',
                name: 'Unstoppable',
                description: '30-day workout streak',
                icon: '💪',
                points: 750,
                type: 'additional',
                required: 30
            },
            {
                id: 'variety',
                name: 'All-Rounder',
                description: 'Complete all different workout types',
                icon: '🎯',
                points: 400,
                type: 'additional',
                required: 6
            }
        ]
    };

    let unlockedAchievements = [];

    // Check DAILY achievements
    allAchievements.daily.forEach(achievement => {
        if (userAchievements[achievement.id]) return; // Skip if already unlocked
        
        let isUnlocked = false;
        
        switch (achievement.id) {
            case 'daily_complete':
                isUnlocked = true;
                break;
            case 'daily_early':
                const workoutTime = new Date(todayWorkout.timestamp);
                isUnlocked = workoutTime.getHours() < 8;
                break;
            case 'daily_perfect':
                isUnlocked = todayWorkout.setsCompleted === todayWorkout.totalSets;
                break;
        }
        
        if (isUnlocked) {
            userAchievements[achievement.id] = {
                unlocked: true,
                timestamp: new Date().toISOString(),
                points: achievement.points
            };
            unlockedAchievements.push(achievement.name);
        }
    });

    // Check WEEKLY achievements
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);
    
    const weeklyWorkouts = workoutHistory.filter(workout => {
        const workoutDate = new Date(workout.timestamp);
        return workoutDate >= weekStart && workoutDate <= weekEnd && workout.completed;
    });
    
    allAchievements.weekly.forEach(achievement => {
        if (userAchievements[achievement.id]) return;
        
        let isUnlocked = false;
        
        switch (achievement.id) {
            case 'weekly_3':
                isUnlocked = weeklyWorkouts.length >= 3;
                break;
            case 'weekly_5':
                isUnlocked = weeklyWorkouts.length >= 5;
                break;
            case 'weekly_perfect':
                isUnlocked = weeklyWorkouts.length >= 7;
                break;
            case 'weekly_rest':
                const restDaysCompleted = weeklyWorkouts.filter(workout => {
                    const workoutDate = new Date(workout.timestamp);
                    const day = workoutDate.getDay();
                    return day === 0 || day === 3; // Sunday or Wednesday
                }).length;
                isUnlocked = restDaysCompleted >= 2;
                break;
        }
        
        if (isUnlocked) {
            userAchievements[achievement.id] = {
                unlocked: true,
                timestamp: new Date().toISOString(),
                points: achievement.points
            };
            unlockedAchievements.push(achievement.name);
        }
    });

    // Check MONTHLY achievements
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    monthEnd.setHours(23, 59, 59, 999);
    
    const monthlyWorkouts = workoutHistory.filter(workout => {
        const workoutDate = new Date(workout.timestamp);
        return workoutDate >= monthStart && workoutDate <= monthEnd && workout.completed;
    });
    
    allAchievements.monthly.forEach(achievement => {
        if (userAchievements[achievement.id]) return;
        
        let isUnlocked = false;
        
        switch (achievement.id) {
            case 'monthly_15':
                isUnlocked = monthlyWorkouts.length >= 15;
                break;
            case 'monthly_20':
                isUnlocked = monthlyWorkouts.length >= 20;
                break;
            case 'monthly_streak':
                isUnlocked = calculateCurrentStreakForAchievements(workoutHistory) >= 7;
                break;
        }
        
        if (isUnlocked) {
            userAchievements[achievement.id] = {
                unlocked: true,
                timestamp: new Date().toISOString(),
                points: achievement.points
            };
            unlockedAchievements.push(achievement.name);
        }
    });

    // Check ADDITIONAL achievements
    const completedWorkouts = workoutHistory.filter(workout => workout.completed);
    
    allAchievements.additional.forEach(achievement => {
        if (userAchievements[achievement.id]) return;
        
        let isUnlocked = false;
        
        switch (achievement.id) {
            case 'total_50':
                isUnlocked = completedWorkouts.length >= 50;
                break;
            case 'total_100':
                isUnlocked = completedWorkouts.length >= 100;
                break;
            case 'streak_30':
                isUnlocked = calculateCurrentStreakForAchievements(workoutHistory) >= 30;
                break;
            case 'variety':
                const workoutTypes = new Set(completedWorkouts.map(workout => workout.day));
                isUnlocked = workoutTypes.size >= 6;
                break;
        }
        
        if (isUnlocked) {
            userAchievements[achievement.id] = {
                unlocked: true,
                timestamp: new Date().toISOString(),
                points: achievement.points
            };
            unlockedAchievements.push(achievement.name);
        }
    });

    // Update user stats
    userStats.totalWorkouts = completedWorkouts.length;
    userStats.streak = calculateCurrentStreakForAchievements(workoutHistory);
    
    // Update monthly score
    const year = now.getFullYear();
    const month = now.getMonth();
    const monthKey = `${year}-${month}`;
    
    if (!monthlyScores[monthKey]) {
        monthlyScores[monthKey] = { points: 0 };
    }
    
    // Add points from newly unlocked achievements
    const newPoints = unlockedAchievements.reduce((total, achievementName) => {
        const achievement = Object.values(allAchievements).flat().find(a => a.name === achievementName);
        return total + (achievement?.points || 0);
    }, 0);
    
    monthlyScores[monthKey].points += newPoints;

    // Save all updated data
    localStorage.setItem('userAchievements', JSON.stringify(userAchievements));
    localStorage.setItem('userStats', JSON.stringify(userStats));
    localStorage.setItem('monthlyScores', JSON.stringify(monthlyScores));
    
    // Show unlocked achievements notification
    if (unlockedAchievements.length > 0) {
        showAchievementNotification(unlockedAchievements);
    }
    
    console.log('All achievements checked. Unlocked:', unlockedAchievements);
}

// Helper function to calculate current streak for achievements
function calculateCurrentStreakForAchievements(workoutHistory) {
    let streak = 0;
    const completedWorkouts = workoutHistory.filter(workout => workout.completed);
    const sortedWorkouts = completedWorkouts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    let currentDate = new Date();
    
    for (let i = 0; i < sortedWorkouts.length; i++) {
        const workoutDate = new Date(sortedWorkouts[i].timestamp);
        const daysDiff = Math.floor((currentDate - workoutDate) / (1000 * 60 * 60 * 24));
        
        if (daysDiff <= 1) {
            streak++;
            currentDate = new Date(workoutDate);
            currentDate.setDate(currentDate.getDate() - 1);
        } else {
            break;
        }
    }
    
    return streak;
}

// Function to show achievement notifications
function showAchievementNotification(achievements) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #10b981, #3b82f6);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        z-index: 10000;
        max-width: 300px;
        animation: slideIn 0.3s ease;
    `;
    
    let html = '<div style="font-weight: bold; margin-bottom: 0.5rem;">🎉 Achievements Unlocked!</div>';
    achievements.forEach(achievement => {
        html += `<div style="font-size: 0.9rem; margin: 0.25rem 0;">✓ ${achievement}</div>`;
    });
    
    notification.innerHTML = html;
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// END OF ACHIEVEMENT SYSTEM FUNCTIONS

// ADD THESE NEW FUNCTIONS FOR WORKOUT PLAN DISPLAY

// Display workout plan
function displayWorkoutPlan() {
    if (currentWorkout.isRestDay) {
        displayRestDayPlan();
    } else {
        displayRegularWorkoutPlan();
    }
}

// Display regular workout plan
function displayRegularWorkoutPlan() {
    let html = '';
    
    currentWorkout.workouts.forEach((exercise, index) => {
        html += `
            <div class="plan-exercise-item">
                <div class="plan-exercise-info">
                    <div class="plan-exercise-name">${exercise.name}</div>
                    <div class="plan-exercise-details">${exercise.reps} • ${exercise.type === 'time' ? 'Timed' : 'Reps'}</div>
                </div>
                <div class="plan-exercise-sets">${exercise.sets} sets</div>
            </div>
        `;
    });
    
    workoutPlanExercises.innerHTML = html;
}

// Display rest day plan
function displayRestDayPlan() {
    let html = `
        <div class="rest-day-plan">
            <div class="rest-icon">🌿</div>
            <h4>Rest & Recovery Day</h4>
            <p>Today is focused on recovery and wellness activities:</p>
            <div class="rest-day-activities">
    `;
    
    currentWorkout.workouts.forEach(activity => {
        html += `
            <div class="rest-activity">
                ${activity.name}
            </div>
        `;
    });
    
    html += `
            </div>
        </div>
    `;
    
    workoutPlanExercises.innerHTML = html;
}

// Initialize the workout page
function initWorkoutPage() {
    updateDateTime();
    setupCurrentWorkout();
    setupEventListeners();
    
    // Update time every second
    setInterval(updateDateTime, 1000);
}

// Update date and time display
function updateDateTime() {
    const now = new Date();
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
    
    const dateString = now.toLocaleDateString('en-US', dateOptions);
    const timeString = now.toLocaleTimeString('en-US', timeOptions);
    
    currentDateTime.textContent = `${dateString} • ${timeString}`;
}

// Check if workout is already completed today
function isWorkoutCompletedToday() {
    const workoutHistory = JSON.parse(localStorage.getItem('workoutHistory') || '[]');
    const today = new Date().toISOString().split('T')[0];
    
    return workoutHistory.some(workout => workout.date === today);
}

// Setup current workout based on day
function setupCurrentWorkout() {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = new Date().getDay();
    currentDay = days[today];
    
    currentWorkout = workoutData[currentDay];
    
    if (!currentWorkout) {
        currentWorkout = workoutData.monday; // Fallback
        currentDay = 'monday';
    }
    
    // Update UI based on workout type
    workoutDayTitle.textContent = currentWorkout.title;
    
    // Display workout plan
    displayWorkoutPlan();
    
    if (currentWorkout.isRestDay) {
        // Automatically record rest day as completed if not already recorded today
        if (!isWorkoutCompletedToday()) {
            autoCompleteRestDay();
        }
        showRestDayInterface();
    } else {
        showWorkoutInterface();
        resetWorkoutProgress();
    }
}

// Automatically complete rest day
function autoCompleteRestDay() {
    console.log('Auto-completing rest day...');
    
    // Set completion data for rest days
    workoutStartTime = new Date();
    totalExercisesCompleted = currentWorkout.workouts.length;
    totalSetsCompleted = 1; // Rest day counts as 1 completed session
    
    saveWorkoutCompletion();
    
    // Show completion modal immediately for rest days
    setTimeout(() => {
        showCompletionModal();
    }, 500);
}

// Show rest day interface
function showRestDayInterface() {
    document.querySelector('.control-card').style.display = 'none';
    restDayMessage.style.display = 'block';
    
    let description = "Today is your recovery day. Focus on:";
    currentWorkout.workouts.forEach(workout => {
        description += `\n• ${workout.name}`;
    });
    restDayDescription.textContent = description;
    
    // Update the finish button text to reflect it's already completed
    if (isWorkoutCompletedToday()) {
        finishRestBtn.innerHTML = '<i class="fas fa-check"></i> Already Completed Today';
        finishRestBtn.disabled = true;
        finishRestBtn.style.opacity = '0.7';
    } else {
        finishRestBtn.innerHTML = '<i class="fas fa-check"></i> Mark as Completed';
        finishRestBtn.disabled = false;
        finishRestBtn.style.opacity = '1';
    }
}

// Show workout interface
function showWorkoutInterface() {
    document.querySelector('.control-card').style.display = 'flex';
    restDayMessage.style.display = 'none';
    timerDisplay.style.display = 'none';
}

// Reset workout progress
function resetWorkoutProgress() {
    currentExerciseIndex = 0;
    currentSet = 0;
    totalSetsCompleted = 0;
    totalExercisesCompleted = 0;
    workoutStartTime = null;
    isWorkoutStarted = false;
    
    updateWorkoutDisplay();
    updateActionButton('start');
}

// Update workout display
function updateWorkoutDisplay() {
    if (currentWorkout.isRestDay) return;
    
    const totalExercises = currentWorkout.workouts.length;
    const totalSets = currentWorkout.workouts.reduce((sum, exercise) => sum + exercise.sets, 0);
    const progress = (totalSetsCompleted / totalSets) * 100;
    
    progressFill.style.width = `${progress}%`;
    workoutCounter.textContent = `${currentExerciseIndex + 1}/${totalExercises}`;
    
    if (currentExerciseIndex < totalExercises) {
        const exercise = currentWorkout.workouts[currentExerciseIndex];
        currentWorkoutName.textContent = `${exercise.name} (${exercise.reps})`;
    }
}

// Update action button state
function updateActionButton(state, exercise = null) {
    const btn = workoutActionBtn;
    btn.className = 'action-btn '; // Reset classes
    
    switch (state) {
        case 'start':
            btn.innerHTML = '<i class="fas fa-play"></i> Start Workout';
            btn.classList.add('start-btn');
            break;
            
        case 'next_set':
            const currentExercise = exercise || currentWorkout.workouts[currentExerciseIndex];
            btn.innerHTML = `<i class="fas fa-forward"></i> Start Set ${currentSet + 1}`;
            btn.classList.add('start-btn');
            break;
            
        case 'set_completed':
            btn.innerHTML = `<i class="fas fa-check"></i> ${currentSet} Set${currentSet > 1 ? 's' : ''} Completed`;
            btn.classList.add('set-completed-btn');
            break;
            
        case 'start_timer':
            btn.innerHTML = '<i class="fas fa-play"></i> Start Timer';
            btn.classList.add('timer-btn');
            break;
            
        case 'timer_running':
            btn.innerHTML = `<i class="fas fa-pause"></i> Timer Running (Set ${currentSet + 1})`;
            btn.classList.add('timer-btn');
            break;
            
        case 'finish_workout':
            btn.innerHTML = '<i class="fas fa-flag-checkered"></i> Finish Workout';
            btn.classList.add('finish-btn');
            break;
    }
}

// Setup event listeners
function setupEventListeners() {
    workoutActionBtn.addEventListener('click', handleWorkoutAction);
    finishRestBtn.addEventListener('click', finishRestDay);
    
    // Close modal when clicking outside
    completionModal.addEventListener('click', (e) => {
        if (e.target === completionModal) {
            completionModal.style.display = 'none';
        }
    });
}

// Handle workout action button clicks
function handleWorkoutAction() {
    if (currentWorkout.isRestDay) return;
    
    if (workoutActionBtn.classList.contains('start-btn')) {
        if (!isWorkoutStarted) {
            startWorkout();
        } else {
            // Clicking "Start Set X" should immediately complete that set
            completeCurrentSet();
        }
    } else if (workoutActionBtn.classList.contains('set-completed-btn')) {
        // Clicking "X Sets Completed" should prepare for next set
        prepareNextSet();
    } else if (workoutActionBtn.classList.contains('timer-btn')) {
        if (workoutActionBtn.textContent.includes('Start Timer')) {
            startTimer();
        }
    } else if (workoutActionBtn.classList.contains('finish-btn')) {
        finishWorkout();
    }
}

// Start workout
function startWorkout() {
    workoutStartTime = new Date();
    currentExerciseIndex = 0;
    currentSet = 0;
    isWorkoutStarted = true;
    
    const firstExercise = currentWorkout.workouts[0];
    if (firstExercise.type === 'time') {
        updateActionButton('start_timer', firstExercise);
        timerDisplay.style.display = 'block';
    } else {
        updateActionButton('next_set', firstExercise);
    }
    
    updateWorkoutDisplay();
}

// Complete the current set
function completeCurrentSet() {
    const currentExercise = currentWorkout.workouts[currentExerciseIndex];
    
    // Complete the current set
    currentSet++;
    totalSetsCompleted++;
    
    // Update button to show completed state
    updateActionButton('set_completed');
    
    updateWorkoutDisplay();
}

// Prepare for next set after completing current one
function prepareNextSet() {
    const currentExercise = currentWorkout.workouts[currentExerciseIndex];
    
    if (currentSet < currentExercise.sets) {
        // More sets to do in current exercise
        if (currentExercise.type === 'time') {
            updateActionButton('start_timer', currentExercise);
            timerDisplay.style.display = 'block';
        } else {
            updateActionButton('next_set', currentExercise);
        }
    } else {
        // Move to next exercise
        currentExerciseIndex++;
        totalExercisesCompleted++;
        currentSet = 0;
        
        if (currentExerciseIndex >= currentWorkout.workouts.length) {
            // Workout complete
            updateActionButton('finish_workout');
        } else {
            const nextExercise = currentWorkout.workouts[currentExerciseIndex];
            if (nextExercise.type === 'time') {
                updateActionButton('start_timer', nextExercise);
                timerDisplay.style.display = 'block';
            } else {
                updateActionButton('next_set', nextExercise);
            }
        }
    }
    
    updateWorkoutDisplay();
}

// Start timer for timed exercises
function startTimer() {
    const currentExercise = currentWorkout.workouts[currentExerciseIndex];
    const duration = currentExercise.duration || 30; // Default to 30 seconds
    
    remainingTime = duration;
    updateActionButton('timer_running');
    
    // Update timer display immediately
    updateTimerDisplay();
    
    // Start countdown
    timerInterval = setInterval(() => {
        remainingTime--;
        updateTimerDisplay();
        
        if (remainingTime <= 0) {
            clearInterval(timerInterval);
            timerDisplay.style.display = 'none';
            // Automatically complete the set when timer finishes
            completeCurrentSet();
        }
    }, 1000);
}

// Update timer display
function updateTimerDisplay() {
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    timerValue.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Finish rest day
function finishRestDay() {
    // Only allow finishing if not already completed today
    if (!isWorkoutCompletedToday()) {
        saveWorkoutCompletion();
        showCompletionModal();
        
        // Update the button state
        finishRestBtn.innerHTML = '<i class="fas fa-check"></i> Already Completed Today';
        finishRestBtn.disabled = true;
        finishRestBtn.style.opacity = '0.7';
    }
}

// Finish workout
function finishWorkout() {
    saveWorkoutCompletion();
    showCompletionModal();
}

// Save workout completion to localStorage - MODIFIED TO INCLUDE ACHIEVEMENTS
function saveWorkoutCompletion() {
    const workoutHistory = JSON.parse(localStorage.getItem('workoutHistory') || '[]');
    const now = new Date();
    
    const completionData = {
        date: now.toISOString().split('T')[0],
        day: currentDay,
        timestamp: now.getTime(),
        exercisesCompleted: totalExercisesCompleted,
        setsCompleted: totalSetsCompleted,
        totalSets: currentWorkout.workouts.reduce((sum, exercise) => sum + exercise.sets, 0),
        duration: workoutStartTime ? Math.round((new Date() - workoutStartTime) / 60000) : 0, // in minutes
        isRestDay: currentWorkout.isRestDay || false,
        completed: true // ADD THIS LINE
    };
    
    workoutHistory.push(completionData);
    localStorage.setItem('workoutHistory', JSON.stringify(workoutHistory));
    
    // Update streak and total workouts
    updateUserStats();
    
    // ADD THIS LINE TO UPDATE ACHIEVEMENTS
    updateAllAchievementsOnWorkoutComplete();
}

// Update user statistics
function updateUserStats() {
    const userStats = JSON.parse(localStorage.getItem('userStats') || '{"streak": 0, "totalWorkouts": 0, "lastWorkoutDate": ""}');
    const today = new Date().toISOString().split('T')[0];
    
    // Check if this is consecutive day
    const lastWorkoutDate = userStats.lastWorkoutDate;
    if (lastWorkoutDate) {
        const lastDate = new Date(lastWorkoutDate);
        const todayDate = new Date(today);
        const diffTime = Math.abs(todayDate - lastDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
            userStats.streak += 1;
        } else if (diffDays > 1) {
            userStats.streak = 1;
        }
    } else {
        userStats.streak = 1;
    }
    
    userStats.totalWorkouts += 1;
    userStats.lastWorkoutDate = today;
    
    localStorage.setItem('userStats', JSON.stringify(userStats));
}

// Show completion modal
function showCompletionModal() {
    const workoutHistory = JSON.parse(localStorage.getItem('workoutHistory') || '[]');
    const userStats = JSON.parse(localStorage.getItem('userStats') || '{"totalWorkouts": 0}');
    
    completedWorkouts.textContent = userStats.totalWorkouts;
    totalExercises.textContent = totalExercisesCompleted;
    
    const duration = workoutStartTime ? Math.round((new Date() - workoutStartTime) / 60000) : 0;
    workoutDuration.textContent = `${duration} min`;
    
    // Update modal message for rest days
    const completionMessage = document.querySelector('.completion-message');
    if (currentWorkout.isRestDay) {
        completionMessage.textContent = "Rest day completed! Your recovery is just as important as your workouts.";
    } else {
        completionMessage.textContent = "Great job! You've completed today's workout.";
    }
    
    completionModal.style.display = 'block';
}

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', initWorkoutPage);