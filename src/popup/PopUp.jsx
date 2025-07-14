/* eslint-disable no-undef */
import { useEffect, useState } from 'react'
import { CallItem } from './components/CallItem.jsx';
import callService from '../services/callService.js';
import utilsService from '../services/utilsService.js';

function PopUp() {
  const [status, setStatus] = useState("Available")
  const [stats, setStats] = useState({
    totalCalls: 0,
    totalEarnings: 0.0,
    totalTime: 0,
    avgHourlyRate: 0.0
  })
  const [calls, setCalls] = useState([])

  useEffect(() => {
    callService.filterCalls({period: "today"}).then((calls) => {
      calls.reverse();
      setCalls(calls);
      const stats = callService.calculateStats(calls);
      setStats(stats);
      checkCurrentStatus();
    });
  }, []);

  const openDashboard = () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('src/dashboard/dashboard.html') });
  }

  const checkCurrentStatus = async () => {
    try {
      // Try to get current status from the active tab
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      const currentTab = tabs[0];
      
      if (currentTab && ['https://valen44.github.io/', 'https://agent.lsaweb.com/agent'].includes(currentTab.url)) {
        // We're on the agent page, try to get current status
        chrome.tabs.sendMessage(currentTab.id, { action: 'getStatus' }, (response) => {
          if (response && response.status) {
            setStatus(response.status);
          }
        });
      } else {
        // Not on the agent page
        setStatus('Not on agent page');
      }
    } catch (error) {
      console.error('Error checking current status:', error);
      setStatus('Unknown');
    }
  }

  return (
    <>
      <body>
    <div className="header">
      <h1>📞 LSA Call Tracker</h1>
    </div>

    <div className={`current-status ${status === "On-Call" ? "status-oncall" : "status-available"}`}>
      {status}
    </div>

    <div className="stats">
      <div className="stat">
        <div className="stat-number">{stats.totalCalls}</div>
        <div className="stat-label">Calls Today</div>
      </div>
      <div className="stat">
        <div className="stat-number">${stats.totalEarnings.toFixed(2)}</div>
        <div className="stat-label">Earned Today</div>
      </div>
      <div className="stat">
        <div className="stat-number">{utilsService.formatDuration(stats.totalTime)}</div>
        <div className="stat-label">Total Time</div>
      </div>
      <div className="stat">
        <div className="stat-number">${stats.avgHourlyRate.toFixed(2)}</div>
        <div className="stat-label">Hrly Rate</div>
      </div>
    </div>

    <div className="calls-container">
      <div className="calls-header">Today's Calls</div>
      {calls.length > 0 ? calls.map((call) => (
        <CallItem key={call.id} call={call}></CallItem>
      )) : <div class="no-calls">No calls today</div>}
    </div>

    <div className="buttons">
      <button className="dashboard-btn" id="dashboardBtn" onClick={() => openDashboard()}>📊 Open Dashboard</button>
    </div>

    <script src="popup.js"></script>
  </body>
    </>
  )
}

export default PopUp
