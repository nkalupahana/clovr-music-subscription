import React from "react";
import { Divider } from "@nextui-org/react";
import { Accordion, AccordionItem } from "@nextui-org/react";
import PageHeader from "@/components/PageHeader";

const About = () => {
  return (
    <div className="flex flex-col justify-start  min-h-screen p-2 gap-2">
      
        <PageHeader>About</PageHeader>
      
      <div className="about">
        <div className="about-text">
          <h1>About Our Company</h1>
          <p>
            CLOVR Music is a multi-faceted record label. We aim to provide
            excellent quality music and also to support the community of
            producers through our sample packs, community, and other resources.
          </p>
          ‍{" "}
          <p>
            We focus primarily on lo-fi beats and chillhop with an emphasis on
            good melodies, an upbeat vibe, and sometimes a jazzy edge. We try to
            have a distinct sound by emphasizing the positive emotion that music
            can bring.
          </p>
        </div>
        <div className="about-image"></div>
      </div>

      <div>
        <Divider className="divider1"></Divider>
      </div>

      <div className="sponsorship">
        <h1>Sponsorships</h1>
        <p>
          Do you also love Lofi and Gaming? We want to work with you! We&apos;re
          currently looking for streamers, content creators and influencers that
          would like to earn extra income by sharing our music to the world.
        </p>
        <p>
          You&apos;ll get your own personal link that track link-clicks towards
          our DMCA / Copyright Free Gaming Lofi Spotify playlist. You are free
          to expose the link in any way you like. Keep it in your Twitch
          Biography, add it to your YouTube video description or add it to your
          Instagram.
        </p>
        <p>
          You can choose to actively market the link to your viewers and
          followers by announcing it, to increase your income further, or to
          keep it in silence in your text field and let the viewers slide in if
          they like to.
        </p>
        <p>
          We provide you with the relevant playlist artwork, a freshly updated
          Spotify playlist with our label releases, and any necessary
          information you might need to get the most success from the
          sponsorship.
        </p>
        <p>Contact us for more info.</p>
      </div>

      <div>
        <Divider className="divider2"></Divider>
      </div>

      <div className="faq">
        <h2>Frequently Asked Questions</h2>
        <Accordion>
          <AccordionItem
            key="1"
            aria-label="Accordion 1"
            title="What types of music do you offer?"
          >
            {"Insert words here"}
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
    </div>
  );
};

export default About;
