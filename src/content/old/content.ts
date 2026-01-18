import callService from "@/services/callService";
import { type Call } from "@/types/Call";
import statsDisplay from "./statsDisplay.ts";
import settingsService, {defaultSettings} from "@/services/settingsService";

type IntervalID = NodeJS.Timeout | null;
type Status = "On-Call" | "Available" | "Attempted" | "Wrap-Up" | null;

class CallTracker {
  private currentCallData: Call | null = null;
  private availableStartTime: Date | null = null;
  private isOnCall: boolean = false;
  private lastStatus: Status = null;
  private RATE: number = defaultSettings.rate;

  // Stats Display
  private displayIntervalID: {avail: IntervalID, call: IntervalID} = {avail: null, call: null}
  private callSaverIntervalID: IntervalID = null;

  constructor() {
    this.init();
  }

  private async init() {
    this.RATE = (await settingsService.loadSettings()).rate

    callService.resolveNotFinishedCalls();
    this.startMonitoring();
    this.injectStats();
    
    console.info("Call Tracker initialized with RATE:", this.RATE);
  }

  private calculateDuration(callData: Call): {duration: number, minutes: number, endTime: Date} {
    const endTime = new Date();
    const startTime = new Date(callData.startTime);

    // Duration in seconds
    const {duration, minutes} = callService.calculateDuration(startTime, endTime)

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
      earnings = parseFloat((minutes * this.RATE).toFixed(2));
    }

    return {status, earnings};
  }

  private startMonitoring(): void {
    setInterval(() => {
      this.checkCallStatus();
    }, 500);
  }

  private startTimer(type: "available" | "call") {
    const startTime = Date.now();
    
    const intervalID = setInterval(() => statsDisplay.updateTimer(startTime), 1000);

    if (type === "call") {
      this.displayIntervalID.call = intervalID;
      this.callSaverIntervalID = setInterval(() => this.saveCallState(), 60000);
    }
    else this.displayIntervalID.avail = intervalID;
  }

  private stopTimer(type: "available" | "call") {
    statsDisplay.stopTimer();
    if (type === "call" && this.displayIntervalID.call && this.callSaverIntervalID) {
      clearInterval(this.displayIntervalID.call);
      this.displayIntervalID.call = null;
      clearInterval(this.callSaverIntervalID);
      this.callSaverIntervalID = null;
    }
    else if (type === "available" && this.displayIntervalID.avail) {
      clearInterval(this.displayIntervalID.avail);
      this.displayIntervalID.avail = null;
    }
  }

  private saveCallState() {
    if (this.currentCallData) {
      const { duration, minutes, endTime } = this.calculateDuration(this.currentCallData);;
      const earnings = parseFloat((minutes * this.RATE).toFixed(2));
      this.currentCallData.duration = duration;
      this.currentCallData.endTime = endTime.toISOString();
      this.currentCallData.earnings = earnings;

      callService.saveCall(this.currentCallData);
      console.log("Call Saved");
      console.log(this.currentCallData);

    }
  }

  private checkCallStatus(): void {
    const statusElement = document.getElementById(
      "span-agentstatus-text"
    ) as HTMLElement | null;
    if (!statusElement) return;

    const currentStatus = (statusElement.textContent?.trim() || null) as Status;
    if (currentStatus === this.lastStatus) return;


    if (currentStatus === "Available" && this.lastStatus !== "Available") {
      this.availableStartTime = new Date();
      this.startTimer("available");
      statsDisplay.setStatus("available");
    }
    else if (currentStatus !== "Available" && this.lastStatus === "Available" && currentStatus !== "On-Call" && currentStatus !== "Attempted") {
      this.availableStartTime = null;
      if (this.displayIntervalID.avail !== null) this.stopTimer("available");
      statsDisplay.setStatus("unavailable");
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
    const callId = Date.now().toString();

    const startTime = new Date();

    const callData: Call = {
      id: callId,
      company: "Unknown",
      startTime: startTime.toISOString(),
      endTime: undefined,
      duration: 0,
      earnings: undefined,
      status: "onGoing",
      available: this.calculateAvailable(startTime),
    };

    callService.saveCall(callData);
    this.currentCallData = callData;

    statsDisplay.setStatus("oncall");

    this.stopTimer("available");
    this.displayIntervalID.avail = null;

    this.startTimer("call");
    

    console.info("Call started:");
    console.table(callData);
  }

  private async endCall(): Promise<void> {
    if (!this.isOnCall || !this.currentCallData) return;
 
    const {duration, minutes, endTime} = this.calculateDuration(this.currentCallData);
    this.currentCallData.endTime = endTime.toISOString();
    this.currentCallData.duration = duration;

    const {status, earnings} = this.calculateEarnings(duration, minutes);
    this.currentCallData.status = status;
    this.currentCallData.earnings = earnings;

    await callService.saveCall(this.currentCallData)
    statsDisplay.updateStats();

    if (this.displayIntervalID.call !== null) {
      this.stopTimer("call");
    }
    statsDisplay.setStatus("unavailable");

    console.info("Call ended:");
    console.table(this.currentCallData); 

    this.currentCallData = null;
    this.isOnCall = false;
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
