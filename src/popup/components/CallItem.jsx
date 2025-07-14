import React from 'react'
import utilsService from '../../services/utilsService';

export const CallItem = ({call}) => {
    const durationStr = utilsService.formatDuration(call.duration);
    const earningsStr = (call.earnings !== null) ? `$${call.earnings.toFixed(2)}` : 'In progress...';
    
    const startTime = new Date(call.startTime);
    const startTimeStr = startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    let endTime;
    let endTimeStr;
    if (call.endTime) {
        endTime = new Date(call.endTime);
        endTimeStr = endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    return (
        <>
            <div className="call-item">
                <div>
                    <div className="call-time">{startTimeStr} {endTimeStr ? "- " + endTimeStr : ""}</div>
                    <div className="call-duration">{durationStr}</div>
                </div>
                <div className={call.serviced ? "call-earnings" : "call-notserviced"}>{call.serviced ? earningsStr : "NOT SERVICED"}</div>
            </div>
            {call.avail ? 
                <div className="call-separator">{utilsService.formatDuration(call.avail)}</div>
            :
                <div className="call-separator-empty"></div>
            }
        </>
    )
}
