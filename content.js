class CallTracker {
  constructor() {
    this.currentCallId = null;
    this.prevCallEndTime = null;
    this.isOnCall = false;
    this.lastStatus = null;
    this.statsInjected = false;
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

    this.saveCall(callData);
    console.log('Call started:', callData);
  }

  endCall() {
    if (!this.isOnCall || !this.currentCallId) {
      return;
    }

    this.isOnCall = false;
    
    this.getCall(this.currentCallId).then(callData => {
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
        this.saveCall(callData);
        console.log('Call ended:', callData);
      }
    });

    this.currentCallId = null;
    
  }

  async saveCall(callData) {
    try {
      const result = await chrome.storage.local.get(['calls']);
      const calls = result.calls || {};
      calls[callData.id] = callData;
      await chrome.storage.local.set({ calls });
    } catch (error) {
      console.error('Error saving call:', error);
    }
  }

  async getCall(callId) {
    try {
      const result = await chrome.storage.local.get(['calls']);
      const calls = result.calls || {};
      return calls[callId];
    } catch (error) {
      console.error('Error getting call:', error);
      return null;
    }
  }

  async injectStats() {
    // Wait for the page to load completely
    setTimeout(() => {
      this.createStatsDisplay();
    }, 2000);
  }

  async createStatsDisplay() {
    if (this.statsInjected) return;

    // Try to find a suitable location in the top bar
    const topBar = document.querySelector('.navbar') || 
                   document.querySelector('.header') || 
                   document.querySelector('.top-bar') || 
                   document.querySelector('[class*="nav"]') ||
                   document.querySelector('[class*="header"]') ||
                   document.querySelector('[class*="top"]');

    if (!topBar) {
      // If no top bar found, create our own
      this.createFloatingStats();
      return;
    }

    // Create stats container
    const statsContainer = document.createElement('div');
    statsContainer.id = 'call-tracker-stats';
    statsContainer.style.cssText = `
      display: flex;
      gap: 15px;
      align-items: center;
      padding: 5px 15px;
      background: rgba(76, 175, 80, 0.1);
      border-radius: 5px;
      font-size: 12px;
      font-weight: bold;
      color: #4CAF50;
      margin-left: auto;
      border: 1px solid #4CAF50;
    `;

    // Create individual stat elements
    const todayEarnings = document.createElement('span');
    todayEarnings.id = 'today-earnings';
    todayEarnings.textContent = 'Today: $0.00';

    const monthEarnings = document.createElement('span');
    monthEarnings.id = 'month-earnings';
    monthEarnings.textContent = 'This Month: $0.00';

    const totalCalls = document.createElement('span');
    totalCalls.id = 'total-calls';
    totalCalls.textContent = 'Calls: 0';

    statsContainer.appendChild(todayEarnings);
    statsContainer.appendChild(monthEarnings);
    statsContainer.appendChild(totalCalls);

    // Append to top bar
    topBar.appendChild(statsContainer);
    this.statsInjected = true;

    // Update stats immediately and then every 30 seconds
    this.updateInjectedStats();
    setInterval(() => this.updateInjectedStats(), 30000);
  }

  createFloatingStats() {
    const statsContainer = document.createElement('div');
    statsContainer.id = 'call-tracker-floating-stats';
    statsContainer.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      z-index: 10000;
      background: white;
      border: 2px solid #4CAF50;
      border-radius: 8px;
      padding: 10px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
      font-family: Arial, sans-serif;
      font-size: 12px;
      color: #333;
      min-width: 200px;
    `;

    const title = document.createElement('div');
    title.style.cssText = `
      font-weight: bold;
      margin-bottom: 5px;
      color: #4CAF50;
      text-align: center;
    `;
    title.textContent = '📞 Call Tracker';

    const todayEarnings = document.createElement('div');
    todayEarnings.id = 'today-earnings';
    todayEarnings.textContent = 'Today: $0.00';

    const monthEarnings = document.createElement('div');
    monthEarnings.id = 'month-earnings';
    monthEarnings.textContent = 'This Month: $0.00';

    const totalCalls = document.createElement('div');
    totalCalls.id = 'total-calls';
    totalCalls.textContent = 'Calls Today: 0';

    statsContainer.appendChild(title);
    statsContainer.appendChild(todayEarnings);
    statsContainer.appendChild(monthEarnings);
    statsContainer.appendChild(totalCalls);

    document.body.appendChild(statsContainer);
    this.statsInjected = true;

    // Update stats immediately and then every 30 seconds
    this.updateInjectedStats();
    setInterval(() => this.updateInjectedStats(), 30000);
  }

  async updateInjectedStats() {
    try {
      const result = await chrome.storage.local.get(['calls']);
      const allCalls = result.calls || {};
      const calls = Object.values(allCalls);

      const today = new Date().toDateString();
      const thisMonth = new Date().getMonth();
      const thisYear = new Date().getFullYear();

      const todaysCalls = calls.filter(call => {
        const callDate = new Date(call.startTime).toDateString();
        return callDate === today;
      });

      const monthCalls = calls.filter(call => {
        const callDate = new Date(call.startTime);
        return callDate.getMonth() === thisMonth && callDate.getFullYear() === thisYear;
      });

      const todayEarnings = todaysCalls.reduce((sum, call) => sum + (call.earnings || 0), 0);
      const monthEarnings = monthCalls.reduce((sum, call) => sum + (call.earnings || 0), 0);

      const todayEarningsEl = document.getElementById('today-earnings');
      const monthEarningsEl = document.getElementById('month-earnings');
      const totalCallsEl = document.getElementById('total-calls');

      if (todayEarningsEl) {
        todayEarningsEl.textContent = `Today: ${todayEarnings.toFixed(2)}`;
      }
      if (monthEarningsEl) {
        monthEarningsEl.textContent = `This Month: ${monthEarnings.toFixed(2)}`;
      }
      if (totalCallsEl) {
        totalCallsEl.textContent = `Calls Today: ${todaysCalls.length}`;
      }
    } catch (error) {
      console.error('Error updating injected stats:', error);
    }
  }
}

// Initialize the tracker when the page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new CallTracker();
  });
} else {
  new CallTracker();
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getStatus') {
    const statusElement = document.getElementById('span-agentstatus-text');
    const status = statusElement ? statusElement.textContent.trim() : 'Unknown';
    sendResponse({ status });
  }
});