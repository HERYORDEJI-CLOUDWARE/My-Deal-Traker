import { AntDesign } from "@expo/vector-icons";
import { Text, Toast } from "native-base";
import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { ActivityIndicator } from "react-native";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { Checkbox } from "react-native-paper";
import appApi from "../../../api/appApi";
import colors from "../../../constants/colors";
import { Context as UserContext } from "../../../context/UserContext";
import { displayError, fetchAuthToken } from "../../../utils/misc";

const CheckList = ({ transaction, property }) => {
  const [fetchedList, setFetchedList] = useState([]);
  const [propertyCheckList, setPropertyCheckList] = useState([]);
  const [fetchingList, setFetchingList] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const {
    state: { user },
  } = useContext(UserContext);

  useEffect(() => {
    if (transaction) {
      fetchTransactionCheckList();
      fetchPropertyCheckList();
    }
  }, []);

  if (!transaction) {
    return (
      <React.Fragment>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <AntDesign name="warning" size={100} color={colors.white} />
          <Text style={{ color: colors.white }}>
            You have not shown interest in this property
          </Text>
        </View>
      </React.Fragment>
    );
  }

  const fetchTransactionCheckList = async () => {
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
        if (response.data.response.data) {
          setFetchedList(JSON.parse(response.data.response.data.task_array));
        } else {
          // setFetchedList(response.data.response.data);
        }
      }
      setFetchingList(false);
    } catch (error) {
      setFetchingList(false);
      displayError(error);
    }
  };

  const fetchPropertyCheckList = async () => {
    try {
      const token = await fetchAuthToken();
      const response = await appApi.get(
        `/fetch_tasks.php?property_transaction_id=${property.transaction_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.response.status == 200) {
        setPropertyCheckList(response.data.response.data);
      }
      setFetchingList(false);
    } catch (error) {
      setFetchingList(false);
      displayError(error);
    }
  };

  let renderedList = [];
  if (!fetchedList.length) {
    renderedList = propertyCheckList;
  } else {
    renderedList = fetchedList;
  }

  const newArr = [];
  for (let index = 0; index < propertyCheckList.length; index++) {
    const element = propertyCheckList[index];
    if (!fetchedList.length) {
      newArr.push(element);
    } else {
      const findOldArr = fetchedList.find(
        (val) => val.task_id == element.unique_id
      );
      if (!findOldArr) {
        const alreadyExists = renderedList.find((e) => {
          console.log(e.task_id + " ======" + element.unique_id);
          return e.task_id == element.unique_id;
        });
        if (!alreadyExists) {
          renderedList.push({
            status: element.status,
            task: element.task,
            task_id: element.unique_id,
          });
        }
      }
    }
  }

  const onToggleCheckList = (index) => {
    const newList = [...renderedList];
    if (newList[index].status == "0") {
      newList[index].status = 1;
    } else {
      newList[index].status = 0;
    }
    setFetchedList(newList);
  };

  const updateCheckList = async () => {
    try {
      const newList = [];
      fetchedList.map((list) => {
        return newList.push({
          task_id: list.task_id || list.unique_id,
          task: list.task,
          status: list.status,
        });
      });

      setIsSending(true);
      const data = new FormData();
      const token = await fetchAuthToken();
      const fdata = JSON.stringify(newList);
      data.append("buyer_agent_id", user.unique_id);
      data.append("transaction_id", transaction.transaction_id);
      data.append("task_array", fdata);
      const response = await appApi.post(`/check_list.php`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.response.status == 200) {
        Toast.show({
          type: "success",
          text: response.data.response.message,
        });
        await fetchTransactionCheckList();
      } else {
        Toast.show({
          type: "warning",
          text: response.data.response.message,
        });
      }
      setIsSending(false);
    } catch (error) {
      setIsSending(false);
      displayError(error);
    }
  };

  const ListItem = ({ text, checked, index }) => {
    return (
      <TouchableOpacity onPress={() => onToggleCheckList(index)}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 20,
          }}
        >
          <Checkbox
            onPress={() => onToggleCheckList(index)}
            color={colors.white}
            uncheckedColor={colors.white}
            status={parseInt(checked) ? "checked" : "unchecked"}
          />
          <Text onPress={() => onToggleCheckList(index)} style={styles.text}>
            {text}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (fetchingList) {
    return (
      <View>
        <ActivityIndicator color={colors.white} size="large" />
      </View>
    );
  }

  return (
    <View>
      <View>
        <FlatList
          data={renderedList}
          ListEmptyComponent={
            <React.Fragment>
              <Text style={{ textAlign: "center", color: "#fff" }}>
                No check list has been added to this property{" "}
              </Text>
            </React.Fragment>
          }
          ListHeaderComponent={
            <Text style={styles.title}>Requirement Checklist</Text>
          }
          keyExtractor={(v, i) => i.toString()}
          renderItem={({ item, index }) => {
            return (
              <View>
                {item.task_id || item.unique_id ? (
                  <ListItem
                    checked={item.status}
                    text={item.task}
                    index={index}
                  />
                ) : null}
              </View>
            );
          }}
          ListFooterComponent={
            <View>
              {renderedList.length > 0 ? (
                <TouchableOpacity
                  style={styles.btn}
                  onPress={updateCheckList}
                  disabled={isSending}
                >
                  <Text style={{ color: colors.white }}>
                    {isSending ? "Loading..." : "Send"}
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
          }
        />
      </View>

      <View style={{ minHeight: 200 }} />
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
    backgroundColor: colors.brown,
    alignSelf: "center",
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 20,
    elevation: 2,
    marginVertical: 20,
  },
});
