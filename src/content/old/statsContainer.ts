const HTML = `
  <div id="tracker" class="tracker">
    <div id="tracker-header" style="background-color: #630404;">
      <p>Call Tracker</p>
      <p id="tracker-timer" class="tracker-timer"></p>
    </div>
    <div id="stats" class="">
      <div class="stat">
        <h1 id="total-calls" class="stat-value">00</h1>
        <p class="stat-label"># Calls</p>
      </div>
      <div class="stat">
        <h1 id="today-earnings" class="stat-value">$00.00</h1>
        <p class="stat-label">Today</p>
      </div>
      <div class="stat">
        <h1 id="in-call-time" class="stat-value">0h 00m</h1>
        <p class="stat-label">In-Call Time</p>
      </div>
      <div class="stat">
        <h1 id="hourly-rate" class="stat-value">$0.00</h1>
        <p class="stat-label">Avg $/H</p>
      </div>
      <div class="stat">
        <h1 id="avg-avail" class="stat-value">00m 00s</h1>
        <p class="stat-label">Avg Avail</p>
      </div>
    </div>
  </div>
`;

const CSS = `
#tracker * {
  font-family: ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
  margin: 0px;
  box-sizing: border-box;
}

#tracker {
  max-width: 400px;
  min-width: 400px;
  border-width: 2px;
  border-style: solid;
  position: fixed;
  top: 100px; /* starting position */
  left: 100px;
  cursor: move;
}

#tracker-header {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  font-weight: 700;
  color: white;
  height: min-content;
}

#stats {
  background: oklch(0.205 0 0);
  display: flex;
  justify-content: space-evenly;
  padding: 10px;
}

.status-unavailable {
  background-color: rgb(99, 4, 4);
}

.status-available {
  background-color: #2f6304;
}

.status-oncall {
  background-color: #9035e5ff;
}

.status-acw {
  background-color: #FF9800;
}

.status-ringing {
  background-color: #0d00ffff;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.stat-value {
  font-size: 20px;
  line-height: 1.75, 1.25;
  line-height: 1.25;
  font-weight: 600;
  color: oklch(0.985 0 0);
}
.stat-label {
  font-size: 12px;
  line-height: 1.33;
  line-height: 1.25;
  color: oklch(0.708 0 0);
}

`;

export default {HTML, CSS}