import React from 'react'
import ProfileHeader from './_component/header'
import InfoBox from './_component/InfoIBox'
import { FaEnvelope, FaPhone, FaUser } from 'react-icons/fa'
import { Bell, ShieldAlert, User2 } from 'lucide-react'
import InfoItem from './_component/InfoItem'
const ProfilePage = () => {
  return (
    <div className="space-y-6">
      <ProfileHeader />
      <InfoBox header="Name" icon={User2}>
        <InfoItem label="Name" value="Jhon Smith" />
        <InfoItem label="Phone Number" value="9727272819" />
      </InfoBox>
      <InfoBox header="Notification Preference" icon={Bell}>
        <InfoItem label="Receive Email Notifications" value="Yes" />
        <InfoItem label="Receive SMS Notifications" value="No" />
      </InfoBox>
      <InfoBox header="Security Activity" icon={ShieldAlert}>
        <InfoItem label="Last Password Changed" value="Jun 1, 2025, 12:30 PM" />
        <InfoItem label="Last Login" value="Jun 8, 2025, 5:30 PM" />
      </InfoBox>
    </div>
  )
}

export default ProfilePage
