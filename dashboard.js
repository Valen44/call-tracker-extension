class CallTrackerDashboard {
    constructor() {
        this.allCalls = [];
        this.filteredCalls = [];
        this.currentMonth = new Date();
        this.dailyEarnings = {};
        this.init();
    }

    async init() {
        await this.loadAllCalls();
        this.setupEventListeners();
        this.setDefaultDates();
        this.applyFilter('today');
        this.generateCalendar();
        this.updateHeaderStats();
    }

    async loadAllCalls() {
        try {
            const result = await chrome.storage.local.get(['calls']);
            const calls = result.calls || {};
            this.allCalls = Object.values(calls).filter(call => call.endTime); // Only completed calls
            this.calculateDailyEarnings();
        } catch (error) {
            console.error('Error loading calls:', error);
        }
    }

    calculateDailyEarnings() {
        this.dailyEarnings = {};
        this.allCalls.forEach(call => {
            const date = new Date(call.startTime).toDateString();
            if (!this.dailyEarnings[date]) {
                this.dailyEarnings[date] = 0;
            }
            this.dailyEarnings[date] += call.earnings || 0;
        });
    }

    setupEventListeners() {
        // Date filter controls
        document.getElementById('filterBtn').addEventListener('click', () => {
            this.applyDateRangeFilter();
        });

        document.getElementById('resetBtn').addEventListener('click', () => {
            this.resetFilters();
        });

        // Quick filter buttons
        document.querySelectorAll('.quick-filter').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.applyFilter(e.target.dataset.period);
                this.updateActiveFilter(e.target);
            });
        });

        // Calendar controls
        document.getElementById('prevMonth').addEventListener('click', () => {
            this.currentMonth.setMonth(this.currentMonth.getMonth() - 1);
            this.generateCalendar();
        });

        document.getElementById('nextMonth').addEventListener('click', () => {
            this.currentMonth.setMonth(this.currentMonth.getMonth() + 1);
            this.generateCalendar();
        });

        // Export and clear data
        document.getElementById('exportCsv').addEventListener('click', () => {
            this.exportToCSV();
        });

        document.getElementById('clearAllData').addEventListener('click', () => {
            this.clearAllData();
        });
    }

    setDefaultDates() {
        const today = new Date();
        const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        
        document.getElementById('startDate').value = startDate.toISOString().split('T')[0];
        document.getElementById('endDate').value = today.toISOString().split('T')[0];
    }

    updateActiveFilter(activeBtn) {
        document.querySelectorAll('.quick-filter').forEach(btn => {
            btn.classList.remove('active');
        });
        activeBtn.classList.add('active');
    }

    applyFilter(period) {
        const now = new Date();
        let startDate, endDate;

        switch (period) {
            case 'today':
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
                break;
            case 'week':
                const weekStart = new Date(now);
                weekStart.setDate(now.getDate() - now.getDay());
                startDate = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate());
                endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
                break;
            case 'month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
                break;
            case 'all':
                startDate = new Date(0);
                endDate = new Date();
                break;
        }

        this.filteredCalls = this.allCalls.filter(call => {
            const callDate = new Date(call.startTime);
            return callDate >= startDate && callDate <= endDate;
        });

        this.updateDisplay(period);
    }

    applyDateRangeFilter() {
        const startDate = new Date(document.getElementById('startDate').value);
        const endDate = new Date(document.getElementById('endDate').value);
        endDate.setHours(23, 59, 59);

        this.filteredCalls = this.allCalls.filter(call => {
            const callDate = new Date(call.startTime);
            return callDate >= startDate && callDate <= endDate;
        });

        document.querySelectorAll('.quick-filter').forEach(btn => {
            btn.classList.remove('active');
        });

        this.updateDisplay('Custom Range');
    }

    resetFilters() {
        this.setDefaultDates();
        this.applyFilter('today');
        this.updateActiveFilter(document.querySelector('[data-period="today"]'));
    }

    updateDisplay(periodLabel) {
        document.getElementById('periodLabel').textContent = `(${periodLabel})`;
        this.updatePeriodStats();
        this.updateCallsTable();
    }

    updatePeriodStats() {
        const totalCalls = this.filteredCalls.length;
        const totalEarnings = this.filteredCalls.reduce((sum, call) => sum + (call.earnings || 0), 0);
        const totalDuration = this.filteredCalls.reduce((sum, call) => sum + call.duration, 0);
        const avgDuration = totalCalls > 0 ? totalDuration / totalCalls : 0;

        document.getElementById('periodCalls').textContent = totalCalls;
        document.getElementById('periodEarnings').textContent = `${totalEarnings.toFixed(2)}`;
        document.getElementById('periodTime').textContent = this.formatDuration(totalDuration);
        document.getElementById('avgCall').textContent = this.formatDuration(avgDuration);
    }

    updateCallsTable() {
        const tbody = document.getElementById('callsTableBody');
        
        if (this.filteredCalls.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="loading">No calls found for this period</td></tr>';
            return;
        }

        // Sort calls by start time (most recent first)
        const sortedCalls = [...this.filteredCalls].sort((a, b) => 
            new Date(b.startTime) - new Date(a.startTime)
        );

        let html = '';
        sortedCalls.forEach(call => {
            const startTime = new Date(call.startTime);
            const endTime = new Date(call.endTime);
            
            html += `
                <tr>
                    <td>${startTime.toLocaleDateString()}</td>
                    <td>${startTime.toLocaleTimeString()}</td>
                    <td>${endTime.toLocaleTimeString()}</td>
                    <td>${this.formatDuration(call.duration)}</td>
                    <td>${call.serviced ? (call.earnings || 0).toFixed(2) : "NS"}</td>
                </tr>
            `;
        });

        tbody.innerHTML = html;
    }

    updateHeaderStats() {
        const today = new Date().toDateString();
        const thisMonth = new Date().getMonth();
        const thisYear = new Date().getFullYear();

        const todaysCalls = this.allCalls.filter(call => 
            new Date(call.startTime).toDateString() === today
        );

        const monthCalls = this.allCalls.filter(call => {
            const callDate = new Date(call.startTime);
            return callDate.getMonth() === thisMonth && callDate.getFullYear() === thisYear;
        });

        const todayEarnings = todaysCalls.reduce((sum, call) => sum + (call.earnings || 0), 0);
        const monthEarnings = monthCalls.reduce((sum, call) => sum + (call.earnings || 0), 0);
        const totalEarnings = this.allCalls.reduce((sum, call) => sum + (call.earnings || 0), 0);

        document.getElementById('todayEarnings').textContent = `${todayEarnings.toFixed(2)}`;
        document.getElementById('todayCalls').textContent = `${todaysCalls.length} calls`;
        
        document.getElementById('monthEarnings').textContent = `${monthEarnings.toFixed(2)}`;
        document.getElementById('monthCalls').textContent = `${monthCalls.length} calls`;
        
        document.getElementById('totalEarnings').textContent = `${totalEarnings.toFixed(2)}`;
        document.getElementById('totalCalls').textContent = `${this.allCalls.length} calls`;
    }

    generateCalendar() {
        const calendar = document.getElementById('calendar');
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        document.getElementById('currentMonth').textContent = 
            `${monthNames[this.currentMonth.getMonth()]} ${this.currentMonth.getFullYear()}`;

        let html = '';
        
        // Add day headers
        dayNames.forEach(day => {
            html += `<div class="calendar-header">${day}</div>`;
        });

        // Get first day of month and number of days
        const firstDay = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 1);
        const lastDay = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        // Generate 42 days (6 weeks)
        for (let i = 0; i < 42; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);
            
            const dateString = currentDate.toDateString();
            const isCurrentMonth = currentDate.getMonth() === this.currentMonth.getMonth();
            const isToday = dateString === new Date().toDateString();
            const earnings = this.dailyEarnings[dateString] || 0;
            
            let dayClass = 'calendar-day';
            if (!isCurrentMonth) dayClass += ' other-month';
            if (isToday) dayClass += ' today';
            
            // Add earnings-based classes
            if (earnings === 0) {
                dayClass += ' no-calls';
            } else if (earnings <= 5) {
                dayClass += ' low-earnings';
            } else if (earnings <= 15) {
                dayClass += ' medium-earnings';
            } else {
                dayClass += ' high-earnings';
            }

            html += `
                <div class="${dayClass}" title="${earnings.toFixed(2)}">
                    <div class="day-number">${currentDate.getDate()}</div>
                    ${earnings > 0 ? `<div class="day-earnings">${earnings.toFixed(2)}</div>` : ''}
                </div>
            `;
        }

        calendar.innerHTML = html;
    }

    formatDuration(seconds) {
        if (seconds < 60) {
            return `${Math.round(seconds)}s`;
        } else if (seconds < 3600) {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = Math.round(seconds % 60);
            return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
        } else {
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            return `${hours}h ${minutes}m`;
        }
    }

    exportToCSV() {
        const headers = ['Date', 'Start Time', 'End Time', 'Duration (seconds)', 'Earnings'];
        const csvData = [headers];

        this.filteredCalls
            .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
            .forEach(call => {
                const startTime = new Date(call.startTime);
                const endTime = new Date(call.endTime);
                
                csvData.push([
                    startTime.toLocaleDateString(),
                    startTime.toLocaleTimeString(),
                    endTime.toLocaleTimeString(),
                    call.duration,
                    (call.earnings || 0).toFixed(2)
                ]);
            });

        const csvContent = csvData.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `call-tracker-export-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }

    async clearAllData() {
        if (confirm('Are you sure you want to clear all call data? This cannot be undone.')) {
            try {
                await chrome.storage.local.remove(['calls']);
                this.allCalls = [];
                this.filteredCalls = [];
                this.dailyEarnings = {};
                this.updateHeaderStats();
                this.updateDisplay('Today');
                this.generateCalendar();
                alert('All data cleared successfully!');
            } catch (error) {
                console.error('Error clearing data:', error);
                alert('Failed to clear data. Please try again.');
            }
        }
    }
}

// Initialize the dashboard when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CallTrackerDashboard();
});