import React from "react";
import { Text } from "react-native";
import LogoPage from "../../../../components/LogoPage";
import DealProgress from "../../../BA/DealProgress/DealProgress";

const BuyerDealProgress = ({ transaction }) => {
  return (
    <>
      <DealProgress transaction={transaction} />
    </>
  );
};

export default BuyerDealProgress;
