// DOM Elements
const dailyAchievementsGrid = document.getElementById('daily-achievements-grid');
const weeklyAchievementsGrid = document.getElementById('weekly-achievements-grid');
const monthlyAchievementsGrid = document.getElementById('monthly-achievements-grid');
const additionalAchievementsGrid = document.getElementById('additional-achievements-grid');
const currentScoreElement = document.getElementById('current-score');
const scoreFillElement = document.getElementById('score-fill');
const yearTotalElement = document.getElementById('year-total');
const monthsGrid = document.getElementById('months-grid');

// Achievement data
const achievementsData = {
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

// Time tracking functions
function getCurrentDayKey() {
    return new Date().toISOString().split('T')[0];
}

function getCurrentWeekKey() {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    return weekStart.toISOString().split('T')[0];
}

function getCurrentMonthKey() {
    const now = new Date();
    return `${now.getFullYear()}-${now.getMonth()}`;
}

// Reset functions
function checkAndResetAchievements() {
    const lastReset = JSON.parse(localStorage.getItem('lastReset') || '{}');
    const currentDay = getCurrentDayKey();
    const currentWeek = getCurrentWeekKey();
    const currentMonth = getCurrentMonthKey();
    
    let needsRefresh = false;
    
    // Check day change
    if (lastReset.day !== currentDay) {
        resetDailyAchievements();
        lastReset.day = currentDay;
        needsRefresh = true;
    }
    
    // Check week change
    if (lastReset.week !== currentWeek) {
        resetWeeklyAchievements();
        lastReset.week = currentWeek;
        needsRefresh = true;
    }
    
    // Check month change
    if (lastReset.month !== currentMonth) {
        resetMonthlyAchievements();
        lastReset.month = currentMonth;
        needsRefresh = true;
    }
    
    if (needsRefresh) {
        localStorage.setItem('lastReset', JSON.stringify(lastReset));
    }
    
    return needsRefresh;
}

function resetDailyAchievements() {
    const userAchievements = JSON.parse(localStorage.getItem('userAchievements') || '{}');
    
    Object.keys(userAchievements).forEach(achievementId => {
        if (achievementId.startsWith('daily_')) {
            delete userAchievements[achievementId];
        }
    });
    
    localStorage.setItem('userAchievements', JSON.stringify(userAchievements));
    console.log('Daily achievements reset for new day');
}

function resetWeeklyAchievements() {
    const userAchievements = JSON.parse(localStorage.getItem('userAchievements') || '{}');
    
    Object.keys(userAchievements).forEach(achievementId => {
        if (achievementId.startsWith('weekly_')) {
            delete userAchievements[achievementId];
        }
    });
    
    localStorage.setItem('userAchievements', JSON.stringify(userAchievements));
    console.log('Weekly achievements reset for new week');
}

function resetMonthlyAchievements() {
    const userAchievements = JSON.parse(localStorage.getItem('userAchievements') || '{}');
    
    Object.keys(userAchievements).forEach(achievementId => {
        if (achievementId.startsWith('monthly_')) {
            delete userAchievements[achievementId];
        }
    });
    
    localStorage.setItem('userAchievements', JSON.stringify(userAchievements));
    console.log('Monthly achievements reset for new month');
}

// Initialize the page
function initAchievementsPage() {
    checkAndResetAchievements(); // Check for time period changes first
    checkRestDay();
    updateAllAchievements();
    updateScoreBar();
    updateMonthlyTracker();
}

// Auto-refresh every minute to catch time changes
function startAutoRefresh() {
    setInterval(() => {
        if (checkAndResetAchievements()) {
            // Time period changed, refresh the display
            updateAllAchievements();
            updateScoreBar();
            updateMonthlyTracker();
        }
    }, 60000); // Check every minute
}

// Check if today is a rest day and hide daily achievements
function checkRestDay() {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = new Date().getDay();
    const todayName = days[today];
    
    // Wednesday and Sunday are rest days
    const isRestDay = todayName === 'wednesday' || todayName === 'sunday';
    
    const dailySection = document.getElementById('daily-achievements');
    if (isRestDay) {
        dailySection.style.display = 'none';
    } else {
        dailySection.style.display = 'block';
    }
}

// Update all achievements
function updateAllAchievements() {
    updateAchievementsSection('daily', dailyAchievementsGrid);
    updateAchievementsSection('weekly', weeklyAchievementsGrid);
    updateAchievementsSection('monthly', monthlyAchievementsGrid);
    updateAchievementsSection('additional', additionalAchievementsGrid);
}

// Update specific achievements section
function updateAchievementsSection(type, gridElement) {
    const achievements = achievementsData[type];
    const userAchievements = JSON.parse(localStorage.getItem('userAchievements') || '{}');
    const workoutHistory = JSON.parse(localStorage.getItem('workoutHistory') || '[]');
    const userStats = JSON.parse(localStorage.getItem('userStats') || '{"streak": 0, "totalWorkouts": 0}');
    
    gridElement.innerHTML = '';
    
    achievements.forEach(achievement => {
        const isUnlocked = checkAchievementUnlocked(achievement, userAchievements, workoutHistory, userStats);
        
        const achievementCard = document.createElement('div');
        achievementCard.className = `achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`;
        
        achievementCard.innerHTML = `
            <div class="achievement-icon ${isUnlocked ? 'unlocked' : 'locked'}">
                ${achievement.icon}
            </div>
            <div class="achievement-info">
                <div class="achievement-name">${achievement.name}</div>
                <div class="achievement-desc">${achievement.description}</div>
                <div class="achievement-progress">${getAchievementProgress(achievement, workoutHistory, userStats)}</div>
            </div>
            <div class="achievement-points">+${achievement.points}</div>
        `;
        
        gridElement.appendChild(achievementCard);
    });
}

// Update monthly score when achievements are unlocked
function updateMonthlyScore(points) {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const monthKey = `${year}-${month}`;
    
    const monthlyScores = JSON.parse(localStorage.getItem('monthlyScores') || '{}');
    
    if (!monthlyScores[monthKey]) {
        monthlyScores[monthKey] = { points: 0 };
    }
    
    monthlyScores[monthKey].points += points;
    localStorage.setItem('monthlyScores', JSON.stringify(monthlyScores));
    
    // Update the display immediately
    updateScoreBar();
    updateMonthlyTracker();
}

// Check if achievement is unlocked
function checkAchievementUnlocked(achievement, userAchievements, workoutHistory, userStats) {
    // Check if already unlocked
    if (userAchievements[achievement.id]) {
        return true;
    }
    
    // Check achievement conditions
    const now = new Date();
    let isUnlocked = false;
    
    switch (achievement.type) {
        case 'daily':
            isUnlocked = checkDailyAchievement(achievement, workoutHistory);
            break;
        case 'weekly':
            isUnlocked = checkWeeklyAchievement(achievement, workoutHistory);
            break;
        case 'monthly':
            isUnlocked = checkMonthlyAchievement(achievement, workoutHistory);
            break;
        case 'additional':
            isUnlocked = checkAdditionalAchievement(achievement, workoutHistory, userStats);
            break;
        default:
            isUnlocked = false;
    }
    
    // If unlocked for the first time, update scores
    if (isUnlocked && !userAchievements[achievement.id]) {
        userAchievements[achievement.id] = {
            unlocked: true,
            timestamp: new Date().toISOString(),
            points: achievement.points
        };
        localStorage.setItem('userAchievements', JSON.stringify(userAchievements));
        
        // Update monthly score immediately
        updateMonthlyScore(achievement.points);
    }
    
    return isUnlocked;
}

// Check daily achievements - ONLY if today's workout is completed
function checkDailyAchievement(achievement, workoutHistory) {
    const today = getCurrentDayKey();
    const todayWorkout = workoutHistory.find(workout => workout.date === today && workout.completed);
    
    // Daily achievements only unlock if today's workout is completed
    if (!todayWorkout || !todayWorkout.completed) {
        return false;
    }
    
    switch (achievement.id) {
        case 'daily_complete':
            return true;
        case 'daily_early':
            const workoutTime = new Date(todayWorkout.timestamp);
            return workoutTime.getHours() < 8;
        case 'daily_perfect':
            return todayWorkout.setsCompleted === todayWorkout.totalSets;
        default:
            return false;
    }
}

// Check weekly achievements - ONLY for completed workouts
function checkWeeklyAchievement(achievement, workoutHistory) {
    const currentWeekKey = getCurrentWeekKey();
    const weekStart = new Date(currentWeekKey);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);
    
    const weeklyWorkouts = workoutHistory.filter(workout => {
        const workoutDate = new Date(workout.timestamp);
        return workoutDate >= weekStart && workoutDate <= weekEnd && workout.completed;
    });
    
    switch (achievement.id) {
        case 'weekly_3':
            return weeklyWorkouts.length >= 3;
        case 'weekly_5':
            return weeklyWorkouts.length >= 5;
        case 'weekly_perfect':
            return weeklyWorkouts.length >= 7;
        case 'weekly_rest':
            const restDaysCompleted = weeklyWorkouts.filter(workout => {
                const workoutDate = new Date(workout.timestamp);
                const day = workoutDate.getDay();
                return day === 0 || day === 3; // Sunday or Wednesday
            }).length;
            return restDaysCompleted >= 2;
        default:
            return false;
    }
}

