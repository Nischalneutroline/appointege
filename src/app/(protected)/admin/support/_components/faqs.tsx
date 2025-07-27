'use client'

import { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import { ChevronDown, Plus, RefreshCcw, SquarePen, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import FilterTabs from '@/components/shared/layout/filter-tabs'
import SearchBar from '@/components/shared/layout/search-bar'
import FilterDropdown from '@/components/shared/layout/filter-dropdown'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'

import { capitalizeFirstChar } from '@/utils/utils'
import FaqFormModal from './faqmodalform'
import { closeFaqForm, FilterOptionState, openFaqForm, setActiveFilter, setActiveFilters, setFaqs } from '@/store/slices/faqSlice'

// Types
export type FaqFilterValue = 'all' | 'public' | 'private'

export interface FAQItem {
  id: string
  question: string
  answer: string
  category?: FaqFilterValue
}

// Default data
const defaultFaqs: FAQItem[] = [
  {
    id: '1',
    question: 'How do I reschedule an appointment?',
    answer:
      'You can reschedule your appointment by going to the My Appointments section and selecting Reschedule next to the booking.',
    category: 'public',
  },
  {
    id: '2',
    question: 'Can I cancel after booking?',
    answer:
      'Yes, appointments can be canceled up to 24 hours in advance for a full refund.',
    category: 'public',
  },
  {
    id: '3',
    question: 'Is customer support available 24/7?',
    answer:
      'Customer support is available 9 AM - 6 PM from Monday to Saturday.',
    category: 'private',
  },
  {
    id: '4',
    question: 'What payment methods are accepted?',
    answer:
      'We accept Visa, MasterCard, American Express, and online wallets like PayPal and Stripe.',
    category: 'public',
  },
]

const DEFAULT_FAQ_FILTERS_VALUES: FaqFilterValue[] = [
  'all',
  'public',
  'private',
]

const createFilterOptions = (faqs: FAQItem[]) => {
  const filters: FilterOptionState[] = [
    {
      label: 'All',
      value: 'all',
      textColor: '#103064',
      border: '#E9DFFF',
      background: '#F0EBFB',
      icon: 'Users',
    },
    {
      label: 'Public',
      value: 'public',
      textColor: '#0F5327',
      border: '#E6F4EC',
      background: '#E9F9EF',
      icon: 'Eye',
    },
    {
      label: 'Private',
      value: 'private',
      textColor: '#7F1D1D',
      border: '#FEE2E2',
      background: '#FEF2F2',
      icon: 'EyeOff',
    },
  ]

  return filters.map((option) => ({
    ...option,
    count: faqs.filter(
      (faq) => option.value === 'all' || faq.category === option.value,
    ).length,
  }))
}

export default function FaqSection() {
  const dispatch = useDispatch<AppDispatch>()
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null)

  const {
    faqs: storeFaqs = [],
    activeFilters = DEFAULT_FAQ_FILTERS_VALUES,
    isFaqFormOpen,
    currentFaq,
    faqFormMode,
  } = useSelector((state: RootState) => state.faq)

  useEffect(() => {
    if (storeFaqs.length === 0) {
      dispatch(setFaqs(defaultFaqs))
    }
  }, [dispatch, storeFaqs.length])

  const allFaqs = storeFaqs.length > 0 ? storeFaqs : defaultFaqs

  const filteredFaqs = useMemo(() => {
    return allFaqs.filter((faq) => {
      const matchesSearch =
        searchQuery === '' ||
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory =
        activeFilters.includes('all') ||
        activeFilters.includes(faq.category as FaqFilterValue)

      return matchesSearch && matchesCategory
    })
  }, [allFaqs, searchQuery, activeFilters])

  const enrichedFilterOptions = useMemo(
    () => createFilterOptions(allFaqs),
    [allFaqs],
  )

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  const handleRefresh = useCallback(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current)
    setIsRefreshing(true)
    debounceTimeout.current = setTimeout(() => {
      dispatch(setFaqs(defaultFaqs)) // Simulate refresh
      setIsRefreshing(false)
    }, 800)
  }, [dispatch])

  const handleOpenCreateForm = () => {
    dispatch(openFaqForm({ mode: 'create' }))
  }

  const handleOpenEditForm = (faq: FAQItem) => {
    dispatch(openFaqForm({ mode: 'edit', faq }))
  }

  const handleCloseForm = () => {
    dispatch(closeFaqForm())
  }

  return (
    <>
      <div className="flex justify-between items-center w-full">
        <div className="flex flex-col w-fit">
          <div className="text-lg md:text-xl font-semibold text-[#111827]">
            FAQ's
          </div>
          <div className="text-[#6B7280] text-xs md:text-base font-normal">
            Everything customers need to know about your business.
          </div>
        </div>
        <div>
          <Button className="active:scale-95" onClick={handleOpenCreateForm}>
            <Plus className="mr-2 h-4 w-4" />
            <span>Add Question</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:justify-between gap-2 w-full">
          <div
            className={cn(
              'w-full md:w-fit flex items-center gap-1 overflow-x-auto px-0.5 bg-[#FAFCFE] h-11 rounded-[10px] border border-[#E5E7EB]',
              'scrollbar-thin scrollbar-track-gray-300 scrollbar-thumb-gray-500',
            )}
          >
            {enrichedFilterOptions.map((option, index) => (
              <FilterTabs
                key={index}
                {...option}
                sliceName="faq"
                onDispatch={(filter: string) =>
                  dispatch(setActiveFilter(option.value as FaqFilterValue))
                }
              />
            ))}
          </div>

          <div className="flex gap-2 min-w-1/4 lg:gap-3 justify-between">
            <SearchBar
              className="bg-white rounded-[8px]"
              placeholder="Search FAQs"
              width="w-full max-w-[530px]"
              onSearch={(value) => setSearchQuery(value)}
            />
            <div className="flex gap-3 justify-end">
              <FilterDropdown<FaqFilterValue>
                filterOptions={enrichedFilterOptions}
                activeFilters={activeFilters}
                defaultFilters={DEFAULT_FAQ_FILTERS_VALUES}
                sliceName="faq"
                onDispatch={{ setActiveFilter, setActiveFilters }}
              />
              <div
                className={cn(
                  'flex items-center justify-center text-[#7285BD] cursor-pointer hover:rotate-90 transition duration-700 hover:scale-110',
                  isRefreshing && 'animate-spin',
                )}
                onClick={handleRefresh}
                aria-label={isRefreshing ? 'Refreshing FAQs' : 'Refresh FAQs'}
                aria-busy={isRefreshing}
              >
                <RefreshCcw strokeWidth={2.5} size={18} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {filteredFaqs.length === 0 ? (
            <div className="text-center text-sm text-gray-500 italic">
              No FAQs found.
            </div>
          ) : (
            filteredFaqs.map((faq, index) => (
              <div
                key={faq.id}
                className={cn(
                  'bg-white p-4 rounded-lg border border-gray-200 shadow-sm',
                  openIndex === index && 'bg-[#E9F1FD]',
                )}
              >
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggle(index)}
                >
                  <h4 className="font-medium text-gray-900">{faq.question}</h4>

                  <div className="flex gap-2 items-center">
                    {openIndex === index && (
                      <div className="text-[#6B7280] items-center flex gap-2">
                        <SquarePen
                          strokeWidth={2}
                          size={16}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleOpenEditForm(faq)
                          }}
                          className="transform translate-y-[1px] hover:text-blue-400 cursor-pointer"
                        />
                        <Trash2
                          strokeWidth={2}
                          size={17}
                          onClick={() => {}}
                          className="hover:text-red-400"
                        />
                      </div>
                    )}
                    <div className="text-[#367C39] text-xs font-medium">
                      {capitalizeFirstChar(faq.category as string)}
                    </div>
                    <ChevronDown
                      className={cn(
                        'transition-transform duration-300 w-4 h-4 text-[#6B7280]',
                        openIndex === index && 'rotate-180',
                      )}
                    />
                  </div>
                </div>
                {openIndex === index && (
                  <p className="mt-2 text-sm text-gray-700">{faq.answer}</p>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <FaqFormModal open={isFaqFormOpen} onChange={handleCloseForm} />
    </>
  )
}
