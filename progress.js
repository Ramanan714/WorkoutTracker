// DOM Elements
const currentDayElement = document.getElementById('current-day');
const weeklyBar = document.getElementById('weekly-bar');
const weeklyFill = document.querySelector('.weekly-fill');
const weeklyPercentage = document.getElementById('weekly-percentage');
const weeklyCompleted = document.getElementById('weekly-completed');
const weeklyTotal = document.getElementById('weekly-total');
const monthlyBar = document.getElementById('monthly-bar');
const monthlyFill = document.querySelector('.monthly-fill');
const monthlyPercentage = document.getElementById('monthly-percentage');
const monthlyCompleted = document.getElementById('monthly-completed');
const monthlyTotal = document.getElementById('monthly-total');
const yearSelect = document.getElementById('year-select');
const monthSelect = document.getElementById('month-select');
const calendarGrid = document.getElementById('calendar-grid');
const achievementsGrid = document.getElementById('achievements-grid');

// Workout data for rest days
const workoutData = {
    wednesday: { isRestDay: true },
    sunday: { isRestDay: true }
};

// Achievements data
const achievements = [
    {
        id: 1,
        name: "Week Starter",
        description: "Complete 3 workouts in a week",
        icon: "🏁",
        required: 3,
        type: "weekly"
    },
    {
        id: 2,
        name: "Perfect Week",
        description: "Complete all 7 days in a week",
        icon: "⭐",
        required: 7,
        type: "weekly"
    },
    {
        id: 3,
        name: "Consistency King",
        description: "Workout 5 days in a row",
        icon: "👑",
        required: 5,
        type: "streak"
    },
    {
        id: 4,
        name: "Rest Day Champion",
        description: "Complete all rest days in a week",
        icon: "🌿",
        required: 2,
        type: "rest"
    },
    {
        id: 5,
        name: "Early Riser",
        description: "Complete workouts before 8 AM",
        icon: "🌅",
        required: 3,
        type: "morning"
    }
];

// Initialize the progress page
function initProgressPage() {
    console.log('Initializing Progress Page...');
    updateCurrentDay();
    setupEventListeners();
    updateProgressBars();
    updateCalendar();
    updateAchievements();
}

// Update current day display
function updateCurrentDay() {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date().getDay();
    currentDayElement.textContent = days[today];
}

// Setup calendar with event listeners
function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    yearSelect.addEventListener('change', updateCalendar);
    monthSelect.addEventListener('change', updateCalendar);
    
    // Set current year and month
    const now = new Date();
    yearSelect.value = now.getFullYear();
    monthSelect.value = now.getMonth();
}

