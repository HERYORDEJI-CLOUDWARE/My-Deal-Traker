import { Text } from "native-base";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Checkbox } from "react-native-paper";
import colors from "../../../constants/colors";
import moment from "moment";
import RNDateTimePicker from "@react-native-community/datetimepicker";

const Financing = () => {
  const [date, setDate] = useState(new Date());

  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
  };

  return (
    <View>
      <View>
        <Text style={styles.title}>Financing</Text>
      </View>

      <View style={{}}>
        <View style={styles.fstatus}>
          <Text style={{ color: colors.white }}>Mortgage obtained</Text>
          <View style={styles.checkPlusText}>
            <Checkbox
              status="checked"
              color={colors.white}
              uncheckedColor={colors.white}
            />
            <Text style={{ color: colors.white }}>Yes</Text>
          </View>
          <View style={styles.checkPlusText}>
            <Checkbox
              status="checked"
              color={colors.white}
              uncheckedColor={colors.white}
            />
            <Text style={{ color: colors.white }}>No</Text>
          </View>
        </View>

        <View style={{ marginTop: 30 }} />

        <View style={styles.fstatus}>
          <Text style={{ color: colors.white }}>Waive Financing</Text>
          <View style={styles.checkPlusText}>
            <Checkbox
              status="checked"
              color={colors.white}
              uncheckedColor={colors.white}
            />
            <Text style={{ color: colors.white }}>Yes</Text>
          </View>
          <View style={styles.checkPlusText}>
            <Checkbox
              status="checked"
              color={colors.white}
              uncheckedColor={colors.white}
            />
            <Text style={{ color: colors.white }}>No</Text>
          </View>
        </View>

        <View style={{ borderBottomWidth: 1, marginVertical: 20, paddingVertical: 10, alignSelf: "center", paddingHorizontal: 20 }} >
          <Text
            style={{
              color: colors.white,
              textAlign: "center",
              marginHorizontal: 20,
            }}
            onPress={() => setShow(true)}
          >
            {moment(date).format("L")}
          </Text>
          {show && (
            <RNDateTimePicker
              testID="dateTimePicker"
              value={date}
              mode={"date"}
              is24Hour={true}
              display="default"
              onChange={onChange}
            />
          )}
        </View>
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
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
});
