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
    const callsMonth = await callService.filterCalls({ period: "month" });

    const statsToday = callService.calculateStats(callsToday);
    const statsMonth = callService.calculateStats(callsMonth);

    const todayEarningsEl = document.getElementById('today-earnings');
    const monthEarningsEl = document.getElementById('month-earnings');
    const totalCallsEl = document.getElementById('total-calls');
    const hourlRateEl = document.getElementById('hourly-rate');

    if (todayEarningsEl) {
        todayEarningsEl.textContent = `$${statsToday.totalEarnings.toFixed(2)}`;
    }
    if (monthEarningsEl) {
        monthEarningsEl.textContent = `$${statsMonth.totalEarnings.toFixed(2)}`;
    }
    if (totalCallsEl) {
        totalCallsEl.textContent = `${statsToday.totalCalls}`;
    }
    if (hourlRateEl) {
        hourlRateEl.textContent = `$${statsToday.avgHourlyRate.toFixed(2)}`;
    }

}

const startTimer = () => {
    const startTime = Date.now();
    const timerElement = document.getElementById("tracker-timer")

    const updateTimer = () => {
        const ms = Date.now() - startTime;
        const totalSeconds = Math.floor(ms / 1000);
        const timerStr = dateService.formatDuration(totalSeconds);
        if (timerElement) timerElement.textContent = timerStr;
        
    }

    const intervalID = setInterval(() => updateTimer(), 1000)

    return intervalID
}

const stopTimer = (intervalID: NodeJS.Timeout) => {
    clearInterval(intervalID);
}

const setOnCall = (isOnCall: boolean) => {
    const headerEl = document.getElementById("tracker-header")

    isOnCall ? headerEl?.classList.add("onCall") : headerEl?.classList.remove("onCall")
}

export default { createStatsDisplay, updateStats, startTimer, stopTimer, setOnCall }