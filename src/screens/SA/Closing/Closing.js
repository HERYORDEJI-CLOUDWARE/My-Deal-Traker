import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Picker, Text } from "native-base";
import colors from "../../../constants/colors";
import { Input } from "react-native-elements";
import { Switch } from "react-native-paper";

const Closing = () => {
  return (
    <View>
      <View>
        <Text style={styles.title}>Seller's Lawyer</Text>
      </View>

      <View style={{ marginTop: 30 }} />

      <View style={{ paddingHorizontal: 20 }}>
        <View style={styles.item}>
          <Text style={styles.label}>Referral Source</Text>
          <Picker mode="dropdown">
            <Picker.Item label="Select" value="" color={colors.lightGrey} />
          </Picker>
        </View>

        <View style={{ paddingBottom: 20 }}>
          <Text style={styles.label}>Seller’s Name</Text>
          <Input
            inputStyle={{ borderBottomWidth: 0 }}
            containerStyle={{ borderBottomWidth: 0 }}
            style={{ borderBottomWidth: 0 }}
            placeholder="Enter Seller’s Name"
            placeholderTextColor={colors.lightGrey}
          />
        </View>

        <View style={{ paddingBottom: 0 }}>
          <Text style={styles.label}>Current Address</Text>
          <Input
            inputStyle={{ borderBottomWidth: 0 }}
            containerStyle={{ borderBottomWidth: 0 }}
            style={{ borderBottomWidth: 0 }}
            placeholder="City / Town"
            placeholderTextColor={colors.lightGrey}
          />
        </View>

        <View style={{ paddingBottom: 0 }}>
          <Input
            inputStyle={{ borderBottomWidth: 0 }}
            containerStyle={{ borderBottomWidth: 0 }}
            style={{ borderBottomWidth: 0 }}
            placeholder="Enter State"
            placeholderTextColor={colors.lightGrey}
          />
        </View>

        <View style={{ paddingBottom: 20 }}>
          <Input
            inputStyle={{ borderBottomWidth: 0 }}
            containerStyle={{ borderBottomWidth: 0 }}
            style={{ borderBottomWidth: 0 }}
            placeholder="Enter Postal/Zip code"
            placeholderTextColor={colors.lightGrey}
          />
        </View>

        <Text style={styles.label}>New Address</Text>

        <View style={{ paddingBottom: 0 }}>
          <Input
            inputStyle={{ borderBottomWidth: 0 }}
            containerStyle={{ borderBottomWidth: 0 }}
            style={{ borderBottomWidth: 0 }}
            placeholder="City/Town"
            placeholderTextColor={colors.lightGrey}
          />
        </View>

        <View style={{ paddingBottom: 0 }}>
          <Input
            inputStyle={{ borderBottomWidth: 0 }}
            containerStyle={{ borderBottomWidth: 0 }}
            style={{ borderBottomWidth: 0 }}
            placeholder="State"
            placeholderTextColor={colors.lightGrey}
          />
        </View>

        <View style={{ paddingBottom: 0 }}>
          <Input
            inputStyle={{ borderBottomWidth: 0 }}
            containerStyle={{ borderBottomWidth: 0 }}
            style={{ borderBottomWidth: 0 }}
            placeholder="Postal/Zip code"
            placeholderTextColor={colors.lightGrey}
          />
        </View>

        <View style={{ paddingBottom: 20 }}>
          <Text style={styles.label}>Telephone Number</Text>
          <Input
            inputStyle={{ borderBottomWidth: 0 }}
            containerStyle={{ borderBottomWidth: 0 }}
            style={{ borderBottomWidth: 0 }}
            placeholder="Enter seller's name"
            placeholderTextColor={colors.lightGrey}
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 30,
          }}
        >
          <View style={{ alignSelf: "flex-start" }}>
            <Switch value={false} />
          </View>
          <Text style={styles.label}>
            Send me notifications for transaction update
          </Text>
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: colors.white,
            alignSelf: "center",
            paddingHorizontal: 30,
            paddingVertical: 10,
            borderRadius: 20,
            marginBottom: 30,
          }}
        >
          <Text>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Closing;

const styles = StyleSheet.create({
  title: {
    color: colors.white,
    fontSize: 36,
    width: 250,
    paddingLeft: 30,
  },
  label: {
    color: colors.white,
  },
});
