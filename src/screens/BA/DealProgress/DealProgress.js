import { Container, Text } from "native-base";
import React from "react";
import { ActivityIndicator, Dimensions } from "react-native";
import { StyleSheet, View } from "react-native";
import LogoPage from "../../../components/LogoPage";
import colors from "../../../constants/colors";

const { height } = Dimensions.get("window");

const DealProgress = ({ transaction, isLoading, navigation }) => {
  if (isLoading) {
    return (
      <LogoPage navigation={navigation} dontShow={false}>
        <ActivityIndicator size="large" color={colors.white} />
      </LogoPage>
    );
  }

  if (!transaction) {
    return (
      <LogoPage dontShow={false} navigation={navigation}>
        <Text style={{ color: colors.white, textAlign:"center" }}>
          You have not started a transaction for this property
        </Text>
      </LogoPage>
    );
  }

  return (
    <LogoPage dontShow={true}>
      <View style={{ paddingLeft: 34 }}>
        <Text style={styles.title}>DEAL PROGRESS</Text>
        <Text style={{ color: colors.lightGrey }}>
          Process tracker for your current deal
        </Text>
      </View>

      <View style={{ marginTop: 40 }} />

      <View style={{ paddingLeft: 10 }}>
        <View style={{ paddingHorizontal: 20 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={styles.doneCircle} />
            <Text style={styles.titleText}>Property</Text>
          </View>

          <View
            style={{
              borderLeftWidth: 1,
              paddingLeft: 28,
              marginLeft: 16,
              marginTop: 10,
              borderLeftColor: colors.doneCircle,
            }}
          >
            <View style={styles.action_status}>
              <Text style={styles.progressText}>Interested Purchaser</Text>
              <Text style={styles.status}>
                {transaction.show_interest_status != "0" ? "Completed" : ""}{" "}
              </Text>
            </View>
            <View style={styles.action_status}>
              <Text style={styles.progressText}>Show Request</Text>
              <Text style={styles.status}>
                {transaction.show_property_status != "0"
                  ? "Completed"
                  : "Not completed"}
              </Text>
            </View>
            <View style={styles.action_status}>
              <Text style={styles.progressText}>Make an offer</Text>
              <Text style={styles.status}>
                {transaction.make_offer_initiation_status != "0"
                  ? "Completed"
                  : "Not completed"}
              </Text>
            </View>
            <View style={styles.action_status}>
              <Text style={styles.progressText}>Offer accepted</Text>
              <Text style={styles.status}>
                {transaction.make_offer_status != "0"
                  ? "Completed"
                  : "Not completed"}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ marginTop: 20 }} />

        <View style={{ paddingHorizontal: 20 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={styles.inProgressCircle} />
            <Text style={styles.titleText}>Condition</Text>
            <View style={{ flex: 1, alignSelf: "flex-end" }}>
              {/* <Text style={{ ...styles.status }}>2 days left</Text> */}
            </View>
          </View>

          <View
            style={{
              borderLeftWidth: 1,
              paddingLeft: 28,
              marginLeft: 16,
              marginTop: 10,
              borderLeftColor: colors.doneCircle,
            }}
          >
            <View style={styles.action_status}>
              <Text style={styles.progressText}>Financing</Text>
              <Text style={{ ...styles.status, color: colors.lightGrey }}>
                {transaction.financing_status != "0"
                  ? "Completed"
                  : "Not completed"}
              </Text>
            </View>
            <View style={styles.action_status}>
              <Text style={styles.progressText}>Inspection</Text>
              <Text style={{ ...styles.status, color: colors.lightGrey }}>
                {transaction.inspection_status != "0"
                  ? "Completed"
                  : "Not completed"}
              </Text>
            </View>
            <View style={styles.action_status}>
              <Text style={styles.progressText}>Appraisal</Text>
              <Text style={{ ...styles.status, color: colors.lightGrey }}>
                {transaction.appraisal_status != "0"
                  ? "Completed"
                  : "Not completed"}
              </Text>
            </View>
            <View style={styles.action_status}>
              <Text style={styles.progressText}>Repairs</Text>
              <Text style={{ ...styles.status, color: colors.lightGrey }}>
                {transaction.repairs_status != "0"
                  ? "Completed"
                  : "Not completed"}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ paddingHorizontal: 20 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={styles.notDoneCircle} />
            <Text style={styles.titleText}>Closing</Text>
            <Text style={{ ...styles.status, color: colors.lightGrey }}>
              {transaction.closing_status != "0"
                ? "Completed"
                : "Not completed"}
            </Text>
          </View>

          <View
            style={{
              borderLeftWidth: 1,
              paddingLeft: 28,
              marginLeft: 16,
              marginTop: 10,
              borderLeftColor: colors.doneCircle,
            }}
          >
            <View>
              <Text style={styles.progressText}>Lawyer</Text>
            </View>
            <View>
              <Text style={styles.progressText}>Mortgage Broker</Text>
            </View>
          </View>
        </View>

        <View style={{ paddingHorizontal: 20 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={styles.notDoneCircle} />
            <Text style={styles.titleText}>Closing</Text>
          </View>

          <View
            style={{
              borderLeftWidth: 1,
              paddingLeft: 28,
              marginLeft: 16,
              marginTop: 10,
              borderLeftColor: colors.doneCircle,
            }}
          >
            <View style={{ height: 40 }} />
          </View>
        </View>
      </View>
    </LogoPage>
  );
};

export default DealProgress;

const styles = StyleSheet.create({
  title: {
    color: colors.white,
    fontSize: 30,
  },
  doneCircle: {
    width: 32,
    height: 32,
    backgroundColor: colors.doneCircle,
    borderRadius: 30,
  },
  titleText: {
    color: colors.white,
    fontSize: 24,
    paddingLeft: 10,
  },
  progressText: {
    color: colors.lightGrey,
    fontSize: 18,
    paddingVertical: 5,
  },
  inProgressCircle: {
    width: 32,
    height: 32,
    borderRadius: 30,
    borderColor: colors.doneCircle,
    borderWidth: 2,
  },
  notDoneCircle: {
    backgroundColor: colors.lightGrey,
    width: 32,
    height: 32,
    borderRadius: 30,
  },
  action_status: {
    flexDirection: "row",
    alignItems: "center",
  },
  status: { color: colors.white, flex: 1, textAlign: "right" },
});
