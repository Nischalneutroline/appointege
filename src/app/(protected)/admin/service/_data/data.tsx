import { CalendarDays, Clock, Users } from 'lucide-react'
import { Service, Status, WeekDays } from '../_types/service'

export type ServiceLabel = 'Active' | 'Inactive' | 'All'
export type ServiceValue = 'active' | 'inactive' | 'all'

export interface ServiceData {
  textColor: string
  count: number
  data: Service[]
  border: string
  background: string
  icon: React.ReactNode
}

export interface FilterServiceState extends ServiceData {
  label: ServiceLabel
  value: ServiceValue
}

export const filterServiceOptions = (
  service: Service[],
): FilterServiceState[] => {
  return [
    {
      label: 'Active',
      value: 'active',
      textColor: '#103064',
      count: service.filter((apt: Service) => apt.status === Status.ACTIVE)
        .length,
      data: service.filter((apt: Service) => apt.status === Status.ACTIVE),
      border: '#DCE9F9',
      background: '#E9F1FD',
      icon: <CalendarDays className="text-[#1C55B2]" size={24} />,
    },
    {
      label: 'Inactive',
      value: 'inactive',
      textColor: '#4C3000',
      count: service.filter((apt: Service) => apt.status === Status.INACTIVE)
        .length,
      data: service.filter((apt: Service) => apt.status === Status.INACTIVE),
      border: '#FFF3CD',
      background: '#FFF6E6',
      icon: <Clock className="text-[#4C3000]" size={24} />,
    },
    {
      label: 'All',
      value: 'all',
      textColor: '#103064',
      data: service,
      count: service.length,
      border: '#E9DFFF',
      background: '#F0EBFB',
      icon: <Users className="text-[#2D155B]" size={24} />,
    },
  ]
}

