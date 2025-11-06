// Update date and time
function updateDateTime() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    
    const dateString = now.toLocaleDateString('en-US', options);
    document.getElementById('datetime').textContent = dateString;
}

// Motivational quotes array
const motivationalQuotes = [
    "The only bad workout is the one that didn't happen.",
    "Don't wish for a good body, work for it.",
    "Strength doesn't come from what you can do. It comes from overcoming the things you once thought you couldn't.",
    "Your body can stand almost anything. It's your mind that you have to convince.",
    "The pain you feel today will be the strength you feel tomorrow.",
    "Success isn't always about greatness. It's about consistency. Consistent hard work gains success. Greatness will come.",
    "The only place where success comes before work is in the dictionary.",
    "Don't stop when you're tired. Stop when you're done.",
    "A one-hour workout is 4% of your day. No excuses.",
    "Your health is an investment, not an expense."
];

// Display random motivational quote
function displayRandomQuote() {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    document.getElementById('motivation-quote').textContent = motivationalQuotes[randomIndex];
}

// Check if today is a rest day
function isRestDay() {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = new Date().getDay();
    const todayName = days[today];
    
    // Wednesday and Sunday are rest days
    return todayName === 'wednesday' || todayName === 'sunday';
}

// Get next workout day
function getNextWorkoutDay() {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date().getDay();
    
    // Find next non-rest day
    let nextDay = (today + 1) % 7;
    while (days[nextDay].toLowerCase() === 'wednesday' || days[nextDay].toLowerCase() === 'sunday') {
        nextDay = (nextDay + 1) % 7;
    }
    
    return days[nextDay];
}

// Update workout completion status
function updateWorkoutCompletion() {
    const workoutHistory = JSON.parse(localStorage.getItem('workoutHistory') || '[]');
    const today = new Date().toISOString().split('T')[0];
    const completionElement = document.getElementById('completion-status');
    
    const todayWorkout = workoutHistory.find(workout => workout.date === today);
    
    if (todayWorkout) {
        completionElement.innerHTML = '✅ You have done today\'s workout';
        completionElement.classList.add('completed');
        completionElement.classList.remove('not-completed');
    } else {
        completionElement.innerHTML = '❌ You haven\'t done today\'s workout';
        completionElement.classList.add('not-completed');
        completionElement.classList.remove('completed');
    }
}

// Calculate day streak
function calculateDayStreak() {
    const workoutHistory = JSON.parse(localStorage.getItem('workoutHistory') || '[]');
    const userStats = JSON.parse(localStorage.getItem('userStats') || '{"streak": 0, "totalWorkouts": 0}');
    
    // Sort workouts by date (newest first)
    const sortedWorkouts = workoutHistory.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    let streak = 0;
    let currentDate = new Date();
    
    // Check consecutive days with workouts (excluding rest days)
    for (let i = 0; i < sortedWorkouts.length; i++) {
        const workoutDate = new Date(sortedWorkouts[i].date);
        const daysDiff = Math.floor((currentDate - workoutDate) / (1000 * 60 * 60 * 24));
        
        // If workout was yesterday or today, and it's not a rest day
        if (daysDiff <= 1) {
            const workoutDay = workoutDate.getDay();
            // Skip rest days (0=Sunday, 3=Wednesday)
            if (workoutDay !== 0 && workoutDay !== 3) {
                streak++;
                currentDate = new Date(workoutDate);
                currentDate.setDate(currentDate.getDate() - 1);
            }
        } else {
            break;
        }
    }
    
    return streak;
}

// Update all stats
function updateStats() {
    const workoutHistory = JSON.parse(localStorage.getItem('workoutHistory') || '[]');
    const userStats = JSON.parse(localStorage.getItem('userStats') || '{"streak": 0, "totalWorkouts": 0}');
    
    // Update day streak
    const streak = calculateDayStreak();
    document.getElementById('streak').textContent = streak;
    
    // Update total workouts (count only non-rest day workouts)
    const totalWorkouts = workoutHistory.filter(workout => {
        const workoutDate = new Date(workout.date);
        const dayOfWeek = workoutDate.getDay();
        // Exclude Sunday (0) and Wednesday (3) - rest days
        return dayOfWeek !== 0 && dayOfWeek !== 3;
    }).length;
    
    document.getElementById('total-workouts').textContent = totalWorkouts;
    
    // Update next workout day
    const nextWorkout = getNextWorkoutDay();
    document.getElementById('next-workout').textContent = nextWorkout;
    
    // Update achievements count (you can implement this based on your achievement logic)
    const achievements = JSON.parse(localStorage.getItem('achievements') || '[]');
    const unlockedAchievements = achievements.filter(ach => ach.unlocked).length;
    document.getElementById('achievements-count').textContent = unlockedAchievements;
    
    // Update user stats in localStorage
    userStats.streak = streak;
    userStats.totalWorkouts = totalWorkouts;
    localStorage.setItem('userStats', JSON.stringify(userStats));
}

// Setup click handlers for summary cards
function setupSummaryCards() {
    // Streak card - already linked to progress.html in HTML
    // Total workouts card - already linked to progress.html in HTML
    // Next workout card - already linked to nextday.html in HTML
    // Achievements card - already linked to achievements.html in HTML
    
    // Add any additional click handlers if needed
    const cards = document.querySelectorAll('.clickable-card');
    cards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Navigation is handled by HTML href, but we can add analytics or other logic here
            console.log(`Navigating to ${this.querySelector('.summary-label').textContent} page`);
        });
    });
}

// Check if workout was completed today and update accordingly
function checkTodaysWorkout() {
    const workoutHistory = JSON.parse(localStorage.getItem('workoutHistory') || '[]');
    const today = new Date().toISOString().split('T')[0];
    const todayWorkout = workoutHistory.find(workout => workout.date === today);
    
    if (todayWorkout && !todayWorkout.processed) {
        // Mark as processed to avoid duplicate processing
        todayWorkout.processed = true;
        localStorage.setItem('workoutHistory', JSON.stringify(workoutHistory));
        
        // Update stats
        updateStats();
        updateWorkoutCompletion();
    }
}

// Initialize the app
function initApp() {
    updateDateTime();
    displayRandomQuote();
    updateStats();
    updateWorkoutCompletion();
    setupSummaryCards();
    
    // Update time every second
    setInterval(updateDateTime, 1000);
    
    // Check for new workouts every 2 seconds
    setInterval(() => {
        checkTodaysWorkout();
        updateStats();
        updateWorkoutCompletion();
    }, 2000);
    
    // Also update when page becomes visible
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            updateStats();
            updateWorkoutCompletion();
        }
    });
}

// Start the app when the page loads
document.addEventListener('DOMContentLoaded', initApp);