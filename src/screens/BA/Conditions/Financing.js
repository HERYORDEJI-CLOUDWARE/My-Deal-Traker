import { Text, Toast } from "native-base";
import React, { useContext, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { RadioButton } from "react-native-paper";
import colors from "../../../constants/colors";

import { useFormik } from "formik";
import { Input } from "react-native-elements";
import {
  displayError,
  fetchAuthToken,
  validateEmail,
} from "../../../utils/misc";
import * as DocumentPicker from "expo-document-picker";
import { Context } from "../../../context/UserContext";
import appApi from "../../../api/appApi";

const Financing = ({ transaction , route}) => {
  const [date, setDate] = useState(new Date());

  const {
    state: { user },
  } = useContext(Context);

  // const {transaction_id} = route.params
  const {transaction_id} = route.params;

  const [show, setShow] = useState(false);

  const [mUser, setMUser] = useState("");
  const [brokerEmail, setBrokerEmail] = useState("");
  const [isAddingFinance, setIsAddingFinance] = useState(false);

  const { values, handleChange, setFieldValue, handleSubmit } = useFormik({
    initialValues: {
      mortgageSource: false,
      waiveFinancing: false,
      date: "",
      financeMethod: "",
      attachment: "",
      mortgageSourceInfo: mUser,
    },
    onSubmit: (valuez) => {
      submitFinancing();
    },
  });

  const submitFinancing = async () => {
    try {
      setIsAddingFinance(true);
      const token = await fetchAuthToken();
      const data = new FormData();
      data.append(
        "mortgage_source",
        mUser === "me"
          ? "1"
          : mUser === "mb"
          ? "2"
          : ""
      );
      data.append("mortgage_professional_email", brokerEmail);
      if (values.attachment) {
        data.append(`file`, {
          name: values.attachment.name,
          type: "application/octet",
          uri: values.attachment.uri,
        });
      }
      // data.append("transaction_id", transaction.transaction_id);
      data.append("transaction_id", transaction_id);

      data.append("user_id", user.unique_id);
      const response = await appApi.post("/add_financing.php", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data)
      if (response.data.response.status == 200) {
        Toast.show({
          type: "success",
          text: response.data.response.message,
          duration: 5000,
        });
      } else {
        Toast.show({
          type: "warning",
          text: response.data.response.message,
          duration: 5000,
        });
      }
      console.log(response.data)
      setIsAddingFinance(false);
    } catch (error) {
      setIsAddingFinance(false);
      displayError(error);
    }
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setFieldValue("date", currentDate);
  };

  const onSaveBrokerEmail = async () => {
    try {
      if (!validateEmail(brokerEmail)) {
        return Toast.show({
          type: "danger",
          text: "Invalid email address",
        });
      }
    } catch (error) {}
  };

  const pickDoc = async (index) => {
    const result = await DocumentPicker.getDocumentAsync();
    if (result.type === "cancel") {
      return;
    }
    setFieldValue("attachment", result);
  };

  const IfMortgage = (
    <View style={{ paddingHorizontal: 20 }}>
      <View>
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center" }}
          onPress={() => setMUser("me")}
        >
          <RadioButton
            status={mUser === "me" ? "checked" : "unchecked"}
            onPress={() => setMUser("me")}
          />
          <Text>Purchaser's Bank Direct</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center" }}
          onPress={() => setMUser("mb")}
        >
          <RadioButton
            status={mUser === "mb" ? "checked" : "unchecked"}
            onPress={() => setMUser("mb")}
          />
          <Text>Through a Mortgage Professional</Text>
        </TouchableOpacity>
      </View>

      {mUser === "mb" ? (
        <View style={{ flexDirection: "row" }}>
          <Input
            placeholder="Enter mortgage broker email"
            value={brokerEmail}
            onChangeText={setBrokerEmail}
            keyboardType="email-address"
            autoCorrect={false}
            autoCapitalize="none"
            placeholderTextColor={"#ccc"}
            // rightIcon={
            //   <Button
            //     title="Save"
            //     color={colors.brown}
            //     onPress={onSaveBrokerEmail}
            //   />
            // }
            style={{ fontSize: 15 }}
          />
        </View>
      ) : null}
    </View>
  );

  return (
    <View>
      <View>
        <Text style={styles.title}>Financing</Text>
      </View>

      <View>
        <View style={{ marginTop: 30 }} />

        <View style={styles.fstatus}>
          <TouchableOpacity
            onPress={() => setFieldValue("financeMethod", "Mortgage Source")}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <RadioButton
              value="Mortgage Source"
              status={
                values.financeMethod === "Mortgage Source"
                  ? "checked"
                  : "unchecked"
              }
              onPress={() => setFieldValue("financeMethod", "Mortgage Source")}
              uncheckedColor={colors.white}
            />
            <Text style={{ color: colors.white }}>Mortgage Source</Text>
          </TouchableOpacity>

          {/* {values.financeMethod === "Mortgage Source" ? (
            ) : null} */}
          <React.Fragment>{IfMortgage}</React.Fragment>

          <TouchableOpacity
            onPress={() => setFieldValue("financeMethod", "Waive Financing")}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <RadioButton
              value="Waive Financing"
              status={
                values.financeMethod === "Waive Financing"
                  ? "checked"
                  : "unchecked"
              }
              onPress={() => setFieldValue("financeMethod", "Waive Financing")}
              uncheckedColor={colors.white}
            />
            <Text style={{ color: colors.white }}>Waive Financing</Text>
          </TouchableOpacity>

          <React.Fragment>
            {values.attachment ? (
              <Text style={{ marginLeft: 20, paddingVertical: 5 }}>
                {values.attachment.name}{" "}
              </Text>
            ) : null}
            <TouchableOpacity
              style={{
                backgroundColor: colors.white,
                alignSelf: "flex-start",
                paddingHorizontal: 15,
                paddingVertical: 7,
                marginLeft: 20,
                borderRadius: 10,
              }}
              onPress={pickDoc}
            >
              <Text>Upload document</Text>
            </TouchableOpacity>
          </React.Fragment>
          {/* {values.financeMethod === "Waive Financing" ? (
          ) : null} */}
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: colors.brown,
            paddingVertical: 10,
            alignSelf: "center",
            borderRadius: 10,
            elevation: 3,
            marginTop: 25,
          }}
          onPress={handleSubmit}
          disabled={isAddingFinance}
        >
          <Text style={{ paddingHorizontal: 25, color: colors.white }}>
            {isAddingFinance ? "Loading..." : "Save"}
          </Text>
        </TouchableOpacity>

        {/* <View
          style={{
            borderBottomWidth: 1,
            marginVertical: 20,
            paddingVertical: 10,
            alignSelf: "center",
            paddingHorizontal: 20,
          }}
        >
          <Text
            style={{
              color: colors.white,
              textAlign: "center",
              marginHorizontal: 20,
            }}
            onPress={() => setShow(true)}
          >
            {moment(values.date || new Date()).format("L")}
          </Text>
          {show && (
            <RNDateTimePicker
              testID="dateTimePicker"
              value={values.date || new Date()}
              mode={"date"}
              is24Hour={true}
              display="default"
              onChange={onChange}
            />
          )}
        </View> */}
      </View>
    </View>
  );
};

export default Financing;

const styles = StyleSheet.create({
  title: {
    color: colors.white,
    fontSize: 36,
    paddingLeft: 35,
  },
  checkPlusText: {
    alignItems: "center",
  },
  fstatus: {
    paddingHorizontal: 30,
  },
});
