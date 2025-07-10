class CallTrackerPopup {
  constructor() {
    this.init();
  }

  async init() {
    await this.loadTodaysCalls();
    this.setupEventListeners();
    this.checkCurrentStatus();
  }

  async loadTodaysCalls() {
    try {
      const result = await chrome.storage.local.get(['calls']);
      const allCalls = result.calls || {};
      
      const today = new Date().toDateString();
      const todaysCalls = Object.values(allCalls).filter(call => {
        const callDate = new Date(call.startTime).toDateString();
        return callDate === today;
      });

      this.displayCalls(todaysCalls);
      this.updateStats(todaysCalls);
    } catch (error) {
      console.error('Error loading calls:', error);
      this.showError('Failed to load calls');
    }
  }

  displayCalls(calls) {
    const callsList = document.getElementById('callsList');
    
    if (calls.length === 0) {
      callsList.innerHTML = '<div class="no-calls">No calls today</div>';
      return;
    }

    // Sort calls by start time (most recent first)
    calls.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));

    let html = '';
    calls.forEach(call => {
      const durationStr = this.formatDuration(call.duration);
      const earningsStr = (call.earnings !== null) ? `$${call.earnings.toFixed(2)}` : 'In progress...';
      
      const startTime = new Date(call.startTime);
      const startTimeStr = startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      let endTime;
      let endTimeStr;
      if (call.endTime) {
        endTime = new Date(call.endTime);
        endTimeStr = endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      
      
      
      html += `
        <div class="call-item">
          <div>
            <div class="call-time">${startTimeStr} ${endTimeStr ? "- " + endTimeStr : ""}</div>
            <div class="call-duration">${durationStr}</div>
          </div>
          <div class="${call.serviced ? "call-earnings" : "call-notserviced"}">${call.serviced ? earningsStr : "NOT SERVICED"}</div>
        </div>
        ${call.avail ? 
            `<div class="call-separator">${this.formatDuration(call.avail)}</div>`
          : `<div class="call-separator-empty"></div>`
        }
      `;
    });

    callsList.innerHTML = html;
  }

  updateStats(calls) {
    const totalCalls = calls.length;
    const totalEarnings = calls.reduce((sum, call) => sum + (call.earnings || 0), 0);
    const totalDuration = calls.reduce((sum, call) => sum + call.duration, 0);
    const totalAvail = calls.reduce((sum, call) => call.avail ? sum + call.avail : sum + 0, 0);
    const avgHourlyRate = totalDuration / (totalDuration + totalAvail) * 0.15 * 60

    document.getElementById('totalCalls').textContent = totalCalls;
    document.getElementById('totalEarnings').textContent = `$${totalEarnings.toFixed(2)}`;
    document.getElementById('avgHourlyRate').textContent = avgHourlyRate ? `$${avgHourlyRate.toFixed(2)}` : "-";
    document.getElementById('totalTime').textContent = totalDuration ? this.formatDuration(totalDuration) : "";
  }

  formatDuration(seconds) {
    if (seconds === 0) {
      return ``;
    } else if (seconds < 60) {
      return `${seconds}s`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return `${hours}h ${minutes}m`;
    }
  }

  async checkCurrentStatus() {
    try {
      // Try to get current status from the active tab
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      const currentTab = tabs[0];
      
      if (currentTab && currentTab.url === 'https://agent.lsaweb.com/agent') {
        // We're on the agent page, try to get current status
        chrome.tabs.sendMessage(currentTab.id, { action: 'getStatus' }, (response) => {
          if (response && response.status) {
            this.updateStatusDisplay(response.status);
          }
        });
      } else {
        // Not on the agent page
        this.updateStatusDisplay('Not on agent page');
      }
    } catch (error) {
      console.error('Error checking current status:', error);
      this.updateStatusDisplay('Unknown');
    }
  }

  updateStatusDisplay(status) {
    const statusElement = document.getElementById('currentStatus');
    const isOnCall = status === 'On-Call';
    
    statusElement.textContent = `Status: ${status}`;
    statusElement.className = `current-status ${isOnCall ? 'status-oncall' : 'status-available'}`;
  }

  setupEventListeners() {
    document.getElementById('clearDataBtn').addEventListener('click', () => {
      this.clearAllData();
    });
    
    document.getElementById('dashboardBtn').addEventListener('click', () => {
      this.openDashboard();
    });
  }

  async clearAllData() {
    if (confirm('Are you sure you want to clear all call data? This cannot be undone.')) {
      try {
        await chrome.storage.local.remove(['calls']);
        this.loadTodaysCalls(); // Refresh the display
        alert('All data cleared successfully!');
      } catch (error) {
        console.error('Error clearing data:', error);
        alert('Failed to clear data. Please try again.');
      }
    }
  }

  openDashboard() {
    chrome.tabs.create({ url: chrome.runtime.getURL('./dashboard/dashboard.html') });
  }

  showError(message) {
    const callsList = document.getElementById('callsList');
    callsList.innerHTML = `<div class="no-calls">Error: ${message}</div>`;
  }
}

// Initialize the popup when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new CallTrackerPopup();
});