import React, { useContext, useState } from "react";
import { Input } from "react-native-elements";
import appApi from "../../../api/appApi";
import LogoPage from "../../../components/LogoPage";
import { Context as UserContext } from "../../../context/UserContext";
import { displayError, fetchAuthToken } from "../../../utils/misc";
import { RadioButton, Switch } from "react-native-paper";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Text, Toast } from "native-base";
import colors from "../../../constants/colors";

const AddLawyer = ({ route, navigation }) => {
  const { property } = route.params;

  const {
    state: { user },
  } = useContext(UserContext);

  const [cellphone, setCellphone] = useState("");
  const [ref, setRef] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [notification, setNotification] = useState("0");
  const [isLoading, setIsLoading] = useState(false);

  const addLawyer = async () => {
    try {
      setIsLoading(true);
      const token = await fetchAuthToken();
      const data = new FormData();
      data.append("property_id", property.transaction_id);
      data.append("seller_agent_id", user.unique_id);
      data.append("first_name", firstName);
      data.append("last_name", lastName);
      data.append("phone", cellphone);
      data.append("email", email);
      const response = await appApi.post(`/add_seller_lawyer.php`, data, {
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

export default AddLawyer;

const styles = StyleSheet.create({
  label: {
    color: colors.white,
  },
});
