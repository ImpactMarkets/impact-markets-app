import formatDistanceToNow from 'date-fns/formatDistanceToNow'

type DateProps = {
  date: Date
  dateLabel?: string
}

export function Date({ date, dateLabel = '' }: DateProps) {
  return (
    <time dateTime={date.toISOString()} title={date.toISOString()}>
      <span className="text-gray-500 text-sm">
        {dateLabel} {formatDistanceToNow(date, { addSuffix: true })}
      </span>
    </time>
  )
}
