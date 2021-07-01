import React, { useContext, useRef, useState } from "react";
import { ActionSheet, Picker, Text, Toast } from "native-base";
import LogoPage from "../../../components/LogoPage";
import { StyleSheet } from "react-native";
import colors from "../../../constants/colors";
import { View } from "react-native";
import { TouchableOpacity } from "react-native";
import { displayError, fetchAuthToken } from "../../../utils/misc";
import { Context } from "../../../context/UserContext";
import { Input } from "react-native-elements";
import MultiSelect from "react-native-multiple-select";
import appApi from "../../../api/appApi";
import { ActivityIndicator } from "react-native";

const CloseDealForm = ({ transaction, checklist }) => {
  const {
    state: { user },
  } = useContext(Context);

  const [closingProcess, setClosingProcess] = useState("");
  const [closingExt, setClosingExt] = useState("");
  const [amendmentBtns, setAmendmentBtns] = useState("");

  const [extReason, setExtReason] = useState("");

  const [selectedItems, setSelectedItems] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  var CLOSING_PROCESS_BUTTONS = ["No", "Yes", "Cancel"];
  var CLOSING_CANCEL_INDEX = 2;

  var CLOSING_EXT_BUTTONS = ["Seller", "Buyer", "Cancel"];
  var CLOSING_EXT_CANCEL_INDEX = 2;

  var AMENDMENT_BUTTONS = ["No", "Yes", "Cancel"];
  var AMENDMENT_CANCEL_INDEX = 2;

  const onSubmitForm = async () => {
    try {
      setIsLoading(true);
      const token = await fetchAuthToken();
      const data = new FormData();
      data.append("user_id", user.unique_id);
      data.append("offer_id", user.unique_id);
      data.append("closing_process_status", closingProcess);
      data.append("outstanding_tasks", JSON.stringify(selectedItems));
      data.append("closing_date_extension_request_by", closingExt);
      data.append("extension_reason", extReason);
      data.append("amendment_status", amendmentBtns);
      data.append("transaction_id", transaction);

      const response = await appApi.post(`/close_deal.php`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.response.status == 200) {
        Toast.show({
          type: "success",
          text: response.data.response.message,
          duration: 5000,
        });
      } else {
        Toast.show({
          type: "warning",
          text: response.data.response.message,
          duration: 5000,
        });
      }
      setIsLoading(false);
    } catch (error) {
      displayError(error);
      setIsLoading(false);
    }
  };

  const items = [];
  checklist.map((c) => items.push({ id: c.id, name: c.task }));

  const selectRef = useRef();

  const onSelectedItemsChange = (sI) => {
    setSelectedItems(sI);
  };

  return (
    <React.Fragment>
      <LogoPage dontShow={true} >
        <View style={{ paddingHorizontal: 20 }}>
          <TouchableOpacity
            style={styles.selects}
            onPress={() =>
              ActionSheet.show(
                {
                  options: CLOSING_PROCESS_BUTTONS,
                  cancelButtonIndex: CLOSING_CANCEL_INDEX,
                  title: "Has the agent completed all necessary tasks?",
                },
                (buttonIndex) => {
                  if (buttonIndex !== CLOSING_CANCEL_INDEX) {
                    setClosingProcess(buttonIndex);
                  }
                }
              )
            }
          >
            <Text style={styles.title}>Closing Process Status?</Text>
            <Text style={styles.body}>
              {" "}
              {CLOSING_PROCESS_BUTTONS[closingProcess] ||
                "Has the agent completed all necessary tasks?"}{" "}
            </Text>
          </TouchableOpacity>

          {closingProcess === 0 ? (
            <View>
              <MultiSelect
                hideTags
                items={items}
                uniqueKey="name"
                ref={selectRef}
                onSelectedItemsChange={onSelectedItemsChange}
                selectedItems={selectedItems}
                selectText="Pick Items"
                searchInputPlaceholderText="Search Items..."
                onChangeInput={(text) => {}}
                tagRemoveIconColor="#CCC"
                tagBorderColor="#CCC"
                tagTextColor="#CCC"
                selectedItemTextColor="#CCC"
                selectedItemIconColor="#CCC"
                itemTextColor="#000"
                displayKey="name"
                searchInputStyle={{ color: "#CCC" }}
                submitButtonColor="#CCC"
                submitButtonText="Submit"
              />
              <View>
                {selectRef.current &&
                  selectRef.current.getSelectedItemsExt(selectedItems)}
              </View>
            </View>
          ) : null}

          <TouchableOpacity
            style={styles.selects}
            onPress={() =>
              ActionSheet.show(
                {
                  options: CLOSING_EXT_BUTTONS,
                  cancelButtonIndex: CLOSING_EXT_CANCEL_INDEX,
                  title: "Closing Date Extension Requested by?",
                },
                (buttonIndex) => {
                  if (buttonIndex !== CLOSING_EXT_CANCEL_INDEX) {
                    setClosingExt(buttonIndex);
                  }
                }
              )
            }
          >
            <Text style={styles.title}>
              Closing Date Extension Requested by?
            </Text>
            <Text style={styles.body}>
              {" "}
              {CLOSING_EXT_BUTTONS[closingExt] ||
                "Closing Date Extension Requested by?"}{" "}
            </Text>
          </TouchableOpacity>

          {closingExt === 0 || closingExt === 1 ? (
            <View>
              <Input
                placeholder="Reason"
                label="Enter reason"
                labelStyle={{ color: colors.white }}
                placeholderTextColor={colors.lightGrey}
                value={extReason}
                onChangeText={setExtReason}
              />
            </View>
          ) : null}

          <TouchableOpacity
            style={styles.selects}
            onPress={() =>
              ActionSheet.show(
                {
                  options: AMENDMENT_BUTTONS,
                  cancelButtonIndex: AMENDMENT_CANCEL_INDEX,
                  title: "Amendment Status?",
                },
                (buttonIndex) => {
                  if (buttonIndex !== AMENDMENT_CANCEL_INDEX) {
                    setAmendmentBtns(buttonIndex);
                  }
                }
              )
            }
          >
            <Text style={styles.title}>Amendment Status?</Text>
            <Text style={styles.body}>
              {" "}
              {AMENDMENT_BUTTONS[amendmentBtns] ||
                "Has all repairs been done?"}{" "}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ backgroundColor: colors.white, paddingVertical: 10 }}
            onPress={onSubmitForm}
          >
            {isLoading ? (
              <ActivityIndicator />
            ) : (
              <Text style={{ textAlign: "center", color: colors.bgBrown }}>
                Submit
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </LogoPage>
    </React.Fragment>
  );
};

export default CloseDealForm;

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    color: colors.black,
    fontWeight: "bold",
  },
  body: {
    paddingVertical: 10,
    color: colors.white,
  },
  selects: {
    marginVertical: 10,
  },
});
