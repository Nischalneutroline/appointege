const REQUIRED_BOOKING_FIELDS = [
  'customerName',
  'email',
  'phone',
  'serviceName',
  'appointmentDate',
  'appointmentTime',
]

function getMissingBookingFields(fields: Record<string, any>): string[] {
  console.log('fields', fields)
  if (!fields) return [...REQUIRED_BOOKING_FIELDS]
  return REQUIRED_BOOKING_FIELDS.filter(
    (key) => !fields[key] || fields[key] === '',
  )
}

const EXAMPLE_VALUES: Record<string, string> = {
  customerName: 'Test Doe',
  email: 'test@gmail.com',
  phone: '977-9821321321',
  serviceName: 'Dental care',
  appointmentDate: '2025-07-09',
  appointmentTime: '09:00 AM',
}

function isCancellationAction(message: string): boolean {
  const cancelKeywords = [
    'cancel appointment',
    'cancel appointment',
    'delete appointment',
    'remove appointment',
    'drop appointment',
    'appointment cancellation',
  ]
  const lowerMsg = message.toLowerCase()
  return cancelKeywords.some((keyword) => lowerMsg.includes(keyword))
}

function isNegativeIntent(message: string): boolean {
  const negativePhrases: (string | RegExp)[] = [
    /do( not|n't)? (want|need)? ?(to )?(book|booking|booked|schedule|scheduling|scheduled|cancel|cancelling|cancelled)/,
    /dont (book|booking|booked|schedule|scheduling|scheduled|cancel|cancelling|cancelled)/,
    /don't (book|booking|booked|schedule|scheduling|scheduled|cancel|cancelling|cancelled)/,
    'cancel this process',
    'exit',
    'abort',
    'not now',
  ]
  const lowerMsg = message.toLowerCase()
  return negativePhrases.some((phrase) => {
    if (typeof phrase === 'string') {
      return lowerMsg.includes(phrase)
    } else {
      return phrase.test(lowerMsg)
    }
  })
}

//service discovery if they only want to list or view service
function isServiceDiscoveryQuery(message: string): boolean {
  const lowerMsg = message.toLowerCase()
  // Inquiry or listing intent
  const hasInquiryWord =
    /(list|show|view|see|display|what|which|are|available)/.test(lowerMsg)
  console.log('hasinquiry', hasInquiryWord)
  // Service context
  const hasServiceWord = /(service|services|appointment|appointments)/.test(
    lowerMsg,
  )
  console.log('hasServiceWord', hasServiceWord)
  // Not a booking/cancellation action
  const isNotBookingAction =
    /(booked|booking|cancel|cancelled|cancelling|appointment)/.test(lowerMsg) ||
    /available to book/.test(lowerMsg)
  console.log('isNotBookingAction', isNotBookingAction)

  return hasInquiryWord && hasServiceWord && isNotBookingAction
}

function getMissingCancellationFields(fields: Record<string, any>): string[] {
  const required = ['email']
  return required.filter((key) => !fields[key])
}

function getExampleForMissingFields(missingFields: string[]): string {
  if (!missingFields || missingFields.length === 0) return ''
  return missingFields
    .map((field) => EXAMPLE_VALUES[field])
    .filter(Boolean)
    .join(', ')
}

function isAppointmentAction(message: string): boolean {
  // Only matches booking/cancellation/reschedule actions
  const actionKeywords = [
    'book',
    'booking',
    'booked',
    'schedule',
    'scheduled',
    'scheduling',
    'reschedule',
    'rescheduled',
    'rescheduling',
    'cancel',
    'cancelled',
    'cancelling',
    'make an appointment',
  ]
  const lowerMsg = message.toLowerCase()

  // Check for keywords
  const hasActionKeyword = actionKeywords.some((keyword) =>
    lowerMsg.includes(keyword),
  )

  // New: check for field-like input (comma-separated or email/phone)
  const isLikelyBookingField =
    /@/.test(message) || // email
    /\d{10,}/.test(message) || // phone
    /\b\d{4}-\d{2}-\d{2}\b/.test(message) || // selectedDate: YYYY-MM-DD
    /\b\d{2}\/\d{2}\/\d{4}\b/.test(message) || // selectedDate: MM/DD/YYYY
    /\b\d{1,2}:\d{2}\b/.test(message) ||
    message.split(',').length >= 2 // multiple fields

  return hasActionKeyword || isLikelyBookingField
}

export {
  isServiceDiscoveryQuery,
  isAppointmentAction,
  getExampleForMissingFields,
  getMissingCancellationFields,
  isNegativeIntent,
  isCancellationAction,
  getMissingBookingFields,
}
