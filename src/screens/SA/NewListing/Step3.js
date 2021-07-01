import { Text, Toast } from "native-base";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Input } from "react-native-elements";
import { Switch } from "react-native-paper";
import DatePicker from "../../../components/DatePicker";
import GoBack from "../../../components/GoBack";
import colors from "../../../constants/colors";
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { fetchAuthToken } from "../../../utils/misc";
import appApi from "../../../api/appApi";
import { RadioButton } from "react-native-paper";

const Step3 = ({
  next,
  back,
  onSave,
  progress,
  goto2,
  values,
  handleChange,
  setFieldValue,
  isLoading,
  progressBar,
}) => {
  const onToggleSwitch = () =>
    setFieldValue("notification", !values.notification);

  const [selectedItems, setSelectedItems] = useState([]);
  const [sellersList, setSellersList] = useState([]);

  useEffect(() => {
    fetchSellers();
  }, []);

  const selectRef = useRef("");

  const fetchSellers = async () => {
    try {
      const token = await fetchAuthToken();
      const response = await appApi.get(`/get_user_with_role.php?role_id=2`, {
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
    } catch (error) {}
  };

  const onSelectedItemsChange = (selectedItems) => {
    setSelectedItems(selectedItems);
    setFieldValue("sellerName", JSON.stringify(selectedItems));
  };

  const editPurchaserInfo = (value, index, field) => {
    const oldValues = [...values.sellerInfo];
    oldValues[index][field] = value;
    setFieldValue("sellerInfo", oldValues);
  };

  const onClickSave = () => {
    if (
      !values.realtor ||
      !values.listBranch ||
      !values.address ||
      !values.city
    ) {
      return Toast.show({
        type: "danger",
        text: "All fields are required",
        duration: 4000
      })
    }

    onSave()
  };

  return (
    <View>
      {/* <GoBack back={goto2} /> */}

      <View style={{ paddingHorizontal: 20 }}>
        <Text style={{ fontSize: 23, color: colors.white, marginBottom: 20 }}>
          Seller(s)
        </Text>
        {values.sellerInfo.map((s, i) => {
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
                <Text style={{ ...styles.label, paddingVertical: 10 }}>
                  Seller’s Name
                </Text>

                <Input
                  inputStyle={styles.inputStyle}
                  containerStyle={styles.sections}
                  style={{ borderBottomWidth: 0 }}
                  placeholder="Enter Seller’s Name"
                  placeholderTextColor={colors.lightGrey}
                  value={s.name}
                  onChangeText={(text) => editPurchaserInfo(text, i, "name")}
                />
              </View>

              <View style={{ paddingBottom: 20 }}>
                <Text style={styles.label}>Seller’s Phone Number</Text>
                <Input
                  inputStyle={styles.inputStyle}
                  containerStyle={styles.sections}
                  keyboardType="number-pad"
                  style={{ borderBottomWidth: 0 }}
                  placeholder="Enter Seller’s Phone Number"
                  placeholderTextColor={colors.lightGrey}
                  value={s.phone}
                  onChangeText={(text) => editPurchaserInfo(text, i, "phone")}
                />
              </View>

              <View style={{ paddingBottom: 20 }}>
                <Text style={styles.label}>Seller’s Email</Text>
                <Input
                  inputStyle={styles.inputStyle}
                  containerStyle={styles.sections}
                  keyboardType="email-address"
                  style={{ borderBottomWidth: 0 }}
                  placeholder="Enter Seller’s Email"
                  placeholderTextColor={colors.lightGrey}
                  autoCorrect={false}
                  value={s.email}
                  onChangeText={(text) => editPurchaserInfo(text, i, "email")}
                />
              </View>
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
            marginTop: 10,
          }}
          onPress={() => {
            const oldPur = [...values.sellerInfo];
            oldPur.push({ name: "", phone: "", email: "" });
            setFieldValue("sellerInfo", oldPur);
          }}
        >
          <Text>+ Add more</Text>
        </TouchableOpacity>

        <View style={{ paddingBottom: 20 }}>
          <Text style={styles.label}>Realtor</Text>
          <Input
            inputStyle={styles.inputStyle}
            containerStyle={styles.sections}
            style={{ borderBottomWidth: 0 }}
            placeholder="Enter Realtor"
            placeholderTextColor={colors.lightGrey}
            value={values.realtor}
            onChangeText={handleChange("realtor")}
          />
        </View>

        <View style={{ paddingBottom: 20 }}>
          <Text style={styles.label}>List Branch</Text>
          <Input
            inputStyle={styles.inputStyle}
            containerStyle={styles.sections}
            style={{ borderBottomWidth: 0 }}
            placeholder="Enter List Branch"
            placeholderTextColor={colors.lightGrey}
            value={values.listBranch}
            onChangeText={handleChange("listBranch")}
          />
        </View>

        <View style={{ paddingBottom: 20 }}>
          <Text style={styles.label}>Address</Text>
          <Input
            inputStyle={styles.inputStyle}
            containerStyle={styles.sections}
            style={{ borderBottomWidth: 0 }}
            placeholder="Address"
            placeholderTextColor={colors.lightGrey}
            value={values.address}
            onChangeText={handleChange("address")}
          />
        </View>

        <View style={{ paddingBottom: 20 }}>
          <Text style={styles.label}>City</Text>
          <Input
            inputStyle={styles.inputStyle}
            containerStyle={styles.sections}
            style={{ borderBottomWidth: 0 }}
            placeholder="City"
            placeholderTextColor={colors.lightGrey}
            value={values.city}
            onChangeText={handleChange("city")}
          />
        </View>

        <DatePicker
          text="Closing Date"
          date={values.closeDate}
          setDate={(currentDate) => setFieldValue("closeDate", currentDate)}
        />

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{ alignSelf: "flex-start" }}>
            <Switch
              value={values.notification == "0" ? false : true}
              onValueChange={onToggleSwitch}
            />
          </View>
          <Text style={styles.label}>
            Send me notifications for transaction update
          </Text>
        </View>

        {values.notification ? (
          <View>
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center" }}
              onPress={() => setFieldValue("notification", "1")}
            >
              <RadioButton
                value="1"
                status={values.notification == "1" ? "checked" : "unchecked"}
                onPress={() => setFieldValue("notification", "1")}
              />
              <Text>Text </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center" }}
              onPress={() => setFieldValue("notification", "2")}
            >
              <RadioButton
                value="2"
                status={values.notification == "2" ? "checked" : "unchecked"}
                onPress={() => setFieldValue("notification", "2")}
              />
              <Text>Email </Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <View style={{ marginTop: 20 }} />

        <TouchableOpacity
          onPress={onClickSave}
          disabled={progress === 1}
          style={{
            alignSelf: "center",
            paddingVertical: 10,
            paddingHorizontal: 30,
            backgroundColor: progress == 1 ? colors.brown : colors.white,
            elevation: 2,
            borderRadius: 10,
            marginBottom: 20,
          }}
        >
          {
            <Text
              style={{ color: progress == 1 ? colors.white : colors.black }}
            >
              {progress == 1 ? "Saved" : isLoading ? "Loading..." : "Save"}
            </Text>
          }
        </TouchableOpacity>
        <TouchableOpacity
          onPress={back}
          style={{
            alignSelf: "center",
            paddingVertical: 10,
            paddingHorizontal: 30,
            backgroundColor: colors.bgBrown,
            elevation: 2,
            borderRadius: 10,
            marginBottom: 40,
          }}
        >
          <Text style={{color: colors.white}} >Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Step3;

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    color: colors.white,
    width: 163,
    marginLeft: 36,
    paddingTop: 10,
  },
  transactionIdBlock: {
    flexDirection: "row",
    paddingHorizontal: 20,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#c4c4c4",
    marginHorizontal: 23,
    opacity: 0.5,
    marginTop: 30,
    borderRadius: 5,
    paddingVertical: 5,
  },
  transactionIdTitle: {
    color: colors.white,
    opacity: 1,
  },
  transactionProgressBlock: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 30,
    marginTop: 30,
  },
  label: {
    color: colors.black,
  },
  inputStyle: { borderBottomWidth: 0, color: colors.white },
  sections: { height: 35 },
});
