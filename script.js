document.addEventListener("DOMContentLoaded", () => {
  const schedule = {
    monday: ["Mathematics"],
    tuesday: ["Reasoning"],
    wednesday: ["General Awareness"],
    thursday: ["Mathematics"],
    friday: ["Reasoning"],
    saturday: ["Mock Test"],
    sunday: ["General Awareness & Science"],
  };

  const selectedDay = document.getElementById("selected-day");
  const timetableBody = document.querySelector("#timetable tbody");
  const currentTaskDisplay = document.getElementById("current-task");
  const timerDisplay = document.getElementById("timer");
  const pauseButton = document.getElementById("pause-timer");
  const resetButton = document.getElementById("reset-timer");
  const customTaskInput = document.getElementById("custom-task");
  const customSubjectInput = document.getElementById("custom-subject");
  const customDurationInput = document.getElementById("custom-duration");
  const themeToggleButton = document.getElementById("toggle-theme");
  const clockDisplay = document.getElementById("clock-display");
  const dateDisplay = document.getElementById("current-date");

  let timer;
  let timeRemaining = 0;
  let isPaused = false;
  let currentTask = {};

  // Automatically detect today's date and update the schedule
  function loadTodaysSchedule() {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const day = dayNames[dayOfWeek];

    selectedDay.textContent = `Day: ${day.charAt(0).toUpperCase() + day.slice(1)}`;
    updateTimetableByDay(day);
  }

  // Update the timetable for a specific day
  function updateTimetableByDay(day) {
    timetableBody.innerHTML = "";

    if (schedule[day]) {
      schedule[day].forEach(subject => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td><input type="number" class="duration-input modern-input" placeholder="Duration (minutes)" min="1"></td>
          <td><input type="text" class="subject-input modern-input" value="${subject}" placeholder="Enter Subject"></td>
          <td><input type="text" class="topic-input modern-input" placeholder="Enter Topic"></td>
          <td><button type="button" class="start-btn modern-button">Start</button></td>
        `;
        timetableBody.appendChild(row);
      });
      attachStartListeners();
    }
  }

  function attachStartListeners() {
    const buttons = document.querySelectorAll(".start-btn");
    buttons.forEach(button => {
      button.removeEventListener("click", handleStartClick);
      button.addEventListener("click", handleStartClick);
    });
  }

  function handleStartClick(event) {
    const row = event.target.closest("tr");
    const subject = row.querySelector(".subject-input").value;
    const topic = row.querySelector(".topic-input").value;
    const duration = row.querySelector(".duration-input").value;

    if (!subject || !topic || !duration) {
      alert("Please fill out all fields (subject, topic, and duration).");
      return;
    }

    currentTask = { subject, topic, duration };
    currentTaskDisplay.textContent = `Current Task: ${topic}`;
    document.getElementById("timer-duration").textContent = duration;
    document.getElementById("timer-subject").textContent = subject;
    document.getElementById("timer-topic").textContent = topic;
    startTimer(parseInt(duration) * 60, subject, topic);
  }

  function startTimer(duration, subject, topic) {
    clearInterval(timer);
    timeRemaining = duration;

    isPaused = false;
    pauseButton.disabled = false;
    resetButton.disabled = false;

    timer = setInterval(() => {
      if (timeRemaining > 0) {
        timeRemaining--;
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        timerDisplay.textContent = `Timer: ${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
      } else {
        clearInterval(timer);
        alert("Time's up!");
        pauseButton.disabled = true;
        resetButton.disabled = true;
      }
    }, 1000);
  }

  pauseButton.addEventListener("click", () => {
    if (isPaused) {
      startTimer(timeRemaining, currentTask.subject, currentTask.topic);
      pauseButton.textContent = "Pause";
      isPaused = false;
    } else {
      clearInterval(timer);
      isPaused = true;
      pauseButton.textContent = "Resume";
    }
  });

  resetButton.addEventListener("click", () => {
    clearInterval(timer);
    timeRemaining = 0;
    timerDisplay.textContent = "Timer: 00:00";
    pauseButton.disabled = true;
    resetButton.disabled = true;
  });

  themeToggleButton.addEventListener("click", () => {
    const body = document.body;
    body.classList.toggle("dark-mode");
    themeToggleButton.textContent = body.classList.contains("dark-mode")
      ? "☀️ Light Mode"
      : "🌙 Dark Mode";
  });

  // Custom Timer Form Submit
  document.getElementById("custom-timer-form").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent page refresh

    const taskName = customTaskInput.value.trim();
    const subjectName = customSubjectInput.value.trim();
    const duration = parseInt(customDurationInput.value);

    if (taskName && subjectName && duration > 0) {
      currentTask = { subject: subjectName, topic: taskName, duration };
      currentTaskDisplay.textContent = `Current Task: ${taskName}`;
      document.getElementById("timer-duration").textContent = duration;
      document.getElementById("timer-subject").textContent = subjectName;
      document.getElementById("timer-topic").textContent = taskName;
      timerDisplay.textContent = "Timer: 00:00";
      startTimer(duration * 60, subjectName, taskName); // Start the custom timer
    } else {
      alert("Please fill all fields correctly.");
    }
  });

  // Initialize live clock and date
  function updateClockAndDate() {
    const now = new Date();
    const dateString = now.toLocaleDateString();
    const timeString = now.toLocaleTimeString();

    clockDisplay.textContent = timeString;
    dateDisplay.textContent = dateString;
  }

  setInterval(updateClockAndDate, 1000); // Update every second

  // Initialize today's schedule on page load
  loadTodaysSchedule();
});
