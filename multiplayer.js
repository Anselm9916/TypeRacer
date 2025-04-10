// DOM Elements
const themeToggle = document.querySelector(".theme-toggle")
const body = document.body
const sentenceContainer = document.getElementById("sentenceContainer")
const userInput = document.getElementById("userInput")
const restartBtn = document.getElementById("restartBtn")
const wpmDisplay = document.getElementById("wpmDisplay")
const car = document.getElementById("car")
const participantsList = document.getElementById("participantsList")
const participantCount = document.getElementById("participantCount")
const addRandomUserBtn = document.getElementById("addRandomUser")
const resetUsersBtn = document.getElementById("resetUsers")
const startRaceBtn = document.getElementById("startRaceBtn")
const leaveRoomBtn = document.getElementById("leaveRoomBtn")
const copyRoomCodeBtn = document.getElementById("copyRoomCode")
const roomCodeDisplay = document.getElementById("roomCode")

// Global variables
let currentSentence = ""
let startTime = null
let timer = null
let participants = []
const maxParticipants = 8
let raceInProgress = false
let userProgress = 0

// Random name generator data
const firstNames = [
  "Alex",
  "Jordan",
  "Taylor",
  "Morgan",
  "Casey",
  "Riley",
  "Avery",
  "Quinn",
  "Skyler",
  "Dakota",
  "Reese",
  "Finley",
  "Rowan",
  "Jamie",
  "Emerson",
  "Sage",
  "Harper",
  "Kai",
  "Remy",
  "Blake",
]
const lastNames = [
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Garcia",
  "Miller",
  "Davis",
  "Rodriguez",
  "Martinez",
  "Hernandez",
  "Lopez",
  "Gonzalez",
  "Wilson",
  "Anderson",
  "Thomas",
  "Taylor",
  "Moore",
  "Jackson",
  "Martin",
]

// Sample sentences for typing
const sampleSentences = [
  "The quick brown fox jumps over the lazy dog.",
  "Programming is the art of telling another human what one wants the computer to do.",
  "The best way to predict the future is to invent it.",
  "The only way to learn a new programming language is by writing programs in it.",
  "Simplicity is the soul of efficiency.",
  "Code is like humor. When you have to explain it, it's bad.",
  "First, solve the problem. Then, write the code.",
  "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
  "Experience is the name everyone gives to their mistakes.",
  "The most disastrous thing that you can ever learn is your first programming language.",
]

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

  // Initialize the race
  initializeRace()

  // Update copyright year
  const currentYear = new Date().getFullYear()
  const footerYear = document.querySelector("footer p")
  if (footerYear) {
    footerYear.textContent = footerYear.textContent.replace("2025", currentYear)
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

// Initialize the race
function initializeRace() {
  // Add yourself as the first participant (host)
  participants = [
    {
      id: "you",
      name: "You",
      isHost: true,
      isYou: true,
      progress: 0,
      wpm: 0,
      avatar: "Y",
    },
  ]

  // Update participants list
  updateParticipantsList()

  // Load a random sentence
  loadSentence()
}

// Load and display a sentence
function loadSentence() {
  // Get a random sentence from the sample sentences
  const randomIndex = Math.floor(Math.random() * sampleSentences.length)
  currentSentence = sampleSentences[randomIndex]

  // Create spans for each character
  sentenceContainer.innerHTML = ""
  for (let i = 0; i < currentSentence.length; i++) {
    const span = document.createElement("span")
    span.innerText = currentSentence[i]
    sentenceContainer.appendChild(span)
  }

  // Reset everything
  userInput.value = ""
  wpmDisplay.textContent = "WPM: 0"
  car.style.left = "0px"
  userProgress = 0

  startTime = null
  if (timer) {
    clearInterval(timer)
    timer = null
  }

  // Reset all participants' progress
  participants.forEach((participant) => {
    participant.progress = 0
    participant.wpm = 0
  })

  // Update participants list
  updateParticipantsList()
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
  wpmDisplay.textContent = `WPM: ${wpm}`

  // Update your WPM in participants
  const youIndex = participants.findIndex((p) => p.isYou)
  if (youIndex !== -1) {
    participants[youIndex].wpm = wpm
    updateParticipantsList()
  }
}

// Start Timer
function startTimer() {
  timer = setInterval(() => {
    updateWPM()

    // Simulate other participants' progress
    if (raceInProgress) {
      simulateParticipantsProgress()
    }
  }, 1000)
}

// Finish Sentence
function finishSentence() {
  clearInterval(timer)
  timer = null
  raceInProgress = false

  // Show race results
  alert("Race finished! Check the participants list to see the results.")

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
    raceInProgress = true
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

  // Update Progress Bar and Move Car
  userProgress = (userText.length / currentSentence.length) * 100
  const trackWidth = document.querySelector(".race-track").offsetWidth - car.offsetWidth
  const carPosition = (userProgress / 100) * trackWidth
  car.style.left = `${carPosition}px`

  // Update your progress in participants
  const youIndex = participants.findIndex((p) => p.isYou)
  if (youIndex !== -1) {
    participants[youIndex].progress = userProgress
    updateParticipantsList()
  }

  if (userText.length >= currentSentence.length) {
    finishSentence()
  }
})

