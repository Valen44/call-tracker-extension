import { Card } from "@/components/ui/card"
import { type CallStats } from "@/types/Call"
import dateService from "@/services/dateService"

export const StatsCard = ({stats, todayTotalEarnings}: {stats: CallStats, todayTotalEarnings: number}) => {
  return (
    <Card className="flex flex-wrap justify-between p-2.5 text-center h-32 gap-x-1 mb-3">
        <div className="stat">
          <h1 className="stat-value">{stats.totalCalls || "-"}</h1>
          <p className="stat-label"># Calls</p>
        </div>
        <div className="stat">
          <h1 className="stat-value">{dateService.formatDuration(stats.totalTime) || "-"}</h1>
          <p className="stat-label">In-Call Time</p>
        </div>
        <div className="stat">
          <h1 className="stat-value">${stats.totalEarnings.toFixed(2) || "-"}</h1>
          <p className="stat-label">Today</p>
        </div>
        <div className="stat">
          <h1 className="stat-value">${stats.avgHourlyRate.toFixed(2) || "-"}</h1>
          <p className="stat-label">Avg $/H</p>
        </div>
        <div className="stat">
          <h1 className="stat-value">${todayTotalEarnings.toFixed(2) || "-"}</h1>
          <p className="stat-label">Today Total</p>
        </div>
        <div className="stat">
          <h1 className="stat-value">{dateService.formatDuration(stats.avgAvailableTime) || "-"}</h1>
          <p className="stat-label">Avg Avail</p>
        </div>    
      </Card>
  )
}
