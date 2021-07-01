import React, { useContext, useState } from "react";
import { TouchableOpacity } from "react-native";
import { View } from "react-native";
import { Input } from "react-native-elements";
import LogoPage from "../../../components/LogoPage";
import colors from "../../../constants/colors";
import { displayError, fetchAuthToken } from "../../../utils/misc";
import { Context as UserContext } from "../../../context/UserContext";
import appApi from "../../../api/appApi";
import { Toast } from "native-base";
import { Text } from "react-native";

const BaAddLawyer = ({ navigation, route }) => {
  const { transaction } = route.params;

  const {
    state: { user },
  } = useContext(UserContext);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [cellphone, setCellphone] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  const addLawyer = async () => {
    try {
      setIsLoading(true);
      const token = await fetchAuthToken();
      const data = new FormData();
      data.append("transaction_id", transaction.transaction_id);
      data.append("property_id", transaction.property_id);
      data.append("buyer_agent_id", user.unique_id);
      data.append("first_name", firstName);
      data.append("last_name", lastName);
      data.append("phone", cellphone);
      data.append("email", email);
      const response = await appApi.post(`/add_buyer_lawyer.php`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.response.status == 200) {
        navigation.goBack();
      } else {
        Toast.show({
          type: "warning",
          text: response.data.response.message,
        });
      }
      setIsLoading(false);
    } catch (error) {
      displayError(error);
      setIsLoading(false);
    }
  };

  return (
    <LogoPage navigation={navigation} >
      <View style={{ paddingHorizontal: 20 }}>
        <Input
          placeholder="First name"
          value={firstName}
          onChangeText={setFirstName}
          inputStyle={{ color: colors.white }}
          placeholderTextColor={colors.lightGrey}
        />
        <Input
          placeholder="Last name"
          value={lastName}
          onChangeText={setLastName}
          inputStyle={{ color: colors.white }}
          placeholderTextColor={colors.lightGrey}
        />

        <Input
          placeholder="Cellphone"
          value={cellphone}
          onChangeText={setCellphone}
          inputStyle={{ color: colors.white }}
          placeholderTextColor={colors.lightGrey}
          keyboardType="number-pad"
        />

        <Input
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          inputStyle={{ color: colors.white }}
          placeholderTextColor={colors.lightGrey}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TouchableOpacity
          style={{
            backgroundColor: colors.white,
            alignSelf: "center",
            paddingHorizontal: 20,
            paddingVertical: 10,
            marginTop: 30,
          }}
          onPress={addLawyer}
          disabled={isLoading}
        >
          <Text style={{ color: colors.brown }}>
            {isLoading ? "Loading..." : "Save"}
          </Text>
        </TouchableOpacity>
      </View>
    </LogoPage>
  );
};

export default BaAddLawyer;
