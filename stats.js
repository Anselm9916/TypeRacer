import { Chart } from "@/components/ui/chart"
// DOM Elements
const themeToggle = document.querySelector(".theme-toggle")
const body = document.body
const tabButtons = document.querySelectorAll(".tab-btn")
const tabContents = document.querySelectorAll(".tab-content")
const historyTableBody = document.getElementById("historyTableBody")
const historyTimeframe = document.getElementById("historyTimeframe")
const historySortBy = document.getElementById("historySortBy")

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

  // Initialize charts
  initCharts()

  // Load race history
  loadRaceHistory()
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

  // Reinitialize charts with new theme
  initCharts()
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

// Initialize Charts
function initCharts() {
  const isDarkMode = body.classList.contains("dark")
  const textColor = isDarkMode ? "#f1f5f9" : "#0c4a6e"
  const gridColor = isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(12, 74, 110, 0.1)"
  const primaryColor = isDarkMode ? "#38bdf8" : "#0c4a6e"
  const secondaryColor = isDarkMode ? "#f43f5e" : "#e11d48"

  // Recent Performance Chart
  const recentPerformanceCtx = document.getElementById("recentPerformanceChart")
  if (recentPerformanceCtx) {
    // Destroy existing chart if it exists
    if (window.recentPerformanceChart) {
      window.recentPerformanceChart.destroy()
    }

    window.recentPerformanceChart = new Chart(recentPerformanceCtx, {
      type: "line",
      data: {
        labels: ["Race 1", "Race 2", "Race 3", "Race 4", "Race 5", "Race 6", "Race 7", "Race 8", "Race 9", "Race 10"],
        datasets: [
          {
            label: "WPM",
            data: [75, 82, 78, 85, 80, 88, 92, 86, 90, 95],
            borderColor: primaryColor,
            backgroundColor: "transparent",
            tension: 0.3,
          },
          {
            label: "Accuracy (%)",
            data: [90, 92, 88, 94, 91, 93, 95, 92, 94, 96],
            borderColor: secondaryColor,
            backgroundColor: "transparent",
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: false,
            grid: {
              color: gridColor,
            },
            ticks: {
              color: textColor,
            },
          },
          x: {
            grid: {
              color: gridColor,
            },
            ticks: {
              color: textColor,
            },
          },
        },
        plugins: {
          legend: {
            labels: {
              color: textColor,
            },
          },
        },
      },
    })
  }

  // WPM Progress Chart
  const wpmProgressCtx = document.getElementById("wpmProgressChart")
  if (wpmProgressCtx) {
    // Destroy existing chart if it exists
    if (window.wpmProgressChart) {
      window.wpmProgressChart.destroy()
    }

    window.wpmProgressChart = new Chart(wpmProgressCtx, {
      type: "line",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
          {
            label: "Average WPM",
            data: [65, 68, 72, 75, 80, 85],
            borderColor: primaryColor,
            backgroundColor: "transparent",
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: false,
            grid: {
              color: gridColor,
            },
            ticks: {
              color: textColor,
            },
          },
          x: {
            grid: {
              color: gridColor,
            },
            ticks: {
              color: textColor,
            },
          },
        },
        plugins: {
          legend: {
            labels: {
              color: textColor,
            },
          },
        },
      },
    })
  }

  // Accuracy Progress Chart
  const accuracyProgressCtx = document.getElementById("accuracyProgressChart")
  if (accuracyProgressCtx) {
    // Destroy existing chart if it exists
    if (window.accuracyProgressChart) {
      window.accuracyProgressChart.destroy()
    }

    window.accuracyProgressChart = new Chart(accuracyProgressCtx, {
      type: "line",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
          {
            label: "Average Accuracy (%)",
            data: [85, 87, 88, 90, 91, 92],
            borderColor: secondaryColor,
            backgroundColor: "transparent",
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: false,
            min: 80,
            max: 100,
            grid: {
              color: gridColor,
            },
            ticks: {
              color: textColor,
            },
          },
          x: {
            grid: {
              color: gridColor,
            },
            ticks: {
              color: textColor,
            },
          },
        },
        plugins: {
          legend: {
            labels: {
              color: textColor,
            },
          },
        },
      },
    })
  }
}

