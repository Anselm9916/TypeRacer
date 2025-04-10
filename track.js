// DOM Elements
const themeToggle = document.querySelector(".theme-toggle")
const body = document.body
const wordInput = document.getElementById("wordInput")
const currentWord = document.getElementById("currentWord")
const restartBtn = document.getElementById("restartBtn")
const inviteBtn = document.getElementById("inviteBtn")
const wpmDisplay = document.getElementById("wpmDisplay")
const accuracyDisplay = document.getElementById("accuracyDisplay")
const timeDisplay = document.getElementById("timeDisplay")
const battleStatus = document.getElementById("battleStatus")
const yourHealth = document.getElementById("yourHealth")
const opponentHealth = document.getElementById("opponentHealth")
const participantsList = document.getElementById("participantsList")
const participantCount = document.getElementById("participantCount")
const addRandomUserBtn = document.getElementById("addRandomUser")
const resetUsersBtn = document.getElementById("resetUsers")
const startGameBtn = document.getElementById("startGameBtn")
const leaveRoomBtn = document.getElementById("leaveRoomBtn")
const copyRoomCodeBtn = document.getElementById("copyRoomCode")
const roomCodeDisplay = document.getElementById("roomCode")
const yourAttack = document.getElementById("yourAttack")
const opponentAttack = document.getElementById("opponentAttack")
const yourDamage = document.getElementById("yourDamage")
const opponentDamage = document.getElementById("opponentDamage")

// Global variables
let currentWordList = []
const wordQueue = []
let correctWords = 0
let totalWords = 0
let startTime = null
let timer = null
let timerInterval = null
let gameInProgress = false
let yourHealthValue = 100
let opponentHealthValue = 100
let participants = []
const maxParticipants = 8

// Word lists by difficulty
const easyWords = [
  "the",
  "and",
  "for",
  "are",
  "but",
  "not",
  "you",
  "all",
  "any",
  "can",
  "had",
  "her",
  "was",
  "one",
  "our",
  "out",
  "day",
  "get",
  "has",
  "him",
  "his",
  "how",
  "man",
  "new",
  "now",
  "old",
  "see",
  "two",
  "way",
  "who",
  "boy",
  "did",
  "its",
  "let",
  "put",
  "say",
  "she",
  "too",
  "use",
]

const mediumWords = [
  "about",
  "above",
  "after",
  "again",
  "along",
  "began",
  "below",
  "between",
  "both",
  "color",
  "could",
  "every",
  "found",
  "house",
  "large",
  "learn",
  "never",
  "other",
  "place",
  "plant",
  "point",
  "right",
  "small",
  "sound",
  "spell",
  "still",
  "study",
  "their",
  "there",
  "these",
  "thing",
  "think",
  "three",
  "water",
  "where",
  "which",
  "world",
  "would",
  "write",
]

const hardWords = [
  "actually",
  "addition",
  "although",
  "attention",
  "beautiful",
  "beginning",
  "carefully",
  "challenge",
  "character",
  "community",
  "completely",
  "condition",
  "confident",
  "consider",
  "continue",
  "dangerous",
  "different",
  "difficult",
  "direction",
  "education",
  "everyone",
  "excellent",
  "experience",
  "important",
  "knowledge",
  "necessary",
  "particular",
  "performance",
  "possibility",
  "practice",
  "preparation",
  "probably",
  "question",
  "remember",
  "separate",
  "something",
  "sometimes",
  "successful",
  "understand",
  "wonderful",
]

const programmingWords = [
  "function",
  "variable",
  "constant",
  "boolean",
  "integer",
  "string",
  "array",
  "object",
  "class",
  "method",
  "property",
  "interface",
  "inheritance",
  "polymorphism",
  "encapsulation",
  "abstraction",
  "algorithm",
  "database",
  "framework",
  "library",
  "component",
  "module",
  "parameter",
  "argument",
  "return",
  "callback",
  "promise",
  "async",
  "await",
  "syntax",
  "compiler",
  "interpreter",
  "runtime",
  "debugging",
  "exception",
  "validation",
  "iteration",
  "recursion",
  "scope",
  "closure",
]

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
]

// Initialize the game
function initializeGame() {
  // Add yourself as the first participant (host)
  participants = [
    {
      id: "you",
      name: "You",
      isHost: true,
      isYou: true,
      wpm: 15,
      health: 100,
      avatar: "Y",
    },
  ]

  // Update participants list
  updateParticipantsList()

  // Load words
  loadWords()

  // Reset health
  resetHealth()
}

// Load words for the game
function loadWords() {
  // Combine word lists with more emphasis on medium difficulty
  const allWords = [...easyWords, ...mediumWords, ...mediumWords, ...hardWords, ...programmingWords]

  // Shuffle the array
  const shuffledWords = allWords.sort(() => Math.random() - 0.5)

  // Set current word and queue
  currentWordList = shuffledWords.slice(0, 50)
  updateCurrentWord()
}

