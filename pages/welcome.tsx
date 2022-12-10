import Head from 'next/head'
import Image from 'next/image'

import { ButtonLink } from '@/components/button-link'
import { CenteredFooter } from '@/components/centeredFooter'
import { HeroText } from '@/components/hero-text'
import { Landing_Header } from '@/components/landingPage/header'
import { Pitches } from '@/components/landingPage/pitches'
import type { NextPageWithAuthAndLayout } from '@/lib/types'
import { Card } from '@mantine/core'

const LandingPage: NextPageWithAuthAndLayout = () => {
  return (
    <div className="max-w-[1100px] mx-auto my-5 pt-6">
      <Head>
        <title>Impact Markets</title>
      </Head>
      <Landing_Header></Landing_Header>
      <HeroText></HeroText>
      <div className="border"></div>
      <Pitches></Pitches>
      <div className="border"></div>
      <div className="max-w-screen-lg m-auto items-center flex m-auto mb-20 mt-12">
        <div className="basis-full">
          <Image
            src="/images/trophy.png"
            alt="Trophy"
            width={626}
            height={378}
            layout="fixed"
            object-fit="contain"
            unoptimized
          />
        </div>
        <div className="basis-full">
          <div className="text-xl font-bold mb-4">
            It’s like investing in X prize teams
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
      <div className="max-w-screen-lg m-auto flex items-center m-auto mb-20 mt-12">
        <div className="basis-full">
          <div className="text-xl font-bold mb-4">
            It’s like a startup ecosystem for altruistic projects
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
        <div className="basis-full">
          <Image
            src="/images/trophy.png"
            alt="Trophy"
            width={626}
            height={378}
            layout="fixed"
            object-fit="contain"
            unoptimized
          />
        </div>
      </div>
      <Card
        shadow="lg"
        p="lg"
        radius="md"
        withBorder
        className=" max-w-screen-lg border-theme-blue m-auto border-2 rounded-2xl text-center p-16 mt-32 mb-12"
      >
        <div>
          <div className="text-4xl font-extrabold mb-4">Check it out!</div>
          <div className="text-lg">
            Launch a prize, fund a friend, or raise some capital
          </div>
          <div className="mt-6">
            <ButtonLink className="mr-2" href="/">
              Join our Discord
            </ButtonLink>
            <ButtonLink variant="highlight" href="/">
              Explore Markets
            </ButtonLink>
          </div>
        </div>
      </Card>
      <div className="m-auto align-center flex justify-center">
        <iframe
          width="50%"
          height="320"
          src="https://impact-markets.substack.com/embed"
          scrolling="no"
        ></iframe>
      </div>
      <CenteredFooter></CenteredFooter>
    </div>
  )
}

export default LandingPage
