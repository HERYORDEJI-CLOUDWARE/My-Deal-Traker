import { AntDesign } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { Card, Container, Text, Toast } from "native-base";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import appApi from "../../../api/appApi";
import CustomHeader from "../../../components/CustomHeader";
import ListItem from "../../../components/ListItem";
import LogoPage from "../../../components/LogoPage";
import colors from "../../../constants/colors";
import { navigate } from "../../../nav/RootNav";
import { displayError, fetchAuthToken } from "../../../utils/misc";

const ListingLawyer = ({ route, navigation }) => {
  const { property } = route.params;

  const [isLoading, setIsLoading] = useState(true);
  const [propertyLawyer, setPropertyLawyer] = useState(null);

  useFocusEffect(
    useCallback(() => {
      fetchListLawyer();
    }, [])
  );

  const fetchListLawyer = async () => {
    try {
      const token = await fetchAuthToken();
      const response = await appApi.get(
        `/get_property_seller_lawyer.php?property_id=${property.transaction_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsLoading(false);
      if (response.data.response.status == 200) {
        setPropertyLawyer(response.data.response.data);
      } else {
        Toast.show({
          type: "warning",
          text: response.data.response.message,
        });
      }
    } catch (error) {
      displayError(error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Container style={{ backgroundColor: colors.bgBrown }}>
        <CustomHeader navigation={navigation} />
        <ActivityIndicator size="large" color={colors.white} />
      </Container>
    );
  }

  if (!propertyLawyer) {
    return (
      <LogoPage navigation={navigation}>
        <View>
          <View style={{ marginTop: 50 }} />
          <AntDesign
            name="warning"
            size={100}
            style={{ alignSelf: "center" }}
            color={colors.white}
          />
          <Text style={{ color: colors.white, textAlign: "center" }}>
            No lawyer has been added to this property
          </Text>

          <TouchableOpacity
            style={{
              paddingVertical: 10,
              backgroundColor: colors.white,
              alignSelf: "center",
              paddingHorizontal: 20,
              marginTop: 20,
              borderRadius: 5,
            }}
            onPress={() => navigate("addListingLawyer", { property })}
          >
            <Text style={{ color: colors.bgBrown }}>Add Lawyer</Text>
          </TouchableOpacity>
        </View>
      </LogoPage>
    );
  }

  return (
    <LogoPage navigation={navigation}>
      <View>
        <Card style={{ backgroundColor: colors.bgBrown }}>
          <Text
            style={{
              textAlign: "center",
              paddingBottom: 25,
              paddingTop: 15,
              color: colors.white,
            }}
          >
            A Lawyer has been added for this property
          </Text>
          <ListItem title="First Name" value={propertyLawyer.first_name} />
          <ListItem title="Last Name" value={propertyLawyer.last_name} />
          <ListItem title="Email" value={propertyLawyer.email} />
          <ListItem title="Phone Number" value={propertyLawyer.phone} />
        </Card>
      </View>
    </LogoPage>
  );
};

export default ListingLawyer;

const styles = StyleSheet.create({
  text: {
    paddingLeft: 20,
    paddingBottom: 10,
  },
});
