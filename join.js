// DOM Elements
const themeToggle = document.querySelector(".theme-toggle")
const body = document.body
const tabButtons = document.querySelectorAll(".tab-btn")
const tabContents = document.querySelectorAll(".tab-content")
const joinButtons = document.querySelectorAll(".join-btn")
const difficultyButtons = document.querySelectorAll(".difficulty-btn")

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

    // Show corresponding tab content
    const tabId = button.getAttribute("data-tab")
    tabContents.forEach((content) => {
      content.classList.remove("active")
      if (content.id === tabId) {
        content.classList.add("active")
      }
    })
  })
})

// Difficulty Button Click Handlers
difficultyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Remove active class from all difficulty buttons
    difficultyButtons.forEach((btn) => {
      btn.classList.remove("active")
    })

    // Add active class to clicked button
    button.classList.add("active")
  })
})

// Join Race Button Click Handlers
joinButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // This would normally join the race, but for demo purposes we'll just show an alert
    const raceName = button.closest(".race-card").querySelector("h3").textContent
    alert(`Joining race: ${raceName}`)
    window.location.href = "race.html"
  })
})

// Action Button Click Handlers
const actionButtons = document.querySelectorAll(".action-btn")
actionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const tabId = button.closest(".tab-content").id
    if (tabId === "join") {
      const roomCode = document.getElementById("roomCode").value
      const username = document.getElementById("joinUsername").value
      if (roomCode && username) {
        alert(`Joining race with room code: ${roomCode} as ${username}`)
        window.location.href = "race.html"
      } else {
        alert("Please enter both room code and username")
      }
    } else if (tabId === "create") {
      const username = document.getElementById("createUsername").value
      const difficulty = document.querySelector(".difficulty-btn.active").getAttribute("data-difficulty")
      const maxPlayers = document.getElementById("maxPlayers").value
      if (username) {
        alert(`Creating new ${difficulty} race for ${maxPlayers} players as ${username}`)
        window.location.href = "race.html"
      } else {
        alert("Please enter your username")
      }
    }
  })
})

// Update copyright year
const currentYear = new Date().getFullYear()
const footerYear = document.querySelector("footer p")
if (footerYear) {
  footerYear.textContent = footerYear.textContent.replace("2025", currentYear)
}

