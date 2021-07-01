import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Text, ActionSheet, Toast } from "native-base";
import colors from "../../../constants/colors";
import { Input } from "react-native-elements";
import { RadioButton, Switch } from "react-native-paper";
import LogoPage from "../../../components/LogoPage";
import { fetchAuthToken } from "../../../utils/misc";
import appApi from "../../../api/appApi";
import { useContext } from "react";
import { Context } from "../../../context/UserContext";
import { ActivityIndicator } from "react-native";
import { navigate } from "../../../nav/RootNav";

const BLClosing = ({ route, navigation }) => {
  const { property } = route.params;
  const {
    state: { user },
  } = useContext(Context);
  const [ref, setRef] = useState("");
  const [notification, setNotification] = useState("0");
  const [cellphone, setCellphone] = useState("");
  const [referralName, setReferralName] = useState("");
  const [refPhone, setRefPhone] = useState("");
  const [current_city, setCurrent_city] = useState("");
  const [currentState, setCurrentState] = useState("");
  const [currentPostal, setCurrentPostal] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const toggleSwitch = () => {
    // setIsEnabled((previousState) => !previousState)
    if (notification) {
      setNotification(0);
    } else {
      setNotification(1);
    }
  };

  const onClosing = async () => {
    try {
      setIsLoading(true);
      const token = await fetchAuthToken();
      const data = new FormData();
      data.append("referral_source", ref);
      data.append("referrer_name", referralName);
      data.append("referrer_phone", refPhone);
      data.append("cellphone", cellphone);
      data.append("city", current_city);
      data.append("state", currentState);
      data.append("postal_code", currentPostal);
      data.append("update_notification", notification);
      data.append("property_transaction_id", property.transaction_id);
      data.append("purchaser_lawyer", 1);
      data.append("user_id", user.unique_id);
      // data.append("current_address", `${current_city} ${currentState} ${currentPostal}`);
      const response = await appApi.post(`/buyer_lawyer.php`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.response.status == 200) {
        Toast.show({
          type: "success",
          text: response.data.response.message,
        });
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
  var BUTTONS = ["Existing client", "Bank", "Agent", "Cancel"];
  var CANCEL_INDEX = 3;

  /*
          <Picker mode="dropdown">
          <Picker.Item label="Select" value="" color={colors.white} />
          <Picker.Item label="Existing client" value="Existing client" />
          <Picker.Item label="Bank" value="Bank" />
          <Picker.Item label="Agent" value="Agent" />
        </Picker>
  */

  return (
    <LogoPage navigation={navigation}>
      <View>
        <Text style={styles.title}>CLOSING</Text>
      </View>

      <View style={{ marginTop: 30 }} />

      <View style={{ paddingHorizontal: 20 }}>
        <View style={styles.item}>
          <Text
            style={[styles.label, { paddingBottom: 30 }]}
            onPress={() => {
              ActionSheet.show(
                {
                  options: BUTTONS,
                  cancelButtonIndex: CANCEL_INDEX,
                  title: "Select Referral Source",
                },
                (buttonIndex) => {
                  if (buttonIndex !== CANCEL_INDEX) {
                    setRef(BUTTONS[buttonIndex]);
                  }
                }
              );
            }}
          >
            Referral Source
          </Text>
          <Text> {ref} </Text>
        </View>

        {ref === "Agent" ? (
          <View>
            <Input
              placeholder="Referral Name"
              value={referralName}
              onChangeText={setReferralName}
              placeholderTextColor={colors.lightGrey}
            />
            <Input
              placeholder="Referral Phone"
              value={refPhone}
              onChangeText={setRefPhone}
              placeholderTextColor={colors.lightGrey}
              keyboardType="phone-pad"
            />
          </View>
        ) : null}

        <View style={{ paddingBottom: 20 }}>
          <Text style={styles.label}>Telephone Number</Text>
          <Input
            inputStyle={{ borderBottomWidth: 0 }}
            containerStyle={{ borderBottomWidth: 0 }}
            style={{ borderBottomWidth: 0 }}
            placeholder="Enter cellphone(s)"
            placeholderTextColor={colors.lightGrey}
            value={cellphone}
            keyboardType="phone-pad"
            onChangeText={setCellphone}
          />
        </View>

        <View style={{ paddingBottom: 0 }}>
          <Text style={styles.label}>Current Address</Text>
          <Input
            inputStyle={{ borderBottomWidth: 0 }}
            containerStyle={{ borderBottomWidth: 0 }}
            style={{ borderBottomWidth: 0 }}
            placeholder="City / Town"
            placeholderTextColor={colors.lightGrey}
            value={current_city}
            onChangeText={setCurrent_city}
          />
        </View>

        <View style={{ paddingBottom: 0 }}>
          <Input
            inputStyle={{ borderBottomWidth: 0 }}
            containerStyle={{ borderBottomWidth: 0 }}
            style={{ borderBottomWidth: 0 }}
            placeholder="Enter State"
            placeholderTextColor={colors.lightGrey}
            value={currentState}
            onChangeText={setCurrentState}
          />
        </View>

        <View style={{ paddingBottom: 20 }}>
          <Input
            inputStyle={{ borderBottomWidth: 0 }}
            containerStyle={{ borderBottomWidth: 0 }}
            style={{ borderBottomWidth: 0 }}
            placeholder="Enter Postal/Zip code"
            placeholderTextColor={colors.lightGrey}
            value={currentPostal}
            onChangeText={setCurrentPostal}
          />
        </View>

        {/* <Text style={styles.label}>New Address</Text>

        <View style={{ paddingBottom: 0 }}>
          <Input
            inputStyle={{ borderBottomWidth: 0 }}
            containerStyle={{ borderBottomWidth: 0 }}
            style={{ borderBottomWidth: 0 }}
            placeholder="City/Town"
            placeholderTextColor={colors.lightGrey}
          />
        </View>

        <View style={{ paddingBottom: 0 }}>
          <Input
            inputStyle={{ borderBottomWidth: 0 }}
            containerStyle={{ borderBottomWidth: 0 }}
            style={{ borderBottomWidth: 0 }}
            placeholder="State"
            placeholderTextColor={colors.lightGrey}
          />
        </View>

        <View style={{ paddingBottom: 0 }}>
          <Input
            inputStyle={{ borderBottomWidth: 0 }}
            containerStyle={{ borderBottomWidth: 0 }}
            style={{ borderBottomWidth: 0 }}
            placeholder="Postal/Zip code"
            placeholderTextColor={colors.lightGrey}
          />
        </View> */}

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 30,
          }}
        >
          <View style={{ alignSelf: "flex-start" }}>
            <Switch
              value={notification == "0" ? false : true}
              onValueChange={toggleSwitch}
              trackColor={{ false: "red", true: "green" }}
              thumbColor={notification ? colors.brown : "#f4f3f4"}
            />
          </View>
          <Text style={styles.label}>
            Send me notifications for transaction update
          </Text>
        </View>

        {notification != "0" ? (
          <React.Fragment>
            <View>
              <TouchableOpacity
                style={{ flexDirection: "row", alignItems: "center" }}
                onPress={() => setNotification("1")}
              >
                <RadioButton
                  value="1"
                  status={notification == "1" ? "checked" : "unchecked"}
                  onPress={() => setNotification("1")}
                />
                <Text>Text </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ flexDirection: "row", alignItems: "center" }}
                onPress={() => setNotification("2")}
              >
                <RadioButton
                  value="2"
                  status={notification == "2" ? "checked" : "unchecked"}
                  onPress={() => setNotification("2")}
                />
                <Text>Email </Text>
              </TouchableOpacity>
            </View>
          </React.Fragment>
        ) : null}

        <TouchableOpacity
          style={{
            backgroundColor: colors.white,
            alignSelf: "center",
            paddingHorizontal: 30,
            paddingVertical: 10,
            borderRadius: 20,
            marginBottom: 30,
          }}
          onPress={onClosing}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.bgBrown} />
          ) : (
            <Text>Save</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: colors.white,
            paddingVertical: 20,
            marginHorizontal: 30,
          }}
          onPress={() => {
            navigate("approvedOffer", {property})
          }}
        >
          <Text style={{ textAlign: "center" }}>View approved offer</Text>
        </TouchableOpacity>
      </View>
    </LogoPage>
  );
};

export default BLClosing;

const styles = StyleSheet.create({
  title: {
    color: colors.white,
    fontSize: 36,
    width: 250,
    paddingLeft: 30,
  },
  label: {
    color: colors.white,
  },
});
