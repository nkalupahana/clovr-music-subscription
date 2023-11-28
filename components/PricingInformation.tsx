import { Accordion, AccordionItem } from "@nextui-org/react";
import { PricingCard } from "./PricingCard";
export const PricingInformation = () => {
  return (
    <>
      <h1 className="text-4xl font-bold text-center mt-16">
        About Our Pricing Plans
      </h1>
      <div className="flex flex-col items-center justify-center w-[75%] mt-8 mb-8">
        <h2 className="text-3xl text-gray-400 text-center mt-16">
          Get unlimited access to our music and sound effects catalog for your
          videos, streams and podcasts. Our license comes with all necessary
          rights included.
        </h2>
        <div className="flex flex-row mt-16 gap-12">
          <PricingCard
            price={"$3.99 / Month"}
            name={"1 Channel"}
            image={"CLOVR_bear_2.png"}
          />
          <PricingCard
            price={"$9.99 / Month"}
            name={"3 Channels"}
            image={"CLOVR_bear_3.png"}
          />
          <PricingCard
            price={"$12.99 / Month"}
            name={"5 Channels"}
            image={"CLOVR_bear_4.png"}
          />
        </div>

        <Accordion>
          <AccordionItem
            key="1"
            aria-label="Accordion 1"
            title="How Does this work??"
          >
            lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
            quod voluptas, quibusdam, quia, quos voluptatum voluptatibus quae
            voluptate quas quibusdam, quia, quos voluptatum voluptatibus quae
            voluptate quas
          </AccordionItem>
          <AccordionItem
            key="2"
            aria-label="Accordion 2"
            title="How can I license music from you?"
          >
            {"More words here"}
          </AccordionItem>
          <AccordionItem
            key="3"
            aria-label="Accordion 3"
            title="Blah blah blah"
          >
            {"More words"}
          </AccordionItem>
        </Accordion>
      </div>
    </>
  );
};
