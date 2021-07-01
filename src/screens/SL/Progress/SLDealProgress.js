import { Text } from "native-base";
import React from "react";
import { StyleSheet, View } from "react-native";
import colors from "../../../constants/colors";

const SLDealProgress = () => {
  return (
    <View style={{flex: 1}} >
      <View style={{ paddingLeft: 34 }}>
        <Text style={styles.title}>DEAL PROGRESS</Text>
        <Text style={{ color: colors.lightGrey }}>
          Process tracker for your current deal
        </Text>
      </View>

      <View style={{ marginTop: 40 }} />

      <View style={{ paddingLeft: 10 }} >
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
                <Text style={styles.status}>Completed</Text>
            </View>
            <View style={styles.action_status}>
                <Text style={styles.progressText}>Show Request</Text>
                <Text style={styles.status}>Completed</Text>
            </View>
            <View style={styles.action_status}>
                <Text style={styles.progressText}>Make an offer</Text>
                <Text style={styles.status}>Approved</Text>
            </View>
            </View>
        </View>

        <View style={{ marginTop: 20 }} />

        <View style={{ paddingHorizontal: 20 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={styles.inProgressCircle} />
            <Text style={styles.titleText}>Condition</Text>
            <View style={{ flex: 1, alignSelf: "flex-end" }} >
                <Text style={{...styles.status}}>2 days left</Text>
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
                <Text style={{...styles.status, color: colors.lightGrey}}>Pending</Text>
            </View>
            <View style={styles.action_status}>
                <Text style={styles.progressText}>Inspection</Text>
            </View>
            <View style={styles.action_status}>
                <Text style={styles.progressText}>Appraisal</Text>
            </View>
            <View style={styles.action_status}>
                <Text style={styles.progressText}>Repairs</Text>
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

    </View>
  );
};

export default SLDealProgress;

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
