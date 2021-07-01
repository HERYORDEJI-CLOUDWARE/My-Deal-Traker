import { AntDesign } from "@expo/vector-icons";
import { Text } from "native-base";
import React from "react";
import { TouchableOpacity } from "react-native";
import colors from "../constants/colors";

const GoBack = ({back}) => {
  return (
    <React.Fragment>
      <TouchableOpacity
        style={{
          marginVertical: 20,
          flexDirection: "row",
          alignItems: "center",
          paddingLeft: 30,
        }}
        onPress={back}
      >
        <AntDesign name="arrowleft" size={20} color={colors.white} />
        <Text style={{ color: colors.white, paddingLeft: 10 }} />
      </TouchableOpacity>
    </React.Fragment>
  );
};

export default GoBack;

/*
<GoBack back={() => navigation.goBack()} />
*/