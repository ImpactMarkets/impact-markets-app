import Head from 'next/head'
import Image from 'next/image'

import { FooterCentered } from '@/components/footercentered'
import { HeroText } from '@/components/herotext'
import { Landing_Header } from '@/components/landingpage/header'
import { OneTwoThree } from '@/components/landingpage/one-two-three'
import type { NextPageWithAuthAndLayout } from '@/lib/types'

const LandingPage: NextPageWithAuthAndLayout = () => {
  return (
    <div className="max-w-[1100px] mx-auto my-5 py-6">
      <Head>
        <title>Impact Markets</title>
      </Head>
      <Landing_Header></Landing_Header>
      <HeroText></HeroText>
      <div className="border"></div>
      <OneTwoThree></OneTwoThree>
      {/* <div className="max-w-xl flex m-auto mb-20 mt-6">
        <div>
          <Image
            width={300}
            height={300}
            alt="Trophy"
            src="/trophy.png"
          ></Image>
        </div>
        <div>
          <div className="text-lg font-bold">
            It's like investing in X prize teams
          </div>
          <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
            congue mollis faucibus. Ut cursus libero et libero pulvinar, vel
            mollis felis tempor. Vestibulum ac libero in est fermentum consequat
            sit amet quis libero. Ut eu urna ligula. Morbi diam erat, vehicula
            dignissim sapien vitae, facilisis finibus neque. Nullam nec neque
            nec nibh feugiat hendrerit tristique ut massa.
          </div>
        </div>
      </div>
      <div className="max-w-xl flex m-auto">
        <div>
          <div className="text-lg font-bold">
            It's like investing in X prize teams
          </div>
          <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
            congue mollis faucibus. Ut cursus libero et libero pulvinar, vel
            mollis felis tempor. Vestibulum ac libero in est fermentum consequat
            sit amet quis libero. Ut eu urna ligula. Morbi diam erat, vehicula
            dignissim sapien vitae, facilisis finibus neque. Nullam nec neque
            nec nibh feugiat hendrerit tristique ut massa.
          </div>
        </div>
        <div>
          <Image
            width={300}
            height={300}
            alt="Trophy"
            src="/trophy.png"
          ></Image>
        </div>
      </div> */}
      <FooterCentered></FooterCentered>
    </div>
  )
}

export default LandingPage
