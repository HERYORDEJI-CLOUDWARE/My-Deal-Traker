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
import LogoPage from "../../../components/LogoPage";
import PropertyHeader from "../../../components/PropertyHeader";
import colors from "../../../constants/colors";
import { navigate } from "../../../nav/RootNav";
import { formatStatus } from "../../../utils/misc";
import SaConditions from "../SaConditions/SaConditions";
import SaReport from "../SaReport/SaReport";
// import PropertyDetails from "../../SA/Property/PropertyDetail";
import PropertyTab from "./PropertyDetails";

const { width } = Dimensions.get("window");

const PropertyView = ({ property, navigation }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [view, setView] = useState("");

  let rendered = <View />;

  if (view === "property") {
    rendered = <PropertyTab property={property} navigation={navigation} />;
  }

  if (view === "conditions") {
    rendered = <SaConditions transaction={property} />;
  }

  if (view === "report") {
    rendered = <SaReport />;
  }

  const moveTo1 = () => {
    setCurrentStep(1);
  };

  const moveTo2 = () => {
    setCurrentStep(2);
  };

  const moveTo3 = () => {
    setCurrentStep(3);
  };

  return (
    <LogoPage title="" navigation={navigation}>
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
                navigate("viewPropertyInfo", {
                  property,
                });
                // setView("property");
              }}
            >
              <Card style={styles.box}>
                <Image source={require("../../../assets/img/property.png")} />
                <View style={{ position: "absolute", right: 10 }}>
                  <AntDesign name="right" />
                </View>
              </Card>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                navigate("saConditions", { transaction: property });
                // setView("conditions");
              }}
            >
              <Card style={styles.box}>
                <Image source={require("../../../assets/img/conditions.png")} />
                <View style={{ position: "absolute", right: 10 }}>
                  <AntDesign name="right" />
                </View>
              </Card>
            </TouchableOpacity>
          </View>

          <View style={{ marginTop: 35 }} />

          <View
            style={{ flexDirection: "row", justifyContent: "space-around" }}
          >
            {/* <Card style={styles.box}>
              <Image source={require("../../../assets/img/closing.png")} />
            </Card> */}
            {/* <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => setView("report")}
            >
              <Card style={styles.box}>
                <Image source={require("../../../assets/img/report.png")} />
                <View style={{ position: "absolute", right: 10 }}>
                  <AntDesign name="right" />
                </View>
              </Card>
            </TouchableOpacity> */}
          </View>
        </View>
      </React.Fragment>

      {/* <PropertyDetails /> */}
      {rendered}
    </LogoPage>
  );
};

export default PropertyView;

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
