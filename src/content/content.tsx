import callService from "@/services/callService";
import { type Call } from "@/types/Call";
import statsDisplay from "./statsDisplay";

class CallTracker {
  private currentCallId: string | null = null;
  private prevCallEndTime: string | null = null;
  private isOnCall: boolean = false;
  private lastStatus: "On-Call" | "Available" | null = null;

  // Stats Display
  private intervalID: NodeJS.Timeout | null = null;

  constructor() {
    this.init();
  }

  private init(): void {
    this.startMonitoring();
    this.injectStats();
    console.info("Call Tracker initialized");
  }

  private startMonitoring(): void {
    setInterval(() => {
      this.checkCallStatus();
    }, 500);
  }

  private checkCallStatus(): void {
    const statusElement = document.getElementById(
      "span-agentstatus-text"
    ) as HTMLElement | null;
    if (!statusElement) return;

    const currentStatus = (statusElement.textContent?.trim() || null) as
      | "On-Call"
      | "Available"
      | null;
    if (currentStatus === this.lastStatus) return;

    this.lastStatus = currentStatus;

    if (currentStatus === "On-Call" && !this.isOnCall) {
      this.startCall();
    } else if (currentStatus !== "On-Call" && this.isOnCall) {
      this.endCall();
    }
  }

  private calculateAvailable(startTime: Date): number | undefined {
    if (this.prevCallEndTime) {
      const prevEndTime = new Date(this.prevCallEndTime);
      const available = Math.floor(
        (startTime.getTime() - prevEndTime.getTime()) / 1000
      );
      return available;
    }
  }

  private startCall(): void {
    this.isOnCall = true;
    this.currentCallId = Date.now().toString();

    const currentDate = new Date();

    const callData: Call = {
      id: this.currentCallId,
      startTime: currentDate.toISOString(),
      endTime: undefined,
      duration: 0,
      earnings: undefined,
      status: "onGoing",
      available: this.calculateAvailable(currentDate),
    };

    callService.saveCall(callData);
    console.info("Call started:");
    console.table(callData);

    statsDisplay.setOnCall(true);
        if (this.intervalID !== null) {
        statsDisplay.stopTimer(this.intervalID);
        }
        this.intervalID = statsDisplay.startTimer();
  }

  private endCall(): void {
    if (!this.isOnCall || !this.currentCallId) return;

    this.isOnCall = false;

    callService.getCall(this.currentCallId).then((callData: Call | null) => {
      if (!callData) return;

      const endTime = new Date();
      const startTime = new Date(callData.startTime);
      const duration = Math.floor(
        (endTime.getTime() - startTime.getTime()) / 1000
      ); // Duration in seconds

      // Calculate minutes and round to 30s
      let minutes = Math.floor(duration / 60);
      if (duration % 60 >= 30) minutes += 1;

      
      if (duration <= 123 && !confirm("Was the call serviced?")) {
        callData.status = "notServiced";
        callData.earnings = 0;
      } else {
        callData.status = "serviced";
        const earnings = minutes * 0.15;
        callData.earnings = parseFloat(earnings.toFixed(2));
      }

      callData.endTime = endTime.toISOString();
      callData.duration = duration;

      this.prevCallEndTime = endTime.toISOString();

      callService.saveCall(callData).then(() => {
        statsDisplay.updateStats();

        if (this.intervalID !== null) {
          statsDisplay.stopTimer(this.intervalID);
        }
        this.intervalID = statsDisplay.startTimer();
        statsDisplay.setOnCall(false);
        console.info("Call ended:");
        console.table(callData);
      });
    });

    this.currentCallId = null;
  }

  private injectStats() {
    // Wait for the page to load completely
    setTimeout(() => {
      statsDisplay.createStatsDisplay();
    }, 2000);
  }
}

// Wait for DOM
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    new CallTracker();
  });
} else {
  new CallTracker();
}