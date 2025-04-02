// DOM Elements
const themeToggle = document.querySelector(".theme-toggle")
const body = document.body
const tabButtons = document.querySelectorAll(".tab-btn")
const leaderboardBody = document.getElementById("leaderboardBody")
const leaderboardHeader = document.querySelector(".leaderboard-header h2")
const leaderboardSubheader = document.querySelector(".leaderboard-header p")

// Leaderboard data
const leaderboardData = {
  daily: [
    { rank: 1, username: "SpeedDemon", wpm: 142, accuracy: 98, races: 15 },
    { rank: 2, username: "TypeMaster", wpm: 135, accuracy: 96, races: 12 },
    { rank: 3, username: "KeyboardWarrior", wpm: 128, accuracy: 97, races: 10 },
    { rank: 4, username: "WordNinja", wpm: 120, accuracy: 95, races: 8 },
    { rank: 5, username: "SwiftFingers", wpm: 115, accuracy: 94, races: 7 },
    { rank: 6, username: "RapidTyper", wpm: 110, accuracy: 93, races: 9 },
    { rank: 7, username: "KeyMaster", wpm: 108, accuracy: 92, races: 11 },
    { rank: 8, username: "SpeedyGonzales", wpm: 105, accuracy: 91, races: 6 },
    { rank: 9, username: "TypingTitan", wpm: 102, accuracy: 90, races: 8 },
    { rank: 10, username: "FastFingers", wpm: 100, accuracy: 89, races: 5 },
  ],
  weekly: [
    { rank: 1, username: "UltraTyper", wpm: 155, accuracy: 99, races: 42 },
    { rank: 2, username: "SpeedDemon", wpm: 148, accuracy: 97, races: 38 },
    { rank: 3, username: "KeyboardKing", wpm: 140, accuracy: 96, races: 35 },
    { rank: 4, username: "TypeMaster", wpm: 138, accuracy: 95, races: 30 },
    { rank: 5, username: "WordWizard", wpm: 132, accuracy: 94, races: 28 },
    { rank: 6, username: "RapidTyper", wpm: 130, accuracy: 93, races: 25 },
    { rank: 7, username: "SwiftFingers", wpm: 125, accuracy: 92, races: 22 },
    { rank: 8, username: "KeyboardWarrior", wpm: 122, accuracy: 91, races: 20 },
    { rank: 9, username: "SpeedyGonzales", wpm: 118, accuracy: 90, races: 18 },
    { rank: 10, username: "TypingTitan", wpm: 115, accuracy: 89, races: 15 },
  ],
  alltime: [
    { rank: 1, username: "LegendaryTyper", wpm: 170, accuracy: 99, races: 250 },
    { rank: 2, username: "UltraTyper", wpm: 165, accuracy: 98, races: 220 },
    { rank: 3, username: "SpeedDemon", wpm: 160, accuracy: 97, races: 200 },
    { rank: 4, username: "KeyboardKing", wpm: 155, accuracy: 96, races: 180 },
    { rank: 5, username: "TypeMaster", wpm: 150, accuracy: 95, races: 170 },
    { rank: 6, username: "WordWizard", wpm: 145, accuracy: 94, races: 160 },
    { rank: 7, username: "RapidTyper", wpm: 140, accuracy: 93, races: 150 },
    { rank: 8, username: "SwiftFingers", wpm: 135, accuracy: 92, races: 140 },
    { rank: 9, username: "KeyboardWarrior", wpm: 130, accuracy: 91, races: 130 },
    { rank: 10, username: "SpeedyGonzales", wpm: 125, accuracy: 90, races: 120 },
  ],
}

// Check for saved theme preference
document.addEventListener("DOMContentLoaded", () => {
  // Check if user has a saved theme preference
  const savedTheme = localStorage.getItem("theme")

  if (savedTheme === "dark") {
    body.classList.add("dark")
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>'
  } else {
    body.classList.remove("dark")
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>'
  }

  // Load default leaderboard (daily)
  loadLeaderboard("daily")
})