// export const serviceData: Service[] = [
//   {
//     id: '5bef6cda-5765-495f-acc3-470f1ffad183',
//     title: 'Probation officer',
//     description:
//       'Could drop expert hard how operation. Response maybe degree government rich light.',
//     estimatedDuration: 45,
//     status: Status.ACTIVE,
//     serviceAvailability: [
//       {
//         weekDay: WeekDays.TUESDAY,
//         timeSlots: [
//           { startTime: '1900-01-01T09:00:00', endTime: '1900-01-01T10:00:00' },
//           { startTime: '1900-01-01T09:00:00', endTime: '1900-01-01T10:00:00' },
//         ],
//       },
//       {
//         weekDay: WeekDays.THURSDAY,
//         timeSlots: [
//           { startTime: '1900-01-01T09:00:00', endTime: '1900-01-01T10:00:00' },
//         ],
//       },
//     ],
//     resourceId: '2f54a1e7-cec7-4299-978a-2017f1beee42',
//     createdAt: '2024-08-03T10:06:51',
//     updatedAt: '2025-04-11T17:25:39',
//     businessDetailId: 'cb40c063-40bd-49d5-bdf8-67afd917b580',
//   },
//   {
//     id: 'ba476ef0-783b-42d1-a5ec-bf8d9fc24538',
//     title: 'Technical author',
//     description:
//       'Well choice serve important direction. Have sit anything two there.',
//     estimatedDuration: 60,
//     status: Status.ACTIVE,
//     serviceAvailability: [
//       {
//         weekDay: WeekDays.WEDNESDAY,
//         timeSlots: [
//           { startTime: '1900-01-01T09:00:00', endTime: '1900-01-01T10:00:00' },
//         ],
//       },
//       {
//         weekDay: WeekDays.THURSDAY,
//         timeSlots: [
//           { startTime: '1900-01-01T09:00:00', endTime: '1900-01-01T10:00:00' },
//           { startTime: '1900-01-01T09:00:00', endTime: '1900-01-01T10:00:00' },
//         ],
//       },
//       {
//         weekDay: WeekDays.SUNDAY,
//         timeSlots: [
//           { startTime: '1900-01-01T09:00:00', endTime: '1900-01-01T10:00:00' },
//           { startTime: '1900-01-01T09:00:00', endTime: '1900-01-01T10:00:00' },
//         ],
//       },
//     ],
//     resourceId: '798ff58b-a2b9-4649-bb1b-fa7ebb18731a',
//     createdAt: '2025-04-05T21:22:34',
//     updatedAt: '2025-03-28T19:13:31',
//     businessDetailId: '623fbc2f-1fd3-45cb-8307-7dcc18c7cf5e',
//   },
//   {
//     id: '666adb28-7357-4602-afb9-87a3f5e2a661',
//     title: 'Printmaker',
//     description: 'Glass nearly half within. Road court staff enjoy.',
//     estimatedDuration: 45,
//     status: Status.ACTIVE,
//     serviceAvailability: [
//       {
//         weekDay: WeekDays.TUESDAY,
//         timeSlots: [
//           { startTime: '1900-01-01T09:00:00', endTime: '1900-01-01T10:00:00' },
//         ],
//       },
//       {
//         weekDay: WeekDays.FRIDAY,
//         timeSlots: [
//           { startTime: '1900-01-01T09:00:00', endTime: '1900-01-01T10:00:00' },
//         ],
//       },
//       {
//         weekDay: WeekDays.FRIDAY,
//         timeSlots: [
//           { startTime: '1900-01-01T09:00:00', endTime: '1900-01-01T10:00:00' },
//           { startTime: '1900-01-01T09:00:00', endTime: '1900-01-01T10:00:00' },
//         ],
//       },
//     ],
//     resourceId: 'bf7ead49-ede3-44d8-b37e-9629665476a3',
//     createdAt: '2025-05-01T03:56:02',
//     updatedAt: '2024-12-23T20:43:14',
//     businessDetailId: '22e070f2-f37d-42f5-82ab-e24f9b92c28a',
//   },
//   {
//     id: '3a9b4f52-3291-4e13-b9ce-bb54aadfe3cb',
//     title: 'Scientific laboratory technician',
//     description:
//       'Occur pay chance. Full include win up wear. Travel rather tell public personal.',
//     estimatedDuration: 30,
//     status: Status.ACTIVE,
//     serviceAvailability: [
//       {
//         weekDay: WeekDays.FRIDAY,
//         timeSlots: [
//           { startTime: '1900-01-01T09:00:00', endTime: '1900-01-01T10:00:00' },
//         ],
//       },
//       {
//         weekDay: WeekDays.THURSDAY,
//         timeSlots: [
//           { startTime: '1900-01-01T09:00:00', endTime: '1900-01-01T10:00:00' },
//         ],
//       },
//     ],
//     resourceId: '9122d23a-1f8f-4bb8-9df7-2f28aca98f9d',
//     createdAt: '2025-03-22T22:17:55',
//     updatedAt: '2025-01-12T17:59:21',
//     businessDetailId: '544cc789-915a-4489-a2d5-10be8bf20389',
//   },
//   {
//     id: '73594d4f-ab17-4547-a7db-99d560c94324',
//     title: 'Armed forces logistics/support/administrative officer',
//     description:
//       'Organization newspaper memory always produce new. Staff majority water consumer rest.',
//     estimatedDuration: 45,
//     status: Status.ACTIVE,
//     serviceAvailability: [
//       {
//         weekDay: WeekDays.FRIDAY,
//         timeSlots: [
//           { startTime: '1900-01-01T09:00:00', endTime: '1900-01-01T10:00:00' },
//         ],
//       },
//       {
//         weekDay: WeekDays.WEDNESDAY,
//         timeSlots: [
//           { startTime: '1900-01-01T09:00:00', endTime: '1900-01-01T10:00:00' },
//           { startTime: '1900-01-01T09:00:00', endTime: '1900-01-01T10:00:00' },
//         ],
//       },
//     ],
//     resourceId: '9a7057b4-df11-40b5-bf36-46fc302547bf',
//     createdAt: '2025-03-20T16:06:42',
//     updatedAt: '2025-04-23T12:04:18',
//     businessDetailId: '9710082b-e440-4bd4-a67f-657ae2f91220',
//   },
// ]
