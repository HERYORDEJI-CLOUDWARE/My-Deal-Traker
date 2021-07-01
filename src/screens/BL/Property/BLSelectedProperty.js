import React from "react";
import { View } from "react-native";
import BLFooterTabs from "./FooterTab/BLFooterTabs";

const BLSelectedProperty = ({ route, navigation }) => {
  const {property} = route.params;
  return (
    <>
      <BLFooterTabs property={property} navigation={navigation} />
    </>
  );
};

export default BLSelectedProperty;
