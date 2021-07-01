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

const BaLawyerView = ({ route, notAgent, navigation }) => {
  const { transaction } = route.params;

  const [isLoading, setIsLoading] = useState(true);
  const [transactionLawyer, setTransactionLawyer] = useState(null);

  useFocusEffect(
    useCallback(() => {
      fetchListLawyer();
    }, [])
  );

  const fetchListLawyer = async () => {
    try {
      const token = await fetchAuthToken();
      const response = await appApi.get(
        `/get_property_buyer_lawyer.php?transaction_id=${transaction.transaction_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsLoading(false);
      if (response.data.response.status == 200) {
        setTransactionLawyer(response.data.response.data);
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

  if (!transactionLawyer) {
    return (
      <LogoPage navigation={navigation} >
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

          {!notAgent && (
            <TouchableOpacity
              style={{
                paddingVertical: 10,
                backgroundColor: colors.white,
                alignSelf: "center",
                paddingHorizontal: 20,
                marginTop: 20,
                borderRadius: 5,
              }}
              onPress={() => navigate("baAddLawyer", { transaction })}
            >
              <Text style={{ color: colors.bgBrown }}>Add Lawyer</Text>
            </TouchableOpacity>
          )}
        </View>
      </LogoPage>
    );
  }

  return (
    <LogoPage navigation={navigation} >
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
          <ListItem title="First Name" value={transactionLawyer.first_name} />
          <ListItem title="Last Name" value={transactionLawyer.last_name} />
          <ListItem title="Email" value={transactionLawyer.email} />
          <ListItem title="Phone Number" value={transactionLawyer.phone} />
        </Card>
      </View>
    </LogoPage>
  );
};

export default BaLawyerView;

const styles = StyleSheet.create({
  text: {
    paddingLeft: 20,
    paddingBottom: 10,
  },
});
