import React from "react";
import LogoPage from "../../../../../components/LogoPage";
import Conditions from "../../../../BA/Conditions/Conditions";

const BuyerConditions = ({ route, navigation }) => {
  const { transaction, property } = route.params;
  return (
    <LogoPage navigation={navigation} >
      <Conditions transaction={transaction} property={property} notAgent={true} />
    </LogoPage>
  );
};

export default BuyerConditions;
