import { AntDesign } from "@expo/vector-icons";
import { Card, Text } from "native-base";
import React from "react";
import { useState } from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import LogoPage from "../../../../components/LogoPage";
import PropertyHeader from "../../../../components/PropertyHeader";
import colors from "../../../../constants/colors";
import { navigate } from "../../../../nav/RootNav";
import { formatStatus } from "../../../../utils/misc";
import SaPropertyInfo from "../../../SA/Property/views/PropertyTab/PropertyInfo";

const { width } = Dimensions.get("window");

const SellerPropertyView = ({ property, navigation }) => {
  let rendered = <View property={property} />;

  return (
    <LogoPage  navigation={navigation} title="Transaction" >
      <React.Fragment>
        <PropertyHeader
          transactionID={property.transaction_id}
          status={formatStatus(property.transaction_status)}
          noHeader={true}
        />

        <View style={{ paddingBottom: 25 }}></View>

        <View style={{ borderBottomWidth: 1, paddingBottom: 25 }}>
          <View
            style={{
              // flexDirection: "row",
              // justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                navigate("sellerPropertyDetails", {
                  property,
                });
              }}
            >
              <Card style={styles.box}>
                {/* <Image source={require("../../../../assets/img/property.png")} /> */}
                <Text style={{ color: colors.bgBrown, fontWeight: "bold" }}>
                  View Property Details
                </Text>
                <View style={{ position: "absolute", right: 10 }}>
                  <AntDesign name="right" />
                </View>
              </Card>
            </TouchableOpacity>
          </View>

          {/* <SaPropertyInfo route={{ params: { property } }} /> */}

          <View style={{ marginTop: 35 }} />
        </View>
      </React.Fragment>

      {/* <PropertyDetails /> */}
      {rendered}
    </LogoPage>
  );
};

export default SellerPropertyView;

const styles = StyleSheet.create({
  box: {
    width: width * 0.8,
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
