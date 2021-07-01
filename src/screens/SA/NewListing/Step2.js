import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { Input } from "react-native-elements";
import GoBack from "../../../components/GoBack";
import colors from "../../../constants/colors";
import DatePicker from "../../../components/DatePicker";
import { ActionSheet, Toast } from "native-base";
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const Step2 = ({ next, back, values, handleChange, setFieldValue }) => {
  var STATUS_BUTTONS = [
    "Active",
    "Offer-in place",
    "Suspended",
    "Sold",
    "Cancel",
  ];
  var STATUS_CANCEL_INDEX = 4;

  var LISTING_TYPE_BUTTONS = ["Sale", "Lease", "Cancel"];
  var LISTING_TYPE_CANCEL_INDEX = 2;

  var OCCUPANCY_BUTTONS = [
    "Owner Occupied",
    "Tenant Occupied",
    "Vacant",
    "Cancel",
  ];
  var OCCUPANCY_CANCEL_INDEX = 3;

  var POSSESSION_BUTTONS = ["Immediately", "Other", "Cancel"];
  var POSSESSION_CANCEL_INDEX = 2;

  const movePage = () => {
    if (
      values.status === undefined ||
      values.status === null ||
      values.listingType === undefined ||
      values.listingType === null ||
      !values.listingPrice ||
      !values.majorIntersection ||
      !values.majorNearestTown ||
      values.occupancy === undefined ||
      values.occupancy === null ||
      !values.occupancy ||
      !values.possession ||
      (values.possession == "Other" && !values.possessionDate)
    ) {
      return Toast.show({
        type: "danger",
        text: "All fields are required",
      });
    }
    next();
  };

  return (
    <View>
      {/* <GoBack back={back} /> */}
      <View style={{ paddingHorizontal: 20 }}>
        <TouchableOpacity
          style={styles.sections}
          onPress={() =>
            ActionSheet.show(
              {
                options: STATUS_BUTTONS,
                cancelButtonIndex: STATUS_CANCEL_INDEX,
                title: "Select Status",
              },
              (buttonIndex) => {
                if (buttonIndex !== 4) {
                  setFieldValue("status", buttonIndex);
                }
              }
            )
          }
        >
          <Text style={styles.label}>Status</Text>
          <Text
            style={{ paddingVertical: 10, fontSize: 18, color: colors.white }}
          >
            {STATUS_BUTTONS[values.status] || "Status"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.sections}
          onPress={() =>
            ActionSheet.show(
              {
                options: LISTING_TYPE_BUTTONS,
                cancelButtonIndex: LISTING_TYPE_CANCEL_INDEX,
                title: "Select Listing Type",
              },
              (buttonIndex) => {
                if (buttonIndex !== 2) {
                  setFieldValue("listingType", buttonIndex);
                }
              }
            )
          }
        >
          <Text style={styles.label}>Listing Type</Text>
          <Text
            style={{ paddingVertical: 10, fontSize: 18, color: colors.white }}
          >
            {LISTING_TYPE_BUTTONS[values.listingType] || "Listing Type"}
          </Text>
        </TouchableOpacity>

        <View style={styles.sections}>
          <Text style={styles.label}>Listing Price</Text>
          <Input
            inputStyle={styles.inputStyle}
            containerStyle={{ borderBottomWidth: 0, height: 45 }}
            style={{ borderBottomWidth: 0 }}
            placeholder="Enter listing price"
            keyboardType={"number-pad"}
            placeholderTextColor={colors.lightGrey}
            value={values.listingPrice}
            onChangeText={handleChange("listingPrice")}
          />
        </View>

        <View style={styles.sections}>
          <Text style={styles.label}>Major Intersection</Text>
          <Input
            inputStyle={styles.inputStyle}
            containerStyle={{ borderBottomWidth: 0, height: 45 }}
            style={{ borderBottomWidth: 0 }}
            placeholder="Enter Major Intersection"
            placeholderTextColor={colors.lightGrey}
            value={values.majorIntersection}
            onChangeText={handleChange("majorIntersection")}
          />
        </View>

        <View style={styles.sections}>
          <Text style={styles.label}>Major Nearest Town</Text>
          <Input
            inputStyle={styles.inputStyle}
            containerStyle={{ borderBottomWidth: 0, height: 45 }}
            style={{ borderBottomWidth: 0 }}
            placeholder="Enter Major Nearest Town"
            placeholderTextColor={colors.lightGrey}
            value={values.majorNearestTown}
            onChangeText={handleChange("majorNearestTown")}
          />
        </View>

        <TouchableOpacity
          style={styles.sections}
          onPress={() =>
            ActionSheet.show(
              {
                options: OCCUPANCY_BUTTONS,
                cancelButtonIndex: OCCUPANCY_CANCEL_INDEX,
                title: "Select Occupancy",
              },
              (buttonIndex) => {
                if (buttonIndex !== 3) {
                  setFieldValue("occupancy", buttonIndex);
                }
              }
            )
          }
        >
          <Text style={styles.label}>Occupancy</Text>
          <Text
            style={{ paddingVertical: 10, fontSize: 18, color: colors.white }}
          >
            {OCCUPANCY_BUTTONS[values.occupancy] || "Occupancy"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            ActionSheet.show(
              {
                options: POSSESSION_BUTTONS,
                cancelButtonIndex: POSSESSION_CANCEL_INDEX,
                title: "Select Possession",
              },
              (buttonIndex) => {
                if (buttonIndex !== 2) {
                  setFieldValue("possession", POSSESSION_BUTTONS[buttonIndex]);
                }
              }
            )
          }
          style={styles.sections}
        >
          <Text style={styles.label}>Possession</Text>
          <Text
            style={{ paddingVertical: 10, fontSize: 18, color: colors.white }}
          >
            {values.possession || "Possession"}
          </Text>
        </TouchableOpacity>

        {values.possession === "Other" ? (
          <View>
            <DatePicker
              text="Possession Date"
              date={values.possessionDate}
              setDate={(currentDate) =>
                setFieldValue("possessionDate", currentDate)
              }
            />
          </View>
        ) : null}

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
          }}
        >
          <Text>Continue</Text>
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
            marginBottom: 20,
          }}
        >
          <Text style={{color: colors.white}} >Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Step2;

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
  sections: {
    paddingBottom: 5,
  },
  inputStyle: { borderBottomWidth: 0, color: colors.white },
});
