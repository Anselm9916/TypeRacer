// DOM Elements
const themeToggle = document.querySelector(".theme-toggle")
const body = document.body
const tabButtons = document.querySelectorAll(".tab-btn")
const tabContents = document.querySelectorAll(".tab-content")
const difficultyButtons = document.querySelectorAll(".difficulty-btn")

// Check for saved theme preference
document.addEventListener("DOMContentLoaded", () => {
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
  body.classList.toggle("dark")
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
    tabButtons.forEach((btn) => btn.classList.remove("active"))
    button.classList.add("active")
    const tabId = button.getAttribute("data-tab")
    tabContents.forEach((content) => {
      content.classList.remove("active")
      if (content.id === tabId) {
        content.classList.add("active")
      }
    })
  })
})

// Difficulty Button Click Handlers (if you need to store this later)
difficultyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    difficultyButtons.forEach((btn) => btn.classList.remove("active"))
    button.classList.add("active")
  })
})

// Updated Action Button Click Handlers
const actionButtons = document.querySelectorAll(".action-btn")
actionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const tabId = button.closest(".tab-content").id
    if (tabId === "join") {
      const roomCode = document.getElementById("roomCode").value.trim()
      const username = document.getElementById("joinUsername").value.trim()
      if (roomCode && username) {
        // Send join request to join_room.php
        const formData = new FormData()
        formData.append('room_code', roomCode)
        formData.append('user_name', username)
        fetch('join_room.php', {
          method: 'POST',
          body: formData
        })
        .then(response => response.json())
        .then(data => {
          if (data.message) {
            alert(`Succes: ${data.message}`)
            // Redirect to race page if join successful
            window.location.href = "race.html"
          } else if (data.error) {
            alert(`Error: ${data.error}`)
          }
        })
        .catch(error => console.error('Error:', error))
      } else {
        alert("Vul zowel de room code als je gebruikersnaam in")
      }
    } else if (tabId === "create") {
      const username = document.getElementById("createUsername").value.trim()
      // (Optional) You can allow the user to supply a room code or have it auto-generated
      // For now we leave it blank so that the PHP endpoint auto-generates it.
      let roomCode = "" 
      // If you wish to add difficulty and maxPlayers into the request,
      // you need to update your backend and database to store those values.
      if (username) {
        const formData = new FormData()
        formData.append('room_code', roomCode) // empty means auto-generate
        formData.append('user_name', username)
        fetch('create_room.php', {
          method: 'POST',
          body: formData
        })
        .then(response => response.json())
        .then(data => {
          if (data.room_code) {
            alert(`Room aangemaakt! Code: ${data.room_code}`)
            // Optionally auto-join the creator to the room immediately:
            // You could either call join_room.php here or store the room code in localStorage.
            window.location.href = "race.html"
          } else if (data.error) {
            alert(`Error: ${data.error}`)
          }
        })
        .catch(error => console.error('Error:', error))
      } else {
        alert("Vul je gebruikersnaam in")
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