// Race history data
const raceHistoryData = [
  {
    date: "Apr 1, 2025",
    wpm: 95,
    accuracy: 96,
    position: "1st",
    text: "The quick brown fox jumps over the lazy dog...",
  },
  { date: "Mar 30, 2025", wpm: 90, accuracy: 94, position: "2nd", text: "To be or not to be, that is the question..." },
  { date: "Mar 28, 2025", wpm: 88, accuracy: 95, position: "1st", text: "All that glitters is not gold..." },
  { date: "Mar 25, 2025", wpm: 86, accuracy: 92, position: "3rd", text: "The early bird catches the worm..." },
  {
    date: "Mar 22, 2025",
    wpm: 92,
    accuracy: 93,
    position: "1st",
    text: "A journey of a thousand miles begins with a single step...",
  },
  { date: "Mar 20, 2025", wpm: 85, accuracy: 90, position: "4th", text: "Actions speak louder than words..." },
  { date: "Mar 18, 2025", wpm: 88, accuracy: 91, position: "2nd", text: "Don't judge a book by its cover..." },
  { date: "Mar 15, 2025", wpm: 82, accuracy: 93, position: "3rd", text: "Time flies when you're having fun..." },
  { date: "Mar 12, 2025", wpm: 80, accuracy: 89, position: "5th", text: "Practice makes perfect..." },
  { date: "Mar 10, 2025", wpm: 78, accuracy: 92, position: "4th", text: "Better late than never..." },
]

// Load race history
function loadRaceHistory() {
  if (!historyTableBody) return

  // Clear existing table rows
  historyTableBody.innerHTML = ""

  // Add new rows
  raceHistoryData.forEach((entry) => {
    const row = document.createElement("tr")

    const dateCell = document.createElement("td")
    dateCell.textContent = entry.date

    const wpmCell = document.createElement("td")
    wpmCell.textContent = entry.wpm

    const accuracyCell = document.createElement("td")
    accuracyCell.textContent = `${entry.accuracy}%`

    const positionCell = document.createElement("td")
    positionCell.textContent = entry.position

    const textCell = document.createElement("td")
    textCell.textContent = entry.text.length > 30 ? entry.text.substring(0, 30) + "..." : entry.text

    // Add cells to row
    row.appendChild(dateCell)
    row.appendChild(wpmCell)
    row.appendChild(accuracyCell)
    row.appendChild(positionCell)
    row.appendChild(textCell)

    // Add row to table
    historyTableBody.appendChild(row)
  })
}

// History filters event listeners
if (historyTimeframe) {
  historyTimeframe.addEventListener("change", loadRaceHistory)
}

if (historySortBy) {
  historySortBy.addEventListener("change", loadRaceHistory)
}

// Update copyright year
const currentYear = new Date().getFullYear()
const footerYear = document.querySelector("footer p")
if (footerYear) {
  footerYear.textContent = footerYear.textContent.replace("2025", currentYear)
}

// Add hover effects to stats cards
const statsCards = document.querySelectorAll(".stats-card")
statsCards.forEach((card) => {
  card.addEventListener("mouseenter", () => {
    card.style.transform = "translateY(-5px)"
    card.style.boxShadow = "0 10px 20px rgba(0, 0, 0, 0.1)"
  })

  card.addEventListener("mouseleave", () => {
    card.style.transform = "translateY(0)"
    card.style.boxShadow = "none"
  })
})

// Add hover effects to achievement cards
const achievementCards = document.querySelectorAll(".achievement-card")
achievementCards.forEach((card) => {
  card.addEventListener("mouseenter", () => {
    card.style.transform = "translateY(-5px)"
    card.style.boxShadow = "0 10px 20px rgba(0, 0, 0, 0.1)"
  })

  card.addEventListener("mouseleave", () => {
    card.style.transform = "translateY(0)"
    card.style.boxShadow = "none"
  })
})

// Pagination buttons
const paginationBtns = document.querySelectorAll(".pagination-btn")
paginationBtns.forEach((btn) => {
  if (!btn.disabled) {
    btn.addEventListener("click", () => {
      // This would normally update the page, but for demo purposes we'll just show an alert
      alert("Pagination functionality would be implemented here in a real application.")
    })
  }
})

