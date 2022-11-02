import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next'
import { unstable_getServerSession as getServerSession } from 'next-auth/next'
import { getProviders, signIn } from 'next-auth/react'
import Head from 'next/head'
import { useEffect } from 'react'
import Div100vh from 'react-div-100vh'

import { Button } from '@/components/button'
import { Footer } from '@/components/footer'
import { Logo } from '@/components/icons'
import { authOptions } from '@/lib/auth'

const SignIn = ({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  useEffect(() => {
    window.intercomSettings = {
      api_base: 'https://api-iam.intercom.io',
      app_id: 'gbn0p3de',
    }

    ;(function () {
      var w = window
      var ic = w.Intercom
      if (typeof ic === 'function') {
        ic('reattach_activator')
        ic('update', w.intercomSettings)
      } else {
        var d = document
        var i = function () {
          i.c(arguments)
        }
        i.q = []
        i.c = function (args) {
          i.q.push(args)
        }
        w.Intercom = i
        var l = function () {
          var s = d.createElement('script')
          s.type = 'text/javascript'
          s.async = true
          s.src = 'https://widget.intercom.io/widget/gbn0p3de'
          var x = d.getElementsByTagName('script')[0]
          x.parentNode.insertBefore(s, x)
        }
        if (document.readyState === 'complete') {
          l()
        } else if (w.attachEvent) {
          w.attachEvent('onload', l)
        } else {
          w.addEventListener('load', l, false)
        }
      }
    })()
  })

  return (
    <>
      <Head>
        <title>Sign In – Impact Markets</title>
      </Head>

      <Div100vh>
        <main className="relative flex items-center justify-center h-full bg-center bg-circle-grid dark:bg-circle-grid-dark">
          <div className="relative bottom-16">
            <Logo className="w-[326px] h-[94px] mb-8 bg-primary" />
            <div className="w-full space-y-4 text-center bg-primary">
              {Object.values(providers!).map((provider) => (
                <div key={provider.name}>
                  <Button
                    className="!h-12 !px-5 !text-lg"
                    onClick={() => signIn(provider.id)}
                  >
                    Sign in with {provider.name}
                  </Button>
                </div>
              ))}
            </div>
            <div className="-mt-4 md:mt-0 w-screen left-1/2 transform -translate-x-1/2 absolute sm:w-[434px] lg:w-[646px] xl:w-[862px] auth-footer">
              <Footer />
            </div>
          </div>
        </main>
      </Div100vh>
    </>
  )
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getServerSession(context.req, context.res, authOptions)
  const providers = await getProviders()

  if (session?.user) {
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
      props: { providers },
    }
  }

  return {
    props: { providers },
  }
}

export default SignIn
