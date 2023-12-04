import { Accordion, AccordionItem } from "@nextui-org/react";
import { PricingCard } from "./PricingCard";
export const PricingInformation = () => {
  return (
    <>
      <h1 className="text-4xl font-bold text-center mt-8">
        About Our Pricing Plans
      </h1>
      <div className="flex flex-col items-center justify-center w-[75%] mt-8 mb-8">
        <h2 className="text-xl md:text-3xl text-gray-400 text-center mt-16">
          Get unlimited access to our music and sound effects catalog for your
          videos, streams and podcasts. Our license comes with all necessary
          rights included.
        </h2>
        <div className="flex flex-row mt-16 justify-evenly">
          <PricingCard
            numChannels={1}
            monthlyPrice={3.99}
            image={"CLOVR_bear_2.png"}
          />
          <PricingCard
            numChannels={3}
            monthlyPrice={9.99}
            image={"CLOVR_bear_3.png"}
          />
          <PricingCard
            numChannels={5}
            monthlyPrice={13.99}
            image={"CLOVR_bear_4.png"}
          />
        </div>

        <Accordion>
          <AccordionItem
            key="1"
            aria-label="Accordion 1"
            title="How Does this work?"
          >
            Once you have signed up for a subscription, you will need to enter
            the Uniform Resource Identifier (URI) of your YouTube channel. This
            step allows us to whitelist your channel, granting permission for
            its use within our platform.
          </AccordionItem>
          <AccordionItem
            key="2"
            aria-label="Accordion 2"
            title="What types of music do you offer?"
          >
            Instrumental Lofi, Chill Hop, Jazz Hop and Ambient music
          </AccordionItem>
          <AccordionItem
            key="3"
            aria-label="Accordion 3"
            title="Can I Monetize my Channel with your music?"
          >
            Absolutely! You have the freedom to monetize your content while
            using our music in various formats like Reels, Stories, Vlogs, Music
            Mixes, and more.
          </AccordionItem>
          <AccordionItem
            key="4"
            aria-label="Accordion 4"
            title="Can i License music from you?"
          >
            If you have specific requirements, such as licensing a song for a
            commercial or ads campaign, please contact us at
            info@clovrrecords.com. Our prices are competitive, lower than those
            of our competitors, and we offer a straightforward and swift
            communication process{" "}
          </AccordionItem>
        </Accordion>
      </div>
    </>
  );
};
