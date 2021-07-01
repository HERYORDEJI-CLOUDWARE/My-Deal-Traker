import { AntDesign } from "@expo/vector-icons";
import { useFormik } from "formik";
import { Picker, Text, Toast, ActionSheet } from "native-base";
import React, { useEffect, useRef, useState } from "react";
import { useContext } from "react";
import {
  StyleSheet,
  View,
  Switch,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Input } from "react-native-elements";
import appApi from "../../../api/appApi";
import colors from "../../../constants/colors";
import { displayError, fetchAuthToken } from "../../../utils/misc";
import { Context as UserContext } from "../../../context/UserContext";
import { RadioButton } from "react-native-paper";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { KeyboardAvoidingView } from "react-native";

const InterestForm = ({ move, back, property, navigation }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [sellersList, setSellersList] = useState([]);

  const {
    state: { user },
  } = useContext(UserContext);

  const [referral_name, setReferral_name] = useState("");
  const [referral_phone, setReferral_phone] = useState("");


  useEffect(() => {
    fetchBuyers();
  }, []);

  const fetchBuyers = async () => {
    try {
      const token = await fetchAuthToken();
      const response = await appApi.get(`/get_user_with_role.php?role_id=1`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const nl = [];
      if (response.data.response.status == 200) {
        response.data.response.data.map((r) =>
          nl.push({ name: r.fullname, id: r.unique_id })
        );
      }
      setSellersList(nl);
    } catch (error) {
      displayError(error);
    }
  };

  const [isLoading, setIsLoading] = useState(false);

  const { values, handleChange, handleSubmit, setFieldValue } = useFormik({
    initialValues: {
      pname: "",
      pphone: "",
      agentName: user.fullname,
      source: "",
      notificationOptIn: 0,
      purchasers: [{ name: "", phone: "", email: "" }],
    },
    onSubmit: async (values) => {
      await sendShowInterest();
      navigation.goBack()
      // back();
    },
  });



  const purchasers_names = [];
  const purchasers_phones = [];
  const purchasers_emails = [];

  values.purchasers.map((v) => {
    purchasers_names.push(v.name);
    purchasers_phones.push(v.phone);
    purchasers_emails.push(v.email);
  });

  const sendShowInterest = async () => {
    try {
      setIsLoading(true);
      const token = await fetchAuthToken();
      const data = new FormData();
      data.append("purchaser_source", values.source);
      data.append("purchasers_names", JSON.stringify(purchasers_names));
      data.append("purchasers_phones", JSON.stringify(purchasers_phones));
      data.append("purchasers_emails", JSON.stringify(purchasers_emails));
      data.append("update_notification", values.notificationOptIn);
      data.append("property_transaction_id", property.transaction_id);
      data.append("purchaser_source_name", referral_name);
      data.append("purchaser_source_phone", referral_phone);
      data.append("user_id", user.unique_id);
      data.append("purchaser_agent_name", values.agentName);
      const response = await appApi.post(`/interested_purchaser.php`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.response.status == 200) {
        setIsSaved(true);
        Toast.show({
          type: "success",
          text: response.data.response.message,
        });
      } else {
        Toast.show({
          type: "warning",
          text: response.data.response.message,
        });
        setIsLoading(false);
        //TEMP
        setIsSaved(true);
        //TEMP
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const toggleSwitch = () => {
    // setIsEnabled((previousState) => !previousState)
    if (values.notificationOptIn) {
      setFieldValue("notificationOptIn", 0);
    } else {
      setFieldValue("notificationOptIn", 1);
    }
  };

  const requestShow = async () => {
    try {
      const token = await fetchAuthToken();
      const data = new FormData();
      data.append("user_id", user.unique_id);
      data.append("property_transaction_id", property.transaction_id);
      data.append("requesting_agent_realtor", property.realtor);
      data.append("branch", property.list_branch);
      const response = await appApi.post(`/submit_show_request.php`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.response.status == 200) {
        Toast.show({
          type: "success",
          text: "Sent successfully",
          duration: 4000,
        });
      }
    } catch (error) {}
  };

  const editPurchaserInfo = (value, index, field) => {
    const oldValues = [...values.purchasers];
    oldValues[index][field] = value;
    setFieldValue("purchasers", oldValues);
  };

  const deletePurchaser = (index) => {
    const oldValues = [...values.purchasers];
    const newValues = oldValues.filter((v, i) => i != index);
    setFieldValue("purchasers", newValues);
  };

  const SOURCE_BUTTONS = [
    "Existing client",
    "Walk-in/Ad",
    "Referral",
    "CANCEL",
  ];
  const SOURCE_CANCEL_INDEX = 3;

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: "padding", android: "height" })}
      style={{ flex: 1 }}
    >
      <TouchableOpacity
        style={{
          marginVertical: 20,
          flexDirection: "row",
          alignItems: "center",
          paddingLeft: 30,
        }}
        onPress={back}
      >
        <AntDesign name="arrowleft" />
        <Text style={{ ...styles.label, paddingLeft: 10 }}>Back</Text>
      </TouchableOpacity>

      <View>
        <Text
          style={{
            color: colors.white,
            paddingHorizontal: 40,
            paddingVertical: 15,
            textAlign: "center",
          }}
        >
          Complete the fields below and click Submit to send
        </Text>
      </View>

      <View style={{ paddingHorizontal: 20 }}>
        <TouchableOpacity
          style={{ paddingBottom: 10 }}
          onPress={() => {
            ActionSheet.show(
              {
                options: SOURCE_BUTTONS,
                cancelButtonIndex: SOURCE_CANCEL_INDEX,
                title: "How did you know about this listing ?",
              },
              (buttonIndex) => {
                setFieldValue("source", SOURCE_BUTTONS[buttonIndex]);
              }
            );
          }}
        >
          <Text style={styles.title}>Source</Text>
          <Text style={styles.label}>
            {values.source || "How did you know about this listing ?"}{" "}
          </Text>
        </TouchableOpacity>

        {values.source === "Referral" ? (
          <React.Fragment>
            <View style={{ paddingBottom: 20 }}>
              <Text style={styles.title}>Referral's Name</Text>
              <Input
                inputStyle={{ borderBottomWidth: 0 }}
                value={referral_name}
                containerStyle={styles.containerStyle}
                placeholder="Referral’s name"
                placeholderTextColor={colors.lightGrey}
                onChangeText={setReferral_name}
              />
            </View>
            <View style={{ paddingBottom: 20 }}>
              <Text style={styles.title}>Referral's Phone</Text>
              <Input
                inputStyle={{ borderBottomWidth: 0 }}
                value={referral_phone}
                containerStyle={styles.containerStyle}
                style={{ borderBottomWidth: 0 }}
                placeholder="Referral’s Phone"
                placeholderTextColor={colors.lightGrey}
                onChangeText={setReferral_phone}
                keyboardType="number-pad"
              />
            </View>
          </React.Fragment>
        ) : null}

        <Text style={{ color: colors.white, fontSize: 23, marginBottom: 20 }}>
          Interested Purchasers
        </Text>

        {values.purchasers.map((p, i) => {
          return (
            <View
              style={{
                borderWidth: 0.5,
                marginVertical: 5,
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderColor: "#ccc",
              }}
            >
              <View style={{ paddingBottom: 20 }}>
                <Text style={styles.title}>Purchaser’s Name</Text>
                <Input
                  inputStyle={{ color: colors.white }}
                  value={p.name}
                  containerStyle={styles.containerStyle}
                  placeholder="Interested purchaser’s name"
                  placeholderTextColor={colors.lightGrey}
                  onChangeText={(text) => editPurchaserInfo(text, i, "name")}
                />
              </View>

              <View style={{ paddingBottom: 20 }}>
                <Text style={styles.title}>Purchaser’s Phone Number</Text>
                <Input
                  inputStyle={{ color: colors.white }}
                  value={p.phone}
                  containerStyle={styles.containerStyle}
                  style={{ borderBottomWidth: 0 }}
                  placeholder="Interested purchaser’s phone number"
                  placeholderTextColor={colors.lightGrey}
                  onChangeText={(text) => editPurchaserInfo(text, i, "phone")}
                  keyboardType="number-pad"
                />
              </View>

              <View style={{ paddingBottom: 20 }}>
                <Text style={styles.title}>Purchaser’s Email</Text>
                <Input
                  inputStyle={{ color: colors.white }}
                  value={p.email}
                  containerStyle={styles.containerStyle}
                  style={{ borderBottomWidth: 0 }}
                  placeholder="Interested purchaser’s email"
                  placeholderTextColor={colors.lightGrey}
                  onChangeText={(text) => editPurchaserInfo(text, i, "email")}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              {i != 0 ? (
                <TouchableOpacity
                  style={{ alignSelf: "flex-end" }}
                  onPress={() => deletePurchaser(i)}
                >
                  <AntDesign name="close" size={20} />
                </TouchableOpacity>
              ) : null}
            </View>
          );
        })}

        <TouchableOpacity
          style={{
            alignSelf: "flex-end",
            paddingVertical: 5,
            backgroundColor: colors.white,
            paddingHorizontal: 10,
            borderRadius: 10,
          }}
          onPress={() => {
            const oldPur = [...values.purchasers];
            oldPur.push({ name: "", phone: "", email: "" });
            setFieldValue("purchasers", oldPur);
          }}
        >
          <Text>+ Add more</Text>
        </TouchableOpacity>

        <View style={{ paddingBottom: 20 }}>
          <Text style={styles.title}>Agent’s Name</Text>
          <Input
            inputStyle={{ color: colors.white }}
            containerStyle={styles.containerStyle}
            style={{ borderBottomWidth: 0 }}
            placeholder="Enter  puchaser’s agent’s name"
            placeholderTextColor={colors.lightGrey}
            onChangeText={handleChange("agentName")}
            value={user.fullname}
            disabled
          />
        </View>

        {!isSaved && (
          <React.Fragment>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingBottom: 30,
                flexWrap: "wrap",
              }}
            >
              <View style={{ alignSelf: "flex-start" }}>
                <Switch
                  trackColor={{ false: "red", true: "green" }}
                  thumbColor={
                    values.notificationOptIn ? colors.brown : "#f4f3f4"
                  }
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleSwitch}
                  value={values.notificationOptIn == "0" ? false : true}
                />
              </View>
              <Text style={[styles.title, { fontSize: 15, paddingLeft: 10 }]}>
                Send me notifications for transaction update
              </Text>
            </View>
            {values.notificationOptIn != "0" ? (
              <React.Fragment>
                <View>
                  <TouchableOpacity
                    style={{ flexDirection: "row", alignItems: "center" }}
                    onPress={() => setFieldValue("notificationOptIn", "1")}
                  >
                    <RadioButton
                      value="1"
                      status={
                        values.notificationOptIn == "1"
                          ? "checked"
                          : "unchecked"
                      }
                      onPress={() => setFieldValue("notificationOptIn", "1")}
                    />
                    <Text>Text </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ flexDirection: "row", alignItems: "center" }}
                    onPress={() => setFieldValue("notificationOptIn", "2")}
                  >
                    <RadioButton
                      value="2"
                      status={
                        values.notificationOptIn == "2"
                          ? "checked"
                          : "unchecked"
                      }
                      onPress={() => setFieldValue("notificationOptIn", "2")}
                    />
                    <Text>Email </Text>
                  </TouchableOpacity>
                </View>
              </React.Fragment>
            ) : null}
          </React.Fragment>
        )}

        <TouchableOpacity
          style={{
            paddingVertical: 10,
            alignSelf: "center",
            backgroundColor: colors.white,
            borderRadius: 30,
            paddingHorizontal: 40,
            elevation: 2,
            marginBottom: 30,
          }}
          disabled={isLoading}
          onPress={() => {
            handleSubmit();
          }}
        >
          <Text style={{ textAlign: "center" }}>
            {isSaved ? "Done" : isLoading ? "Loading..." : "Submit"}
          </Text>
        </TouchableOpacity>

        {isSaved && (
          <View style={{ marginBottom: 40 }}>
            
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

export default InterestForm;

const styles = StyleSheet.create({
  label: {
    color: colors.white,
    paddingLeft: 20,
  },
  title: {
    color: colors.black,
  },
  containerStyle: {
    height: 35,
  },
});
