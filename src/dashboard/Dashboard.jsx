import React from 'react';
import callService from "../services/callService.js";

import "./css/dashboard.css";
import { useEffect, useState } from 'react';
import { Card } from './components/Card.jsx';
import { Filter } from './components/Filter.jsx';
import { Calls } from './components/Calls.jsx';

const statsBlank = {
  totalCalls: 0,
  totalEarnings: 0.0,
  totalTime: 0,
  avgHourlyRate: 0.0,
  avgCallTime: 0.0,
  avgAvailableTime: 0.0
}

export const Dashboard = () => {
  const [callsFilter, setCallsFilter] = useState({
    period: "today",
    startDate: "",
    endDate: "",
  });

  const [statsHeader, setStatsHeader] = useState({ today: statsBlank, month: statsBlank, allTime: statsBlank });

  useEffect(() => {
    getCalls();
  }, [])

  const getCalls = async () => {
    try {
      const [allTimeCalls, monthCalls, todayCalls] = await Promise.all([
        callService.filterCalls({ period: "allTime" }),
        callService.filterCalls({ period: "month" }),
        callService.filterCalls({ period: "today" })
      ]);

      const updatedStats = {
        allTime: callService.calculateStats(allTimeCalls),
        month: callService.calculateStats(monthCalls),
        today: callService.calculateStats(todayCalls)
      };

      setStatsHeader(prev => ({ ...prev, ...updatedStats }));
    } catch (error) {
      console.error("Error loading call data:", error);
    }
  };

  const filterCalls = (filter) => {
    setCallsFilter(filter);
  }

  return (
    <>
      <div className="container py-4">
        <header className="bg-white p-4 rounded shadow mb-4">
          <h1 className="text-center text-success mb-4">📞 Call Tracker Dashboard</h1>
          <div className="row g-3">
            <Card title={"Today"} earnings={statsHeader.today.totalEarnings.toFixed(2) || 0} totalCalls={statsHeader.today.totalCalls || 0} />
            <Card title={"This Month"} earnings={statsHeader.month.totalEarnings.toFixed(2) || 0} totalCalls={statsHeader.month.totalCalls || 0} />
            <Card title={"AllTime"} earnings={statsHeader.allTime.totalEarnings.toFixed(2) || 0} totalCalls={statsHeader.allTime.totalCalls || 0} />
          </div>
        </header>

        <section className="bg-white p-4 rounded shadow mb-4">
          <Filter filterCalls={filterCalls}></Filter>
        </section>

        <div className="row g-4">
        <Calls filter={callsFilter}></Calls>

        <div className="col-lg-5">
          <section className="bg-white p-4 rounded shadow h-100">
            <h2 className="text-success">Earnings Calendar</h2>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <button id="prevMonth" className="btn btn-outline-success btn-sm">&lt;</button>
              <strong id="currentMonth">January 2024</strong>
              <button id="nextMonth" className="btn btn-outline-success btn-sm">&gt;</button>
            </div>
            <div id="calendar" className="calendar">
              {/* <!-- calendar populated by JS --> */}
            </div>
            <div className="d-flex flex-wrap gap-3 justify-content-center mt-3">
              <div className="d-flex align-items-center gap-2">
                <div className="legend-color bg-light border"></div>
                <span>No calls</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <div className="legend-color bg-success-subtle"></div>
                <span>$0.01 - $5.00</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <div className="legend-color bg-success"></div>
                <span>$5.01 - $15.00</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <div className="legend-color bg-success text-white"></div>
                <span>$15.01+</span>
              </div>
            </div>
          </section>
        </div>
      </div>

      </div>

      
    </>
  )
}