// Update the current word display
function updateCurrentWord() {
  if (currentWordList.length === 0) {
    loadWords()
    return
  }

  // Get the next word
  const nextWord = currentWordList.shift()
  currentWord.textContent = nextWord

  // Update word queue display
  const wordQueueElement = document.querySelector(".word-queue")
  wordQueueElement.innerHTML = ""

  // Show next 3 words in queue
  for (let i = 0; i < Math.min(3, currentWordList.length); i++) {
    const wordElement = document.createElement("div")
    wordElement.className = "next-word"
    wordElement.textContent = currentWordList[i]
    wordQueueElement.appendChild(wordElement)
  }
}

// Reset health values
function resetHealth() {
  yourHealthValue = 100
  opponentHealthValue = 100
  updateHealthDisplay()
}

// Update health display
function updateHealthDisplay() {
  yourHealth.style.width = `${yourHealthValue}%`
  opponentHealth.style.width = `${opponentHealthValue}%`

  // Update health text
  document.querySelector(".your-area .health-text").textContent = `${yourHealthValue} HP`
  document.querySelector(".opponent-area .health-text").textContent = `${opponentHealthValue} HP`

  // Update health color based on value
  if (yourHealthValue < 30) {
    yourHealth.style.backgroundColor = "#ef4444"
  } else if (yourHealthValue < 60) {
    yourHealth.style.backgroundColor = "#f59e0b"
  } else {
    yourHealth.style.backgroundColor = "#22c55e"
  }

  if (opponentHealthValue < 30) {
    opponentHealth.style.backgroundColor = "#ef4444"
  } else if (opponentHealthValue < 60) {
    opponentHealth.style.backgroundColor = "#f59e0b"
  } else {
    opponentHealth.style.backgroundColor = "#22c55e"
  }

  // Update participant health
  const youIndex = participants.findIndex((p) => p.isYou)
  if (youIndex !== -1) {
    participants[youIndex].health = yourHealthValue
    updateParticipantsList()
  }
}

// Calculate WPM
function calculateWPM() {
  if (!startTime) return 0

  const now = new Date()
  const elapsedSeconds = (now - startTime) / 1000
  const minutes = elapsedSeconds / 60

  return minutes > 0 ? Math.round(correctWords / minutes) : 0
}

// Calculate accuracy
function calculateAccuracy() {
  if (totalWords === 0) return 100

  return Math.round((correctWords / totalWords) * 100)
}

// Update game stats
function updateGameStats() {
  const wpm = calculateWPM()
  const accuracy = calculateAccuracy()

  wpmDisplay.textContent = `${wpm} WPM`
  accuracyDisplay.textContent = `${accuracy}% Accuracy`

  // Update your WPM in participants
  const youIndex = participants.findIndex((p) => p.isYou)
  if (youIndex !== -1) {
    participants[youIndex].wpm = wpm
    updateParticipantsList()
  }
}

