import React from "react";
import LogoPage from "../../../../components/LogoPage";
import PropertyTab from "../../../BA/Property/PropertyTab";

const BuyerPropertyDetails = ({ route, navigation }) => {
  const { property, transaction } = route.params;
  return (
    <LogoPage navigation={navigation}>
      <PropertyTab
        property={property}
        transaction={transaction}
        isLoading={false}
        hideBtn={true}
      />
    </LogoPage>
  );
};

export default BuyerPropertyDetails;
