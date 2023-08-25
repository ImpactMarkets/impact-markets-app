import formatDistanceToNow from 'date-fns/formatDistanceToNow'

type DateProps = {
  date: Date
  dateLabel?: string
  className?: string
}

export function Date({ date, dateLabel = '', className = '' }: DateProps) {
  return (
    <time
      dateTime={date.toISOString()}
      title={date.toISOString()}
      className={className}
    >
      {dateLabel} {formatDistanceToNow(date, { addSuffix: true })}
    </time>
  )
}
