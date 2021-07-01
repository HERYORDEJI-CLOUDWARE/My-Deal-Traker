import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "../../../constants/colors";

const { width } = Dimensions.get("window");

const ListItem = ({ title, value }) => (
  <View
    style={{
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "center",
      paddingHorizontal: 20,
    }}
  >
    <Text style={styles.listTitle}>{title} </Text>
    <Text style={styles.listValue}>{value}</Text>
  </View>
);

const SLPropertyDetails = ({ move }) => {
  return (
    <SafeAreaView style={{ backgroundColor: colors.bgBrown, flex: 1 }}>
      <>
        <View>
          <ListItem title="Listing #" value="123erghjkuytrdh" />
          <ListItem title="Property Type" value="Commercial" />
          <ListItem title="Listing Date" value="02/09/2020" />
          <ListItem
            title="Property Address:"
            value="No 24, cresent Avenue, Gallery Road New Normal"
          />
          <ListItem
            title="Property Details"
            value="This is the field to view property details"
          />
          <ListItem
            title="Major Intersection"
            value="This is the field to view major intersection"
          />
          <ListItem
            title="Major Nearest Town"
            value="This is the field to view major nearest town"
          />
          <ListItem title="Occupancy" value="Vacant" />
          <ListItem title="Possession" value="Immediate" />
        </View>

        <View style={{ marginVertical: 30 }} />
      </>
    </SafeAreaView>
  );
};

export default SLPropertyDetails;

const styles = StyleSheet.create({
  box: {
    width: width / 2.5,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  boxText: {
    textAlign: "center",
    color: colors.brown,
    fontSize: 24,
  },
  listTitle: {
    padding: 10,
    fontSize: 20,
    color: colors.lightGrey,
    textAlign: "left",
  },
  listValue: {
    padding: 10,
    fontSize: 20,
    color: colors.white,
    textAlign: "left",
  },
});
