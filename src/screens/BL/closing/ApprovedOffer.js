import { useFocusEffect } from "@react-navigation/native";
import { Toast } from "native-base";
import React, { useCallback, useState } from "react";
import { Text } from "react-native";
import { View } from "react-native";
import { TouchableOpacity } from "react-native";
import { ActivityIndicator } from "react-native";
import appApi from "../../../api/appApi";
import ListItem from "../../../components/ListItem";
import LogoPage from "../../../components/LogoPage";
import colors from "../../../constants/colors";
import { navigate } from "../../../nav/RootNav";
import { displayError, fetchAuthToken } from "../../../utils/misc";

const ApprovedOffer = ({ route, navigation }) => {
  const { property } = route.params;

  const [isLoading, setIsLoading] = useState(true);
  const [approvedOffer, setApprovedOffer] = useState();
  const [transaction_id, setTransaction_id] = useState();

  useFocusEffect(
    useCallback(() => {
      getApprovedOffer();
    }, [])
  );

  const getApprovedOffer = async () => {
    try {
      const token = await fetchAuthToken();
      const response = await appApi.get(
        `/get_property_approved_offer.php?property_id=${property.transaction_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.response.status == 200) {
        setApprovedOffer(
          JSON.parse(
            response.data.response.data.offer_conversation_json
          ).reverse()[0]
        );
        setTransaction_id(response.data.response.data.transaction_id);
      } else {
        Toast.show({
          type: "warning",
          text: response.data.response.message,
        });
      }
      setIsLoading(false);
    } catch (error) {
      displayError(error);
    }
  };

  if (isLoading) {
    return (
      <LogoPage navigation={navigation}>
        <ActivityIndicator size="large" color={colors.white} />
      </LogoPage>
    );
  }

  return (
    <LogoPage navigation={navigation} title="Approved Offer" >
      <View>
        <ListItem
          title="Buyer Agent Name"
          value={approvedOffer.by_who.buyer_name}
        />
        <ListItem title="Price" value={approvedOffer.by_who.price} />

        <TouchableOpacity
          style={{
            paddingVertical: 10,
            backgroundColor: colors.white,
            width: 200,
            marginTop: 30,
            alignSelf: "center",
          }}
          onPress={() => {
            navigate("closeDeal", {transaction_id});
          }}
        >
          <Text style={{ textAlign: "center", color: colors.bgBrown }}>
            CLOSE DEAL
          </Text>
        </TouchableOpacity>
      </View>
    </LogoPage>
  );
};

export default ApprovedOffer;
