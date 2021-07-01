import { Container, Text, Toast } from "native-base";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { Input } from "react-native-elements";
import appApi from "../../../api/appApi";
import LogoPage from "../../../components/LogoPage";
import colors from "../../../constants/colors";
import { displayError, fetchAuthToken } from "../../../utils/misc";
import { AntDesign } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const ListingChecklist = ({ route, navigation }) => {
  const { property } = route.params;

  const [showAddNew, setShowAddNew] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isFetchingList, setIsFetchingList] = useState(true);
  const [fetchedList, setFetchedList] = useState([]);
  const [taskLists, setTask] = useState("");

  const addNewForm = () => {
    setShowAddNew(!showAddNew);
  };

  useEffect(() => {
    fetchCheckList();
  }, []);

  const fetchCheckList = async () => {
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
      setFetchedList(response.data.response.data);
      setIsFetchingList(false);
    } catch (error) {
      displayError(error);
      setIsFetchingList(false);
    }
  };

  const onAddNewTask = async () => {
    try {
      setIsAddingTask(true);
      const token = await fetchAuthToken();
      const data = new FormData();
      data.append("task", taskLists);
      data.append("notify", true);
      data.append("property_transaction_id", property.transaction_id);
      const response = await appApi.post(`/add_task.php`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.response.status == 200) {
        setTask("");
        setShowAddNew(false);
        await fetchCheckList();
        setIsAddingTask(false);
      } else {
        Toast.show({
          type: "warning",
          text: response.data.response.message,
          duration: 3500,
        });
      }
    } catch (error) {
      setIsAddingTask(true);
      displayError(error);
    }
  };

  const ListItem = ({ text, checked }) => {
    return (
      <View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 20,
            paddingVertical: 5,
          }}
        >
          <Text style={styles.text}>• {text}</Text>
        </View>
      </View>
    );
  };

  if (isFetchingList) {
    return (
      <LogoPage navigation={navigation}>
        <ActivityIndicator size="large" color={colors.white} />
      </LogoPage>
    );
  }

  return (
    <LogoPage style={{ backgroundColor: colors.bgBrown }} navigation={navigation}>
      {isFetchingList ? (
        <ActivityIndicator />
      ) : (
        <View>
          <FlatList
            data={fetchedList}
            ListHeaderComponent={
              <React.Fragment>
                <View>
                  <Text
                    style={{
                      fontSize: 22,
                      textAlign: "center",
                      color: colors.white,
                      paddingBottom: 20,
                    }}
                  >
                    Checklist for this property
                  </Text>
                </View>
              </React.Fragment>
            }
            renderItem={({ item }) => {
              return (
                <ListItem checked={parseInt(item.status)} text={item.task} />
              );
            }}
            ListFooterComponent={
              <React.Fragment>
                {showAddNew ? (
                  <View>
                    <View>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Input
                          containerStyle={{ width: width * 0.8 }}
                          inputContainerStyle={{
                            backgroundColor: colors.white,
                            paddingHorizontal: 10,
                          }}
                          placeholder="Enter New Task"
                          value={taskLists}
                          onChangeText={(text) => setTask(text)}
                        />
                      </View>
                    </View>
                  </View>
                ) : null}

                {taskLists && showAddNew ? (
                  <TouchableOpacity style={styles.btn} onPress={onAddNewTask}>
                    <Text style={{ color: colors.brown }}>
                      {isAddingTask ? "Loading..." : "Save"}
                    </Text>
                  </TouchableOpacity>
                ) : null}

                <TouchableOpacity style={styles.btn} onPress={addNewForm}>
                  <Text style={{ color: colors.brown }}>
                    {showAddNew ? (
                      <AntDesign name="close" size={30} />
                    ) : (
                      "Add New"
                    )}
                  </Text>
                </TouchableOpacity>
              </React.Fragment>
            }
          />
        </View>
      )}
    </LogoPage>
  );
};

export default ListingChecklist;

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
    borderRadius: 2,
    elevation: 2,
    marginVertical: 20,
  },
});
