import React from "react";
import { View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Text } from "native-base";
import moment from "moment";
import colors from "../constants/colors";

const DatePicker = ({ date, setDate, text }) => {
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
  };

  return (
    <View
        style={{paddingBottom: 20}}
    >
      <Text
        style={{
          color: colors.black,
        }}
      >
        {text || "Date"}
      </Text>

      <Text
        style={{paddingHorizontal: 20}}
      >
        {date ? (
          <Text onPress={() => setShow(true)}
            style={{color: colors.lightGrey}}
          >
            {moment(date).format("Do MMM YYYY")}{" "}
          </Text>
        ) : (
          <Text style={{color: colors.white}} onPress={() => setShow(true)}>Select Date</Text>
        )}
      </Text>
      <View>
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date || new Date()}
            mode={"date"}
            is24Hour={true}
            display="default"
            onChange={onChange}
          />
        )}
      </View>
    </View>
  );
};

export default DatePicker;
