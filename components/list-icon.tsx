import reactIcon from 'react-icons/fa'

export function MockListIcon(mockUpName: string, FavIcon: any) {
  return (
    <div style={{ display: 'inline' }}>
      {FavIcon}
      <p style={{ display: 'inline', marginLeft: '10px' }}>{mockUpName}</p>
    </div>
  )
}
