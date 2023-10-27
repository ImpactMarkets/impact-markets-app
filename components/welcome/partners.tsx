// map a partners object to a list of logos',
import Image from 'next/image'

import { Tooltip } from '@/lib/mantine'

const partners = [
  {
    tooltip: 'Membership of the Glo Consortium pending',
    logo: '/images/partners/glo-consortium.svg',
    aspect: 0.55,
  },
  {
    tooltip: 'Seen at EAGxBerlin',
    logo: '/images/partners/eagx-berlin.svg',
    aspect: 0.55,
  },
  {
    tooltip: 'Seen at EAGxRotterdam',
    logo: '/images/partners/eagx-rotterdam.svg',
    aspect: 0.55,
  },
  {
    tooltip: 'Seen at EAGxWarsaw',
    logo: '/images/partners/eagx-warsaw.svg',
    aspect: 0.55,
  },
  {
    tooltip: 'Seen at Funding the Commons',
    logo: '/images/partners/funding-the-commons.svg',
    aspect: 0.55,
  },
  {
    tooltip: 'Seen at LessWrong Community Weekend',
    logo: '/images/partners/less-wrong-community-weekend.svg',
    aspect: 0.55,
  },
  {
    tooltip: 'Seen at VAISU',
    logo: '/images/partners/vaisu.svg',
    aspect: 0.55,
  },
]

export const Partners = () => (
  <div className="flex gap-4 flex-row p-3 w-full bg-gray-100 rounded-2xl">
    {partners.map(({ logo, tooltip, aspect }, index) => (
      <div key={index} className="w-[200px]">
        <Tooltip label={tooltip}>
          <Image
            src={logo}
            alt={tooltip}
            width={200}
            height={200 * aspect}
            className="w-full h-full object-contain opacity-50"
            unoptimized
          />
        </Tooltip>
      </div>
    ))}
  </div>
)
