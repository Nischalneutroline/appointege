// components/Table.tsx
import React from 'react'

export interface TableColumn<T> {
  header: string
  accessor: keyof T
  render?: (value: T[keyof T], row: T, index: number) => React.ReactNode
  className?: string
}

export interface TableProps<T> {
  data: T[]
  columns: TableColumn<T>[]
  rowKey: keyof T
  rowClassName?: (row: T, index: number) => string
}

const DataTable = <T,>({
  data,
  columns,
  rowKey,
  rowClassName,
}: TableProps<T>) => {
  return (
    <table className="lg:min-w-full min-w-[600px] border-[1px] overflow-auto border-[#DCE9F9] ">
      <thead className="bg-[#F8F9FA] h-12 ">
        <tr className="border-0">
          {columns.map((col, idx) => (
            <th
              key={idx}
              className={`px-6 py-3 border-t-0 text-left text-sm font-semibold text-[#111827] tracking-wider ${
                col.className || ''
              }`}
            >
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white rounded-b-[10px]">
        {data.map((row, rowIndex) => (
          <tr
            key={String(row[rowKey])}
            className={`hover:bg-gray-50 bg-white transition h-16 ${
              rowClassName ? rowClassName(row, rowIndex) : ''
            }`}
          >
            {columns.map((col, colIndex) => (
              <td
                key={colIndex}
                className="px-6 py-4 whitespace-nowrap text-sm text-[#111827] cursor-pointer"
              >
                {col.render
                  ? col.render(row[col.accessor], row, rowIndex)
                  : (row[col.accessor] as string)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default DataTable

export interface TableColumn<T> {
  header: string
  accessor: keyof T
  render?: (value: T[keyof T], row: T, index: number) => React.ReactNode
  className?: string
}
