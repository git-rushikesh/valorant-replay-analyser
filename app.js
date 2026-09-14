let matchData = null;
let selectedRound = null;

async function loadMatch() {
  const response = await fetch("data/sample-match.json");
  matchData = await response.json();

  renderMatchSummary();
  renderRounds();
}

function renderMatchSummary() {
  document.querySelector("#map-name").textContent = matchData.map;
  document.querySelector("#match-score").textContent = matchData.result;
  document.querySelector("#agent-name").textContent = matchData.agent;
  document.querySelector("#player-name").textContent = matchData.player;

  const totalRounds = matchData.rounds.length;
  const roundWins = matchData.rounds.filter(
    round => round.result === "win"
  ).length;

  const totalKills = matchData.rounds.reduce(
    (total, round) => total + round.kills,
    0
  );

  const totalDeaths = matchData.rounds.reduce(
    (total, round) => total + round.deaths,
    0
  );

  document.querySelector("#total-rounds").textContent = totalRounds;
  document.querySelector("#round-wins").textContent = roundWins;
  document.querySelector("#total-kills").textContent = totalKills;
  document.querySelector("#total-deaths").textContent = totalDeaths;
}

function renderRounds() {
  const filter = document.querySelector("#round-filter").value;
  const roundList = document.querySelector("#round-list");

  const rounds = matchData.rounds.filter(round => {
    return filter === "all" || round.result === filter;
  });

  roundList.innerHTML = "";

  rounds.forEach(round => {
    const button = document.createElement("button");
    button.className = "round";

    if (selectedRound === round.round) {
      button.classList.add("selected");
    }

    button.innerHTML = `
      <div class="round-top">
        <strong>Round ${round.round}</strong>
        <strong class="${round.result}">
          ${round.result.toUpperCase()}
        </strong>
      </div>
      <div class="round-details">
        ${round.side} · ${round.kills} kills · ${round.deaths} deaths
        · ${round.damage} damage · ${round.duration}s
      </div>
    `;

    button.addEventListener("click", () => {
      selectedRound = round.round;
      renderRounds();
      renderCoachingNotes(round);
    });

    roundList.appendChild(button);
  });
}

function renderCoachingNotes(round) {
  const notes = document.querySelector("#coaching-notes");

  notes.innerHTML = `
    <p><strong>Round ${round.round}:</strong> ${round.note}</p>
    <p>
      <strong>Performance:</strong>
      ${round.kills} kills, ${round.deaths} deaths,
      ${round.damage} damage.
    </p>
    <p>
      <strong>Suggested review:</strong>
      Check positioning, utility usage, timing, and whether
      the death or engagement was tradeable.
    </p>
  `;
}

document
  .querySelector("#round-filter")
  .addEventListener("change", renderRounds);

loadMatch().catch(error => {
  document.querySelector("#round-list").innerHTML =
    `<p>Could not load sample match data.</p>`;

  console.error(error);
});