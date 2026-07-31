import React from 'react'

export type AboutTopic = {
  description: string
  title: string
}

type AboutTopicsSectionProps = {
  closing: string
  heading: string
  intro: string
  topics: AboutTopic[]
}

export const AboutTopicsSection: React.FC<AboutTopicsSectionProps> = ({
  closing,
  heading,
  intro,
  topics,
}) => {
  return (
    <section aria-labelledby="about-topics-heading" className="my-10 md:my-12">
      <h2
        className="font-serif text-2xl font-semibold tracking-wide text-brand-heading md:text-3xl"
        id="about-topics-heading"
      >
        {heading}
      </h2>
      <p className="mt-4 font-sans text-base leading-[1.9] tracking-wide text-brand-body">{intro}</p>

      <ul className="mt-6 divide-y divide-brand-border/60 rounded-md border border-brand-border bg-brand-card/60 md:mt-8">
        {topics.map((topic) => (
          <li className="px-5 py-5 md:px-6 md:py-6 lg:px-8" key={topic.title}>
            <div className="heading-sage-bar">
              <h3 className="font-serif text-lg font-semibold tracking-wide text-brand-heading md:text-xl">
                {topic.title}
              </h3>
            </div>
            <p className="mt-2 font-sans text-sm leading-[1.85] tracking-wide text-brand-body md:text-base md:leading-[1.9]">
              {topic.description}
            </p>
          </li>
        ))}
      </ul>

      <p className="mt-6 font-sans text-base leading-[1.9] tracking-wide text-brand-body md:mt-8">
        {closing}
      </p>
    </section>
  )
}
