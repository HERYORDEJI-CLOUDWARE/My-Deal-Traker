import React, { useEffect } from "react";
import {
  View,
  Text,
  Platform,
  Linking,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  RefreshControl,
} from "react-native";
import { Header } from "react-native-elements";
import { AntDesign } from "@expo/vector-icons";
import colors from "../constants/colors";
import { useNavigation } from "@react-navigation/native";
import {
  purchaseErrorListener,
  purchaseUpdatedListener,
} from "react-native-iap";
import * as RNIap from "react-native-iap";
import { Toast } from "native-base";
import { Context as UserContext } from "../context/UserContext";
import {
    displayError,
    plans_unique_id,
    androidPlanIds
  } from "../utils/misc";

const { width } = Dimensions.get("window");

function SubscriptionPage(props) {
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await getAvailablePurchases();
    } catch (error) {
      setRefreshing(false);
    }
    setRefreshing(false);
  }, []);
  const navigation = useNavigation();
  const [productList, setProductList] = React.useState([]);
  const {
    state: { user },
    subscribeToPlan,
    fetchSubStatus
  } = React.useContext(UserContext);
  const [availablePurchase, setAvailablePurchase] = React.useState([]);

  React.useEffect(() => {
    connect();
    sub();
    getAvailablePurchases();
  }, []);

  useEffect(() => {
    const purchaseUpdateSubscription = purchaseUpdatedListener(
      async (purchase) => {
        // console.log("purchaseUpdatedListener", purchase);
        if (
          //   purchase.purchaseStateAndroid === 1 &&
          //   !purchase.isAcknowledgedAndroid
          purchase.transactionReceipt
        ) {
          try {
            // const ackResult = await acknowledgePurchaseAndroid(
            //   purchase.purchaseToken
            // );
            const finishedTrans = await RNIap.finishTransaction(purchase);
            console.log(purchase);
            Toast.show({
              type: "success",
              text: "Subscription successful",
            });
            try {
              const formdata = new FormData();
              formdata.append("email", user.email);
              formdata.append("amount", 3);
              formdata.append("order_id", purchase.dataAndroid.orderId);
              formdata.append("user_id", user.unique_id);
              formdata.append("order_status", "completed");
              formdata.append("plan_id", plans_unique_id[purchase.productId]);
              await subscribeToPlan(formdata);
              fetchSubStatus(user.unique_id);
            } catch (error) {
              displayError(error);
            }
          } catch (error) {
            displayError(error);
          }
        }
        // purchaseConfirmed();
        setReceipt(purchase.transactionReceipt);
      }
    );

    const purchaseErrorSubscription = purchaseErrorListener((error) => {
      console.log("purchaseErrorListener", error);
      // alert('purchase error', JSON.stringify(error));
    });

    return () => {
      purchaseUpdateSubscription.remove();
      purchaseErrorSubscription.remove();
    };
  }, []);

  const itemSubs = Platform.select({
    ios: androidPlanIds,
    android: androidPlanIds,
  });

  const connect = async () => {
    try {
      const result = await RNIap.initConnection();
      console.log("connection result => ", result);
      await RNIap.flushFailedPurchasesCachedAsPendingAndroid();
    } catch (err) {
      console.log("error in cdm => ", err.message);
    }
  };

  const getAvailablePurchases = async () => {
    try {
      const res = await RNIap.getAvailablePurchases();
      // console.log(res)
      let availableSubIds = [];
      if (res.length) {
        res.map((item) => {
          return availableSubIds.push(item.productId);
        });
      }
      setAvailablePurchase(availableSubIds);
    } catch (error) {
      console.log("[AVAILABLE PURCHASES]", error.message);
    }
  };

  const getSubscriptions = async () => {
    try {
      const products = await RNIap.getSubscriptions(itemSubs);
      setProductList(products);
      console.log(products)
    } catch (err) {
      console.log("getSubscriptions error => ", err);
    }
  };

  const sub = async () => {
    try {
      getSubscriptions();
    } catch (error) {
      console.log(error.message);
    }
  };

  const requestSubscription = async (sku) => {
    try {
      RNIap.requestSubscription(sku);
    } catch (error) {
      console.log("requestPurchase error => ", error);
    }
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: colors.white,
      }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View>
        <Header
          containerStyle={{ backgroundColor: colors.bgBrown }}
          leftComponent={
            <View style={{ flexDirection: "row", alignItems: "center" }}>
             <TouchableOpacity onPress={() => navigation.goBack()} style={{flex:1, flexDirection:'row'}}>
                <AntDesign name="arrowleft" size={20} color={colors.white} />
                  <Text
                    style={{ color: colors.white, marginLeft:3 }}
                    
                  >
                    Back
                  </Text>
             </TouchableOpacity>
             
            </View>
          }
          centerComponent={
            <Text style={{ color: colors.white }}>Subscription plans</Text>
          }
        />
      </View>
      <View style={{ backgroundColor: colors.white, borderRadius: 5 }}>
        <Text
          style={{
            textAlign: "center",
            paddingVertical: 20,
            fontSize: 20,
            color: colors.black,
          }}
        >
          Subscribe to a new plan
        </Text>
        {productList.map((p, i) => {
          return (
            <View key={i}>
              <View
                style={{
                  paddingHorizontal: 5,
                  paddingVertical: 20,
                  borderWidth: 0.5,
                  marginVertical: 5,
                  marginHorizontal: 10,
                  borderRadius: 5,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ width: width * 0.5 }}>
                    <Text style={{ fontWeight: "bold", color: colors.black }}>
                      {p.title}{" "}
                    </Text>
                    <Text>{p.description} </Text>
                  </View>
                  {availablePurchase.includes(p.productId) ? (
                    <TouchableOpacity
                      onPress={() => {
                        if (Platform.OS === "ios") {
                          Linking.openURL(
                            `https://apps.apple.com/account/subscriptions`
                          );
                        } else if (Platform.OS === "android") {
                          Linking.openURL(
                            `https://play.google.com/store/account/subscriptions?package=com.mydealtracker.androidapp&sku=${p.productId}`
                          );
                        }
                        getAvailablePurchases();
                      }}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.subBtn}>Cancel</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => {
                        requestSubscription(p.productId);
                      }}
                      activeOpacity={0.8}
                      disabled={availablePurchase.length}
                    >
                      <Text
                        style={[
                          styles.subBtn,
                          { opacity: availablePurchase.length ? 0.6 : 1 },
                        ]}
                      >
                        {p.localizedPrice}{" "}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

export default SubscriptionPage;

const styles = StyleSheet.create({
  noresult: {
    textAlign: "center",
    fontFamily: "pop-reg",
    fontSize: 18,
    opacity: 0.9,
    color: colors.white,
  },
  subBtn: {
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 10,
    borderColor: colors.bgBrown,
    elevation: 2,
    backgroundColor: colors.white,
    alignSelf: "center",
  },
});
