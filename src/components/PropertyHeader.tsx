import { Text } from "native-base";
import React from "react";
import { View } from "react-native";
import colors from "../constants/colors";
import CustomHeader from "./CustomHeader";

const PropertyHeader = ({
  transactionID,
  status,
  date,
  navigation,
  noHeader,
}) => {
  return (
    <View>
      {!noHeader ? <CustomHeader navigation={navigation} /> : null}
      <View
        style={{
          paddingVertical: 10,
          paddingHorizontal: 20,
          marginTop: 0,
        }}
      >
        <View>
          <Text>
            <Text
              style={{
                fontFamily: "pop-reg",
                fontSize: 25,
                color: colors.white,
              }}
            >
              Transaction ID:{" "}
            </Text>
            <Text
              style={{
                fontFamily: "pop-semibold",
                fontSize: 18,
                color: colors.white,
                fontWeight: "bold",
              }}
            >
              {transactionID}
            </Text>
          </Text>

          <Text>
            <Text
              style={{
                fontSize: 20,
                fontFamily: "pop-reg",
                color: colors.white,
              }}
            >
              Status:{" "}
            </Text>
            <Text
              style={{
                fontSize: 18,
                fontFamily: "pop-semibold",
                color: colors.white,
              }}
            >
              {status}
            </Text>
          </Text>

          <View>
            <Text
              style={{
                fontSize: 18,
                color: colors.white,
                marginTop: 20,
                marginRight: 30,
              }}
            >
              {date}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default PropertyHeader;
