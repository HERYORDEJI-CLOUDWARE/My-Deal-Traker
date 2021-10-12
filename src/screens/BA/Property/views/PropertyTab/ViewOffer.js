import { Picker, Toast, Icon } from "native-base";
import React, { useContext, useState, useEffect } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Text,
  Pressable,
  ActivityIndicator,
  Linking,
} from "react-native";
import { Input } from "react-native-elements";
import colors from "../../../../../constants/colors";
import { RFValue } from "react-native-responsive-fontsize";
import _font from "../../../../../styles/fontStyles";
import { useNavigation, useRoute } from "@react-navigation/native";

// import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import { AntDesign, Entypo } from "@expo/vector-icons";
import ReactNativeModal from "react-native-modal";
import { useFormik } from "formik";
import * as DocumentPicker from "expo-document-picker";
import { useFocusEffect } from "@react-navigation/native";
import {
  _consologger,
  displayError,
  downloadFile,
  fetchAuthToken,
} from "../../../../../utils/misc";
import appApi, { baseUri } from "../../../../../api/appApi";
import { Context as UserContext } from "../../../../../context/UserContext";
import LogoPage from "../../../../../components/LogoPage";
import DatePicker from "../../../../../components/DatePicker";
import ButtonPrimaryBig from "../../../../../components/ButtonPrimaryBig";

const ViewPropertyOffer = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [date, setDate] = useState(new Date());

  const { property, theTransaction } = route?.params ?? {
    property: undefined,
    theTransaction: undefined,
  };

  const [docUpload, setDocUpload] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [offerLoading, setOfferLoading] = useState(true);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const [offerDetails, setOfferDetails] = useState(undefined);

  const {
    state: { user },
  } = useContext(UserContext);

  const { values, handleChange, handleSubmit, setFieldValue } = useFormik({
    initialValues: {
      legalName: "",
      nameOfSeller: "",
      purchasePrice: "",
      closingDate: "",
      document: "",
      optionalDoc: "",
      notes: "",
      multipleDocs: [],
      docUpload: [],
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

  console.log("theTransaction", theTransaction);

  const submitMakeOffer = async () => {
    try {
      setIsLoading(true);
      const token = await fetchAuthToken();
      const data = new FormData();
      data.append("property_id", property.transaction_id);
      data.append("transaction_id", theTransaction.transaction_id);
      data.append("by_who_id", theTransaction.buyer_agent_id);
      data.append("to_who_id", property.listing_agent_id);
      data.append("note_given", values.notes);
      data.append("price", values.purchasePrice);
      data.append("buyer_name", values.nameOfSeller);
      data.append("file_count", values.multipleDocs.length);
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
          text: `$...{response.data.response.message}`,
          duration: 5000,
        });
      }
    } catch (error) {
      displayError(error);
      setIsLoading(false);
    }
  };

  const selectDoc = async () => {
    const result = await DocumentPicker.getDocumentAsync();
    // if (result.type !== 'cancel') {
    // 	return;
    // }
    // const list = docUpload.map((doc) => JSON.stringify(doc));
    setDocUpload([...docUpload, result]);
    setFieldValue("multipleDocs", [...docUpload, result]);
  };

  const cls = () => _consologger(values.multipleDocs);

  const deleteDoc = (uri) => {
    const docs = docUpload.filter(
      (doc) => doc.uri !== uri && doc.type !== "cancel"
    );
    setDocUpload(docs);
    setFieldValue("multipleDocs", [...docs]);
  };

  const getOfferDetails = async () => {
    try {
      const token = await fetchAuthToken();
      const data = new FormData();
      // data.append('transaction_id', `transaction.transaction_id`);
      data.append("transaction_id", theTransaction.transaction_id);
      const response = appApi.post(`/display_offer_per_transaction.php`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (e) {
      console.log(e);
    }
  };

  // console.log("offerDetails, ", offerDetails);

  useEffect(() => {
    setOfferLoading(true);
    getOfferDetails().then((res) => {
      const response = res.data.response.data.offer_conversation_json;
      // setOfferDetails(response);
      setOfferDetails(response);
      setOfferLoading(false);
    });
  }, []);

  // useFocusEffect(
  // 	React.useCallback(() => {
  // 		getOfferDetails().then((res) => {
  // 			const response = res.data;
  // 			console.log(property);
  // 			console.log('-/---', response);
  // 		});
  // 	}, []),
  // );

  // const { by_who, to_who } = offerDetails;
  // const {
  // 	buyer_name,
  // 	email,
  // 	note_given,
  // 	docs,
  // 	name,
  // 	price,
  // 	closing_date,
  // 	current_status,
  // } = offerDetails?.by_who;

  return (
    <LogoPage>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          borderWidth: 0,
        }}
      >
        <Text
          style={{
            ..._font.H5,
            color: colors.white,
          }}
        >
          Offer Details
        </Text>
        {/*<TouchableOpacity style={{}} onPress={() => setShowModal(true)}>*/}
        {/*	<Entypo*/}
        {/*		name='dots-three-vertical'*/}
        {/*		size={RFValue(20)}*/}
        {/*		color={colors.white}*/}
        {/*	/>*/}
        {/*</TouchableOpacity>*/}
      </View>
      <View style={{ paddingVertical: RFValue(20) }}>
        {offerLoading ? (
          <ActivityIndicator size="large" color={colors.white} />
        ) : (
          offerDetails.map((offer, index) => (
            <View
              style={{
                paddingVertical: RFValue(10),
                borderBottomWidth: RFValue(2),
                borderBottomColor: colors.white,
              }}
            >
              <View style={{ marginBottom: RFValue(20) }}>
                <Text style={styles.title}>Name of Agent</Text>
                <Text style={styles.valueStyle}>{user.fullname}</Text>
              </View>

              <View style={{ paddingBottom: 20 }}>
                <Text style={styles.title}>Name of Buyer</Text>
                <Text style={styles.valueStyle}>
                  {offer?.by_who?.buyer_name}
                </Text>
              </View>

              <View style={{ paddingBottom: 20 }}>
                <Text style={styles.title}>Purchase Price</Text>
                <Text style={styles.valueStyle}>{offer?.by_who?.price}</Text>
              </View>

              <View style={{ paddingBottom: 20 }}>
                <Text style={styles.title}>Notes (optional)</Text>
                <Text style={styles.valueStyle}>{offer?.note_given}</Text>
              </View>

              <View style={{ paddingBottom: 20 }}>
                <Text style={styles.title}>Closing Date</Text>
                <Text style={styles.valueStyle}>{offer?.closing_date}</Text>
              </View>

              <View style={{}}>
                <Text style={styles.title}>Purchase Agreement Doc</Text>
                {offer?.docs.map((d, ind) => {
                  return (
                    d.type !== "cancel" && (
                      <View key={ind} style={styles.imageItem}>
                        <Text style={{ ..._font.Medium, color: colors.white }}>
                          {d.toString().substr(0, 20)}
                          {"..."}
                        </Text>
                        <Pressable
                          onPress={async () =>
                            await Linking.openURL(baseUri + d)
                          }
                          style={styles.viewButton}
                        >
                          <Text style={{ ..._font.Small, color: colors.white }}>
                            View
                          </Text>
                        </Pressable>
                      </View>
                    )
                  );
                })}
              </View>
            </View>
          ))
        )}
      </View>
    </LogoPage>
  );
};

