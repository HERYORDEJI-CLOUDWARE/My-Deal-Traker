import { Card, Text } from "native-base";
import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import colors from "../constants/colors";

const {width} = Dimensions.get("window");

const ListItem = ({ title, value }) => (
  <View
    style={{
      flexWrap: "wrap",
      marginHorizontal: 10,
      paddingVertical: 10
    }}
  >
    <View style={{ width: width - 25, backgroundColor: colors.bgBrown }}>
      <Text style={styles.listTitle}>{title} </Text>
    </View>
    <Text style={styles.listValue}>{value}</Text>
  </View>
);

export default ListItem;

const styles = StyleSheet.create({
  listTitle: {
    padding: 10,
    paddingVertical:0,
    fontSize: 20,
    color: colors.black,
    textAlign: "left",
    fontWeight:'bold'
    
  },
  listValue: {
    padding: 10,
    paddingVertical:0,
    fontSize: 20,
    color: colors.white,
    textAlign: "left",
    width: width * 0.8
  },
});
