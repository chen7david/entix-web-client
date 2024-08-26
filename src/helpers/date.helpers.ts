import dayjs from 'dayjs'

export function getNextOccurrence(inputDate: string | Date) {
  const inputDay = dayjs(inputDate).day()
  const today = dayjs()
  const todayDay = today.day()

  if (inputDay === todayDay) {
    return today
  }

  const daysUntilNext = (inputDay - todayDay + 7) % 7

  const nextOccurrence = today.add(daysUntilNext, 'day')

  return nextOccurrence
}