// Update progress bars - Only count completed days
function updateProgressBars() {
    console.log('Updating progress bars...');
    const workoutHistory = JSON.parse(localStorage.getItem('workoutHistory') || '[]');
    const now = new Date();
    
    console.log('Workout history:', workoutHistory);
    
    // Weekly progress - Only count completed days (workouts + passed rest days)
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);
    
    // Get completed workouts in current week
    const weeklyWorkouts = workoutHistory.filter(workout => {
        const workoutDate = new Date(workout.timestamp);
        return workoutDate >= weekStart && workoutDate <= weekEnd;
    });
    
    // Count only PASSED rest days in current week (not future rest days)
    let completedRestDays = 0;
    const currentDate = new Date(weekStart);
    
    for (let i = 0; i < 7; i++) {
        const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        const isRestDay = workoutData[dayName] && workoutData[dayName].isRestDay;
        
        // Only count rest days that have passed (including today)
        if (isRestDay && currentDate <= now) {
            // Check if there's no workout recorded for this day (rest days are auto-completed)
            const dateString = currentDate.toISOString().split('T')[0];
            const hasWorkout = workoutHistory.some(workout => workout.date === dateString);
            
            // Rest days are automatically considered completed when they pass
            completedRestDays++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    const totalWeeklyCompleted = weeklyWorkouts.length + completedRestDays;
    const weeklyProgress = Math.min((totalWeeklyCompleted / 7) * 100, 100);
    
    console.log('Weekly progress:', {
        workouts: weeklyWorkouts.length,
        restDays: completedRestDays,
        total: totalWeeklyCompleted,
        progress: weeklyProgress
    });
    
    if (weeklyFill) {
        weeklyFill.style.width = `${weeklyProgress}%`;
    }
    if (weeklyPercentage) {
        weeklyPercentage.textContent = `${Math.round(weeklyProgress)}%`;
    }
    if (weeklyCompleted) {
        weeklyCompleted.textContent = totalWeeklyCompleted;
    }
    
    // Monthly progress - Only count completed days
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    monthEnd.setHours(23, 59, 59, 999);
    
    // Get completed workouts in current month
    const monthlyWorkouts = workoutHistory.filter(workout => {
        const workoutDate = new Date(workout.timestamp);
        return workoutDate >= monthStart && workoutDate <= monthEnd;
    });
    
    // Count only PASSED rest days in current month
    let completedMonthRestDays = 0;
    const monthCurrentDate = new Date(monthStart);
    
    while (monthCurrentDate <= monthEnd && monthCurrentDate <= now) {
        const dayName = monthCurrentDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        const isRestDay = workoutData[dayName] && workoutData[dayName].isRestDay;
        
        if (isRestDay) {
            // Rest days are automatically considered completed when they pass
            completedMonthRestDays++;
        }
        monthCurrentDate.setDate(monthCurrentDate.getDate() + 1);
    }
    
    const totalMonthlyCompleted = monthlyWorkouts.length + completedMonthRestDays;
    const daysInMonth = monthEnd.getDate();
    const monthlyProgress = Math.min((totalMonthlyCompleted / daysInMonth) * 100, 100);
    
    console.log('Monthly progress:', {
        workouts: monthlyWorkouts.length,
        restDays: completedMonthRestDays,
        total: totalMonthlyCompleted,
        progress: monthlyProgress
    });
    
    if (monthlyFill) {
        monthlyFill.style.width = `${monthlyProgress}%`;
    }
    if (monthlyPercentage) {
        monthlyPercentage.textContent = `${Math.round(monthlyProgress)}%`;
    }
    if (monthlyCompleted) {
        monthlyCompleted.textContent = totalMonthlyCompleted;
    }
    if (monthlyTotal) {
        monthlyTotal.textContent = daysInMonth;
    }
}

// Get rest days in a week - Only passed days
function getRestDaysInWeek(weekStart) {
    let restDays = 0;
    const currentDate = new Date(weekStart);
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
        const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        if (workoutData[dayName] && workoutData[dayName].isRestDay) {
            // Only count rest days that have passed (including today)
            if (currentDate <= today) {
                restDays++;
            }
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return restDays;
}

// Get rest days in a month - Only passed days
function getRestDaysInMonth(year, month) {
    let restDays = 0;
    const today = new Date();
    const monthStart = new Date(year, month, 1);
    const monthEnd = new Date(year, month + 1, 0);
    
    for (let day = 1; day <= monthEnd.getDate(); day++) {
        const date = new Date(year, month, day);
        // Only count rest days that have passed (including today)
        if (date <= today) {
            const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
            if (workoutData[dayName] && workoutData[dayName].isRestDay) {
                restDays++;
            }
        }
    }
    
    return restDays;
}

// Update calendar
function updateCalendar() {
    console.log('Updating calendar...');
    
    if (!calendarGrid) {
        console.error('Calendar grid element not found!');
        return;
    }
    
    const year = parseInt(yearSelect.value);
    const month = parseInt(monthSelect.value);
    const workoutHistory = JSON.parse(localStorage.getItem('workoutHistory') || '[]');
    const today = new Date();
    
    console.log('Calendar data:', { year, month, workoutHistory });
    
    // Clear calendar
    calendarGrid.innerHTML = '';
    
    // Add day headers
    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayHeaders.forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day-header';
        dayElement.textContent = day;
        calendarGrid.appendChild(dayElement);
    });
    
    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    console.log('Calendar details:', {
        firstDay,
        lastDay,
        daysInMonth,
        startingDay
    });
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day empty';
        calendarGrid.appendChild(emptyDay);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = day;
        
        // Check if this is today
        if (date.toDateString() === today.toDateString()) {
            dayElement.classList.add('today');
        }
        
        // Check if workout is completed
        const dateString = date.toISOString().split('T')[0];
        const workoutCompleted = workoutHistory.some(workout => workout.date === dateString);
        
        // Check if it's a rest day
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        const isRestDay = workoutData[dayName] && workoutData[dayName].isRestDay;
        
        if (date > today) {
            // Future date
            dayElement.classList.add('future');
        } else if (workoutCompleted || isRestDay) {
            // Workout completed or rest day
            dayElement.classList.add('completed');
            if (isRestDay) {
                dayElement.classList.add('rest-day');
                dayElement.title = 'Rest Day - Auto Completed';
            }
        } else {
            // Workout not done
            dayElement.classList.add('not-completed');
        }
        
        calendarGrid.appendChild(dayElement);
    }
    
    console.log('Calendar updated with', daysInMonth, 'days');
}

