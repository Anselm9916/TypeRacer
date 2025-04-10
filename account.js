// DOM Elements
const themeToggle = document.querySelector(".theme-toggle")
const body = document.body
const tabButtons = document.querySelectorAll(".tab-btn")
const tabContents = document.querySelectorAll(".tab-content")
const fontSizeSlider = document.getElementById("fontSizeSlider")
const fontSizeValue = document.getElementById("fontSizeValue")
const editProfileBtn = document.querySelector(".edit-profile-btn")
const infoEditBtns = document.querySelectorAll(".info-edit-btn")
const enable2FACheckbox = document.getElementById("enable2FA")
const setup2FABtn = document.querySelector(".setup-2fa-btn")
const logoutButtons = document.querySelectorAll(".btn.danger.small")
const logoutAllBtn = document.querySelector(".logout-all-btn")
const savePreferencesBtn = document.querySelector(".save-preferences-btn")
const deleteAccountBtn = document.querySelector(".delete-account-btn")
const resetStatsBtn = document.querySelector(".reset-stats-btn")

// Check for saved theme preference
document.addEventListener("DOMContentLoaded", () => {
  // Check if user has a saved theme preference
  const savedTheme = localStorage.getItem("theme")

  if (savedTheme === "dark") {
    applyDarkMode()
    document.getElementById("themeDark").checked = true
  } else {
    applyLightMode()
    document.getElementById("themeLight").checked = true
  }

  // Load user data
  loadUserData()

  // Initialize font size slider
  if (fontSizeSlider && fontSizeValue) {
    const savedFontSize = localStorage.getItem("fontSize") || "16"
    fontSizeSlider.value = savedFontSize
    updateFontSize(savedFontSize)
  }

  // Update copyright year
  const currentYear = new Date().getFullYear()
  const footerYear = document.querySelector("footer p")
  if (footerYear) {
    footerYear.textContent = footerYear.textContent.replace("2025", currentYear)
  }
})

// Theme Toggle Functionality
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    // Toggle dark mode
    if (body.classList.contains("dark")) {
      applyLightMode()
    } else {
      applyDarkMode()
    }
  })
}

// Apply Dark Mode
function applyDarkMode() {
  body.classList.add("dark")
  if (themeToggle) {
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>'
  }
  localStorage.setItem("theme", "dark")
  if (document.getElementById("themeDark")) {
    document.getElementById("themeDark").checked = true
  }
}

// Apply Light Mode
function applyLightMode() {
  body.classList.remove("dark")
  if (themeToggle) {
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>'
  }
  localStorage.setItem("theme", "light")
  if (document.getElementById("themeLight")) {
    document.getElementById("themeLight").checked = true
  }
}

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

// Font Size Slider
if (fontSizeSlider) {
  fontSizeSlider.addEventListener("input", () => {
    const size = fontSizeSlider.value
    updateFontSize(size)
    localStorage.setItem("fontSize", size)
  })
}

function updateFontSize(size) {
  if (fontSizeValue) {
    fontSizeValue.textContent = `${size}px`
  }
}

// Theme Radio Buttons
document.querySelectorAll('input[name="theme"]').forEach((radio) => {
  radio.addEventListener("change", (e) => {
    const theme = e.target.value
    if (theme === "light") {
      applyLightMode()
    } else if (theme === "dark") {
      applyDarkMode()
    } else if (theme === "system") {
      // Check system preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      if (prefersDark) {
        applyDarkMode()
      } else {
        applyLightMode()
      }
      localStorage.setItem("theme", "system")
    }
  })
})

// Edit Profile Button
if (editProfileBtn) {
  editProfileBtn.addEventListener("click", () => {
    // In a real app, this would open a modal or navigate to an edit profile page
    alert("Edit profile functionality would be implemented here.")
  })
}

