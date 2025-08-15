import React from 'react'
import DashboardLayoutCard from './DashboardLayoutCard'
import { dashboardCardData } from '../_data/staticData'

const DashboardCards = () => {
  return (
    <div className="hidden md:flex gap-4 ">
      {dashboardCardData.map((card, index) => (
        <DashboardLayoutCard
          key={index}
          count={card.count}
          label={card.label}
          icon={card.icon}
          subText={card.subText}
          backgroundColor={card.backgroundColor}
          borderColor={card.borderColor}
          textColor={card.textColor}
          isDown={card.isDown}
        />
      ))}
    </div>
  )
}

export default DashboardCards
