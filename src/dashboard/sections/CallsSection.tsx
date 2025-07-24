import { columns } from '../components/call-table/columns';
import { DataTable } from '../components/call-table/data-table';
import { type Call } from "@/types/Call"
import { Card, CardContent } from "@/components/ui/card";
import dateService from "@/services/dateService";
import callService from "@/services/callService";



export const CallsSection = ({calls} : {calls: Call[]}) => {

  const stats = callService.calculateStats(calls);

  return (
    <div className="mb-6">
        <div>
          <Card className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 p-6  mb-3">
                  <div className="stat">
                    <h1 className="stat-value">{stats.totalCalls}</h1>
                    <p className="stat-label"># Calls</p>
                  </div>
                  <div className="stat">
                    <h1 className="stat-value">${stats.totalEarnings.toFixed(2)}</h1>
                    <p className="stat-label">Earned</p>
                  </div>
                  <div className="stat">
                    <h1 className="stat-value">{dateService.formatDuration(stats.totalTime) || "-"}</h1>
                    <p className="stat-label">In-Call Time</p>
                  </div>
                  <div className="stat">
                    <h1 className="stat-value">${stats.avgHourlyRate.toFixed(2)}</h1>
                    <p className="stat-label">Avg $/H</p>
                  </div>
                  <div className="stat">
                    <h1 className="stat-value">{dateService.formatDuration(stats.avgCallTime) || "-"}</h1>
                    <p className="stat-label">Avg Call Time</p>
                  </div>
                  <div className="stat">
                    <h1 className="stat-value">{dateService.formatDuration(stats.avgAvailableTime) || "-"}</h1>
                    <p className="stat-label">Avg Avail</p>
                  </div>    
                </Card>
        </div>

        <div>
            <DataTable columns={columns} data={calls}></DataTable>
        </div>
    </div>
  )
}
