/* eslint-disable no-undef */
import statsDisplay from "./statsDisplay";
import callService from "../services/callService";


class CallTracker {
  constructor() {
    this.currentCallId = null;
    this.prevCallEndTime = null;
    this.isOnCall = false;
    this.lastStatus = null;
    this.statsInjected = false;
    this.intervalID = null;
    this.init();
  }

  init() {
    this.startMonitoring();
    this.injectStats();
    console.log('Call Tracker initialized');
  }

  startMonitoring() {
    // Check every 500ms for status changes
    setInterval(() => {
      this.checkCallStatus();
    }, 500);
  }

  checkCallStatus() {
    const statusElement = document.getElementById('span-agentstatus-text');
    
    if (!statusElement) {
      return;
    }

    const currentStatus = statusElement.textContent.trim();
    
    // Only process if status has changed
    if (currentStatus === this.lastStatus) {
      return;
    }

    this.lastStatus = currentStatus;
    
    if (currentStatus === 'On-Call' && !this.isOnCall) {
      this.startCall();
    } else if (currentStatus !== 'On-Call' && this.isOnCall) {
      this.endCall();
    }
  }

  startCall() {
    this.isOnCall = true;
    this.currentCallId = Date.now().toString();
    
    const callData = {
      id: this.currentCallId,
      startTime: new Date().toISOString(),
      endTime: null,
      duration: 0,
      earnings: null,
      serviced: true,
      avail: null,
    };

    callService.saveCall(callData);
    console.log('Call started:', callData);

    statsDisplay.setOnCall(true);
    this.intervalID !== null ? statsDisplay.stopTimer(this.intervalID) : null;
    this.intervalID = statsDisplay.startTimer();
  }

  endCall() {
    if (!this.isOnCall || !this.currentCallId) {
      return;
    }

    this.isOnCall = false;
    
    callService.getCall(this.currentCallId).then(callData => {
      if (callData) {
        const endTime = new Date();
        const startTime = new Date(callData.startTime);
        const duration = Math.floor((endTime - startTime) / 1000); // Duration in seconds

        // Calculate whole minutes
        let minutes = Math.floor(duration / 60);
        // Check if the remaining seconds are 30 or more
        if (duration % 60 >= 30) {
          minutes += 1;
        }

        if (duration <= 123 && !confirm("Was the call serviced?")) {
          callData.serviced = false;
          callData.earnings = 0;
        } else {
          const earnings = minutes * 0.15; // $0.15 per minute
          callData.earnings = parseFloat(earnings.toFixed(2));
        }

        callData.endTime = endTime.toISOString();
        callData.duration = duration;

        // Calculate available
        if (this.prevCallEndTime) {
          const prevEndTime = new Date(this.prevCallEndTime);

          console.log(startTime, this.prevCallEndTime, prevEndTime);
          const avail = Math.floor((startTime - prevEndTime) / 1000);

          callData.avail = avail;
        }

        this.prevCallEndTime = endTime.toISOString();
        callService.saveCall(callData).then(() => {
          statsDisplay.updateStats();

          statsDisplay.stopTimer(this.intervalID);
          this.intervalID = statsDisplay.startTimer();
          statsDisplay.setOnCall(false);
          console.log('Call ended:', callData);
        });
      }
    });

    this.currentCallId = null;
    
  }

  async injectStats() {
    // Wait for the page to load completely
    setTimeout(() => {
      statsDisplay.createStatsDisplay();
    }, 2000);
  }

}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new CallTracker();
  });
} else {
  new CallTracker();
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getStatus') {
    const statusElement = document.getElementById('span-agentstatus-text');
    const status = statusElement ? statusElement.textContent.trim() : 'Unknown';
    sendResponse({ status });
  }
});