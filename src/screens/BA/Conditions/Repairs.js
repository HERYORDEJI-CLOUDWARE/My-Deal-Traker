import { Card, Container, Text, Toast } from "native-base";
import React, { useCallback } from "react";
import { useEffect } from "react";
import { useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import appApi from "../../../api/appApi";
import ListEmptyComponent from "../../../components/ListEmptyComponent";
import colors from "../../../constants/colors";
import { displayError, fetchAuthToken } from "../../../utils/misc";
import moment from "moment";
import { useFocusEffect } from "@react-navigation/native";
import { ActivityIndicator } from "react-native";
import { useContext } from "react";
import { Context } from "../../../context/UserContext";
import ReactNativeModal from "react-native-modal";
import { Input } from "react-native-elements";
import { ScrollView } from "react-native";

const Repairs = ({ transaction, notAgent, setView }) => {
  const [repairs, setRepairs] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [isAddingNote, setIsAddingNote] = useState(false);

  const {
    state: { user },
  } = useContext(Context);

  useFocusEffect(
    useCallback(() => {
      fetchRepairs();
      fetchNotes();
    }, [])
  );

  const [itemToUpdate, setItemToUpdate] = useState();
  const [isUpdating, setIsUpdating] = useState(false);
  const [showAddNote, setShowAddNote] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [note, setNote] = useState("");
  const [transNotes, setTransNotes] = useState([]);

  const fetchNotes = async () => {
    try {
      const token = await fetchAuthToken();
      const response = await appApi.get(
        `/fetch_transaction_repairs_notes.php?transaction_id=${transaction.transaction_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.response.status == 200) {
        setTransNotes(response.data.response.data);
      }
    } catch (error) {
      displayError(error);
    }
  };

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
        setRepairs(response.data.response.data);
        setIsLoading(false);
      } else {
        Toast.show({
          type: "warning",
          text: response.data.response.message,
        });
        setIsLoading(false);
      }
    } catch (error) {
      displayError(error);
    }
  };

  const addNote = async () => {
    try {
      setIsAddingNote(true);
      const token = await fetchAuthToken();
      const data = new FormData();
      // data.append("repair_id");
      data.append("user_id", user.unique_id);
      data.append("note", note);
      data.append("transaction_id", transaction.transaction_id);
      const response = await appApi.post(`/add_repairs_note.php`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.response.status == 200) {
        fetchNotes();
      }
      setIsAddingNote(false);
      setShowAddNote(false);
      setNote("");
    } catch (error) {
      setIsAddingNote(false);
      displayError(error);
    }
  };

  const ListEmpty = (
    <React.Fragment>
      <ListEmptyComponent title="Nothing here" info="Check back later" />
      <Text
        style={{
          textAlign: "center",
          backgroundColor: colors.white,
          alignSelf: "center",
          paddingVertical: 5,
          paddingHorizontal: 10,
        }}
        onPress={() => setView("inspection")}
      >
        Add repair
      </Text>
    </React.Fragment>
  );

  if (isLoading) {
    return (
      <Container style={{ backgroundColor: colors.bgBrown }}>
        <ActivityIndicator size={"large"} color={colors.white} />
      </Container>
    );
  }

  const onMarkDone = async (item) => {
    try {
      Alert.alert("Confirm", "Are you sure you want to confirm this repair?", [
        {
          text: "Yes",
          onPress: () => markDone(item),
        },
        {
          text: "NO",
        },
      ]);
    } catch (error) {}
  };

  const markDone = async (item) => {
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

  return (
    <View>
      <FlatList
        data={repairs}
        keyExtractor={(d, i) => i.toString()}
        ListEmptyComponent={ListEmpty}
        ListHeaderComponent={
          <View
            style={{
              paddingVertical: 20,
              paddingHorizontal: 20,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontSize: 20,
                color: colors.white,
              }}
            >
              Repairs and Status
            </Text>
            {repairs.length ? (
              <React.Fragment>
                {!notAgent && (
                  <Text
                    style={{
                      backgroundColor: colors.white,
                      alignSelf: "flex-start",
                      padding: 10,
                      paddingVertical: 5,
                    }}
                    onPress={() => setShowAddNote(true)}
                  >
                    + Add note
                  </Text>
                )}
                <Text
                  onPress={() => setShowNotes(true)}
                  style={{
                    backgroundColor: colors.white,
                    alignSelf: "flex-start",
                    padding: 10,
                    paddingVertical: 5,
                    marginTop: 10,
                  }}
                >
                  View notes
                </Text>
              </React.Fragment>
            ) : null}
          </View>
        }
        renderItem={({ item }) => {
          return (
            <React.Fragment>
              <View style={{ marginHorizontal: 10 }}>
                <Card style={{ backgroundColor: "rgba(255, 255, 255, 0.6)" }}>
                  <View style={{ paddingHorizontal: 15, paddingVertical: 5 }}>
                    {item.item ? (
                      <Text>
                        Item: <Text>{item.item}</Text>
                      </Text>
                    ) : null}
                    {item.recommended_repair ? (
                      <Text>
                        Recommended repair:{" "}
                        <Text>{item.recommended_repair}</Text>
                      </Text>
                    ) : null}
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
                      style={{
                        backgroundColor: colors.brown,
                        paddingHorizontal: 10,
                        paddingVertical: 10,
                      }}
                      activeOpacity={1}
                    >
                      <Text style={styles.markBtns}>Not done</Text>
                    </TouchableOpacity>
                  ) : item.status == "1" ? (
                    <TouchableOpacity
                      activeOpacity={1}
                      style={{
                        backgroundColor: colors.brown,
                        paddingVertical: 10,
                        paddingHorizontal: 20,
                      }}
                      disabled={notAgent}
                      onPress={() => {
                        onMarkDone(item);
                      }}
                    >
                      <Text style={styles.markBtns}>
                        {isUpdating && itemToUpdate == item.id
                          ? "Loading..."
                          : "Confirm as done"}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={{
                        backgroundColor: colors.brown,
                        paddingVertical: 5,
                        paddingHorizontal: 20,
                      }}
                      activeOpacity={1}
                    >
                      <Text
                        style={{
                          ...styles.markBtns,
                          backgroundColor: "green",
                          color: colors.white,
                        }}
                      >
                        Done
                      </Text>
                    </TouchableOpacity>
                  )}
                </Card>
              </View>
            </React.Fragment>
          );
        }}
      />
      <ReactNativeModal
        isVisible={showAddNote}
        onBackdropPress={() => {
          setShowAddNote(false);
          setNote("");
        }}
        onBackButtonPress={() => {
          setShowAddNote(false);
          setNote("");
        }}
      >
        <View style={{ backgroundColor: colors.white, paddingVertical: 30 }}>
          <Text style={{ fontSize: 25, textAlign: "center" }}>Add note</Text>
          <Input
            placeholder="Type something here"
            value={note}
            onChangeText={setNote}
          />
          <TouchableOpacity
            style={{
              alignSelf: "center",
              backgroundColor: colors.bgBrown,
              paddingHorizontal: 20,
              paddingVertical: 10,
              marginBottom: 10,
              borderRadius: 10,
            }}
          >
            <Text onPress={addNote} style={{ color: colors.white }}>
              {isAddingNote ? "Loading..." : "Send"}
            </Text>
          </TouchableOpacity>
        </View>
      </ReactNativeModal>
      <ReactNativeModal
        isVisible={showNotes}
        onBackdropPress={() => setShowNotes(false)}
        onBackButtonPress={() => setShowNotes(false)}
      >
        <View>
          <ScrollView style={{ backgroundColor: colors.white, padding: 20 }}>
            {transNotes.map((t, i) => {
              return (
                <View key={i}>
                  <View
                    style={{
                      flexDirection: "column",
                      flexWrap: "wrap",
                      marginVertical: 5,
                    }}
                  >
                    <Text style={{ fontSize: 20 }}>{t.note}</Text>
                    <Text style={{ fontSize: 12 }}>{t.date_created}</Text>
                  </View>
                </View>
              );
            })}
            {!transNotes.length ? <Text>No note has been added</Text> : null}
          </ScrollView>
        </View>
      </ReactNativeModal>
    </View>
  );
};

export default Repairs;

const styles = StyleSheet.create({
  markBtns: {
    color: colors.black,
    borderWidth: 0.5,
    alignSelf: "flex-start",
    marginVertical: 5,
    paddingHorizontal: 15,
    paddingVertical: 5,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderRadius: 5,
    borderColor: colors.white,
  },
});
