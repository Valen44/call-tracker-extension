const HTML = `
    <div id="tracker" class="tracker">
        <header id="tracker-header" class="tracker-header">
        <h1>LSA CALL TRACKER</h1>
        <div id="tracker-timer" class="tracker-timer"></div>
        </header>
        <main class="tracker-body">
        <div class="stat-grid">
            <div class="tracker-stat">
            <span id="total-calls" class="stat-value">00</span>
            <span class="stat-label">Calls</span>
            </div>
            <div class="tracker-stat">
            <span id="today-earnings" class="stat-value">$00.00</span>
            <span class="stat-label">Today</span>
            </div>
            <div class="tracker-stat">
            <span id="hourly-rate"class="stat-value">$0.00</span>
            <span class="stat-label">Hourly Rate</span>
            </div>
            <div class="tracker-stat">
            <span id="month-earnings" class="stat-value">$000.00</span>
            <span class="stat-label">This Month</span>
            </div>
        </div>
        </main>
    </div>
`;

const CSS = `
    .tracker {
    min-width: 350px;
    border: 2px solid #000;
    background-color: #fff;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    position: fixed;
    top: 100px; /* starting position */
    left: 100px;
    z-index: 9999;
    cursor: move;
    }

    .tracker-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #99d47c;
    padding: 12px 16px;
    font-weight: bold;
    color: #000;
    }

    .onCall {
        background-color: #e8b17c  !important;
    }

    .tracker-header h1 {
    font-size: 16px;
    margin: 0;
    }

    .tracker-timer {
    font-size: 15px;
    }

    .tracker-body {
    padding: 20px;
    }

    .stat-grid {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    }


    .tracker-stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    text-align: center;
    padding-bottom: 30px;
    }

    .stat-value {
    font-size: 24px;
    font-weight: bold;
    color: #4caf50;
    margin-top: auto;
    margin-bottom: auto;
    }

    .stat-label {
    font-size: 12px;
    color: #666;
    margin-top: 5px;
    width: max-content;
    white-space: normal;
    position: absolute;
    bottom: 0;
    }

    `;

export default {HTML, CSS}