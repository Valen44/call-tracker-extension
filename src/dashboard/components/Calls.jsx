import React, { useEffect, useState } from 'react'
import utilsService from '../../services/utilsService';
import callService from '../../services/callService';

const periodLabels = { today: "Today", week: "This Week", month: "This Month", allTime: "All", custom: "Custom Range" };

export const Calls = ({ filter }) => {
  const [calls, setCalls] = useState([]);
  const [stats, setStats] = useState({
    totalCalls: 0,
    totalEarnings: 0.0,
    totalTime: 0,
    avgHourlyRate: 0.0,
    avgCallTime: 0.0,
    avgAvailableTime: 0.0
  });

  useEffect(() => {
    callService.filterCalls(filter).then((calls) => {
      setCalls(calls);
      setStats(callService.calculateStats(calls));
    })
  }, [filter]);

  return (
    <>
      <div className="col-lg-7">
        <section className="bg-white p-4 rounded shadow h-100">
          <h2 className="text-success">
            Calls ({periodLabels[filter.period]})
          </h2>
          <div className="row row-cols-2 row-cols-md-3 text-center bg-light rounded py-3 mb-3">
            <div className="col">
              <small className="text-muted">Total Calls:</small>
              <div className="text-success fw-bold">{stats.totalCalls}</div>
            </div>
            <div className="col">
              <small className="text-muted">Total Earnings:</small>
              <div className="text-success fw-bold">{stats.totalEarnings.toFixed(2)}</div>
            </div>
            <div className="col">
              <small className="text-muted">Total Time:</small>
              <div className="text-success fw-bold">{utilsService.formatDuration(stats.totalTime)}</div>
            </div>
            <div className="col">
              <small className="text-muted">Average Call:</small>
              <div className="text-success fw-bold">{utilsService.formatDuration(stats.avgCallTime)}</div>
            </div>
            <div className="col">
              <small className="text-muted">Average Available:</small>
              <div className="text-success fw-bold">{utilsService.formatDuration(stats.avgAvailableTime)}</div>
            </div>
            <div className="col">
              <small className="text-muted">Average Hrly Rate:</small>
              <div className="text-success fw-bold">${stats.avgHourlyRate.toFixed(2)}</div>
            </div>
          </div>
          <div className="table-responsive" style={{ maxHeight: "400px"}}>
            <table className="table table-striped text-center">
              <thead className="table-success sticky-top">
                <tr id="headerTable">
                  <th>Date</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Duration</th>
                  <th>Earnings</th>
                  <th>Avail</th>
                  {/* <th className="d-none" id="deleteCol">Delete</th> */}
                </tr>
              </thead>
              <tbody id="callsTableBody">
                { 
                  calls.map((call) => {
                    return (
                    <tr key={call.id}>
                      <td>{utilsService.formatDate(call.startTime)}</td>
                      <td>{utilsService.formatTime(call.startTime)}</td>
                      <td>{utilsService.formatTime(call.endTime)}</td>
                      <td>{utilsService.formatDuration(call.duration)}</td>
                      {call.serviced ?
                        <td>${call.earnings.toFixed(2)}</td>
                        :
                        <td className="text-danger">NS</td>
                      }
                      
                      <td>{utilsService.formatDuration(call.avail) || "-"}</td>
                    </tr>
                  )})
                }
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  )
}
