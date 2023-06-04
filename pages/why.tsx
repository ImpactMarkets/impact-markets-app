import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import { Heading1 } from '@/components/heading1'
import { Heading2 } from '@/components/heading2'
import { Layout } from '@/components/layout'
import type { NextPageWithAuthAndLayout } from '@/lib/types'
import { Accordion } from '@mantine/core'

const WhyImpactMarkets: NextPageWithAuthAndLayout = () => {
  return (
    <div className="max-w-screen-lg mx-auto my-5 py-6">
      <Head>
        <title>Frequently asked questions</title>
      </Head>

      <Heading1 className="mb-6">Frequently asked questions</Heading1>

      <Accordion
        chevronPosition="right"
        defaultValue="h.supl8yeuzjp"
        variant="separated"
      >
        <p>
          If your question is not answered here, please hit us up on Discord or
          use the support button in the bottom right!
        </p>
        <Heading2 className="my-10">General questions</Heading2>
        <Accordion.Item value="h.supl8yeuzjp">
          <Accordion.Control>What is this all about?</Accordion.Control>
          <Accordion.Panel>
            <p className="my-3">That depends on who you are:</p>
            <p className="my-3">
              <strong>
                If you’re a donor who doesn’t want to spend a lot of time
                researching your donations
              </strong>
              , you’ll be able to follow sophisticated donors who have skin in
              the game. We’re building a crowdsourced charity evaluator for all
              the small, speculative, potentially-spectacular projects across
              all cause areas ranked by the donations they’ve received from
              expert donors. You can tap into the wisdom of these donors and
              boost the impact of your donations.
            </p>
            <p className="my-3">
              <strong>
                If you’re a donor who has insider knowledge of some space of
                nonprofit work or likes to thoroughly research your donations
              </strong>
              , you can use the platform to signal-boost the best projects. You
              get a “donor score” based on your track record of impact, and the
              higher your score, the greater your boost to the project. This
              lets you leverage your expertise for follow-on donations, getting
              the project funded faster.
            </p>
            <p className="my-3">
              <strong>
                If you are a charity entrepreneur and you’re fundraising for a
                project
              </strong>
              , we want to make it easier for your project to find donors. We
              score donors by their track record of finding new high-impact
              projects, which signal-boosts the projects that they support.
              Attention from top donors helps you be discovered by more donors,
              which can snowball into greater and greater success.
            </p>
            <p className="my-3">
              <strong>If you are a philanthropic funder</strong>, we want to
              make all the local information accessible to you that is
              distributed across thousands of sophisticated donors and helps
              them find exceptional funding gaps. We signal-boost that knowledge
              and make it accessible to you. You can use cash or regranting
              prizes to incentivize these donors, or you can mine their findings
              for any funding gaps that you want to fill.
            </p>
            <p className="my-3">
              Eventually we want to grow this into an ecosystem akin to the
              voluntary carbon credit market (phase 3). But for now only phase 1
              is relevant.
            </p>
            <p className="my-3">
              <Image
                src="/images/phases.png"
                alt="Phases"
                width={1024}
                height={631}
                object-fit="contain"
                className="max-w-screen-md mx-auto"
                unoptimized
              />
            </p>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="h.fiwjvi9zluh9">
          <Accordion.Control>What problems does it solve?</Accordion.Control>
          <Accordion.Panel>
            <p className="my-3">
              Donors and grant applicants face the following three problems at
              the moment:
            </p>
            <ol className="list-decimal list-outside m-2 ml-10">
              <li>
                Charity entrepreneurs are known to waste a lot of time on
                redundant grant applications – each tailored a bit to the
                questions of the respective funder but otherwise virtually
                identical in content.
              </li>
              <li>
                Donors, especially if they are “earning to give,” often don’t
                have the time to do a lot of vetting. Funds and donor lotteries
                address this, but a team of fund managers needs to win their
                trust first, which is not a given, and maybe they don’t want to
                take months off work in case they win the lottery.
              </li>
              <li>
                Larger funders generally don’t want to invest much more time and
                money into vetting a project than it would cost them to fund it.
                Hence funders are forced to ignore projects that are too small.
              </li>
            </ol>
            <p className="my-3">This is our solution:</p>
            <ol className="list-decimal list-outside m-2 ml-10">
              <li>
                We promote impactmarkets.io as the one platform where grant
                applicants can publish their project proposals. No particular
                format: There’s a Q &amp; A system though for funders/donors to
                ask further questions as needed. Questions and answers are
                public too. Funders can subscribe to notifications of new,
                popular projects in their cause areas.
              </li>
              <li>
                When a donor supports a project, they can record that. When a
                project claims to have succeeded, some experts evaluate it.
                Eventually early donors to successful projects (“top donors”)
                will stand out as having unusual foresight, especially if they
                can repeat this feat several times. Donors who don’t have the
                time to do as much research can follow the top donors to inform
                their own donations.
              </li>
              <li>
                Larger funders can (1) also follow the implicit recommendations
                of top donors, (2) encourage top donors with cash or regranting
                prizes, and (3) recruit grantmakers from the set of top donors.
              </li>
            </ol>
            <p className="my-3">
              There are a host of other benefits in various specific scenarios.{' '}
              <Link
                className="link"
                href="https://impactmarkets.substack.com/&amp;"
              >
                You can read about them on our blog.
              </Link>
            </p>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="h.jvgcfqp41802">
          <Accordion.Control>What is a project?</Accordion.Control>
          <Accordion.Panel>
            <p className="my-3">
              What we call a project is some set of actions that creators or
              charity entrepreneurs plan to carry out within some time frame.
              Good examples are blog articles, scientific papers, campaigns,
              courses, etc.
            </p>
            <p className="my-3">
              Whole charities (like the whole of the Center on Long-Term Risk
              rather than any one piece of research) are a bit of an awkward
              contingency because they don’t have any obvious “completion date,”
              but they qualify too. We’re considering methods for how we can
              evaluate them too.
            </p>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="h.cvsxi8tyyiro">
          <Accordion.Control>
            What is a creator or charity entrepreneur?
          </Accordion.Control>
          <Accordion.Panel>
            <p className="my-3">
              We call a creator or charity entrepreneur someone who publishes a
              project on our website to fundraise for it. They are usually
              researchers, founders, entrepreneurs, etc. Founder would be
              another obvious choice, but the term creator is more general and
              harder to confuse with funder than founder.
            </p>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="h.xe0xcdm5nzyr">
          <Accordion.Control>
            What is a specialist donor; what is a generalist donor?
          </Accordion.Control>
          <Accordion.Panel>
            <p className="my-3">
              Both of them give money to projects, but their ambitions are
              different.
            </p>
            <p className="my-3">
              Generalist donors either don’t have the time or the specialized
              knowledge to evaluate projects. They want to use the impact market
              like a black box, a charity evaluator that makes recommendations
              to them.
            </p>
            <p className="my-3">
              Specialist donors have the time or the special knowledge to form a
              first-hand opinion on projects – be it because they are experts in
              a relevant field, because they are experts in startup picking, or
              simply because they are friends with the people who run a
              particular project. They use the impact market to make
              recommendations and thereby leverage the donations of the donors
              who rely on them. They may also be after the prizes that funders
              might provide!
            </p>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="h.mpr26iil8s3h">
          <Accordion.Control>What is a funder?</Accordion.Control>
          <Accordion.Panel>
            <p className="my-3">
              Funders are basically large donors. They can behave exactly like
              other donors, but they can also provide prizes to incentivize
              other donors.
            </p>
          </Accordion.Panel>
        </Accordion.Item>

        <Heading2 className="my-10">Questions about the platform</Heading2>
        <Accordion.Item value="h.a960frelo8vn">
          <Accordion.Control>What is the donor score?</Accordion.Control>
          <Accordion.Panel>
            <p className="my-3">The score is computed in three steps:</p>
            <ol className="list-decimal list-outside m-2 ml-10">
              <li>
                The contribution of each donor to a given project is calculated
                as a fraction that is greater if the donor contributed to a
                project earlier. Earliness here is not about sidereal time but
                about the order of the donations, so it doesn’t matter whether
                there’s a day or a year between the first and the second
                donation. The standard score also takes the size of the donation
                into account.
              </li>
              <li>
                Eventually many projects will complete and then get evaluated.
                The result is a score that expresses the evaluators aggregate
                opinion on the relative impact of the project.
              </li>
              <li>
                Finally the per-project contributions and the per-project scores
                are multiplied and summed up for each donor. This results in the
                scores that form the donor ranking.
              </li>
            </ol>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="h.2vyw7iqj7vgi">
          <Accordion.Control>
            When and how are projects evaluated?
          </Accordion.Control>
          <Accordion.Panel>
            <p className="my-3">
              Each project has a review date estimating when the project will be
              ready for evaluation. The project creator can edit this date in
              case things take longer than planned.
            </p>
            <p className="my-3">
              We want to get a number of evaluators on board to consider the
              project artifacts and pass judgment on them.
            </p>
            <p className="my-3">
              The focus here will not be to make great contributions to
              priorities research but rather, if the project is (say) a book, to
              establish whether the book got written at all and whether it looks
              like someone has put effort into it. Ethical value judgments will
              be embedded in these assessments but we can hopefully find
              multiple evaluators so that, in controversial cases, the scores
              can average out.
            </p>
            <p className="my-3">
              The guideline for the calibration of the scores will be something
              along the lines: Suppose this book/paper/etc. didn’t exist, and I
              wanted to make it happen. How much would I have to pay? Or
              conversely for harmful projects: If there were a fairy who let’s
              me undo this book/paper/etc., how much would I pay to have it
              undone?
            </p>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="h.8g8my56gh8j0">
          <Accordion.Control>What are your long-term plans?</Accordion.Control>
          <Accordion.Panel>
            <p className="my-3">
              There have been changes to the funding landscape in 2022. Such
              vicissitudes keep our long-term plans in flux. But at the moment
              we’re aiming to create a market that is similar to the voluntary
              market for carbon credits. (These are also called “carbon
              offsets,” but the term “offset” would be confusing in our
              context.)
            </p>
            <ol className="list-decimal list-outside m-2 ml-10">
              <li>
                In the first phase we want to work with just the score that is
                explained above. Any prizes will be attached to such a score.
              </li>
              <li>
                In the second phase, we want to introduce a play money currency
                that we might call “impact credit” or “impact mark.” The idea is
                to reward people with high scores with something that they can
                transfer within the platform so that incentives for donors will
                be controlled less and less by the people with the prize money
                and increasingly by the top donors who have proved their mettle
                and received impact credits as a result.
              </li>
              <li>
                Eventually, and this brings us to the third phase, we want to
                understand the legal landscape well enough to allow trade of
                impact credits against dollars or other currencies. We would
                like for impact credits to enjoy the same status that carbon
                credits already have. They should function like generalized
                carbon credits.
              </li>
            </ol>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="h.o9c8p21v0pxr">
          <Accordion.Control>
            Last time I checked you were doing something with impact
            certificates, though?
          </Accordion.Control>
          <Accordion.Panel>
            <p className="my-3">
              What we’ve been calling a “project” is something that can issue
              one or more impact certificates.{' '}
              <Link href="/certificates" className="link">
                Our platform still lists the existing certificates
              </Link>
              , but that’s merely an archive at this point. There is a chance we
              might return to this format, especially if we choose to found a
              nonprofit branch of our organization, but for the moment we have
              no such plans.
            </p>
            <p className="my-3">
              We’ve encountered three problems with impact certificates:
            </p>
            <ol className="list-decimal list-outside m-2 ml-10">
              <li>
                Charity entrepreneurs are hesitant to issue them because they
                need to define what their plans are and who their contributors
                are in some detail and commit to never issuing overlapping
                certificates. That requires some thought and coordination, and
                without a fairly strong promise of funding, few charity
                entrepreneurs are ready to put in the time and effort. That was
                compounded by the problem that hardly any funders were
                interested in using our or any impact market, so that there
                never was any such “strong promise of funding.”
              </li>
              <li>
                Trading impact certificates is only legal between accredited
                investors in the US. Trade between accredited investors
                internationally (esp. US, Canada, EU, UK, and India) is
                sufficiently recondite of a problem that we haven’t found any
                experts on it yet. Additionally, we would not be allowed to help
                these investors coordinate either without running afoul of
                broker-dealer regulations. Figuring this out just for the US and
                accredited investors is something that can easily cost upward of
                $100k in lawyer fees and might even then just fail. The
                combination of costs, risks, and limitation to one country and
                only rich people was too much for us, at least at this level of
                scale.
              </li>
              <li>
                Funders were very hard to find. We concentrated on outreach to
                funders for several months, had talks at several Effective
                Altruism Globals and other conferences, but in the end only got
                two funders interested (among them Scott Alexander though!), who
                promptly lost most of their funding because it was tied to the
                Future Fund. The funding situation changed to become even more
                unfavorable, so that we were no longer optimistic that it might
                still become easier to find funders.
              </li>
            </ol>
            <p className="my-3">
              Finally – and this hasn’t become a problem but would have – a lot
              of interesting financial instruments, such as perpetual futures,
              will remain inapplicable to impact certificates because each one
              of them is doomed to have very little liquidity. Most projects on
              impact markets will require some $10–100k in seed funding to get
              off the ground. The fully diluted market cap of even the most
              successful projects will probably almost never exceed $1–10m. The
              circulating supply will be much less still. Such assets are a good
              fit for bonding curve or English auctions but it would be useless
              to try to set up order books, indices, and futures markets for
              them. We previously hoped to bucket them to alleviate this
              problem. Impact credits will hopefully one day serve this purpose.
            </p>
            <p className="my-3">
              Hence, we’ve removed impact certificates from our plans and
              introduced projects instead, which are perfectly laissez faire
              about their definition. We’ve also opted to allow no trade of
              anything that can be turned into dollars.
            </p>
            <p className="my-3">
              You can think of the donor score as analogous to the total value
              that you would hold in retired certificate shares if we still had
              those. (“Retired,” a.k.a. “consumed” or “burned,” shares are ones
              that cannot be sold anymore.) But it’s probably just confusing to
              think of it that way.
            </p>
            <p className="my-3">
              The only monetary rewards that donors may receive are prizes if
              they make it to the top of our donor ranking.
            </p>
            <p className="my-3">
              <Image
                src="/images/phases-vs-classic.png"
                alt="Phases"
                width={1024}
                height={631}
                object-fit="contain"
                className="max-w-screen-md mx-auto"
                unoptimized
              />
            </p>
          </Accordion.Panel>
        </Accordion.Item>
        <Heading2 className="my-10">
          Questions from charity entrepreneurs
        </Heading2>
        <Accordion.Item value="h.mxi6iu7u9fut">
          <Accordion.Control>
            What does this platform do for me?
          </Accordion.Control>
          <Accordion.Panel>
            <p className="my-3">
              That hinges on how much promise your project has.
            </p>
            <p className="my-3">Let’s say it has a lot.</p>
            <ol className="list-decimal list-outside m-2 ml-10">
              <li>
                Do you have some donors who already trust you? Convince them to
                donate, then bring them on the platform to register their
                donations. As early donors they’ll be rewarded richly by the
                scoring.
              </li>
              <li>
                Do you know any of the top donors? If the #1 donor is an AI
                specialist but your project is in animal rights, getting in
                touch with a top donor who is a specialist in your field may pay
                off even if they’re only donor #8 because animal rights donors
                will tend to follow the recommendations of other animal rights
                donors.
              </li>
              <li>
                Now your project has gotten a donation from a top donor? That’ll
                wash it way up in our list of projects so that donors will see
                it even if they’re not yet following that exact donor!
              </li>
            </ol>
            <p className="my-3">
              To wit: As soon as you have any fundraising success, you can
              leverage it to build greater success. The platform even does it
              for you!
            </p>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="h.nh8lirgsyv0z">
          <Accordion.Control>
            What sorts of projects can I post?
          </Accordion.Control>
          <Accordion.Panel>
            <p className="my-3">
              Basically anything goes&hellip; so long as it’s legal and not
              super risky!
            </p>
            <p className="my-3">
              We review every project and eliminate any that seem to us like
              they might be harmful. But please also make sure yourself that you
              don’t include any classified information or info hazards in the
              description because all projects are public. (Would you like to
              make your project only accessible to logged-in users? Send us a
              message through the support button in the bottom right to indicate
              your interest in this feature!)
            </p>
            <p className="my-3">
              The ideal project is something finite that produces artifacts. Our
              evaluators will have an easy time with projects that fundraise for
              books, articles, or papers because they can read them to assess
              them. They’ll have a hard time with projects that are about whole
              organizations because an organization typically does a lot and
              they also can’t look into the future to know what great things the
              organization might still accomplish. Expect organizations to be
              undervalued, not because they suck but because so much of what
              they do is shrouded by the future and closed office doors.
            </p>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="h.rn7v71rrlvxg">
          <Accordion.Control>
            How long does it take to submit a project?
          </Accordion.Control>
          <Accordion.Panel>
            <p className="my-3">
              There’s no required format. So if you already have a funding
              application lying around because you already applied for funding
              from some foundation, then just copy-paste or link it.
            </p>
            <p className="my-3">
              Other than that, you just need to enter a title and someplace
              where people can send you their donations, such as a PayPal or
              Stripe page. You can add some tags to make it easier for your
              project to be found. All in all this should take no longer than 5
              minutes.
            </p>
            <p className="my-3">
              If you have no application written up yet, it’ll take longer. It’s
              up to you how comprehensive you want to make it. One thing I like
              to do is to write down just the essentials (if it’s short, it’s
              more likely to get read too), and then to include a link to a site
              where people can book a call with me to learn more.
            </p>
            <p className="my-3">
              Alternatively they also have the option to ask questions in the Q
              &amp; A section. No need to procatalepse them all in your
              description when you can just respond to the ones that actually
              come up.
            </p>
            <p className="my-3">
              <Link className="link" href="https://amber-dawn-ace.com/">
                Amber Dawn
              </Link>{' '}
              might also help you with the writing.
            </p>
          </Accordion.Panel>
        </Accordion.Item>
        <Heading2 className="my-10">Questions from specialist donors</Heading2>
        <Accordion.Item value="h.36yxgo56zi81">
          <Accordion.Control>
            What does this platform do for me?
          </Accordion.Control>
          <Accordion.Panel>
            <p className="my-3">
              Have you supported any charities early on that late made it bigly?
            </p>
            <p className="my-3">
              I, for one, would love to know what fledgling organizations you
              support today so I can get in early too. And for you that means
              that suddenly your donations count for more!
            </p>
            <p className="my-3">
              Some of my friends donate up to $100,000 per year. They don’t have
              much time to research their donations, so they, too, would love to
              know about that fledgling organization that you support. Even if
              you just donate $100 to the organization, your $100 might leverage
              $100,000 from the donors who trust your judgment!
            </p>
            <p className="my-3">
              That’s one thing that the platform can do for you.
            </p>
            <p className="my-3">
              Another is that we’re hoping for larger funders to come in and to
              reward our top donors. They might opt for cash prizes or for
              regranting prizes. Either way you’ll have a lot more money to give
              away if you unlock any of those prizes!
            </p>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="h.sekimcu4had8">
          <Accordion.Control>Can I make money with this?</Accordion.Control>
          <Accordion.Panel>
            <p className="my-3">
              My hope is that eventually a substantial number of people can turn
              donating into their full-time job. They make small but really
              smart donations, earn high scores as a result, and then make it
              all back several times over from the prizes that they win.
            </p>
            <p className="my-3">
              As of early 2023 we’re not there yet, but you might as well start
              building up your score already.
            </p>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="h.u4kfw6gdbmyg">
          <Accordion.Control>
            Project X doesn’t make sense if it receives less than $10k. I love
            it, but I only have $1k. What do I do?
          </Accordion.Control>
          <Accordion.Panel>
            <p className="my-3">
              A Kickstarter type of system would solve this, right? We can’t
              easily implement such “assurance contracts” ourselves, but we can
              help you coordinate: We could offer a way for donors to pledge
              that they want to donate $x if all donors together pledge to
              donate $X. Then once the sum of all pledges reaches $X, you’ll all
              get notified and can dispatch your donations.
            </p>
            <p className="my-3">
              Does that sound interesting? Please let us know, e.g., through the
              support button in the lower right. We’ll prioritize the feature
              more highly.
            </p>
          </Accordion.Panel>
        </Accordion.Item>
        <Heading2 className="my-10">Questions from generalist donors</Heading2>
        <Accordion.Item value="h.6pmqv5etw1wf">
          <Accordion.Control>
            What does this platform do for me?
          </Accordion.Control>
          <Accordion.Panel>
            <p className="my-3">
              You want to donate but maybe you don’t have time to do a lot of
              research or you want to donate in a field where you don’t have the
              requisite background knowledge. Hence you’re dependent on friends,
              funds, or charity evaluators to suggest good giving opportunities.
            </p>
            <p className="my-3">
              But all of these have limitations: Your friends probably know of
              many of the same giving opportunities, so you might be overlooking
              even better ones. The same is true of funds, though they receive
              applications, which alleviates the problem. Conversely, you may
              know and trust them less than some of your friends. The track
              record of retrospective self-evaluation at funds is thin. Finally
              charity evaluators have a wholly different set of limitations:
              They put a lot of effort into their evaluations, so that they
              can’t evaluate projects whose funding gaps are so small that they
              don’t warrant the evaluators’ efforts. Plus charity evaluators
              don’t exist for many cause areas.
            </p>
            <p className="my-3">
              We want to solve that for you. All you need to do when you want to
              donate is to turn to our platform. You can:
            </p>
            <ol className="list-decimal list-outside m-2 ml-10">
              <li>
                View our top donor ranking, pick out top donors who share your
                values, and then follow their recommendations, or
              </li>
              <li>
                Filter projects according to your values (using the tags) and
                pick out the ones that have received most top donor support.
              </li>
            </ol>
            <p className="my-3">
              Today we’re just getting started, but over the coming months we
              want to establish a new, bottom-up, grassroots type of funding
              allocation mechanism that scales down to the smallest projects, is
              fully meritocratic, and doesn’t know geographic limits.
            </p>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="h.ld1hmhx8di2a">
          <Accordion.Control>
            How do I know that the donors I’m following aren’t just good
            forecasters but also have good ethics?
          </Accordion.Control>
          <Accordion.Panel>
            <p className="my-3">
              Our plan is to hand off power to top donors gradually. First all
              their forecasting will bottom out at the judgments of impact
              evaluators that we will hire. That’ll ensure that they’ll be
              sophisticated altruists, but it will not immediately steel us
              against our own biases. Later we want to recruit impact evaluators
              from our top donors, increasing the organic, bottom-up meritocracy
              of the platform.
            </p>
            <p className="my-3">
              But then we want to transition to phase 2 of our rollout. Phase 2
              will gradually put top donors on the same footing as evaluators
              until most evaluation is done by top donors. But even then our
              evaluators will still be around to steer the platform as needed to
              make sure it is not usurped by any amoral top donors.
            </p>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="h.3ldrrpzde9q0">
          <Accordion.Control>
            How do I know that a project still has room for more funding?
          </Accordion.Control>
          <Accordion.Panel>
            <p className="my-3">
              We ask projects to publish their fundraising goals and stretch
              goals. If they have not done so, please ask them for that
              information in the Q &amp; A section.
            </p>
          </Accordion.Panel>
        </Accordion.Item>
        <Heading2 className="my-10">
          Questions from philanthropic funders
        </Heading2>
        <Accordion.Item value="h.asxltp7enbtx">
          <Accordion.Control>
            What does this platform do for me?
          </Accordion.Control>
          <Accordion.Panel>
            <p className="my-3">
              You can use the platform like any other donor to find great, new
              funding opportunities.
            </p>
            <p className="my-3">
              But we also have a special function for you: You can basically
              rent our top donors by offering regranting budgets to them. Those
              serve the dual purpose that (1) you’ll get top grantmaker talent
              for free, maybe even top grantmaker talent whose networks are
              relatively uncorrelated with yours, and (2) by announcing such a
              prize, you create an incentive for prospective top donors to show
              up and try to prove their mettle.
            </p>
            <p className="my-3">
              If that sounds interesting to you, please get in touch, e.g.,
              through the support button to the lower right or via
              hi@impactmarkets.io.
            </p>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="h.dkepb7f0y0b">
          <Accordion.Control>
            What if I’m unhappy with the scoring?
          </Accordion.Control>
          <Accordion.Panel>
            <p className="my-3">
              Are you? If so, we can easily build a custom score for you. You
              score the projects, and we aggregate all of your project scores
              into your own custom donor ranking. Please get in touch if that
              sounds interesting to you, e.g., through the support button to the
              lower right or via{' '}
              <Link className="link" href="mailto:hi@impactmarkets.io">
                hi@impactmarkets.io
              </Link>
              .
            </p>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="h.gpalvf8twiqy">
          <Accordion.Control>
            What if there are funders who defect against me by idly waiting for
            me to post the same prizes they want to see posted?
          </Accordion.Control>
          <Accordion.Panel>
            <p className="my-3">
              We’ve termed this problem the “
              <Link
                className="link"
                href="https://impactmarkets.substack.com/p/the-retrofunders-dilemma"
              >
                Retrofunder’s Dilemma
              </Link>
              .” It’s easy to imagine a world in which there are several funders
              – just too many for them all to be really chummy with each other –
              who all insist on extremely niche scoring rules to make sure that
              they don’t reward any donations to good deeds that anyone else
              might reward too. But that would leave exactly the most
              uncontroversially good deeds unrewarded.
            </p>
            <p className="my-3">
              We’re far from this being a problem for our rewarding, alias
              retrofunding, at all and even farther from it becoming a greater
              problem for retrofunding than it is already for prospective
              funding. But if it becomes a problem, the abovelinked article
              lists three remedies that funders can implement and four that
              charity entrepreneurs can implement. Or that we can implement for
              them to establish coordination.
            </p>
          </Accordion.Panel>
        </Accordion.Item>
        <Heading2 className="my-10">Questions from bounty posters</Heading2>
        <Accordion.Item value="what-is-a-bounty">
          <Accordion.Control>What is a bounty?</Accordion.Control>
          <Accordion.Panel>
            <p className="my-3">
              If you want a task done without having to find and hire a
              particular person to do it, you can create a bounty: a promise of
              a specified reward to anyone who can prove they’ve performed the
              task you want completed. Impact Markets’ bounty board functions as
              a directory of tasks, the completion of which is valued by members
              of the EA, rationalist, and adjacent communities.
            </p>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="what-can-i-use-bounties-for">
          <Accordion.Control>What can I use bounties for?</Accordion.Control>
          <Accordion.Panel>
            <p className="my-3">
              Any (legal) tasks you’d like completed! They don’t have to be
              philanthropy-related. You can, for example, make a bounty
              requesting that someone find you a long-term partner, to be paid
              in the event of your marriage!
            </p>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="can-i-post-a-bounty-without-making-it-fully-public">
          <Accordion.Control>
            Can I post a bounty without making it fully public?
          </Accordion.Control>
          <Accordion.Panel>
            <p className="my-3">
              Not at the moment. But if this is a feature that you would like to
              use, please let us know, e.g., through the support button in the
              bottom right.
            </p>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="how-should-i-structure-my-bounty">
          <Accordion.Control>
            How should I structure my bounty?
          </Accordion.Control>
          <Accordion.Panel>
            <p className="my-3">
              Describe the task you want performed and the amount you will pay
              to whoever completes it. You can also specify different bounty
              amounts. For example, $5 for the first date, and $50 for the
              second, so that you’ll be paying proportionally more for
              milestones that are proportionately more valuable to you. In such
              a case, please list the highest bounty you offer as a bounty
              amount and describe the details in the description, or else your
              bounty may get sorted lower than it has to be. You can also pay
              for referrals to people who can solve your task, but bear in mind
              that this will make your bounty more expensive for you as two
              people can easily collude to pretend-refer the other and split the
              reward.
            </p>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="what-if-more-than-one-person-completes-my-task">
          <Accordion.Control>
            What if more than one person completes my task?
          </Accordion.Control>
          <Accordion.Panel>
            <p className="my-3">
              If this is a concern, describe how you’ll handle this situation in
              the text of your bounty. E.g. if you want to pay $5 to the first
              person who can find you a date, state this in your bounty
              description. To prevent a second person from wasting their time,
              please update your bounty promptly on completion! You can also ask
              people to commit to working on the bounty in a comment. Then you
              can acknowledge that in a reply. Everyone can see these comments
              and replies and steer clear of the bounty if it has been
              preliminarily claimed like that.
            </p>
            <p className="my-3">
              Your bounty is initially in the “active” status. When you see that
              someone is working on it and you don’t want a second person to
              work on it too, you can switch it to the “claimed” status. You can
              reverse this any time if the first person fails to deliver.
              Finally, you can switch your bounty to the “completed” status.
            </p>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="can-i-post-a-bounty-for-0">
          <Accordion.Control>
            Can I post a bounty for $0? And why would I want to do this?
          </Accordion.Control>
          <Accordion.Panel>
            <p className="my-3">
              You can! The downside is, of course, no monetary incentive for
              anyone to complete your request. But the bounty board functions as
              a directory for, among other things, personal dating docs. We’d
              like the platform to act as a Schelling point for community
              members’ dating profiles, which would mean that someone looking
              for a partner or matchmakers looking to pair people up might
              peruse the “personal dating doc” tag, regardless of whether a
              dollar amount is attached to the bounty.
            </p>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="whats-a-personal-dating-doc">
          <Accordion.Control>What’s a “personal dating doc”?</Accordion.Control>
          <Accordion.Panel>
            <p className="my-3">
              A personal dating doc (or a “date me” doc) can take the form of a
              dating profile that isn’t attached to a particular app, a
              personals ad, or an application for prospective partners to fill
              out. There’s no standardized format or method of dissemination,
              but they’re often written in Google docs and the links sent around
              to friends or posted on social media.
            </p>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="how-does-this-related-to-charity-evaluation">
          <Accordion.Control>
            How does this relate to charity evaluation?
          </Accordion.Control>
          <Accordion.Panel>
            <p className="my-3">
              It doesn’t directly; the bounty board is a directory for the sorts
              of people interested in effective altruism. The bounty board is
              open for all sorts of bounties, but bounties that may be of
              particular value to the world are altruistic ones – also known as
              prizes.
            </p>
            <p className="my-3">
              You would like to understand how transformer networks implement
              addition? Post a sizable prize and motivate researchers to find
              out! If a researcher then needs to fundraise for a teaching buyout
              to work on your bounty, they can use our projects section.
            </p>
          </Accordion.Panel>
        </Accordion.Item>
        <Heading2 className="my-10">Questions from bounty hunters</Heading2>
        <Accordion.Item value="how-can-i-trust-that-bounty-posters-will-pay-up">
          <Accordion.Control>
            How can I trust that bounty posters will pay up?
          </Accordion.Control>
          <Accordion.Panel>
            <p className="my-3">
              At the moment, the platform’s bounty board is purely a directory.
              We intend to make transactions reported to us by both parties
              visible on users’ pages, so that users looking to fulfill bounties
              can see whether someone submitting a bounty has a track record of
              honesty.
            </p>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="how-do-i-know-that-someone-else-isnt-already-working-on-a-bounty">
          <Accordion.Control>
            How do I know that someone else isn’t already working on a bounty?
          </Accordion.Control>
          <Accordion.Panel>
            <p className="my-3">
              See the question{' '}
              <Link
                href="#mantine-r69-control-what-if-more-than-one-person-completes-my-task"
                className="link"
              >
                What if more than one person completes my task?
              </Link>{' '}
              above. In short: Watch out for the bounty status (“active” vs.
              “claimed”) and whether someone in the comments already reserved it
              for themselves and is working on it. Of course there are also
              plenty of bounties for which it makes sense for several people to
              work on them.
            </p>
          </Accordion.Panel>
        </Accordion.Item>
        <Heading2 className="my-10">Questions about impact markets</Heading2>
        <Accordion.Item value="h.kt5pxzelzfcn">
          <Accordion.Control>
            Is the goal to replace the current funding mechanisms?
          </Accordion.Control>
          <Accordion.Panel>
            <p className="my-3">
              Not really, sort of in the way that airplanes didn’t replace
              bikes. We think that impact markets will be best suited for
              funding the long-tail of small, young speculative startup charity
              projects. But they will be rather uninteresting for projects with
              strong track records or otherwise safe, reliable success. They
              will also be uninteresting for projects that require a lot of
              funding from the get-go.
            </p>
            <p className="my-3">
              <Link
                className="link"
                href="https://impactmarkets.substack.com/p/chaining-retroactive-funders"
              >
                You read more about the math behind these considerations on our
                blog.
              </Link>
            </p>
            <p className="my-3">
              The basic idea is that projects that are &gt; 90% likely to
              succeed (according to some metric of success that the funder uses)
              don’t leave much room for an investor to make a profit while
              reducing the risk further for the funder.
            </p>
            <p className="my-3">
              Additionally, a risk-neutral funder is only interested in a risk
              reduction if it moves an investment from the space of negative
              expected value to the space of positive expected value. If a
              project is already 90% likely to succeed, it would have to be very
              expensive before it could become negative EV for a funder. Such an
              expensive project is then easily worth the time of the funder to
              evaluate prospectively rather than retrospectively.
            </p>
            <p className="my-3">
              So impact markets (with risk-neutral funders) are most interesting
              for:
            </p>
            <ol className="list-decimal list-outside m-2 ml-10">
              <li>
                Projects that seem very speculative to funders, e.g., because
                they are new and the funder doesn’t know the team behind the
                project,
              </li>
              <li>
                Projects that require little money to get started, so they’re
                not worth the time of the funder to review.
              </li>
            </ol>
            <p className="my-3">
              If highly risk-averse funders are involved, though, they may be
              happy to pay a disproportionate fee for a risk reduction from 10%
              to 0%! There are also funders who are limited by their by-laws to
              only invest in certain types of low-risk projects. In some cases
              impact markets may present a loophole for them to do good more
              effectively without incurring any illicit risks.
            </p>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="h.ku1l9ts6y4vt">
          <Accordion.Control>
            Is the goal to replace the current market mechanisms?
          </Accordion.Control>
          <Accordion.Panel>
            <p className="my-3">
              No. The financial markets have developed over the course of over a
              century and are accompanied with legislation that is usually
              phrased in such generic terms that it is nigh impossible to create
              a separate financial apparatus outside of it. Many cryptocurrency
              projects have tried to create market mechanisms beyond the reach
              of the law, but the law typically disagreed. More recently, there
              is instead a stronger push to welcome regulation and to reform the
              law to facilitate regulation.
            </p>
            <p className="my-3">
              We therefore consider it infeasible to try to replace the existing
              financial systems. Rather our goal is to create systems that
              reward the creation and maintenance of public, common, and network
              goods while interfacing with the existing financial systems in
              standard, regulated ways. (The closest parallel is the voluntary
              market for carbon credits.)
            </p>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="h.w9wpoa3uvoqd">
          <Accordion.Control>How good is it?</Accordion.Control>
          <Accordion.Panel>
            <p className="my-3">
              [This section has not been rewritten for the new “impact credits”
              approach. The differences are probably minor.]
            </p>
            <p className="my-3">
              We’ve been trying to get an idea of how good impact markets are by
              putting some rough estimates into a{' '}
              <Link
                className="link"
                href="https://www.getguesstimate.com/models/20448"
              >
                Guesstimate
              </Link>
              , but a lot of the factors are multiplicative and they are all
              hard to guess, so that the variance of the result is very wide.
            </p>
            <p className="my-3">Some key benefits are:</p>
            <ol className="list-decimal list-outside m-2 ml-10">
              <li>
                There’ll be as much or more seed funding as there is today. The
                idea is that many investors will try many different things and
                try to think outside of the box. Often it’ll turn out that their
                calibration was off. They’ll invest into lots of projects and
                make less money back because they were wrong about how great all
                the projects will turn out. These investors will gradually
                select themselves out of the pool, but new ones will join. We
                don’t know how many ill-calibrated investors join for each that
                is well-calibrated, but we’ve seen some data that prize contests
                attract investments to the tune of up to 50x the prize money, so
                the average investor must be fairly ill-calibrated. Our model
                assumes that the value is probably around 1–20x.
              </li>
              <li>
                The allocational efficiency can be improved because investors
                can overcome language barriers. But much of the world speaks
                English, and the US dominates the world economy, so we’ve put
                this improvement at a factor 1–3x.
              </li>
              <li>
                The allocational efficiency can be improved because investors
                are in different social circles. This factor seems more
                significant to us, and we’ve put it at 1–10x.
              </li>
              <li>
                The allocational efficiency can be improved because investors
                can draw on economies of scale. They can rent one server rack
                for all of their projects, or they can employ one HR person for
                all of them, etc. We’ve put this factor at 1–10x too.
              </li>
              <li>
                Charities can draw on much greater talent pools if they can use
                fractions of impact certificates to align incentives. (They can
                also pay bonuses tied to retro funding.) We think that the
                talent pool might grow by 1–5x.
              </li>
              <li>
                All of this frees up a lot of time for retro funders. Current
                prospective funders such as the Open Philanthropy Project have a
                lot of staff who would be excellent at a very practical brand of
                priorities research. When impact markets free up time for them,
                they can devote that time to research. Evidential cooperation in
                large worlds alone can serve as a likely existence proof that
                there is a lot more to know about global priorities. We very
                conservatively assume that improved understanding of priorities
                will boost the allocational efficiency by 1–10x.
              </li>
            </ol>
            <p className="my-3">
              The result of the model is that impact markets are unlikely to
              improve the current efficiency by less than 60x or by more than
              11,000x.
            </p>
            <p className="my-3">
              We think that this range is likely biased upward:
            </p>
            <ol className="list-decimal list-outside m-2 ml-10">
              <li>
                Our model ignores black swan events that may occur with an
                unknown frequency and may be very harmful.
              </li>
              <li>
                It is well possible that some factor in the model actually turns
                out to be &lt; 1x for some reason that we haven’t thought of.
              </li>
              <li>
                Finally, we’ve mentioned before that the multiplicativeness of
                the model makes it very easy for it to produce big numbers. This
                is the prime reason that we don’t greatly trust it.
              </li>
            </ol>
            <p className="my-3">
              You can find further discussion of the model in the comments on
              this post.
            </p>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="h.97gdpmg2kbnp">
          <Accordion.Control>Can it go bad?</Accordion.Control>
          <Accordion.Panel>
            <p className="my-3">
              The biggest concern that we’ve had from the beginning in 2021 is
              that prize contests (such as impact markets) are general purpose:
              Anyone can use them – to incentivize awesome papers on AI safety
              or to incentivize terrorist attacks. In fact, promises of rewards
              in heaven could count as prizes. If we create tooling to make
              prize contests easier, there is the risk that said tooling will be
              used by unscrupulous actors too. The very concept of the prize
              contest could also count as attention hazard.
            </p>
            <p className="my-3">
              <a
                href="https://docs.google.com/document/d/1fQIbl6vi8rs68uj96Zg0zdcwMmx4IdPdrA_ClfmxydI/edit"
                rel="nofollow ugc noopener"
              >
                Here is a summary of all of the risks that we’ve identified and
                our mitigation strategies.
              </a>
            </p>
            <p className="my-3">
              A rich terrorism funder could, for example, copy our approach and
              build an analogous platform where they promise millions of dollars
              to donors who fund speculative approaches to terrorism, such as
              terror attacks that only work out in 1 in 10 attempts. We would
              not allow such projects on our platform or a scoring procedure
              with such goals, but that doesn’t keep terrorists from building
              their own clone of our platform.
            </p>
            <p className="my-3">
              This doesn’t need to be obviously ill-intentioned (though
              terrorists probably also consider themselves to be heroes). You
              could imagine someone cloning our platform to fund grassroots
              nuclear fusion research, which might lead to accidental nuclear
              chain reactions in the basements of hobby physicists in densely
              populated cities around the world.
            </p>
            <p className="my-3">
              <Link
                className="link"
                href="https://forum.effectivealtruism.org/posts/7kqL4G5badqjskYQs/toward-impact-markets-1%23Definition"
              >
                The Impact Attribution Norm
              </Link>{' '}
              alleviates this problem to (roughly) the extent to which it is
              adopted (see the question about measurement above). Yet it is not
              obvious that it will reliably be applied the way we would like to
              see it applied.{' '}
              <Link
                className="link"
                href="https://forum.effectivealtruism.org/posts/74rz7b8fztCsKotL6/impact-markets-may-incentivize-predictably-net-negative"
              >
                This article is a good summary of its limits
              </Link>
              .{' '}
              <Link
                className="link"
                href="https://forum.effectivealtruism.org/posts/74rz7b8fztCsKotL6/impact-markets-may-incentivize-predictably-net-negative?commentId%3D7t7hRntZTMqiaMKBA%23comments"
              >
                See also our comment
              </Link>
              . Consider for example:
            </p>
            <ol className="list-decimal list-outside m-2 ml-10">
              <li>
                Someone might wrongly think that the impact evaluators will
                reward them for posting an article that contains some dangerous
                info hazards.
              </li>
              <li>
                This can also happen if they don’t think that the particular{' '}
                impact evaluators will reward them but just that at some point
                there will be impact evaluators that will reward them.
              </li>
              <li>
                Finally, it can happen that the impact evaluators are actually
                mistaken about the value of some impact and that their mistaken
                evaluation is predictable. This applies in particular (but not
                only) to actions that can turn out very well or very badly –
                might save lives or destroy civilization – but so happen to turn
                out well. The longer the duration betwee n the launch of the
                project and the evaluation, the greater the risk that the prize
                committee will see only how well it turned out and ignore the
                other possible world where it did not.
              </li>
            </ol>
            <p className="my-3">
              These risks mostly seem like “black swan” risks to us –
              deleterious but highly unlikely risks. We’re also quite confident
              that we can prevent them from happening on our platform by
              carefully moderating all activity.
            </p>
            <p className="my-3">
              Finally, there is always the question how easy it is already for
              unscrupulous actors to achieve their ends and why they are not
              doing it already. It is quite easy for an unscrupulous millionaire
              to promise a big reward for something like nuclear fusion simply
              by tweeting it. But this is not currently a major problem. So the
              legal safeguards (or some other mechanisms) that also apply to our
              solution must be working fairly well. That said,{' '}
              <a
                href="https://docs.google.com/document/d/1fQIbl6vi8rs68uj96Zg0zdcwMmx4IdPdrA_ClfmxydI/edit"
                rel="nofollow noopener"
              >
                we’re not solely relying on them
              </a>
              .
            </p>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="h.r75d4xs2318l">
          <Accordion.Control>
            Isn’t it in the interest of funders to promise funding but then not
            pay up?
          </Accordion.Control>
          <Accordion.Panel>
            <p className="my-3">
              Seemingly the best outcome for funders is to incentivize excellent
              work with the promise of a prize but then not reward them at all
              but to instead put the money into prospective funding of
              additional impactful work.
            </p>
            <p className="my-3">
              That is a shortsighted strategy as no one will trust a funder
              again if they’ve pulled this trick once. I would go further and
              suggest that donors should not rely on new funders to pay up
              unless they have a history of being trustworthy. For funders this
              means that it’s probably in their interest to gradually ramp up
              their prizes, so that they can build up trust more cheaply.
              Another option is escrow.
            </p>
            <p className="my-3">
              Eventually we hope to have tradable impact credits so that donors
              can assume that any funder who suddenly vanishes will thus leave
              the price at an unexpectedly low level which other funders will
              immediately use to “buy the dip.”
            </p>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="h.2jwn8eyhczyl">
          <Accordion.Control>
            Does uncertainty really decrease over time?
          </Accordion.Control>
          <Accordion.Panel>
            <p className="my-3">
              <Link
                className="link"
                href="https://impactmarkets.substack.com/p/chaining-retroactive-funders"
              >
                This article touches on this question.
              </Link>{' '}
              I don’t think it’s important whether there is always more evidence
              of impact at a later point. Impact markets will just be most
              interesting for projects for which that is true.
            </p>
            <p className="my-3">
              The second part of the answer is that we think that there is a
              substantial number of projects for which this is true.
            </p>
            <p className="my-3">
              An example: You can usually divide your uncertainty about how a
              project – say, a book – turns out into two multiplicative parts:
              the probability that the book gets written at all and the
              impact-over-probability distribution of the finished book if it
              gets written. Once you know whether the book got written or not,
              that product collapses into just the second factor (minus the “if
              &hellip;”).
            </p>
            <p className="my-3">
              This only goes through if you take uncertainty to mean something
              like the difference between the best and the worst or the 99st and
              the 1th percentile outcomes, which may be a bit unintuitive. If
              you think of uncertainty as variance, and your fully written book
              has either an extremely positive or an extremely negative impact,
              then added uncertainty over whether the book has really been
              written adds another cluster of neutral outcomes in the middle
              between the extremes. It does not reduce (or increase) the
              difference between the extremes, but it does reduce the variance.
            </p>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="h.rt1a9x5wy2y4">
          <Accordion.Control>
            Do impact markets risk centralizing funding?
          </Accordion.Control>
          <Accordion.Panel>
            <p className="my-3">
              The whole point of impact markets is to decentralize funding – so
              might they perversely increase it? The argument goes that the
              current scoring rule allows for truly exceptionally good donations
              – the first donation to a project as amazing as{' '}
              <Link className="link" href="https://longtermrisk.org/msr">
                Evidential Cooperation in Large Worlds
              </Link>{' '}
              might’ve been a substantial donation. Whoever the donor might be,
              they’d get an enormous score boost even though they were only
              right once. This boost might push them to the top of our ranking
              for many years until finally enough other donors have gradually
              accrued comparable scores. That seems unlikely but also
              undesirable.
            </p>
            <p className="my-3">
              One variation that we’re trialing is a score that does not take
              the size of a donation into account but just the earliness. Every
              project has a first donation, so even the first donations to great
              projects could no longer be as remarkable as a substantial first
              donation to a great project could’ve been under the size-weighted
              scoring rule.
            </p>
            <p className="my-3">
              Another remedy is to have scores decay over time. One solution
              we’re trialing is to have a score that only takes into account
              donations from the past year.
            </p>
            <p className="my-3">
              We’ll keep monitoring this potential issue and react in case it
              does manifest.
            </p>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="top-charities">
          <Accordion.Control>
            Do impact markets detract from top charities?
          </Accordion.Control>
          <Accordion.Panel>
            <p className="my-3">
              In contrast to the previous question: If impact markets succeed in
              their mission to decentralize funding, might they thereby detract
              from the top charities of GiveWell or Animal Charity Evaluators?
            </p>
            <p className="my-3">
              That’s not automatically a bad thing, but (1) if there is no
              funding overhang, and (2) if our top donors are not sufficiently
              astute, the average project on impact markets might be worse than
              the average top charity. If donors still switch to impact markets,
              then impact markets might do harm.
            </p>
            <p className="my-3">
              I’ve talked to Animal Charity Evaluators about this, and they
              don’t seem particularly concerned about it. They welcome the
              diversity of opinions and even run their own “movement grants”
              program to support smaller charities that don’t yet have the scale
              and track record to become top or standout charities. GiveWell,
              too, has made grants of this sort, and its staff is also open
              about their private donations, which sometimes capitalize on
              smaller, less legible funding gaps that they’re aware of.
            </p>
            <p className="my-3">
              Nonetheless this is something that we want to monitor closely. We
              can ask donors and compare their impact market donations to
              donations they’ve made in the past. But more importantly, we can
              compare how our impact market projects compare against top
              charities.
            </p>
            <p className="my-3">
              Ídeally of course the impact market becomes a place where you can
              find and donate to all the future top charities. We’re planning to
              incentivze that by boosting the scores of projects that were
              instrumental in the genesis of new top and standout charities.
            </p>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </div>
  )
}

WhyImpactMarkets.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

export default WhyImpactMarkets
