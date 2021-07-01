import { AntDesign } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { Card, Text, Toast } from "native-base";
import React, { useCallback, useState } from "react";
import { ActivityIndicator } from "react-native";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions,
  ScrollView,
} from "react-native";
import appApi from "../../../api/appApi";
import LogoPage from "../../../components/LogoPage";
import PropertyHeader from "../../../components/PropertyHeader";
import colors from "../../../constants/colors";
import { navigate } from "../../../nav/RootNav";
import { displayError, fetchAuthToken, formatStatus } from "../../../utils/misc";
import SLClosing from "../closing/BLClosing";
import SLPropertyDetails from "./BLPropertyDetail";

const { width } = Dimensions.get("window");

const BLPropertyView = ({ property, navigation }) => {
  const [view, setView] = useState("property");
  const [theApproved, setTheApproved] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [theTransaction, setTheTransaction] = useState("");

  useFocusEffect(
    useCallback(() => {
      getApprovedOffer();
    }, [])
  );

  const getApprovedOffer = async () => {
    try {
      const token = await fetchAuthToken();
      const response = await appApi.get(
        `/get_property_approved_offer.php?property_id=${property.transaction_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.response.status == 200) {
        setTheApproved(response.data.response.data);
        fetchTransaction(response.data.response.data.transaction_id);
      } else {
        Toast.show({
          type: "warning",
          text: response.data.response.message,
        });
      }
      setIsLoading(false);
    } catch (error) {
      displayError(error);
    }
  };

  const fetchTransaction = async (id) => {
    try {
      const token = await fetchAuthToken();
      const response = await appApi.get(
        `/get_transaction_details.php?transaction_id=${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.response.status == 200) {
        setTheTransaction(response.data.response.data);
        setIsLoading(false);
      } else {
        Toast.show({
          type: "warning",
          text: response.data.response.message,
        });
      }
      setIsLoading(false);
    } catch (error) {
      displayError(error);
    }
  };

  const HeaderButtons = () => (
    <React.Fragment>
      <View style={{ borderBottomWidth: 0, paddingBottom: 25 }}>
        <View style={{ alignItems: "center" }}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigate("blPropertyInfo", { property })}
          >
            <Card style={styles.box}>
              <Image source={require("../../../assets/img/property.png")} />
            </Card>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              setView("conditions");
            }}
          >
            <Card style={styles.box}>
              <Image source={require("../../../assets/img/conditions.png")} />
            </Card>
          </TouchableOpacity>
        </View>

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
              navigate("blClosingScreen", { property });
            }}
          >
            <Card style={styles.box}>
              <Image source={require("../../../assets/img/closing.png")} />
              <View style={{ position: "absolute", right: 10 }}>
                <AntDesign name="right" />
              </View>
            </Card>
          </TouchableOpacity>

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
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              navigate("fileUpload", { transaction: theTransaction });
            }}
          >
            <Card style={styles.box}>
              <Text
                style={{
                  color: colors.bgBrown,
                  fontWeight: "bold",
                  fontSize: 20,
                }}
              >
                Files and uploads
              </Text>
              <View style={{ position: "absolute", right: 10 }}>
                <AntDesign name="right" />
              </View>
            </Card>
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: 35 }} />
      </View>
    </React.Fragment>
  );


  if (isLoading) {
    return (
      <LogoPage navigation={navigation}>
        <ActivityIndicator color={colors.white} size="large" />
      </LogoPage>
    );
  }

  if (!theApproved) {
    return (
      <LogoPage navigation={navigation}>
        <View
          style={{
            alignItems: "center",
          }}
        >
          <AntDesign name="warning" size={100} color={colors.white} />
          <Text
            style={{
              textAlign: "center",
              paddingHorizontal: 50,
              color: colors.white,
            }}
          >
            No approved transaction for this property at the moment
          </Text>
        </View>
      </LogoPage>
    );
  }


  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={{marginVertical: 10}} />
      <PropertyHeader
        transactionID={property.transaction_id}
        status={formatStatus(property.status)}
        date={property.date_created}
        navigation={navigation}
      />
      <View style={{marginVertical: 30}} />
      <HeaderButtons />
    </ScrollView>
  );
};

export default BLPropertyView;

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
