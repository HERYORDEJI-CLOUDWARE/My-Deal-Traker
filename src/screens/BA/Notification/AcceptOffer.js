import { Container, Text, Toast } from "native-base";
import React, { useState } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import colors from "../../../constants/colors";
import * as DocumentPicker from "expo-document-picker";
import { useFormik } from "formik";
import { displayError, fetchAuthToken } from "../../../utils/misc";
import appApi from "../../../api/appApi";
import { ScrollView } from "react-native";
import LogoPage from "../../../components/LogoPage";

const AcceptOffer = ({ route, navigation }) => {
  const { transaction } = route.params;

  const [isLoading, setIsLoading] = useState(false);

  const { values, setFieldValue, handleSubmit } = useFormik({
    initialValues: {
      document: "",
      otherDoc: "",
    },
    onSubmit: (values) => {
      acceptOffer();
    },
  });

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({});
      if (result.type !== "cancel") {
        setFieldValue("document", result);
      }
    } catch (error) {}
  };

  const acceptOffer = async () => {
    try {
      setIsLoading(true);
      const token = await fetchAuthToken();
      const data = new FormData();
      data.append("transaction_id", transaction.transaction_id);
      data.append("property_id", transaction.property_id);
      if (values.document) {
        data.append("psa_doc", {
          name: values.document.name,
          type: "application/octet",
          uri: values.document.uri,
        });
      }
      const response = await appApi.post(`/approve_make_offer.php`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.response.status == 200) {
        Toast.show({
          type: "success",
          text: response.data.response.message,
        });
      } else {
        Toast.show({
          type: "warning",
          text: response.data.response.message,
        });
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      displayError(error);
    }
  };

  return (
    <LogoPage navigation={navigation} >
      <ScrollView>
        <View
          style={{
            paddingHorizontal: 20,
            paddingBottom: 80,
            borderBottomWidth: 1,
            borderBottomColor: colors.white,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.title}>Make Offer Notification</Text>
            <Text style={{ color: colors.white, flex: 1, textAlign: "right" }}>
              02/09/2020
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ ...styles.title, fontSize: 20 }}>
              Transaction ID:
            </Text>
            <Text style={{ color: colors.white, flex: 1, textAlign: "right" }}>
              36 000 458{" "}
            </Text>
          </View>
          <Text style={{ color: colors.white, textAlign: "center" }}>
            Upload the necessary documents to complete Accept Offer process
          </Text>
        </View>

        <View>
          <Text
            style={{
              color: colors.white,
              textAlign: "center",
              fontSize: 33,
              paddingTop: 30,
            }}
          >
            Submit An Offer
          </Text>
        </View>

        <View style={{ paddingVertical: 20 }}>
          <Text style={styles.label}>Upload Purchase Agreement Doc</Text>
        </View>

        {values.document ? (
          <Text style={{ textAlign: "center" }}>{values.document.name}</Text>
        ) : null}

        <View>
          <TouchableOpacity
            style={{
              paddingVertical: 10,
              backgroundColor: colors.white,
              paddingHorizontal: 30,
              alignSelf: "center",
              borderRadius: 20,
            }}
            onPress={pickDocument}
          >
            <Text style={{ textAlign: "center", color: colors.black }}>
              Upload Document
            </Text>
          </TouchableOpacity>
        </View>

        {/* <View style={{ paddingVertical: 20 }}>
          <Text style={styles.label}>Other Document</Text>
        </View> */}

        <View>
          {/* <TouchableOpacity
            style={{
              paddingVertical: 10,
              backgroundColor: colors.white,
              paddingHorizontal: 30,
              alignSelf: "center",
              borderRadius: 20,
            }}
            onPress={pickOtherDocument}
          >
            <Text style={{ textAlign: "center", color: colors.black }}>
              Upload Document
            </Text>
          </TouchableOpacity> */}

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
            {isLoading ? (
              <ActivityIndicator color={colors.bgBrown} />
            ) : (
              <Text style={{ textAlign: "center", color: colors.bgBrown }}>
                Send
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LogoPage>
  );
};

export default AcceptOffer;

const styles = StyleSheet.create({
  title: {
    color: colors.white,
    padding: 20,
    fontSize: 30,
    width: 200,
    textAlign: "center",
  },
  label: {
    color: colors.white,
    paddingHorizontal: 20,
  },
});
