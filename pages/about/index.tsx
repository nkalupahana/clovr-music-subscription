import React from "react";
import { Divider } from "@nextui-org/react";
import { Accordion, AccordionItem } from "@nextui-org/react";
import { Card, CardHeader, CardBody, Image } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { LandingFooter } from "@/components/LandingFooter";

const About = () => {
  const list = [
    {
      title: "Fadrr",
      body: "This platform serves as a marketplace specifically tailored for lo-fi sample packs. It provides a curated space for artists to access and purchase high-quality sample packs, fostering creativity and production within the lo-fi music genre.",
      button: "https://fadrr.com/",
      logo: "/fadrr_logo.png",
    },
    {
      title: "Submity",
      body: "This platform facilitates a submission system where artists can submit their music for consideration, and curators can review these submissions to potentially include the tracks in their playlists. It's a channel for artists to share their work and for curators to discover new talent.",
      button: "Submity.co",
      logo: "/submity_logo.png",
    },

    {
      title: "Discord",
      body: "Clovr Records maintains an active presence on Discord, inviting individuals to join their community. This channel likely serves as a space for networking, sharing updates, providing opportunities, and fostering collaboration among artists, producers, and music enthusiasts.",
      button: "https://discord.com/invite/3szPBEuUr3",
      logo: "/discord_logo.png",
    },
  ];

  return (
    <div>
      <div>
        <div className="mx-5 my-5">
          <p>
            <span className="font-bold">Clovr Records</span> is a record label
            known for its focus on music production, particularly in genres like
            lo-fi, gaming, and other similar music categories. They have gained
            attention for providing DMCA/Copyright-free music, catering to
            content creators, streamers, and influencers who seek music for
            their videos without worrying about copyright issues.
          </p>
        </div>
        <div className="about-image"></div>
      </div>
      <Divider className="my-4" />
      <div className="mx-5 my-5">
        <div className="space-y-5">
          <h1 className="text-2xl font-medium">Associated Links</h1>
          <p className="text-lg text-default-400">
            Clovr Records has expanded its services beyond music production,
            offering various platforms and opportunities for both artists and
            creators within the music industry:
          </p>
          <div className="gap-2 flex  flex-col md:flex-row">
            {list.map((item, index) => (
              <Card key={index}>
                <CardHeader className="justify-between">
                  <Image
                    src={item.logo}
                    className="mx-auto"
                    height={200}
                    width={200}
                    alt="Submity Logo"
                  />
                </CardHeader>
                <CardBody className="text-small justify-between gap-2">
                  <p>{item.body}</p>
                  <Button
                    color="primary"
                    variant="ghost"
                    onClick={() => {
                      window.open(item.button);
                    }}
                  >
                    {item.button}
                  </Button>
                </CardBody>
              </Card>
            ))}
          </div>
          <p className="text-lg text-default-400">
            These platforms and initiatives demonstrate Clovr Records commitment
            to creating a multifaceted ecosystem within the music industry,
            encompassing various facets such as sample pack creation, artist
            submissions, playlist curation, label partnerships, and community
            engagement via Discord.
          </p>
          <p className="text-lg text-default-400">
            To access or participate in these services, interested individuals
            can explore Fadrr.com for lo-fi sample packs, utilize Submity.co to
            submit music or curate playlists, submit music for label
            consideration, and join the Clovr Records community on Discord via
            the provided link.{" "}
          </p>
        </div>
      </div>

      <div>
        <Divider className="divider2"></Divider>
      </div>

      <div>
        <Divider className="divider2"></Divider>
      </div>
      <Divider />
      <div className="mx-5 my-5">
        <h1 className="text-2xl font-medium">Frequently Asked Questions</h1>
        <Accordion>
          <AccordionItem
            key="1"
            aria-label="Accordion 1"
            title="How does it work?"
          >
            {
              "Once you've signed up for a subscription, you'll need to enter the Uniform Resource Identifier (URI) of your YouTube channel. This step allows us to whitelist your channel, granting permission for its use within our platform."
            }
          </AccordionItem>
          <AccordionItem
            key="2"
            aria-label="Accordion 2"
            title="What types of music do you offer?"
          >
            {"Instrumental Lofi, Chill Hop, Jazz Hop and Ambient music."}
          </AccordionItem>
          <AccordionItem
            key="3"
            aria-label="Accordion 3"
            title="Can I Monetize my Channel with your music?"
          >
            {
              "Absolutely! You have the freedom to monetize your content while using our music in various formats like Reels, Stories, Vlogs, Music Mixes, and more."
            }
          </AccordionItem>
          <AccordionItem
            key="4"
            aria-label="Accordion 4"
            title="Can I License music from you?"
          >
            {
              "If you have specific requirements, such as licensing a song for a commercial or ads campaign, please contact us at info@clovrrecords.com. Our prices are competitive, lower than those of our competitors, and we offer a straightforward and swift communication process."
            }
          </AccordionItem>
        </Accordion>
      </div>
      <Divider />
      <div className="mx-5 my-5">
        <h1 className="text-2xl font-medium">Become an Affiliate: </h1>
        <p className="text-lg text-default-400">
          we are actively seeking streamers, content creators, and influencers
          interested in earning extra income by sharing our music with their
          audience.
        </p>
        <p className="text-lg text-default-400">
          Upon joining, you will receive a personalized tracking link that
          monitors clicks leading to our music on Spotify and earn revenue for
          each click generated. You are at liberty to share this link however
          you prefer—whether it is in your Twitch Biography, included in your
          YouTube video descriptions, or featured on your Instagram. Reach out
          to info@clovrrecords.com.
        </p>
      </div>
      <Divider />
      <div className="mx-5 ">
        <LandingFooter />
      </div>
    </div>
  );
};

export default About;
