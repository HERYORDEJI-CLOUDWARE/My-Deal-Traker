import { Picker, Text, Toast } from "native-base";
import React, { useContext, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Input } from "react-native-elements";
import colors from "../../../constants/colors";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import { AntDesign, Entypo } from "@expo/vector-icons";
import ReactNativeModal from "react-native-modal";
import { useFormik } from "formik";
import * as DocumentPicker from "expo-document-picker";
import { displayError, fetchAuthToken } from "../../../utils/misc";
import appApi from "../../../api/appApi";
import { Context as UserContext } from "../../../context/UserContext";
import LogoPage from "../../../components/LogoPage";

const BaCounterOffer = ({ navigation, route }) => {
  const [date, setDate] = useState(new Date());

  const { transaction, offerForMe } = route.params;

  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {
    state: { user },
  } = useContext(UserContext);

  const [show, setShow] = useState(false);

  const { values, handleChange, handleSubmit, setFieldValue } = useFormik({
    initialValues: {
      legalName: "",
      nameOfSeller: "",
      purchasePrice: "",
      closingDate: "",
      document: "",
      optionalDoc: "",
      notes: "",
      multipleDocs: [""],
    },
    onSubmit: (values) => {
      if (!values.closingDate) {
        return Toast.show({
          type: "danger",
          text: "Select closing date",
        });
      }
      submitMakeOffer();
    },
  });



  const submitMakeOffer = async () => {
    try {
      setIsLoading(true);
      const token = await fetchAuthToken();
      const data = new FormData();
      data.append("property_id", transaction.property_id);
      data.append("transaction_id", transaction.transaction_id);
      data.append("by_who_id", user.unique_id);
      data.append("to_who_id", offerForMe[0].by_who.id);
      data.append("note_given", values.notes);
      data.append("price", values.purchasePrice);
      data.append("buyer_name", offerForMe[0].by_who.buyer_name);
      data.append("file_count", values.multipleDocs[0]?values.multipleDocs.length:0);
      data.append("closing_date", new Date(values.closingDate).toUTCString());
      if (values.multipleDocs[0]) {
        values.multipleDocs.map((d, i) => {
          data.append(`doc${i + 1}`, {
            name: d.name,
            type: "application/octet",
            uri: d.uri,
          });
        });
      }
      if(values.multipleDocs.length > 0){
        values.multipleDocs.map((d,i) => {
          data.append(`doc${i+1}`, {
            name: d.name,
            type: "application/octet",
            uri: d.uri,
          });
        })
      };
      const response = await appApi.post(`/make_offer_new.php`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIsLoading(false);
      if (response.data.response.status == 200) {
        Toast.show({
          type: "success",
          text: response.data.response.message,
          duration: 5000,
        });
        navigation.goBack();
      } else {
        Toast.show({
          type: "warning",
          text: response.data.response.message,
          duration: 5000,
        });
      }
    } catch (error) {
      displayError(error);
      setIsLoading(false);
    }
  };



  const pickDoc = async (index) => {
    const result = await DocumentPicker.getDocumentAsync();
    if (result.type === "cancel") {
      return;
    }
    // setFieldValue("document", result);
    const newVal = [...values.multipleDocs];
    newVal[index] = result;
    setFieldValue("multipleDocs", newVal);
  };

  const deleteDoc = async (index) => {
    const newVal = [...values.multipleDocs];
    const removedVal = newVal.filter((v, ind) => ind != index);
    setFieldValue("multipleDocs", removedVal);
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    // setShow(Platform.OS === "ios");
    setShow(false);
    setDate(currentDate);
    setFieldValue("closingDate", currentDate);
  };

  return (
    <LogoPage navigation={navigation} >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          borderWidth: 0,
        }}
      >
        <Text
          style={{
            color: colors.white,
            paddingHorizontal: 40,
            paddingVertical: 15,
            textAlign: "center",
            fontSize: 22,
            borderWidth: 0,
          }}
        >
          Submit An Offer
        </Text>
        <TouchableOpacity
          style={{ position: "absolute", right: 10, alignSelf: "center" }}
          onPress={() => setShowModal(true)}
        >
          <Entypo name="dots-three-vertical" size={25} />
        </TouchableOpacity>
      </View>

      <View style={{ paddingHorizontal: 20, marginBottom: 50 }}>
        <View style={{ paddingBottom: 20 }}>
          <Text style={styles.label}>Your Legal Name</Text>
          <Input
            inputStyle={{ borderBottomWidth: 0 }}
            containerStyle={{ borderBottomWidth: 0 }}
            style={{ borderBottomWidth: 0 }}
            placeholder="Enter your Legal Name"
            placeholderTextColor={colors.lightGrey}
            value={user.fullname}
            disabled
            // onChangeText={handleChange("legalName")}
          />
        </View>

        <View style={{ paddingBottom: 20 }}>
          <Text style={styles.label}>Name of Buyer</Text>
          <Input
            inputStyle={{ borderBottomWidth: 0 }}
            containerStyle={{ borderBottomWidth: 0 }}
            style={{ borderBottomWidth: 0 }}
            placeholder="Enter Name of Buyer"
            placeholderTextColor={colors.lightGrey}
            value={offerForMe[0].by_who.buyer_name}
            onChangeText={handleChange("nameOfSeller")}
            disabled
          />
        </View>

        <View style={{ paddingBottom: 20 }}>
          <Text style={styles.label}>Offer Price</Text>
          <Input
            inputStyle={{ borderBottomWidth: 0 }}
            containerStyle={{ borderBottomWidth: 0 }}
            style={{ borderBottomWidth: 0 }}
            placeholder="Enter amount you are willing to pay"
            placeholderTextColor={colors.lightGrey}
            keyboardType="number-pad"
            value={values.purchasePrice}
            onChangeText={handleChange("purchasePrice")}
          />
        </View>

        <View style={{ paddingBottom: 20 }}>
          <Text style={styles.label}>Notes (optional)</Text>
          <Input
            inputStyle={{ borderBottomWidth: 0 }}
            containerStyle={{ borderBottomWidth: 0 }}
            style={{ borderBottomWidth: 0 }}
            placeholder="Optional Notes"
            placeholderTextColor={colors.lightGrey}
            value={values.notes}
            onChangeText={handleChange("notes")}
          />
        </View>

        <View>
          <Text style={styles.label}>Closing Date</Text>
          <Text
            style={{ paddingVertical: 20, color: colors.white }}
            onPress={() => setShow(true)}
          >
            {moment(date).format("L")}{" "}
          </Text>

          {show && (
            <DateTimePicker
              onChange={onChange}
              display="spinner"
              value={date}
              mode="date"
            />
          )}
        </View>

        <View style={{ paddingVertical: 20 }}>
          <Text style={styles.label}>Upload Purchase Agreement Doc</Text>
        </View>

        {values.document ? <Text>{values.document.name} </Text> : null}

        {values.multipleDocs.map((d, ind) => {
          return (
            <View key={ind}>
              <Text>{d.name} </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  style={{
                    paddingVertical: 10,
                    backgroundColor: colors.white,
                    paddingHorizontal: 50,
                    alignSelf: "center",
                    borderRadius: 2,
                    marginTop: 10,
                    marginRight: 15,
                  }}
                  onPress={() => pickDoc(ind)}
                >
                  <Text style={{ textAlign: "center", color: colors.black }}>
                    Upload Document
                  </Text>
                </TouchableOpacity>
                <AntDesign
                  name="delete"
                  size={20}
                  onPress={() => deleteDoc(ind)}
                />
              </View>
            </View>
          );
        })}
        <Text
          style={{ textAlign: "right", color: colors.white, marginTop: 15 }}
          onPress={() => {
            const newV = [...values.multipleDocs];
            newV.push("");
            setFieldValue("multipleDocs", newV);
          }}
        >
          {values.multipleDocs.length > 0 ? "+ Add more": "Add document"}
        </Text>

        <View>
          <TouchableOpacity
            style={{
              backgroundColor: colors.white,
              paddingVertical: 10,
              alignSelf: "center",
              paddingHorizontal: 30,
              borderRadius: 20,
              marginTop: 20,
              elevation: 2,
            }}
            onPress={handleSubmit}
          >
            <Text style={{ textAlign: "center", color: colors.bgBrown }}>
              {isLoading ? "Loading..." : "Send"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <ReactNativeModal
        isVisible={showModal}
        onBackdropPress={() => setShowModal(false)}
        onBackButtonPress={() => setShowModal(false)}
      >
        <View
          style={{
            backgroundColor: colors.white,
            paddingVertical: 20,
            paddingHorizontal: 10,
          }}
        >
          <Text onPress={() => setShowModal(false)}>Download Template</Text>
        </View>
      </ReactNativeModal>
    </LogoPage>
  );
};

export default BaCounterOffer;

const styles = StyleSheet.create({
  label: {
    color: colors.white,
  },
});