// Restart Button
restartBtn.addEventListener("click", () => {
  loadSentence()
})

// Add Random User Button
addRandomUserBtn.addEventListener("click", () => {
  if (participants.length < maxParticipants) {
    addRandomParticipant()
  } else {
    alert(`Maximum number of participants (${maxParticipants}) reached!`)
  }
})

// Reset Users Button
resetUsersBtn.addEventListener("click", () => {
  // Keep only yourself
  participants = participants.filter((p) => p.isYou)
  updateParticipantsList()
})

// Start Race Button
startRaceBtn.addEventListener("click", () => {
  if (participants.length < 2) {
    alert("Need at least 2 participants to start a race!")
    return
  }

  // Focus on the input field
  userInput.focus()

  // Start the race
  raceInProgress = true

  // Countdown (simulated)
  alert("Race starting in 3... 2... 1... GO!")
})

// Leave Room Button
leaveRoomBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to leave this race room?")) {
    window.location.href = "join-race.html"
  }
})

// Copy Room Code Button
copyRoomCodeBtn.addEventListener("click", () => {
  const roomCode = roomCodeDisplay.textContent

  navigator.clipboard
    .writeText(roomCode)
    .then(() => {
      copyRoomCodeBtn.innerHTML = '<i class="fas fa-check"></i> Copied!'

      setTimeout(() => {
        copyRoomCodeBtn.innerHTML = '<i class="fas fa-copy"></i> Copy Code'
      }, 2000)
    })
    .catch((err) => {
      console.error("Could not copy text: ", err)
      alert("Failed to copy room code")
    })
})

// Add a random participant
function addRandomParticipant() {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
  const name = `${firstName} ${lastName.charAt(0)}.`
  const avatar = name.charAt(0)

  const newParticipant = {
    id: `user_${Date.now()}`,
    name: name,
    isHost: false,
    isYou: false,
    progress: 0,
    wpm: Math.floor(Math.random() * 50) + 30, // Random WPM between 30-80
    avatar: avatar,
  }

  participants.push(newParticipant)
  updateParticipantsList()
}

// Update participants list in the UI
function updateParticipantsList() {
  // Sort participants: you first, then host, then others by name
  participants.sort((a, b) => {
    if (a.isYou) return -1
    if (b.isYou) return 1
    if (a.isHost) return -1
    if (b.isHost) return 1
    return a.name.localeCompare(b.name)
  })

  // Update participant count
  participantCount.textContent = `${participants.length}/${maxParticipants}`

  // Clear the list
  participantsList.innerHTML = ""

  // Add each participant
  participants.forEach((participant) => {
    const participantCard = document.createElement("div")
    participantCard.className = `participant-card ${participant.isYou ? "participant-you" : ""} ${participant.isHost ? "participant-host" : ""}`

    participantCard.innerHTML = `
      <div class="participant-info">
        <div class="participant-avatar">${participant.avatar}</div>
        <div class="participant-name">${participant.name}${participant.isYou ? " (You)" : ""}${participant.isHost && !participant.isYou ? " (Host)" : ""}</div>
        <div class="participant-status">${participant.wpm > 0 ? `${participant.wpm} WPM` : "Ready"}</div>
      </div>
      <div class="participant-progress">
        <div class="progress-bar" style="width: ${participant.progress}%"></div>
      </div>
    `

    participantsList.appendChild(participantCard)
  })
}

// Simulate progress for other participants
function simulateParticipantsProgress() {
  participants.forEach((participant) => {
    if (!participant.isYou) {
      // Calculate a random progress increment based on their WPM
      const progressIncrement = (participant.wpm / 200) * Math.random() * 5
      participant.progress = Math.min(100, participant.progress + progressIncrement)

      // If a participant finishes, generate a new WPM for them
      if (participant.progress >= 100) {
        participant.progress = 100
        participant.wpm = Math.floor(Math.random() * 50) + 30
      }
    }
  })

  // Update the UI
  updateParticipantsList()

  // Check if all participants have finished
  const allFinished = participants.every((p) => p.progress >= 100)
  if (allFinished && raceInProgress) {
    finishSentence()
  }
}

