import formatDistanceToNow from 'date-fns/formatDistanceToNow'

type DateProps = {
  date: Date
}

export function Date({ date }: DateProps) {
  return (
    <time dateTime={date.toISOString()} title={date.toISOString()}>
      <span className="text-gray-500 text-sm">
        {formatDistanceToNow(date, { addSuffix: true })}
      </span>
    </time>
  )
}
