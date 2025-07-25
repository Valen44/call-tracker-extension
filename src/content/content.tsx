import callService from "@/services/callService";
import { type Call } from "@/types/Call";
import statsDisplay from "./statsDisplay";

class CallTracker {
  private currentCallId: string | null = null;
  private availableStartTime: Date | null = null;
  private isOnCall: boolean = false;
  private lastStatus: "On-Call" | "Available" | null = null;

  // Stats Display
  private availIntervalID: NodeJS.Timeout | null = null;
  private callIntervalID: NodeJS.Timeout | null = null;

  constructor() {
    this.init();
  }

  private init(): void {
    this.startMonitoring();
    this.injectStats();
    console.info("Call Tracker initialized");
  }

  private calculateDuration(callData: Call): {duration: number, minutes: number, endTime: Date} {
    const endTime = new Date();
    const startTime = new Date(callData.startTime);

    // Duration in seconds
    const duration = Math.floor(
      (endTime.getTime() - startTime.getTime()) / 1000); 

    // Calculate minutes and round to 30s
    let minutes = Math.floor(duration / 60);
    if (duration % 60 >= 30) minutes += 1;

    return {duration, minutes, endTime}
  }

  private calculateEarnings(duration:number, minutes: number): {status: Call["status"], earnings: number } {
    let status: Call["status"];
    let earnings: number;

    if (duration <= 123 && !confirm("Was the call serviced?")) {
      status = "notServiced";
      earnings = 0;
    } else {
      status = "serviced";
      earnings = parseFloat((minutes * 0.15).toFixed(2));
    }

    return {status, earnings};
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


    if (currentStatus === "Available" && this.lastStatus !== "Available") {
      this.availableStartTime = new Date();
      this.availIntervalID = statsDisplay.startTimer();
    }
    else if (currentStatus !== "Available" && this.lastStatus === "Available" && currentStatus !== "On-Call") {
      this.availableStartTime = null;
      if (this.availIntervalID !== null) statsDisplay.stopTimer(this.availIntervalID);
    }

    this.lastStatus = currentStatus;

    if (currentStatus === "On-Call" && !this.isOnCall) {
      this.startCall();
    } else if (currentStatus !== "On-Call" && this.isOnCall) {
      this.endCall();
    }
  }

  private calculateAvailable(startTime: Date): number | undefined {
    if (this.availableStartTime) {
      const available = Math.floor(
        (startTime.getTime() - this.availableStartTime.getTime()) / 1000
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
    if (this.availIntervalID !== null) {
      statsDisplay.stopTimer(this.availIntervalID);
      this.availIntervalID = null;

      this.callIntervalID = statsDisplay.startTimer();
    }
  }

  private async endCall(): Promise<void> {
    if (!this.isOnCall || !this.currentCallId) return;

    const callData = await callService.getCall(this.currentCallId);
      if (!callData) return;
    
    const {duration, minutes, endTime} = this.calculateDuration(callData);
    callData.endTime = endTime.toISOString();
    callData.duration = duration;

    const {status, earnings} = this.calculateEarnings(duration, minutes);
    callData.status = status;
    callData.earnings = earnings;

    await callService.saveCall(callData)
    statsDisplay.updateStats();

    if (this.callIntervalID !== null) {
      statsDisplay.stopTimer(this.callIntervalID);
    }
    statsDisplay.setOnCall(false);

    this.currentCallId = null;
    this.isOnCall = false;

    console.info("Call ended:");
    console.table(callData); 
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
