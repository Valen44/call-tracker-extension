import React from 'react'

export const Card = ({title, earnings, totalCalls}) => {
  return (
    <div className="col-md-4">
      <div className="card bg-success text-white text-center shadow">
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <h3>${earnings}</h3>
          <p>{totalCalls} calls</p>
        </div>
      </div>
    </div>
  )
}