// Update timer display
function updateTimer() {
  if (!startTime) return

  const now = new Date()
  const elapsedSeconds = Math.floor((now - startTime) / 1000)
  const minutes = Math.floor(elapsedSeconds / 60)
  const seconds = elapsedSeconds % 60

  timeDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`
}

// Start the game
function startGame() {
  if (participants.length < 2) {
    alert("Need at least 2 participants to start a battle!")
    return
  }

  startTime = new Date()
  gameInProgress = true

  // Reset stats
  correctWords = 0
  totalWords = 0

  // Reset health
  resetHealth()

  // Load new words
  loadWords()

  // Focus on input
  wordInput.focus()

  // Start timers
  timer = setInterval(updateGameStats, 1000)
  timerInterval = setInterval(updateTimer, 1000)

  // Update battle status
  battleStatus.textContent = "Battle in progress! Type words to attack!"

  // Start opponent attacks
  startOpponentAttacks()
}

// Start opponent attacks
function startOpponentAttacks() {
  if (!gameInProgress) return

  // Random interval between 3-8 seconds
  const attackInterval = Math.floor(Math.random() * 5000) + 3000

  setTimeout(() => {
    if (gameInProgress) {
      // Opponent attacks
      opponentAttack.style.opacity = "1"

      // Calculate damage (5-15 points)
      const damage = Math.floor(Math.random() * 11) + 5

      // Apply damage to player
      yourHealthValue = Math.max(0, yourHealthValue - damage)
      updateHealthDisplay()

      // Show damage effect
      yourDamage.textContent = `-${damage}`
      yourDamage.classList.add("active")

      setTimeout(() => {
        opponentAttack.style.opacity = "0"
        yourDamage.classList.remove("active")

        // Check if player is defeated
        if (yourHealthValue <= 0) {
          endGame(false)
        } else {
          // Schedule next attack
          startOpponentAttacks()
        }
      }, 1000)
    }
  }, attackInterval)
}

// End the game
function endGame(playerWon) {
  gameInProgress = false

  if (timer) {
    clearInterval(timer)
    timer = null
  }

  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }

  // Update battle status
  if (playerWon) {
    battleStatus.textContent = "Victory! You defeated your opponent!"
  } else {
    battleStatus.textContent = "Defeat! Your opponent has won the battle."
  }

  // Show game results
  const wpm = calculateWPM()
  const accuracy = calculateAccuracy()

  setTimeout(() => {
    alert(
      `Battle ${playerWon ? "Won" : "Lost"}!\n\nYour Results:\nWPM: ${wpm}\nAccuracy: ${accuracy}%\nWords Typed: ${correctWords}`,
    )
  }, 1000)
}

// Word input event listener
wordInput.addEventListener("input", () => {
  if (!gameInProgress) {
    // Start game on first input
    if (!startTime) {
      startGame()
    }
    return
  }

  const typedWord = wordInput.value.trim().toLowerCase()
  const targetWord = currentWord.textContent.toLowerCase()

  // Check if word is correct
  if (typedWord === targetWord) {
    // Word is correct
    correctWords++
    totalWords++

    // Clear input
    wordInput.value = ""

    // Player attacks
    yourAttack.style.opacity = "1"

    // Calculate damage (8-20 points)
    const damage = Math.floor(Math.random() * 13) + 8

    // Apply damage to opponent
    opponentHealthValue = Math.max(0, opponentHealthValue - damage)
    updateHealthDisplay()

    // Show damage effect
    opponentDamage.textContent = `-${damage}`
    opponentDamage.classList.add("active")

    setTimeout(() => {
      yourAttack.style.opacity = "0"
      opponentDamage.classList.remove("active")

      // Check if opponent is defeated
      if (opponentHealthValue <= 0) {
        endGame(true)
      }
    }, 1000)

    // Get next word
    updateCurrentWord()
  }
})

// Restart Button
restartBtn.addEventListener("click", () => {
  // End current game if in progress
  if (gameInProgress) {
    if (timer) {
      clearInterval(timer)
      timer = null
    }

    if (timerInterval) {
      clearInterval(timerInterval)
      timerInterval = null
    }

    gameInProgress = false
  }

  // Reset everything
  startTime = null
  correctWords = 0
  totalWords = 0

  // Reset health
  resetHealth()

  // Load new words
  loadWords()

  // Clear input
  wordInput.value = ""

  // Reset displays
  wpmDisplay.textContent = "0 WPM"
  accuracyDisplay.textContent = "100% Accuracy"
  timeDisplay.textContent = "0:00"
  battleStatus.textContent = "Waiting for battle to start..."

  // Focus on input
  wordInput.focus()
})

// Invite Button
inviteBtn.addEventListener("click", () => {
  const roomCode = roomCodeDisplay.textContent
  navigator.clipboard
    .writeText(roomCode)
    .then(() => {
      alert(`Room code ${roomCode} copied to clipboard! Share this with friends to invite them.`)
    })
    .catch((err) => {
      console.error("Could not copy text: ", err)
      alert(`Your room code is: ${roomCode}`)
    })
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

// Start Game Button
startGameBtn.addEventListener("click", () => {
  if (participants.length < 2) {
    alert("Need at least 2 participants to start a battle!")
    return
  }

  // Focus on the input field
  wordInput.focus()

  // Start the game
  startGame()
})

// Leave Room Button
leaveRoomBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to leave this battle room?")) {
    window.location.href = "index.html"
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
        copyRoomCodeBtn.innerHTML = '<i class="fas fa-copy"></i> Copy'
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
    wpm: Math.floor(Math.random() * 50) + 30, // Random WPM between 30-80
    health: 100,
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
      <div class="participant-health-bar">
        <div class="health-fill" style="width: ${participant.health}%"></div>
      </div>
    `

    participantsList.appendChild(participantCard)
  })

  // Update opponent name if there are other participants
  const opponents = participants.filter((p) => !p.isYou)
  if (opponents.length > 0) {
    const opponent = opponents[0]
    document.querySelector(".opponent-area .player-name").textContent = opponent.name
    document.querySelector(".opponent-area .player-avatar").textContent = opponent.avatar
  }
}

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

// Initialize the game when the page loads
document.addEventListener("DOMContentLoaded", () => {
  // Check for saved theme preference
  const savedTheme = localStorage.getItem("theme")

  if (savedTheme === "light") {
    body.classList.remove("dark")
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>'
  }

  initializeGame()
})
