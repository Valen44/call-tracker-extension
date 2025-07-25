import statsContainer from "./statsContainer";
import dateService from "@/services/dateService";
import callService from "@/services/callService";

const createStatsDisplay = () => {
    const style = document.createElement("style");
    style.textContent = statsContainer.CSS;

    document.body.appendChild(style);
    document.body.insertAdjacentHTML("beforeend", statsContainer.HTML);

    // Drag logic
    const tracker = document.getElementById("tracker");

    let isDragging = false;
    let offsetX: number, offsetY: number;

    tracker?.addEventListener("mousedown", (e) => {
        isDragging = true;
        offsetX = e.clientX - tracker.getBoundingClientRect().left;
        offsetY = e.clientY - tracker.getBoundingClientRect().top;
        tracker.style.transition = "none";
    });

    document.addEventListener("mousemove", (e) => {
        if (isDragging) {
            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;
            if (tracker) {
            tracker.style.left = `${x}px`;
            tracker.style.top = `${y}px`;
            }
        }
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
    });

    updateStats()
}

const updateStats = async () => {
    const callsToday = await callService.filterCalls({ period: "today" });

    const statsToday = callService.calculateStats(callsToday);

    const totalCallsEl = document.getElementById('total-calls');
    const todayEarningsEl = document.getElementById('today-earnings');
    const inCallTimeEl = document.getElementById('in-call-time');
    const hourlyRateEl = document.getElementById('hourly-rate');
    const avgAvailEl = document.getElementById('avg-avail');
    
    if (totalCallsEl) {
        totalCallsEl.textContent = `${statsToday.totalCalls}`;
    }
    if (todayEarningsEl) {
        todayEarningsEl.textContent = `$${statsToday.totalEarnings.toFixed(2)}`;
    }
    if (inCallTimeEl) {
        inCallTimeEl.textContent = `${dateService.formatDuration(statsToday.totalTime || 0)}`;
    }
    if (hourlyRateEl) {
        hourlyRateEl.textContent = `$${statsToday.avgHourlyRate.toFixed(2)}`;
    }
    if (avgAvailEl) {
        avgAvailEl.textContent = `${dateService.formatDuration(statsToday.avgAvailableTime || 0)}`;
    }

}

const updateTimer = (startTime: number) => {
    const timerElement = document.getElementById("tracker-timer");
    const ms = Date.now() - startTime;
    const totalSeconds = Math.floor(ms / 1000);
    const timerStr = dateService.formatDuration(totalSeconds, true);
    if (timerElement) timerElement.textContent = timerStr;
    
}


const stopTimer = () => {
    const timerElement = document.getElementById("tracker-timer");
    if (timerElement) timerElement.textContent = "";
}

const setStatus = (status: "available" | "oncall" | "unavailable") => {
    const headerEl = document.getElementById("tracker-header")
    if (headerEl === null) return;
    
    switch (status) {
    case "available":
      headerEl.className = "status-available";
      break;
    case "oncall":
      headerEl.className = "status-oncall";
      break;
    case "unavailable":
      headerEl.className = "status-unavailable";
      break;
  }
}

export default { createStatsDisplay, updateStats, stopTimer, setStatus, updateTimer }