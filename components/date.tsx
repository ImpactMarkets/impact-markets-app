import formatDistanceToNow from 'date-fns/formatDistanceToNow'

type DateProps = {
  date: Date
}

export function Date({ date }: DateProps) {
  return (
    <time dateTime={date.toISOString()} title={date.toISOString()}>
      {formatDistanceToNow(date)} ago
    </time>
  )
}
