import React from "react";
import PageHeader from "@/components/PageHeader";
import { PricingInformation } from "@/components/PricingInformation";
const Pricing = () => {
  return (
    <div className="flex flex-col items-center justify-start py-2 ">
      <PricingInformation />
    </div>
  );
};

export default Pricing;
