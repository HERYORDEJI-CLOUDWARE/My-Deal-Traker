import React from "react";
import { View } from "react-native";
import { Header } from "react-native-elements";
import colors from "../constants/colors";



const CustomHeader = ({ title, navigation, style }) => {
  return (
    <View>
      <Header
        leftComponent={{
          icon: "arrow-back",
          color: "#fff",
          onPress: () => navigation.goBack(),
        }}
        centerComponent={{ text: title, style: { color: "#fff" } }}
        containerStyle={[{backgroundColor:colors.bgBrown}, {...style}]}
      />
    </View>
  );
};

export default CustomHeader;