// Check monthly achievements - ONLY for completed workouts
function checkMonthlyAchievement(achievement, workoutHistory) {
    const currentMonthKey = getCurrentMonthKey();
    const [year, month] = currentMonthKey.split('-').map(Number);
    const monthStart = new Date(year, month, 1);
    const monthEnd = new Date(year, month + 1, 0);
    monthEnd.setHours(23, 59, 59, 999);
    
    const monthlyWorkouts = workoutHistory.filter(workout => {
        const workoutDate = new Date(workout.timestamp);
        return workoutDate >= monthStart && workoutDate <= monthEnd && workout.completed;
    });
    
    switch (achievement.id) {
        case 'monthly_15':
            return monthlyWorkouts.length >= 15;
        case 'monthly_20':
            return monthlyWorkouts.length >= 20;
        case 'monthly_streak':
            return calculateCurrentStreak(workoutHistory) >= 7;
        default:
            return false;
    }
}

// Check additional achievements - ONLY for completed workouts
function checkAdditionalAchievement(achievement, workoutHistory, userStats) {
    // Only count completed workouts for additional achievements
    const completedWorkouts = workoutHistory.filter(workout => workout.completed);
    
    switch (achievement.id) {
        case 'total_50':
            return completedWorkouts.length >= 50;
        case 'total_100':
            return completedWorkouts.length >= 100;
        case 'streak_30':
            return calculateCurrentStreak(workoutHistory) >= 30;
        case 'variety':
            const workoutTypes = new Set(completedWorkouts.map(workout => workout.day));
            return workoutTypes.size >= 6;
        default:
            return false;
    }
}

