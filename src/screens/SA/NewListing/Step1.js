// import { Picker } from "@react-native-community/picker";
import { Picker, Text, Toast } from "native-base";
import React, { useEffect } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ActionSheetIOS,
  Platform,
  Keyboard,
  Animated,
} from "react-native";
import { Input } from "react-native-elements";
import colors from "../../../constants/colors";
import { KeyboardAvoidingView } from "react-native";

const Step1 = ({ next, back, values, handleChange, setFieldValue }) => {
  const keyboardHeight = new Animated.Value(0);
  // const imageHeight = new Animated.Value(IMAGE_HEIGHT);
  let keyboardWillShowSub;
  let keyboardWillHideSub;
  useEffect(() => {
    keyboardWillShowSub = Keyboard.addListener(
      "keyboardWillShow",
      keyboardWillShow
    );
    keyboardWillHideSub = Keyboard.addListener(
      "keyboardWillHide",
      keyboardWillHide
    );

    return () => {
      keyboardWillShowSub.remove();
      keyboardWillHideSub.remove();
    };
  }, []);

  const keyboardWillShow = (event) => {
    console.log("showing");
    Animated.parallel([
      Animated.timing(keyboardHeight, {
        duration: event.duration,
        toValue: event.endCoordinates.height,
      }),
    ]).start();
  };

  const keyboardWillHide = (event) => {
    Animated.parallel([
      Animated.timing(keyboardHeight, {
        duration: event.duration,
        toValue: 0,
      }),
    ]).start();
  };

  const onPress = () =>
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Cancel", "Commercial", "Residential"],
        // destructiveButtonIndex: 2,
        cancelButtonIndex: 0,
        title: "Select Property Type",
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          // cancel action
        } else if (buttonIndex === 1) {
          setFieldValue("propertyType", 0);
        } else if (buttonIndex === 2) {
          setFieldValue("propertyType", 1);
        }
      }
    );

  const movePage = () => {

    console.log(
      values.listNo,
      values.listSource,
      values.propertyType,
      values.propertyDetails,
      values.propertyAddress,
      values.propertyState,
      values.postCode
    )

    if (
      !values.listNo ||
      !values.listSource ||
      (values.propertyType === null || values.propertyType === undefined) ||
      !values.propertyDetails ||
      !values.propertyAddress ||
      !values.propertyState ||
      !values.postCode
    ) {
      return Toast.show({
        type: "danger",
        text: "All fields are required",
        duration: 4000
      })
    }
    next()
  };

  return (
    <KeyboardAvoidingView>
      <View style={{ paddingHorizontal: 20, marginTop: 30 }}>
        <View>
          <View style={{ paddingBottom: 20 }}>
            <Text style={styles.label}>Listing Number</Text>
            <Input
              inputStyle={styles.inputStyle}
              containerStyle={styles.sections}
              style={{ borderBottomWidth: 0 }}
              placeholder="Enter MLS Number"
              placeholderTextColor={colors.lightGrey}
              value={values.listNo}
              onChangeText={handleChange("listNo")}
            />
          </View>

          <View style={{ paddingBottom: 20 }}>
            <Text style={styles.label}>Listing Source</Text>
            <Input
              inputStyle={styles.inputStyle}
              containerStyle={styles.sections}
              style={{ borderBottomWidth: 0 }}
              placeholder="Listing Source"
              placeholderTextColor={colors.lightGrey}
              value={values.listSource}
              onChangeText={handleChange("listSource")}
            />
          </View>

          {Platform.OS === "android" ? (
            <View style={{ paddingBottom: 20 }}>
              <Text style={styles.label}>Property Type</Text>
              <Picker
                style={{height:30, width:200}}
                selectedValue={values.propertyType}
                onValueChange={(value) => setFieldValue("propertyType", value)}
                mode="dropdown"
              >
                <Picker.Item
                  label="Select property type"
                  value=""
                  color={colors.lightGrey}
                />
                <Picker.Item label="Commercial" value="0" />
                <Picker.Item label="Residential" value="1" />
              </Picker>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => onPress()}
              style={{ paddingBottom: 1 }}
            >
              <Text onPress={onPress} style={styles.label}>
                Select Property Type
              </Text>
              <Text
                style={{
                  color: colors.lightGrey,
                  paddingVertical: 10,
                  paddingLeft: 10,
                }}
              >
                {values.propertyType == "0"
                  ? "Commercial"
                  : values.propertyType == "1"
                  ? "Residential"
                  : "Select property type"}
              </Text>
            </TouchableOpacity>
          )}

          <View style={{ paddingBottom: 20 }}>
            <Text style={styles.label}>Property Details</Text>
            <Input
              inputStyle={styles.inputStyle}
              containerStyle={styles.sections}
              style={{ borderBottomWidth: 0 }}
              placeholder="Property Details"
              placeholderTextColor={colors.lightGrey}
              value={values.propertyDetails}
              onChangeText={handleChange("propertyDetails")}
            />
          </View>

          <View style={{ paddingBottom: 20 }}>
            <Text style={styles.label}>Property Address</Text>
            <Input
              inputStyle={styles.inputStyle}
              containerStyle={styles.sections}
              style={{ borderBottomWidth: 0 }}
              placeholder="City/Town"
              placeholderTextColor={colors.lightGrey}
              value={values.propertyAddress}
              onChangeText={handleChange("propertyAddress")}
            />
          </View>

          <View style={{ paddingBottom: 20 }}>
            <Text style={styles.label}>State</Text>
            <Input
              inputStyle={styles.inputStyle}
              containerStyle={styles.sections}
              style={{ borderBottomWidth: 0 }}
              placeholder="Enter State"
              placeholderTextColor={colors.lightGrey}
              value={values.propertyState}
              onChangeText={handleChange("propertyState")}
            />
          </View>

          <View style={{ paddingBottom: 20 }}>
            <Text style={styles.label}>Postal/Zip Code</Text>
            <Input
              inputStyle={styles.inputStyle}
              containerStyle={styles.sections}
              style={{ borderBottomWidth: 0 }}
              placeholder="Enter postal Code"
              placeholderTextColor={colors.lightGrey}
              value={values.postCode}
              onChangeText={handleChange("postCode")}
            />
          </View>

          <TouchableOpacity
            onPress={movePage}
            style={{
              alignSelf: "center",
              paddingVertical: 10,
              paddingHorizontal: 30,
              backgroundColor: colors.white,
              elevation: 2,
              borderRadius: 10,
              marginBottom: 20,
              marginTop: 20,
            }}
          >
            <Text>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Step1;

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
