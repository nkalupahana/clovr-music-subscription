import React from "react";
import { Card, CardBody, Image, Button } from "@nextui-org/react";
export const PricingCard = ({
  price,
  name,
  image,
}: {
  price: string;
  name: string;
  image: string;
}) => {
  return (
    <Card>
      <CardBody>
        <div className="flex flex-col items-center justify-center">
          <Image
            alt="Album cover"
            className="object-cover w-full h-48"
            shadow="md"
            src={image}
          />
          <h1 className="text-3xl font-bold text-center mt-8">{name}</h1>
          <h2 className="text-xl text-gray-400 text-center mt-8">{price}</h2>
        </div>
      </CardBody>
    </Card>
  );
};