// Calculate current streak - ONLY for completed workouts
function calculateCurrentStreak(workoutHistory) {
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

// Get achievement progress text
function getAchievementProgress(achievement, workoutHistory, userStats) {
    const now = new Date();
    const completedWorkouts = workoutHistory.filter(workout => workout.completed);
    
    switch (achievement.id) {
        case 'weekly_3':
        case 'weekly_5':
        case 'weekly_perfect':
            const weekStart = new Date(now);
            weekStart.setDate(now.getDate() - now.getDay());
            const weeklyWorkouts = completedWorkouts.filter(workout => {
                const workoutDate = new Date(workout.timestamp);
                return workoutDate >= weekStart;
            });
            return `${weeklyWorkouts.length}/${achievement.required}`;
        
        case 'monthly_15':
        case 'monthly_20':
            const monthWorkouts = completedWorkouts.filter(workout => {
                const workoutDate = new Date(workout.timestamp);
                return workoutDate.getMonth() === now.getMonth();
            });
            return `${monthWorkouts.length}/${achievement.required}`;
        
        case 'total_50':
        case 'total_100':
            return `${completedWorkouts.length}/${achievement.required}`;
        
        case 'streak_30':
            const streak = calculateCurrentStreak(workoutHistory);
            return `${streak}/${achievement.required}`;
        
        case 'variety':
            const workoutTypes = new Set(completedWorkouts.map(workout => workout.day));
            return `${workoutTypes.size}/${achievement.required}`;
        
        default:
            return '';
    }
}

// Update score bar
function updateScoreBar() {
    const userAchievements = JSON.parse(localStorage.getItem('userAchievements') || '{}');
    
    // Calculate total score from all unlocked achievements
    let totalScore = 0;
    Object.values(userAchievements).forEach(achievement => {
        if (achievement.unlocked) {
            totalScore += achievement.points;
        }
    });
    
    // Update display
    currentScoreElement.textContent = totalScore;
    const progress = Math.min((totalScore / 1000) * 100, 100);
    scoreFillElement.style.width = `${progress}%`;
}

// Update monthly tracker
function updateMonthlyTracker() {
    const monthlyScores = JSON.parse(localStorage.getItem('monthlyScores') || '{}');
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    let yearTotal = 0;
    
    monthsGrid.innerHTML = '';
    
    months.forEach((month, index) => {
        const monthData = monthlyScores[`${currentYear}-${index}`] || { points: 0 };
        const isCurrent = index === currentMonth;
        const isCompleted = index < currentMonth;
        const isFuture = index > currentMonth;
        
        yearTotal += monthData.points;
        
        const monthItem = document.createElement('div');
        monthItem.className = `month-item ${isCurrent ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${isFuture ? 'future' : ''}`;
        
        const pointsDisplay = isCurrent ? `${monthData.points}+` : monthData.points;
        
        monthItem.innerHTML = `
            <div class="month-name">${month}</div>
            <div class="month-points">${pointsDisplay}</div>
            <div class="month-total">points</div>
            ${isCurrent ? '<div class="month-progress">Live</div>' : ''}
        `;
        
        monthsGrid.appendChild(monthItem);
    });
    
    yearTotalElement.textContent = `Total: ${yearTotal} pts`;
}

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initAchievementsPage();
    startAutoRefresh();
});