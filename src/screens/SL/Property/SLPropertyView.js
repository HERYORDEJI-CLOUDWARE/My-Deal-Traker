import { Card, Text, Toast } from "native-base";
import React, { useCallback, useState } from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions,
  ScrollView,
} from "react-native";
import PropertyHeader from "../../../components/PropertyHeader";
import colors from "../../../constants/colors";
import { navigate } from "../../../nav/RootNav";
import SLClosing from "../closing/SLClosing";
import moment from "moment";
import { displayError, fetchAuthToken } from "../../../utils/misc";
import appApi from "../../../api/appApi";
import { useFocusEffect } from "@react-navigation/native";
import LogoPage from "../../../components/LogoPage";
import { AntDesign } from "@expo/vector-icons";
import { ActivityIndicator } from "react-native";

const { width } = Dimensions.get("window");

const SLPropertyView = ({ property, navigation }) => {
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
        setTheTransaction(response.data.response.data)
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
      <View style={{ borderBottomWidth: 1, paddingBottom: 25 }}>
        <View style={{ alignItems: "center" }}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              navigate("SLPropertyInfo", {property});
              // setView("property")
            }}
          >
            <Card style={styles.box}>
              <Image source={require("../../../assets/img/property.png")} />
            </Card>
          </TouchableOpacity>
        </View>

        <View style={{ alignItems: "center" }}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              navigate("slChecklist", { property });
            }}
          >
            <Card style={styles.box}>
              <Image source={require("../../../assets/img/conditions.png")} />
            </Card>
          </TouchableOpacity>
        </View>

        <View style={{ alignItems: "center" }}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              navigate("slClosing", { property });
              // setView("closing")
            }}
          >
            <Card style={styles.box}>
              <Image source={require("../../../assets/img/closing.png")} />
            </Card>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              setView("report");
            }}
          >
            <Card style={styles.box}>
              <Image source={require("../../../assets/img/report.png")} />
            </Card>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              navigate("fileUpload", { transaction: theTransaction })
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
            </Card>
          </TouchableOpacity>
        </View>
      </View>
    </React.Fragment>
  );

  let rendered = <View />;
  if (view === "closing") {
    rendered = <SLClosing />;
  }
  if (view === "report") {
    rendered = <Text>REPORT</Text>;
  }

  if (isLoading) {
    return (
      <LogoPage navigation={navigation} >
        <ActivityIndicator color={colors.white} size="large" />
      </LogoPage>
    );
  }

  if (!theApproved) {
    return (
      <LogoPage navigation={navigation} >
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
      <PropertyHeader
        transactionID={property.transaction_id}
        status="Active"
        date={moment(property.date_created).format("MM/DD/YYYY")}
        navigation={navigation}
      />
      <HeaderButtons />
      {rendered}
    </ScrollView>
  );
};

export default SLPropertyView;

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
