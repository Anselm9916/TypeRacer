// Global variables
let currentSentence = "";
let startTime = null;
let timer = null;

// DOM Elements
const sentenceContainer = document.getElementById("sentenceContainer");
const userInput = document.getElementById("userInput");
const restartBtn = document.getElementById("restartBtn");
const progressBar = document.getElementById("progressBar");
const wpmDisplay = document.getElementById("wpmDisplay");
const rocket = document.getElementById("rocket");

// Fetch a random sentence from Advice Slip API
async function fetchSentence() {
    try {
        const response = await fetch("https://api.adviceslip.com/advice", { cache: "no-cache" });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        return data.slip.advice;
    } catch (error) {
        console.error("Error fetching sentence:", error);
        return "Error fetching sentence. Please try again later.";
    }
}

// Load and display a sentence
async function loadSentence() {
    currentSentence = await fetchSentence();
    sentenceContainer.innerHTML = "";

    for (let i = 0; i < currentSentence.length; i++) {
        const span = document.createElement("span");
        span.innerText = currentSentence[i];
        sentenceContainer.appendChild(span);
    }

    // Reset everything
    userInput.value = "";
    progressBar.style.width = "0%";
    wpmDisplay.textContent = "WPM: 0";
    rocket.style.bottom = "0px";

    startTime = null;
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
}

// Calculate correct words
function calculateCorrectWords() {
    const targetWords = currentSentence.split(" ");
    const typedWords = userInput.value.trim().split(/\s+/);
    let correctCount = 0;
    for (let i = 0; i < typedWords.length; i++) {
        if (typedWords[i] === targetWords[i]) {
            correctCount++;
        }
    }
    return correctCount;
}

// Update WPM
function updateWPM() {
    const now = new Date();
    const elapsedSeconds = (now - startTime) / 1000;
    const correctWords = calculateCorrectWords();
    const minutes = elapsedSeconds / 60;
    const wpm = minutes > 0 ? Math.round(correctWords / minutes) : 0;
    wpmDisplay.textContent = `WPM: ${wpm}`;
}

// Start Timer
function startTimer() {
    timer = setInterval(updateWPM, 1000);
}

// Finish Sentence
function finishSentence() {
    clearInterval(timer);
    timer = null;
    setTimeout(() => {
        loadSentence();
    }, 1000);
}

// Typing Event Listener
userInput.addEventListener("input", () => {
    const arraySentence = sentenceContainer.querySelectorAll("span");
    const userText = userInput.value;
    const arrayValue = userText.split("");

    if (!startTime && userText.length > 0) {
        startTime = new Date();
        startTimer();
    }

    // Highlight correct/incorrect characters
    arraySentence.forEach((charSpan, index) => {
        const typedChar = arrayValue[index];
        if (typedChar == null) {
            charSpan.classList.remove("correct", "incorrect");
        } else if (typedChar === charSpan.innerText) {
            charSpan.classList.add("correct");
            charSpan.classList.remove("incorrect");
        } else {
            charSpan.classList.add("incorrect");
            charSpan.classList.remove("correct");
        }
    });

    // Update Progress Bar
    const progress = (userText.length / currentSentence.length) * 100;
    progressBar.style.width = `${Math.min(progress, 100)}%`;

    // Move Rocket 🚀
    const maxHeight = 120;
    const rocketPosition = (progress / 100) * maxHeight;
    rocket.style.bottom = `${rocketPosition}px`;

    if (userText.length >= currentSentence.length) {
        finishSentence();
    }
});

// Restart Button
restartBtn.addEventListener("click", () => {
    loadSentence();
});

// Load First Sentence
window.addEventListener("DOMContentLoaded", loadSentence);
