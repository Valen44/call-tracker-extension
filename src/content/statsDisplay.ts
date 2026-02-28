import statsContainer from "./statsContainer";
import dateService from "@/services/dateService";
import callService from "@/services/callService";
import type { AgentState } from "./state/AgentState";

export class StatsDisplay {
  private companyName: string;
  public tracker: HTMLElement | null = null;
  private trackerElements: { [key: string]: HTMLElement | null } = {
    "total-calls": null,
    "today-earnings": null,
    "in-call-time": null,
    "hourly-rate": null,
    "avg-avail": null,
    "tracker-header": null,
    "tracker-title": null,
    "tracker-timer": null,
  };

  private isDragging = false;
  private offsetX = 0;
  private offsetY = 0;

  constructor(companyName: string) {
    this.companyName = companyName;
  }

  // =========================
  // INIT / CREATE
  // =========================
  create() {
    const style = document.createElement("style");
    style.textContent = statsContainer.CSS;
    document.body.appendChild(style);

    document.body.insertAdjacentHTML("beforeend", statsContainer.HTML);

    this.tracker = document.getElementById("tracker");
    this.trackerElements["total-calls"] = document.getElementById("total-calls");
    this.trackerElements["today-earnings"] = document.getElementById("today-earnings");
    this.trackerElements["in-call-time"] = document.getElementById("in-call-time");
    this.trackerElements["hourly-rate"] = document.getElementById("hourly-rate");
    this.trackerElements["avg-avail"] = document.getElementById("avg-avail");
    this.trackerElements["tracker-header"] = document.getElementById("tracker-header");
    this.trackerElements["tracker-title"] = document.getElementById("tracker-title");
    this.trackerElements["tracker-timer"] = document.getElementById("tracker-timer");

    this.attachDragHandlers();
    this.updateStats();
  }

  // =========================
  // DRAG LOGIC
  // =========================
  private attachDragHandlers() {
    if (!this.tracker) return;

    this.tracker.addEventListener("mousedown", (e) => {
      this.isDragging = true;
      this.offsetX = e.clientX - this.tracker!.getBoundingClientRect().left;
      this.offsetY = e.clientY - this.tracker!.getBoundingClientRect().top;
      this.tracker!.style.transition = "none";
    });

    document.addEventListener("mousemove", (e) => {
      if (!this.isDragging || !this.tracker) return;

      const x = e.clientX - this.offsetX;
      const y = e.clientY - this.offsetY;

      this.tracker.style.left = `${x}px`;
      this.tracker.style.top = `${y}px`;
    });

    document.addEventListener("mouseup", () => {
      this.isDragging = false;
    });
  }

  // =========================
  // STATS
  // =========================
  async updateStats() {
    const callsToday = await callService.filterCalls({
      period: "today",
      companyName: this.companyName,
    });

    const statsToday = callService.calculateStats(callsToday);

    this.setText("total-calls", `${statsToday.totalCalls || 0}`);
    this.setText(
      "today-earnings",
      `$${statsToday.totalEarnings.toFixed(2) || 0}`
    );
    this.setText(
      "in-call-time",
      dateService.formatDuration(statsToday.totalTime || 0)
    );
    this.setText(
      "hourly-rate",
      `$${statsToday.avgHourlyRate.toFixed(2) || 0}`
    );
    this.setText(
      "avg-avail",
      dateService.formatDuration(statsToday.avgAvailableTime || 0)
    );
  }

  private setText(id: string, value: string) {
    const el = this.trackerElements[id];
    if (el) el.textContent = value;
  }

  // =========================
  // TIMER
  // =========================
  updateTimer(seconds: number) {
    const timerElement = this.trackerElements["tracker-timer"];
    if (!timerElement) return;

    timerElement.textContent =
      seconds === 0 ? "" : dateService.formatDuration(seconds, true);
  }

  // =========================
  // STATUS
  // =========================
  setStatus(status: AgentState) {
    const headerEl = this.trackerElements["tracker-header"];
    const titleEl = this.trackerElements["tracker-title"];
    if (!headerEl || !titleEl) return;

    headerEl.style.backgroundColor = status.color;
    titleEl.textContent = "Call Tracker - " + status.name.toUpperCase();

    this.updateStats();
  }
}
