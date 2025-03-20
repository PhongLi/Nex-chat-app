import dayjs from 'dayjs'

export const formatTimestamp = (timestamp: number) => {
  const now = dayjs()
  const messageTime = dayjs(timestamp)

  // If the message was sent within the same day
  if (now.isSame(messageTime, 'day')) {
    return messageTime.format('hh:mm A') // Format: 12:30 PM
  }

  // If the message was sent within the past week
  if (now.isAfter(messageTime, 'day') && now.diff(messageTime, 'days') <= 7) {
    return messageTime.format('dddd, hh:mm A') // Format: Monday, 12:30 PM
  }

  // If the message was sent in a previous year
  if (now.year() !== messageTime.year()) {
    return messageTime.format('DD MMM YYYY') // Format: 15 Oct 2022
  }

  // If the message was sent more than a week ago, but in the same year
  return messageTime.format('DD MMM') // Format: 15 Oct
}
