// Global variables
let currentSentence = ""
let startTime = null
let timer = null

// DOM Elements
const sentenceContainer = document.getElementById("sentenceContainer")
const userInput = document.getElementById("userInput")
const restartBtn = document.getElementById("restartBtn")
const progressBar = document.getElementById("progressBar")
const wpmDisplay = document.getElementById("wpmDisplay")
const car = document.getElementById("car")
const themeToggle = document.querySelector(".theme-toggle")
const body = document.body

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

  // Load first sentence
  loadSentence()
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

// Fetch a random sentence from Advice Slip API
async function fetchSentence() {
  try {
    const response = await fetch("https://api.adviceslip.com/advice", { cache: "no-cache" })
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)
    const data = await response.json()
    return data.slip.advice
  } catch (error) {
    console.error("Error fetching sentence:", error)
    return "Error fetching sentence. Please try again later."
  }
}

// Load and display a sentence
async function loadSentence() {
  currentSentence = await fetchSentence()
  sentenceContainer.innerHTML = ""

  for (let i = 0; i < currentSentence.length; i++) {
    const span = document.createElement("span")
    span.innerText = currentSentence[i]
    sentenceContainer.appendChild(span)
  }

  // Reset everything
  userInput.value = ""
  progressBar.style.width = "0%"
  wpmDisplay.innerHTML = '<i class="fas fa-keyboard"></i> WPM: 0'
  car.style.left = "0px"

  startTime = null
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

// Calculate correct words
function calculateCorrectWords() {
  const targetWords = currentSentence.split(" ")
  const typedWords = userInput.value.trim().split(/\s+/)
  let correctCount = 0
  for (let i = 0; i < typedWords.length; i++) {
    if (typedWords[i] === targetWords[i]) {
      correctCount++
    }
  }
  return correctCount
}

// Update WPM
function updateWPM() {
  const now = new Date()
  const elapsedSeconds = (now - startTime) / 1000
  const correctWords = calculateCorrectWords()
  const minutes = elapsedSeconds / 60
  const wpm = minutes > 0 ? Math.round(correctWords / minutes) : 0
  wpmDisplay.innerHTML = `<i class="fas fa-keyboard"></i> WPM: ${wpm}`
}

// Start Timer
function startTimer() {
  timer = setInterval(updateWPM, 1000)
}

// Finish Sentence
function finishSentence() {
  clearInterval(timer)
  timer = null
  setTimeout(() => {
    loadSentence()
  }, 1000)
}

// Typing Event Listener
userInput.addEventListener("input", () => {
  const arraySentence = sentenceContainer.querySelectorAll("span")
  const userText = userInput.value
  const arrayValue = userText.split("")

  if (!startTime && userText.length > 0) {
    startTime = new Date()
    startTimer()
  }

  // Highlight correct/incorrect characters
  arraySentence.forEach((charSpan, index) => {
    const typedChar = arrayValue[index]
    if (typedChar == null) {
      charSpan.classList.remove("correct", "incorrect")
    } else if (typedChar === charSpan.innerText) {
      charSpan.classList.add("correct")
      charSpan.classList.remove("incorrect")
    } else {
      charSpan.classList.add("incorrect")
      charSpan.classList.remove("correct")
    }
  })

  // Update Progress Bar
  const progress = (userText.length / currentSentence.length) * 100
  progressBar.style.width = `${Math.min(progress, 100)}%`

  // Move Car 🚗
  const trackWidth = document.querySelector(".race-track").offsetWidth - car.offsetWidth
  const carPosition = (progress / 100) * trackWidth
  car.style.left = `${carPosition}px`

  if (userText.length >= currentSentence.length) {
    finishSentence()
  }
})

// Restart Button
restartBtn.addEventListener("click", () => {
  loadSentence()
})

// Update copyright year
const currentYear = new Date().getFullYear()
const footerYear = document.querySelector("footer p")
if (footerYear) {
  footerYear.textContent = footerYear.textContent.replace("2025", currentYear)
}

