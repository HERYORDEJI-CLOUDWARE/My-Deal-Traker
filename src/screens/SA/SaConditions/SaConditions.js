import { Entypo } from "@expo/vector-icons";
import { Text } from "native-base";
import React from "react";
import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import ReactNativeModal from "react-native-modal";
import LogoPage from "../../../components/LogoPage";
import colors from "../../../constants/colors";
import Appraisal from "./Appraisal";
import CheckList from "./CheckList";
import Financing from "./Financing";
import Inspection from "./Inspection";
import Repairs from "./Repairs";

const SaConditions = ({ route, navigation }) => {
  const [view, setView] = useState("repairs");

  const { transaction } = route.params;

  const [showModal, setShowModal] = useState(false);

  const rendered = () => {
    switch (view) {
      case "financing":
        return <Financing />;
      case "appraisal":
        return <Appraisal />;
      case "repairs":
        return <Inspection transaction={transaction} />;
      case "check":
        return <CheckList transaction={transaction} />;
            // case "repairs":
            //   return <Repairs />;
            // case "inspection":
            //   return <Inspection transaction={transaction} />;
      default:
        return <View />;
    }
  };

  return (
    <LogoPage navigation={navigation}>
      <TouchableOpacity
        onPress={() => setShowModal(true)}
        style={{
          alignSelf: "flex-end",
          paddingHorizontal: 20,
          paddingVertical: 10,
        }}
      >
        <Entypo name="dots-three-vertical" size={30} color={colors.white} />
      </TouchableOpacity>
      <ReactNativeModal
        isVisible={showModal}
        onBackdropPress={() => setShowModal(false)}
        onBackButtonPress={() => setShowModal(false)}
      >
        <View style={{ backgroundColor: colors.white }}>
          {/* <TouchableOpacity
            onPress={() => {
              setView("financing");
              setShowModal(false);
            }}
          >
            <Text style={styles.dropdownText}>Financing</Text>
          </TouchableOpacity> */}
          <TouchableOpacity
            onPress={() => {
              setView("check");
              setShowModal(false);
            }}
          >
            <Text style={styles.dropdownText}>Conditions</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
            onPress={() => {
              setView("appraisal");
              setShowModal(false);
            }}
          >
            <Text style={styles.dropdownText}>Appraisal</Text>
          </TouchableOpacity> */}
          <TouchableOpacity
            onPress={() => {
              setView("repairs");
              setShowModal(false);
            }}
          >
            <Text style={styles.dropdownText}>Repairs</Text>
          </TouchableOpacity>
        </View>
      </ReactNativeModal>
      {rendered()}
    </LogoPage>
  );
};

export default SaConditions;

const styles = StyleSheet.create({
  dropdownText: {
    textAlign: "center",
    paddingVertical: 7,
  },
});