// Update achievements
function updateAchievements() {
    console.log('Updating achievements...');
    
    if (!achievementsGrid) {
        console.error('Achievements grid element not found!');
        return;
    }
    
    const workoutHistory = JSON.parse(localStorage.getItem('workoutHistory') || '[]');
    const now = new Date();
    
    console.log('Achievements data:', workoutHistory);
    
    // Weekly achievements
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);
    
    const weeklyWorkouts = workoutHistory.filter(workout => {
        const workoutDate = new Date(workout.timestamp);
        return workoutDate >= weekStart && workoutDate <= weekEnd;
    });
    
    // Count rest days in current week
    const weekRestDays = getRestDaysInWeek(weekStart);
    const totalWeeklyCompleted = weeklyWorkouts.length + weekRestDays;
    
    // Calculate streak
    let currentStreak = 0;
    const sortedWorkouts = workoutHistory.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    let currentDate = new Date();
    
    for (let i = 0; i < 7; i++) {
        const dateString = currentDate.toISOString().split('T')[0];
        const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        const isRestDay = workoutData[dayName] && workoutData[dayName].isRestDay;
        
        const hasWorkout = workoutHistory.some(workout => workout.date === dateString);
        
        if (hasWorkout || isRestDay) {
            currentStreak++;
            currentDate.setDate(currentDate.getDate() - 1);
        } else {
            break;
        }
    }
    
    console.log('Achievement stats:', {
        weeklyCompleted: totalWeeklyCompleted,
        currentStreak: currentStreak,
        weekRestDays: weekRestDays
    });
    
    // Clear achievements grid
    achievementsGrid.innerHTML = '';
    
    // Update each achievement
    achievements.forEach(achievement => {
        const achievementCard = document.createElement('div');
        achievementCard.className = 'achievement-card';
        
        let progress = 0;
        let required = achievement.required;
        
        switch (achievement.type) {
            case 'weekly':
                progress = totalWeeklyCompleted;
                break;
            case 'streak':
                progress = currentStreak;
                break;
            case 'rest':
                progress = weekRestDays;
                break;
            case 'morning':
                // Count morning workouts (before 8 AM)
                progress = weeklyWorkouts.filter(workout => {
                    const workoutTime = new Date(workout.timestamp);
                    return workoutTime.getHours() < 8;
                }).length;
                break;
        }
        
        const isUnlocked = progress >= required;
        
        if (isUnlocked) {
            achievementCard.classList.add('unlocked');
        } else {
            achievementCard.classList.add('locked');
        }
        
        achievementCard.innerHTML = `
            <div class="achievement-icon ${isUnlocked ? 'unlocked' : 'locked'}">
                ${achievement.icon}
            </div>
            <div class="achievement-info">
                <div class="achievement-name">${achievement.name}</div>
                <div class="achievement-desc">${achievement.description}</div>
                <div class="achievement-progress">${progress}/${required}</div>
            </div>
        `;
        
        achievementsGrid.appendChild(achievementCard);
    });
    
    console.log('Achievements updated with', achievements.length, 'achievements');
}

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing progress page...');
    initProgressPage();
});

// Also update when page becomes visible (in case of back navigation)
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        console.log('Page visible, updating progress...');
        updateProgressBars();
        updateCalendar();
        updateAchievements();
    }
});