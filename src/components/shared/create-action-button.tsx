import React from 'react'
import { Button } from '../ui/button'
import { Plus } from 'lucide-react'

interface CreateButtonProps {
  label: string
  onClick: () => void
}

const CreateButton = ({ label, onClick }: CreateButtonProps) => {
  return (
    <Button
      className="w-40 gap-1 px-3 py-2 min-h-10 bg-[#4F7CFF] hover:bg-[#246FE8] hover:scale-105 transform duration-300 rounded-[8px] shadow-[inset_1px_3px_6px_rgba(255,255,255,0.2),inset_1px_-2px_6px_rgba(0,0,0,0.2)]"
      onClick={onClick}
    >
      <div>
        <Plus strokeWidth={2.5} size={16} />
      </div>
      <div className="h-fit">{label}</div>
    </Button>
  )
}

export default CreateButton
