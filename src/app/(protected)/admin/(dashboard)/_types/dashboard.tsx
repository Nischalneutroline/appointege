import { ViewOption } from '@/components/shared/layout/view-tabs'

export const DEFAULT_DASHBOARD_FILTERS_VALUES: DashboardFilterValue[] = [
  'today',
  'this-week',
  'this-month',
  'this-year',
]

export type DashboardFilterLabel =
  | 'Today'
  | 'This week'
  | 'This month'
  | 'This year'

export type DashboardFilterValue =
  | 'today'
  | 'this-week'
  | 'this-month'
  | 'this-year'
  | 'all'

export interface DashboardFilterOption {
  value: DashboardFilterValue
  label: DashboardFilterLabel
  icon?: string // Icon name from Lucide icons
  textColor: string // Text color for the icon
}

export const dashboardTabOptions: DashboardFilterOption[] = [
  {
    value: 'today',
    label: 'Today',
    textColor: '#FF5733',
  },
  {
    value: 'this-week',
    label: 'This week',
    textColor: '#33FF57',
  },
  {
    value: 'this-month',
    label: 'This month',
    textColor: '#3357FF',
  },
  {
    value: 'this-year',
    label: 'This year',
    textColor: '#FF33A1',
  },
]
