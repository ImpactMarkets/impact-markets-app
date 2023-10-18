// map a partners object to a list of logos',

const partners = [
  {
    name: 'EAGxBerlin',
    logo: '/images/partners/eagx-berlin.svg',
  },
  {
    name: 'EAGxRotterdam',
    logo: '/images/partners/eagx-rotterdam.svg',
  },
  {
    name: 'EAGxWarsaw',
    logo: '/images/partners/eagx-warsaw.svg',
  },
  {
    name: 'Funding the Commons',
    logo: '/images/partners/funding-the-commons.svg',
  },
  {
    name: 'LessWrong Community Weekend',
    logo: '/images/partners/less-wrong-community-weekend.svg',
  },
  {
    name: 'VAISU',
    logo: '/images/partners/vaisu.svg',
  },
  {
    name: 'Glo Consortium',
    logo: '/images/partners/glo-consortium.svg',
  },
]

export const Partners = () => (
  <div className="max-w-[1400px] text-center bg-gray-100">
    {partners.map((partner, index) => (
      <div key={index} className="inline-block w-[200px] h-[110px] m-4">
        <img
          src={partner.logo}
          alt={partner.name}
          className="w-full h-full object-contain opacity-50"
        />
      </div>
    ))}
  </div>
)