export default ViewPropertyOffer;

const styles = StyleSheet.create({
  label: {
    color: colors.white,
  },
  title: { ..._font.Medium, color: colors.black },
  valueStyle: {
    ..._font.Medium,
    color: "#FFFFFF",
  },

  textInput: {
    ..._font.Medium,
    backgroundColor: "#FFFFFF",
    // height: RFValue(50),
    padding: 0,
    margin: 0,
    borderWidth: 0,
    justifyContent: "center",
    flex: 1,
    // paddingHorizontal: RFValue(10),
  },
  imageItem: {
    ..._font.Medium,
    height: RFValue(50),
    padding: 0,
    margin: 0,
    borderWidth: 0,
    justifyContent: "space-between",
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  viewButton: {
    backgroundColor: colors.lightBrown,
    height: RFValue(48),
    width: RFValue(50),
    alignItems: "center",
    justifyContent: "center",
  },
});

const offerDetails = [
  {
    by_who: {
      buyer_name: "Yusuf",
      email: "akinfemi46@gmail.com",
      id: "5277317dc49bfa58248b2d4730db2f48",
      name: "Femi Akinyemi",
      price: "500000",
    },
    closing_date: "2021-07-15",
    current_date: "2021-07-01 02:22:54",
    current_status: 3,
    docs: [
      "make_offer_uploads/1625149374screencapture-book-booktrip-pacesettertransport-ng-backend-www-trips-admin-html-2021-06-29-15_58_13 (1).png",
    ],
    note_given: "",
    offer_id: "f30227ed7d57428dac31124eb09a1515",
    to_who: {
      buyer_name: "Yusuf",
      email: "koikidamilare@gmail.com",
      id: "f2445bd0678477b286f80b0b792cc1ba",
      name: "Koiki Damilare",
      price: "500000",
    },
  },
  {
    by_who: {
      buyer_name: "",
      email: "koikidamilare@gmail.com",
      id: "f2445bd0678477b286f80b0b792cc1ba",
      name: "Koiki Damilare",
      price: "700000",
    },
    closing_date: "2021-07-22",
    current_date: null,
    current_status: 0,
    docs: [
      "make_offer_uploads/1625149634screencapture-book-booktrip-pacesettertransport-ng-backend-www-trips-admin-html-2021-06-29-15_58_13.png",
    ],
    note_given: "",
    offer_id: "b7276264815a2204a4294f8d74eb8559",
    to_who: {
      buyer_name: "",
      email: "akinfemi46@gmail.com",
      id: "5277317dc49bfa58248b2d4730db2f48",
      name: "Femi Akinyemi",
      price: "700000",
    },
  },
];
