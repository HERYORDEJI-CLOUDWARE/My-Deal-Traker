import { Card, Picker, Text, Toast } from "native-base";
import React, { useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  FlatList,
  ActivityIndicator,
} from "react-native";
import colors from "../../../constants/colors";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import { AntDesign } from "@expo/vector-icons";
import { displayError, fetchAuthToken } from "../../../utils/misc";
import appApi from "../../../api/appApi";
import { useEffect } from "react";
import { Alert } from "react-native";
import { useContext } from "react";
import { Context } from "../../../context/UserContext";

const Inspection = ({ transaction }) => {
  const [repairList, setRepairList] = useState();
  const [isFetching, setIsFetching] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [itemToUpdate, setItemToUpdate] = useState();

  const {
    state: { user },
  } = useContext(Context);

  useEffect(() => {
    fetchRepairs();
  }, []);

  const fetchRepairs = async () => {
    try {
      const token = await fetchAuthToken();
      const response = await appApi.get(
        `/fetch_transaction_repair.php?transaction_id=${transaction.transaction_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.response.status == 200) {
        setRepairList(response.data.response.data);
      } else {
        Toast.show({
          type: "warning",
          text: response.data.response.message,
        });
      }
      setIsFetching(false);
    } catch (error) {
      displayError(error);
    }
  };

  const onMarkDone = async (item) => {
    try {
      Alert.alert("Confirm", "Are you sure you have completed this repair?", [
        {
          text: "Yes",
          onPress: () => markAsDone(item),
        },
        {
          text: "NO",
        },
      ]);
    } catch (error) {}
  };

  const updateRepairs = async (item) => {
    try {
      // setIsUpdating(true);
      const token = await fetchAuthToken();
      var datestr = new Date().toUTCString();
      const data = new FormData();
      data.append("repair_id", item.repair_id);
      data.append("property_transaction_id", item.property_transaction_id);
      data.append("transaction_id", item.transaction_id);
      data.append("required", item.required);
      data.append("item", item.item);
      data.append("recommended_repair", item.recommended_repair);
      data.append("memo", item.memo);
      data.append("status", true);
      data.append("date_ordered", datestr);
      data.append("date_received", item.date_received);
      data.append("expected_delivery_date", datestr);

      const response = await appApi.post(`/update_repairs.php`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIsUpdating(false);
      if (response.data.response.status == 200) {
        fetchRepairs();
        Toast.show({
          type: "success",
          text: response.data.response.message,
        });
      }
    } catch (error) {
      setIsUpdating(false);
      displayError(error);
    }
  };

  const markAsDone = async (item) => {
    try {
      setIsUpdating(true);
      setItemToUpdate(item.id);
      const token = await fetchAuthToken();
      const data = new FormData();
      data.append("user_id", user.unique_id);
      data.append("transaction_id", item.transaction_id);
      data.append("repair_id", item.repair_id);
      const response = await appApi.post(`/mark_repair_as_done.php`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.response.status == 200) {
        fetchRepairs();
        Toast.show({
          type: "success",
          text: response.data.response.message,
        });
      } else {
        fetchRepairs();
        Toast.show({
          type: "warning",
          text: response.data.response.message,
        });
      }
      setIsUpdating(false);
    } catch (error) {
      displayError(error);
      setIsUpdating(false);
    }
  };

  if (isFetching) {
    return (
      <View>
        <ActivityIndicator size="large" color={colors.white} />
      </View>
    );
  }

  return (
    <View style={{ paddingHorizontal: 20 }}>
      <View>
        <Text style={styles.title}>Repairs</Text>
      </View>

      <FlatList
        data={repairList}
        keyExtractor={(v, i) => i.toString()}
        renderItem={({ item }) => {
          return (
            <View>
              <Card>
                <View style={{ paddingHorizontal: 15, paddingVertical: 5 }}>
                  <Text>
                    Item: <Text>{item.item}</Text>
                  </Text>
                  <Text>
                    Recommended repair: <Text>{item.recommended_repair}</Text>
                  </Text>
                  <Text>
                    Memo: <Text>{item.memo}</Text>
                  </Text>
                  <Text>
                    Date added:{" "}
                    <Text>{moment(item.date_created).format("LT")}</Text>
                  </Text>
                </View>
                {item.status == "0" ? (
                  <TouchableOpacity
                    onPress={() => onMarkDone(item)}
                    style={{
                      backgroundColor: colors.brown,
                      paddingHorizontal: 10,
                    }}
                  >
                    <Text style={styles.markBtns}>
                      {isUpdating && itemToUpdate == item.id
                        ? "Loading..."
                        : "Confirm as done"}
                    </Text>
                  </TouchableOpacity>
                ) : item.status == "1" ? (
                  <TouchableOpacity
                    activeOpacity={1}
                    style={{
                      backgroundColor: colors.brown,
                      paddingHorizontal: 10,
                    }}
                  >
                    <Text style={styles.markBtns}>
                      Pending Buyer Agent Confirmation
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={{
                      backgroundColor: colors.brown,
                      paddingHorizontal: 10,
                    }}
                    activeOpacity={1}
                  >
                    <Text style={styles.markBtns}>Done</Text>
                  </TouchableOpacity>
                )}
              </Card>
            </View>
          );
        }}
      />

      <View style={{ marginTop: 30 }} />

      {/* <TouchableOpacity
        style={{
          backgroundColor: colors.white,
          alignSelf: "center",
          paddingVertical: 10,
          paddingHorizontal: 80,
          borderRadius: 20,
          marginBottom: 20,
          elevation: 2,
        }}
      >
        <Text>Send</Text>
      </TouchableOpacity> */}
    </View>
  );
};

export default Inspection;

const styles = StyleSheet.create({
  title: {
    color: colors.white,
    fontSize: 36,
    paddingLeft: 30,
  },
  label: {
    color: colors.white,
  },
  moreBtn: {
    backgroundColor: colors.white,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginVertical: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  item: { borderBottomWidth: 0.5, marginBottom: 40 },
  markBtns: {
    color: colors.white,
    borderWidth: 0.5,
    alignSelf: "flex-start",
    marginVertical: 5,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
});
