import { AntDesign } from "@expo/vector-icons";
import { Text, Toast } from "native-base";
import React, { useState } from "react";
import { useEffect } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Input } from "react-native-elements";
import { Checkbox } from "react-native-paper";
import appApi from "../../../api/appApi";
import colors from "../../../constants/colors";
import { displayError, fetchAuthToken } from "../../../utils/misc";

const { width } = Dimensions.get("window");

const ListItem = ({ text, checked }) => {
  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 20,
        }}
      >
        <Checkbox
          color={colors.white}
          uncheckedColor={colors.white}
          status={checked ? "checked" : "unchecked"}
          disabled
        />
        <Text style={styles.text}>{text}</Text>
      </View>
    </View>
  );
};

//SaConditions/SaConditions

const CheckList = ({ transaction }) => {
  const [taskLists, setTask] = useState([]);
  const [fetchedList, setFetchedList] = useState([]);
  const [isFetchingList, setIsFetchingList] = useState(true);
  useEffect(() => {
    fetchCheckList();
  }, []);

  const fetchCheckList = async () => {
    try {
      const token = await fetchAuthToken();
      const response = await appApi.get(
        `/fetch_buyer_agent_checked_lists_for_property.php?transaction_id=${transaction.transaction_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.response.status == 200) {
        setFetchedList(JSON.parse(response.data.response.data.task_array));
      }
      setIsFetchingList(false);
    } catch (error) {
      displayError(error);
      setIsFetchingList(false);
    }
  };

  return (
    <View>
      <Text style={styles.title}>Requirement Checklist</Text>

      {isFetchingList ? (
        <ActivityIndicator size="large" color={colors.white} />
      ) : (
        <View>
          <FlatList
            data={fetchedList}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => {
              return (
                <ListItem checked={parseInt(item.status)} text={item.task} />
              );
            }}
          />
        </View>
      )}
    </View>
  );
};

export default CheckList;

const styles = StyleSheet.create({
  title: {
    color: colors.white,
    fontSize: 36,
    width: 250,
    paddingLeft: 30,
  },
  text: {
    color: colors.white,
  },
  btn: {
    backgroundColor: colors.white,
    alignSelf: "center",
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 20,
    elevation: 2,
    marginVertical: 20,
  },
});
