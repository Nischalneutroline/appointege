'use client'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import Image from 'next/image'

const languages = [
  {
    code: 'en',
    label: 'Eng (US)',
    flag: '/flag/america.png',
  },
  { code: 'es', label: 'Esp (ES)', flag: '/flag/spain.png' },
  { code: 'fr', label: 'Fr (FR)', flag: '/flag/france.webp' },
  { code: 'in', label: 'In (IN)', flag: '/flag/india.webp' },
]

export default function LanguageSwitcher() {
  const [selectedLang, setSelectedLang] = useState(languages[0])
  const [open, setOpen] = useState(false)

  return (
    <div className="relative inline-block text-left h-full">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center space-x-3 rounded-md h-full bg-white text-gray-600  focus:outline-none"
      >
        <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
          <img
            src={selectedLang.flag}
            alt={selectedLang.code}
            className="w-full h-full object-cover"
          />
        </div>
        <span className="text-[#6B7280] text-base font-semibold">
          {selectedLang.label}
        </span>
        <ChevronDown className="w-4 h-4 text-[#6B7280] font-semibold" />
      </button>

      {open && (
        <div className=" flex flex-col absolute mt-2 w-36 rounded-[8px] shadow-lg bg-white border-[1px] border-[#E5E7EB] space-y-1  z-10 px-2 py-1">
          <ul className="py-1">
            {languages.map((lang) => (
              <li
                key={lang.code}
                onClick={() => {
                  setSelectedLang(lang)
                  setOpen(false)
                }}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer space-x-2 rounded-[8px]"
              >
                <div className="w-5 h-5 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                  <Image
                    src={lang.flag} // ✅ /flag/america.png
                    alt={lang.code}
                    className="w-full h-full object-cover"
                    width={20}
                    height={20}
                    priority
                    quality={80}
                  />
                </div>
                <span className="text-[#6B7280] text-base font-semibold">
                  {lang.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
