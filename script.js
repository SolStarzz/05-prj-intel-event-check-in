document.addEventListener("DOMContentLoaded", () => {
  const checkInForm = document.getElementById("checkInForm");
  const attendeeNameInput = document.getElementById("attendeeName");
  const teamSelect = document.getElementById("teamSelect");
  const greetingEl = document.getElementById("greeting");
  const attendeeCountEl = document.getElementById("attendeeCount");
  const progressBarEl = document.getElementById("progressBar");
  const checkInBtn = document.getElementById("checkInBtn");

  const teamCards = {
    water: document.querySelector(".team-card.water"),
    zero: document.querySelector(".team-card.zero"),
    power: document.querySelector(".team-card.power"),
  };

  const teamCountEls = {
    water: document.getElementById("waterCount"),
    zero: document.getElementById("zeroCount"),
    power: document.getElementById("powerCount"),
  };
  
  const attendeeListEl = document.getElementById("attendeeList");

  const maxAttendees = 50;
  let attendees = [];
  let teamCounts = { water: 0, zero: 0, power: 0 };
  let totalAttendees = 0;

  function loadState() {
    attendees = JSON.parse(localStorage.getItem("summitAttendees")) || [];
    teamCounts = JSON.parse(localStorage.getItem("summitTeamCounts")) || { water: 0, zero: 0, power: 0 };
    totalAttendees = attendees.length;
    
    updateUI();
  }
  
  function saveState() {
    localStorage.setItem("summitAttendees", JSON.stringify(attendees));
    localStorage.setItem("summitTeamCounts", JSON.stringify(teamCounts));
  }

  function updateUI() {
    attendeeCountEl.textContent = totalAttendees;
    const progressPercentage = (totalAttendees / maxAttendees) * 100;
    progressBarEl.style.width = `${progressPercentage}%`;
    
    for (const team in teamCounts) {
        teamCountEls[team].textContent = teamCounts[team];
    }
    
    renderAttendeeList();
    highlightWinningTeam();

    if (totalAttendees >= maxAttendees) {
        triggerCelebration();
    }
  }

  function handleCheckIn(event) {
    event.preventDefault();

    const name = attendeeNameInput.value.trim();
    const team = teamSelect.value;
    const teamName = teamSelect.options[teamSelect.selectedIndex].text;

    if (!name || !team) return;

    attendees.push({ name, team, teamName });
    totalAttendees = attendees.length;
    
    teamCounts[team]++;
    
    greetingEl.textContent = `Welcome, ${name}! You're checked in for ${teamName}.`;
    greetingEl.className = "success-message";
    greetingEl.style.display = "block";
    
    saveState();
    updateUI();
    
    checkInForm.reset();
    attendeeNameInput.focus();
  }
  
  function renderAttendeeList() {
    attendeeListEl.innerHTML = "";
    
    attendees.forEach(attendee => {
        const li = document.createElement("li");
        li.textContent = attendee.name + " "; 
        const badge = document.createElement("span");
        badge.className = `team-badge badge-${attendee.team}`;
        badge.textContent = attendee.teamName;
        li.appendChild(badge);
        attendeeListEl.appendChild(li);
    });
  }
  
  function highlightWinningTeam() {
    let maxCount = -1;
    let winningTeams = [];

    for (const team in teamCounts) {
      if (teamCounts[team] > maxCount) {
        maxCount = teamCounts[team];
      }
    }
    
    if (maxCount > 0) {
      for (const team in teamCounts) {
        if (teamCounts[team] === maxCount) {
          winningTeams.push(team);
        }
      }
    }
    
    Object.keys(teamCards).forEach(team => {
      if (winningTeams.includes(team)) {
        teamCards[team].classList.add("winning");
      } else {
        teamCards[team].classList.remove("winning");
      }
    });
  }

  function triggerCelebration() {
      greetingEl.textContent = `Goal Reached! We have ${maxAttendees} attendees. Thank you!`;
      greetingEl.className = "success-message";
      greetingEl.style.display = "block";
      
      attendeeNameInput.disabled = true;
      teamSelect.disabled = true;
      checkInBtn.disabled = true;
      checkInBtn.textContent = "Goal Met!";

      confetti({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.6 }
      });
  }

  checkInForm.addEventListener("submit", handleCheckIn);
  loadState();
});