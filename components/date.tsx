import formatDistanceToNow from 'date-fns/formatDistanceToNow'

type DateProps = {
  date: Date
}

export function Date({ date }: DateProps) {
  return (
    <time
      dateTime={date.toISOString()}
      title={date.toISOString()}
      className="underline underline-offset-1 decoration-dotted"
    >
      {formatDistanceToNow(date)} ago
    </time>
  )
}
