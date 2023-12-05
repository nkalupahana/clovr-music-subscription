import React, {cloneElement, useState, useEffect} from "react";
import {
  FaInstagram,
  FaTwitter,
  FaTwitch,
  FaDiscord,
  FaYoutube,
  FaSpotify,
} from "react-icons/fa";

const SOCIALS = [
  {
    name: "Instagram",
    icon: <FaInstagram size={32} />,
    handle: "@clovrrecords",
    href: "https://www.instagram.com/clovvrecords",
  },

  {
    name: "Twitch",
    icon: <FaTwitch size={32} />,
    handle: "@clovr_records",
    href: "https://m.twitch.tv/clovr_records",
  },
  {
    name: "Discord",
    icon: <FaDiscord size={32} />,
    handle: "@clovr_records",
    href: "https://discord.com/invite/3szPBEuUr3",
  },
  {
    name: "Youtube",
    icon: <FaYoutube size={32} />,
    handle: "@clovrmusic",
    href: "https://www.youtube.com/@clovrmusic",
  },
  {
    name: "Spotify",
    icon: <FaSpotify size={32} />,
    handle: "@CLOVR",
    href: "https://open.spotify.com/user/cjn2fn9efuibns4f1k8kotgmq?si=9f11c4931dd545a7&nd=1&dlsi=7348434f80dd4dea",
  },
];

export const LandingFooter = () => {
  const [iconSize, setIconSize] = useState<number>(24); // Default to 5

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setIconSize(24);
      } else {
        setIconSize(32);
      }
    };

    // Set the initial value
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex flex-row items-center md:w-[90%] md:justify-between">
      <div>
        <h4>COPYRIGHT © 2023 CLOVR. ALL RIGHTS RESERVED</h4>
      </div>
      <div className="flex flex-wrap gap-4 justify-center mt-4">
        {SOCIALS.map((social, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center justify-center cursor-pointer"
            onClick={() => window.open(social.href)}
          >
            {cloneElement(social.icon, { size: iconSize })}
            <span className="text-gray-400 text-xs md:text-sm">{social.handle}</span>
          </div>
        ))}
      </div>
    </div>
  );
};