// Info Edit Buttons
infoEditBtns.forEach((button) => {
  button.addEventListener("click", () => {
    const infoRow = button.closest(".info-row")
    const infoLabel = infoRow.querySelector(".info-label").textContent
    const infoValue = infoRow.querySelector(".info-value").textContent

    // In a real app, this would open an inline editor or modal
    const newValue = prompt(`Edit ${infoLabel}:`, infoValue)

    if (newValue !== null && newValue.trim() !== "") {
      infoRow.querySelector(".info-value").textContent = newValue
      // In a real app, this would save to the server
      showSuccessMessage("Information updated successfully!")
    }
  })
})

// 2FA Checkbox
if (enable2FACheckbox && setup2FABtn) {
  enable2FACheckbox.addEventListener("change", () => {
    setup2FABtn.disabled = !enable2FACheckbox.checked

    if (enable2FACheckbox.checked) {
      setup2FABtn.addEventListener("click", () => {
        // In a real app, this would open a 2FA setup flow
        alert("Two-factor authentication setup would be implemented here.")
      })
    }
  })
}

// Logout Buttons
logoutButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // In a real app, this would log out the specific session
    const sessionDevice = button.closest(".session-item").querySelector(".session-device").textContent
    if (confirm(`Are you sure you want to log out from ${sessionDevice}?`)) {
      button.closest(".session-item").remove()
      showSuccessMessage("Device logged out successfully!")
    }
  })
})

// Logout All Button
if (logoutAllBtn) {
  logoutAllBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to log out from all devices?")) {
      // In a real app, this would log out all sessions except the current one
      document.querySelectorAll(".session-item:not(.current)").forEach((item) => {
        item.remove()
      })
      showSuccessMessage("Logged out from all other devices!")
    }
  })
}

// Save Preferences Button
if (savePreferencesBtn) {
  savePreferencesBtn.addEventListener("click", () => {
    // In a real app, this would save all preferences to the server
    showSuccessMessage("Preferences saved successfully!")
  })
}

// Danger Zone Buttons
if (deleteAccountBtn) {
  deleteAccountBtn.addEventListener("click", () => {
    if (confirm("WARNING: This action cannot be undone. Are you absolutely sure you want to delete your account?")) {
      if (prompt("Please type 'DELETE' to confirm account deletion:") === "DELETE") {
        // In a real app, this would delete the account
        alert("Account deleted. You will be redirected to the homepage.")
        window.location.href = "index.html"
      }
    }
  })
}

if (resetStatsBtn) {
  resetStatsBtn.addEventListener("click", () => {
    if (confirm("WARNING: This will reset all your typing statistics. This action cannot be undone. Are you sure?")) {
      // In a real app, this would reset all stats
      showSuccessMessage("All statistics have been reset!")
    }
  })
}

// Load User Data
function loadUserData() {
  // In a real app, this would fetch data from a server
  // For demo purposes, we'll use mock data
  const userData = {
    username: "SpeedDemon123",
    displayName: "Speed Demon",
    email: "user@example.com",
    memberSince: "January 15, 2025",
    bio: "Typing enthusiast who loves to race against others and improve my speed.",
  }

  // Update profile header
  document.getElementById("profileName").textContent = userData.displayName
  document.getElementById("profileEmail").textContent = userData.email

  // Update personal info tab
  document.getElementById("usernameValue").textContent = userData.username
  document.getElementById("emailValue").textContent = userData.email
  document.getElementById("displayNameValue").textContent = userData.displayName
  document.getElementById("bioValue").textContent = userData.bio
  document.getElementById("memberSinceValue").textContent = userData.memberSince
}

// Show Success Message
function showSuccessMessage(message) {
  const successMessage = document.createElement("div")
  successMessage.className = "success-message"
  successMessage.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`

  // Add to the body
  document.body.appendChild(successMessage)

  // Position it
  successMessage.style.position = "fixed"
  successMessage.style.bottom = "20px"
  successMessage.style.right = "20px"
  successMessage.style.zIndex = "1000"

  // Remove after 3 seconds
  setTimeout(() => {
    successMessage.remove()
  }, 3000)
}

