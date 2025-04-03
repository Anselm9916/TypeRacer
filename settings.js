// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const themeToggle = document.querySelector(".theme-toggle")
    const body = document.body
    const tabs = document.querySelectorAll(".login-tab")
    const forms = document.querySelectorAll(".login-form")
  
    // Update copyright year
    const currentYear = new Date().getFullYear()
    const footerYear = document.querySelector("footer p")
    if (footerYear) {
      footerYear.textContent = footerYear.textContent.replace("2025", currentYear)
    }
  
    // Check for saved theme preference
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme === "dark") {
      body.classList.add("dark")
      themeToggle.innerHTML = '<i class="fas fa-moon"></i>'
    }
  
    // Tab switching functionality
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        // Remove active class from all tabs and forms
        tabs.forEach((t) => t.classList.remove("active"))
        forms.forEach((f) => f.classList.remove("active"))
  
        // Add active class to clicked tab
        tab.classList.add("active")
  
        // Show corresponding form
        const formId = tab.getAttribute("data-tab") + "-form"
        const formElement = document.getElementById(formId)
        if (formElement) {
          formElement.classList.add("active")
        }
      })
    })
  
    // Theme Toggle Functionality
    if (themeToggle) {
      themeToggle.addEventListener("click", () => {
        // Toggle dark class on body
        body.classList.toggle("dark")
  
        // Update icon and save preference
        if (body.classList.contains("dark")) {
          themeToggle.innerHTML = '<i class="fas fa-moon"></i>'
          localStorage.setItem("theme", "dark")
        } else {
          themeToggle.innerHTML = '<i class="fas fa-sun"></i>'
          localStorage.setItem("theme", "light")
        }
      })
    }
  })
  
  