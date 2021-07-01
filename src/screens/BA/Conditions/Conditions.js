import { Entypo } from "@expo/vector-icons";
import { Text } from "native-base";
import React from "react";
import { useState } from "react";
import { ActivityIndicator } from "react-native";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import ReactNativeModal from "react-native-modal";
import colors from "../../../constants/colors";
import Appraisal from "./Appraisal";
import CheckList from "./CheckList";
import Financing from "./Financing";
import Inspection from "./Inspection";
import Repairs from "./Repairs";

const Conditions = ({ transaction, property, notAgent }) => {
  const [view, setView] = useState("check");


  const [showModal, setShowModal] = useState(false);

  const rendered = () => {
    switch (view) {
      case "financing":
        return <Financing transaction={transaction} />;
      case "inspection":
        return <Inspection transaction={transaction} property={property} />;
      case "appraisal":
        return <Appraisal />;
      case "repairs":
        return (
          <Repairs
            transaction={transaction}
            property={property}
            setView={setView}
            notAgent={notAgent}
          />
        );
      case "check":
        return <CheckList transaction={transaction} property={property} />;
      default:
        return <ActivityIndicator size="large" color={colors.white} />;
    }
  };

  return (
    <View>
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
          {!notAgent ? (
            <React.Fragment>
              <TouchableOpacity
                onPress={() => {
                  setView("financing");
                  setShowModal(false);
                }}
              >
                <Text style={styles.dropdownText}>Financing</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setView("inspection");
                  setShowModal(false);
                }}
              >
                <Text style={styles.dropdownText}>Inspection</Text>
              </TouchableOpacity>
            </React.Fragment>
          ) : null}
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
          <TouchableOpacity
            onPress={() => {
              setView("check");
              setShowModal(false);
            }}
          >
            <Text style={styles.dropdownText}>Requirement</Text>
          </TouchableOpacity>
        </View>
      </ReactNativeModal>
      {rendered()}
    </View>
  );
};

export default Conditions;

const styles = StyleSheet.create({
  dropdownText: {
    textAlign: "center",
    paddingVertical: 7,
  },
});
