import { Picker, Text, Toast } from "native-base";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View, Image } from "react-native";
import colors from "../../../constants/colors";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { AntDesign } from "@expo/vector-icons";
import { useFormik } from "formik";
import { Input } from "react-native-elements";
import { displayError, fetchAuthToken } from "../../../utils/misc";
import appApi from "../../../api/appApi";
import { Switch, ToggleButton } from "react-native-paper";
import { useContext } from "react";
import { Context as UserContext } from "../../../context/UserContext";

const Inspection = ({ transaction, property }) => {
  const {
    state: { user },
  } = useContext(UserContext);
  const [date, setDate] = useState(new Date());

  const [show, setShow] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [ordering, setOrdering] = useState(false);

  const { values, setFieldValue, handleSubmit } = useFormik({
    initialValues: {
      dateOrdered: "",
      repairsNeeded: "",
      condition: "",
      repairRecommendation: "",
      required: false,
      memo: "",
      recommendations: [
        {
          item: "",
          condition: "",
          recommendation: "",
          dateNeeded: "",
        },
      ],
    },
    onSubmit: (valuez) => {
      onSubmitRepairs();
    },
  });

  const itemsArr = [];
  const rpArr = [];
  values.recommendations.map((i) => {
    rpArr.push(i.recommendation);
    return itemsArr.push(i.item);
  });

  const sendRepair = async () => {
    try {
      setIsLoading(true);
      var datestr = new Date().toUTCString();
      const data = new FormData();
      data.append("property_transaction_id", property.transaction_id);
      data.append("transaction_id", transaction.transaction_id);
      data.append("repairs_needed", values.required ? 1 : 0);
      data.append("required", values.required ? 1 : 0);
      data.append("item", JSON.stringify(itemsArr));
      data.append("recommended_repair", JSON.stringify(rpArr));
      data.append("memo", values.memo);
      data.append("date_ordered", datestr);
      data.append("expected_delivery_date", datestr);
      data.append("user_id", user.unique_id);

      const token = await fetchAuthToken();
      const response = await appApi.post(`/repairs.php`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIsLoading(false);


      if (response.data.response.status == 200) {
        Toast.show({
          type: "success",
          text: `Repairs added successfully`,
          duration: 4000,
        });
      } else {
        Toast.show({
          type: "warning",
          text: response.data.response.message,
          duration: 4000,
        });
      }
    } catch (error) {
      displayError(error);
    }
  };

  const onSubmitRepairs = async () => {
    try {
      await sendRepair();
      const newv = [
        {
          item: "",
          condition: "",
          recommendation: "",
          dateNeeded: "",
          memo: "",
          required: false,
        },
      ];
      setFieldValue("recommendations", newv);
    } catch (error) {
      displayError(error);
    }
  };

  const onDateChange = (event, selectedDate, i) => {
    const currentDate = selectedDate || date;
    const valuez = [...values.recommendations];
    valuez[i] = { ...valuez[i], dateNeeded: currentDate };
    setShow(false);
    setDate(currentDate);
    setFieldValue("recommendations", valuez);
  };

  const handleInputChange = (text, index, name) => {
    const valuez = [...values.recommendations];
    valuez[index] = { ...valuez[index], [name]: text };
    setFieldValue("recommendations", valuez);
  };

  const handleAddFields = () => {
    const valuez = [...values.recommendations];
    valuez.push({ item: "", condition: "", recommendation: "" });
    setFieldValue("recommendations", valuez);
  };

  const deleteRepairItem = (i) => {
    const valuez = [...values.recommendations];
    const filteredValues = valuez.filter((v, ind) => {
      return ind != i;
    });
    setFieldValue("recommendations", filteredValues);
  };

  const orderInspection = async() => {
    try {
      setOrdering(true)
      const token = await fetchAuthToken();
      const data = new FormData()
      data.append("seller_agent_id", property.listing_agent_id)
      data.append("buyer_agent_id", transaction.buyer_agent_id)
      data.append("transaction_id", transaction.transaction_id)
      const response = await appApi.post(`/order_inspection.php`, data, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      if(response.data.response.status == 200){
        Toast.show({
          type: 'success',
          text: response.data.response.message
        })
      } else {
        Toast.show({
          type: 'warning',
          text: response.data.response.message
        })
      }
      setOrdering(false)
    } catch (error) {
      displayError(error)
      setOrdering(false)
    }
  }


  return (
    <View style={{ paddingHorizontal: 20 }}>
      <View>
        <Text style={styles.title}>Inspection</Text>
      </View>

      <View style={{ marginTop: 30 }} />

      <TouchableOpacity
        style={{
          paddingVertical:10,
          alignSelf:'center',
          paddingHorizontal: 30,
          backgroundColor: colors.white,
          marginBottom: 20,
          borderRadius: 10,
        }}
        onPress={orderInspection}
        disabled={ordering}
      >
        <Text>{ordering ? "Loading..." : "Order Inspection"}</Text>
      </TouchableOpacity>

      <View>
        <Text
          style={{
            ...styles.label,
            paddingHorizontal: 20,
            fontSize: 20,
            paddingVertical: 10,
          }}
        >
          Repairs Needed
        </Text>
      </View>

      <View style={{ paddingHorizontal: 20 }}>
        {values.recommendations.map((r, i) => {
          return (
            <View key={i}>
              <Text style={{ color: colors.white }}>{i + 1}) </Text>

              {show && (
                <RNDateTimePicker
                  testID="dateTimePicker"
                  value={r.dateNeeded || new Date()}
                  mode={"date"}
                  is24Hour={true}
                  display="default"
                  onChange={(event, selectedDate) => {
                    onDateChange(event, selectedDate, i);
                  }}
                />
              )}

              <View style={styles.item}>
                <Text style={styles.label}>Item</Text>
                <Input
                  placeholder="Item"
                  placeholderTextColor={"#ccc"}
                  value={r.item}
                  onChangeText={(text) => handleInputChange(text, i, "item")}
                  style={{ color: colors.white }}
                  inputContainerStyle={{ borderBottomColor: colors.white }}
                />
              </View>

              <View style={styles.item}>
                <Text style={styles.label}>Condition</Text>
                <Input
                  placeholder="Conditions"
                  placeholderTextColor={"#ccc"}
                  value={r.condition}
                  onChangeText={(text) =>
                    handleInputChange(text, i, "condition")
                  }
                  inputContainerStyle={{ borderBottomColor: colors.white }}
                  style={{ color: colors.white }}
                />
              </View>

              <View style={styles.item}>
                <Text style={styles.label}>Repair Recommendation</Text>
                <Input
                  placeholder="Repair Recommendation"
                  value={r.recommendation}
                  placeholderTextColor={"#ccc"}
                  onChangeText={(text) =>
                    handleInputChange(text, i, "recommendation")
                  }
                  style={{ color: colors.white }}
                  inputContainerStyle={{
                    borderBottomWidth: 1,
                    borderBottomColor: colors.white,
                  }}
                  containerStyle={{}}
                />
              </View>

              {values.recommendations.length > 1 ? (
                <TouchableOpacity
                  style={{ marginBottom: 30 }}
                  onPress={() => deleteRepairItem(i)}
                >
                  <Text>
                    <AntDesign name="delete" /> Remove
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
          );
        })}

        <View style={styles.item}>
          <Text style={styles.label}>Memo</Text>
          <Input
            placeholder="Memo"
            value={values.memo}
            placeholderTextColor={"#ccc"}
            onChangeText={(text) => setFieldValue("memo", text)}
            style={{ color: colors.white }}
            inputContainerStyle={{
              borderBottomWidth: 1,
              borderBottomColor: colors.white,
            }}
            containerStyle={{}}
          />
        </View>

        <View style={{flexDirection:"row", alignItems:"center"}}>
          <Switch
            value={values.required}
            color={colors.white}
            style={{ alignSelf: "flex-start" }}
            onValueChange={() => setFieldValue("required", !values.required)}
          />
          <Text>Required?</Text>
        </View>

        <TouchableOpacity style={styles.moreBtn} onPress={handleAddFields}>
          <Text style={{ paddingRight: 20, color: colors.brown }}>
            Add More
          </Text>
          <AntDesign name="plussquare" size={20} color={colors.brown} />
        </TouchableOpacity>

        <View style={{ marginTop: 30 }} />

        <TouchableOpacity
          style={{
            backgroundColor: colors.white,
            alignSelf: "center",
            paddingVertical: 10,
            paddingHorizontal: 80,
            borderRadius: 20,
            marginBottom: 20,
            elevation: 2,
          }}
          onPress={handleSubmit}
        >
          <Text>{isLoading ? "Loading..." : "Send"}</Text>
        </TouchableOpacity>
      </View>
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
  item: { marginBottom: 0 },
});
