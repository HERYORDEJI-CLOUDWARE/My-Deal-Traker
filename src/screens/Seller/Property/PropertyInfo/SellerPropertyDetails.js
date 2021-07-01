import React from "react";
import SaPropertyInfo from "../../../SA/Property/views/PropertyTab/PropertyInfo";

const SellerPropertyDetails = ({ route, navigation }) => {


  const { property } = route.params;


  return (
    <>
      <SaPropertyInfo route={{ params: { property } }} navigation={navigation} />
    </>
  );
};

export default SellerPropertyDetails;
