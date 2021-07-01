import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useContext } from "react";
import LogoPage from "../../../../../components/LogoPage";
import { Context } from "../../../../../context/UserContext";
import { getRole } from "../../../../../utils/misc";
import PropertyTab from "../../PropertyTab";

const PropertyInfo = ({ route, navigation }) => {
  const { property, transaction, isLoading, fetchTransaction } = route.params;

  const {
    state: { user },
  } = useContext(Context);

  useFocusEffect(
    useCallback(() => {
      fetchTransaction();
    }, [])
  );



  return (
    <React.Fragment>
      <LogoPage navigation={navigation}  title={"Signed in as: " + getRole(user.role)}>
        <PropertyTab
          property={property}
          transaction={transaction}
          isLoading={isLoading}
          navigation={navigation}
        />
      </LogoPage>
    </React.Fragment>
  );
};

export default PropertyInfo;