// Theme Toggle Functionality
themeToggle.addEventListener("click", () => {
  // Toggle dark class on body
  body.classList.toggle("dark")

  // Update icon based on current theme
  if (body.classList.contains("dark")) {
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>'
    localStorage.setItem("theme", "dark")
  } else {
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>'
    localStorage.setItem("theme", "light")
  }
})

// Tab Button Click Handlers
tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Remove active class from all buttons
    tabButtons.forEach((btn) => {
      btn.classList.remove("active")
    })

    // Add active class to clicked button
    button.classList.add("active")

    // Load leaderboard data
    const period = button.getAttribute("data-period")
    loadLeaderboard(period)
  })
})

// Load leaderboard data
function loadLeaderboard(period) {
  // Update header text
  updateLeaderboardHeader(period)

  // Clear existing table rows
  leaderboardBody.innerHTML = ""

  // Add new rows
  leaderboardData[period].forEach((entry) => {
    const row = document.createElement("tr")

    // Create rank cell with special styling for top 3
    const rankCell = document.createElement("td")
    if (entry.rank === 1) {
      rankCell.innerHTML = `<span class="rank-1"><i class="fas fa-trophy"></i> ${entry.rank}</span>`
    } else if (entry.rank === 2) {
      rankCell.innerHTML = `<span class="rank-2"><i class="fas fa-medal"></i> ${entry.rank}</span>`
    } else if (entry.rank === 3) {
      rankCell.innerHTML = `<span class="rank-3"><i class="fas fa-medal"></i> ${entry.rank}</span>`
    } else {
      rankCell.textContent = entry.rank
    }

    // Create other cells
    const usernameCell = document.createElement("td")
    usernameCell.textContent = entry.username

    const wpmCell = document.createElement("td")
    wpmCell.textContent = entry.wpm

    const accuracyCell = document.createElement("td")
    accuracyCell.textContent = `${entry.accuracy}%`

    const racesCell = document.createElement("td")
    racesCell.textContent = entry.races

    // Add cells to row
    row.appendChild(rankCell)
    row.appendChild(usernameCell)
    row.appendChild(wpmCell)
    row.appendChild(accuracyCell)
    row.appendChild(racesCell)

    // Add highlight animation
    row.classList.add("highlight")

    // Add row to table
    leaderboardBody.appendChild(row)
  })
}

// Update leaderboard header based on period
function updateLeaderboardHeader(period) {
  switch (period) {
    case "daily":
      leaderboardHeader.textContent = "Daily Top Racers"
      leaderboardSubheader.textContent = "The fastest typists in the last 24 hours"
      break
    case "weekly":
      leaderboardHeader.textContent = "Weekly Top Racers"
      leaderboardSubheader.textContent = "The fastest typists in the last 7 days"
      break
    case "alltime":
      leaderboardHeader.textContent = "All-Time Champions"
      leaderboardSubheader.textContent = "The fastest typists since the beginning"
      break
  }
}

// Update copyright year
const currentYear = new Date().getFullYear()
const footerYear = document.querySelector("footer p")
if (footerYear) {
  footerYear.textContent = footerYear.textContent.replace("2025", currentYear)
}

// Add hover effect to position card
const positionCard = document.querySelector(".position-card")
if (positionCard) {
  positionCard.addEventListener("mouseenter", () => {
    positionCard.style.transform = "translateY(-5px)"
    positionCard.style.boxShadow = "0 10px 20px rgba(0, 0, 0, 0.1)"
  })

  positionCard.addEventListener("mouseleave", () => {
    positionCard.style.transform = "translateY(0)"
    positionCard.style.boxShadow = "none"
  })
}

// Improve Rank button click handler
const improveRankBtn = document.querySelector(".position-btn")
if (improveRankBtn) {
  improveRankBtn.addEventListener("click", () => {
    window.location.href = "race.html"
  })
}

