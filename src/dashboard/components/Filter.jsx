import React from "react";
import { useState } from "react";

export const Filter = ({ filterCalls }) => {
  const [filter, setFilter] = useState({
    period: "today",
    startDate: "",
    endDate: "",
  });

  const sendFilter = (filter) => {
    filterCalls(filter);
  };

  const quickFilter = (period) => {
    const quickFilter = {period: period, startDate: "", endDate: "" };
    sendFilter(quickFilter)

    resetFilter()
  }

  const resetFilter = (withSend=false) => {
    const resetFilter = { period: "today", startDate: "", endDate: "" };
    setFilter(resetFilter);
    
    if (withSend) sendFilter(resetFilter);
  };

  return (
    <>
      <h2 className="text-success mb-3">Filter Calls</h2>
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-end flex-wrap gap-3 justify-content-between">
        {/* <!-- Left side: Date inputs and Filter/Reset buttons --> */}
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-end gap-3">
          <div className="d-flex flex-column">
            <label className="form-label">From:</label>
            <input
              type="date"
              id="startDate"
              className="form-control"
              value={filter.startDate || ""}
              onChange={(e) =>
                setFilter({
                  ...filter,
                  period: "custom",
                  startDate: e.target.value,
                })
              }
            />
          </div>
          <div className="d-flex flex-column">
            <label className="form-label">To:</label>
            <input
              type="date"
              id="endDate"
              className="form-control"
              value={filter.endDate || ""}
              onChange={(e) =>
                setFilter({ ...filter, period: "custom", endDate: e.target.value })
              }
            />
          </div>
          <div className="d-flex gap-2">
            <button
              id="filterBtn"
              className="btn btn-success"
              onClick={() => sendFilter(filter)}
            >
              Filter
            </button>
            <button
              id="resetBtn"
              className="btn btn-secondary"
              onClick={() => resetFilter(true)}
            >
              Reset
            </button>
          </div>
        </div>

        {/* <!-- Right side: Quick filter buttons --> */}
        <div className="d-flex flex-wrap gap-2 justify-content-md-end">
          <button
            className="btn btn-outline-success quick-filter"
            data-period="today"
            onClick={() => quickFilter("today")}
          >
            Today
          </button>
          <button
            className="btn btn-outline-success quick-filter"
            data-period="week"
            onClick={() => quickFilter("week")}
          >
            This Week
          </button>
          <button
            className="btn btn-outline-success quick-filter"
            data-period="month"
            onClick={() => quickFilter("month")}
          >
            This Month
          </button>
          <button
            className="btn btn-outline-success quick-filter"
            data-period="all"
            onClick={() => quickFilter("allTime")}
          >
            All Time
          </button>
        </div>
      </div>
    </>
  );
};
