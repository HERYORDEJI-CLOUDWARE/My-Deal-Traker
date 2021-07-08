// import { useEffect } from "react";
// import { Platform } from "react-native";
// import RNIap, {
//   acknowledgePurchaseAndroid,
//   purchaseErrorListener,
//   purchaseUpdatedListener,
// } from "react-native-iap";

// const [receipt, setReceipt] = React.useState("");
// const [productList, setProductList] = React.useState([]);

// let purchaseUpdateSubscription;
// let purchaseErrorSubscription;
// const itemSkus = Platform.select({
//   ios: ["com.mydealtracker.ios"],
//   android: ["com.mydealtracker.android"],
// });

// const itemSubs = Platform.select({
//   ios: ["master_plan"],
//   android: ["master_plan"],
// });

// const purchaseConfirmed = () => {
//   //you can code here for what changes you want to do in db on purchase successfull
// };

// purchaseUpdateSubscription = purchaseUpdatedListener(async (purchase) => {
//   // console.log("purchaseUpdatedListener", purchase);
//   if (purchase.purchaseStateAndroid === 1 && !purchase.isAcknowledgedAndroid) {
//     try {
//       const ackResult = await acknowledgePurchaseAndroid(
//         purchase.purchaseToken
//       );
//       // console.log("ackResult", ackResult);
//     } catch (ackErr) {
//       console.warn("ackErr", ackErr);
//     }
//   }
//   purchaseConfirmed();
//   setReceipt(purchase.transactionReceipt);
//   purchaseErrorSubscription = purchaseErrorListener((error) => {
//     // console.log("purchaseErrorListener", error);
//     // alert('purchase error', JSON.stringify(error));
//   });
// });

// const getItems = async () => {
//   try {
//     // console.log("itemSkus[0]", itemSkus[0]);
//     const products = await RNIap.getProducts(itemSkus);
//     // console.log("Products[0]", products[0]);
//     setProductList(products);
//     requestPurchase(itemSkus[0]);
//   } catch (err) {
//     // console.log("getItems || purchase error => ", err);
//   }
// };

// const getSubscriptions = async () => {
//   try {
//     const products = await RNIap.getSubscriptions(itemSubs);
//     // console.log("Products => ", products);
//     setProductList(products);
//   } catch (err) {
//     // console.log("getSubscriptions error => ", err);
//   }
// };

// const requestSubscription = async (sku) => {
//   try {
//     await getItems();
//     await RNIap.requestSubscription(sku);
//   } catch (err) {
//     alert(err.toLocaleString());
//   }
// };

// const requestPurchase = async (sku) => {
//   try {
//     RNIap.requestPurchase(sku);
//   } catch (err) {
//     // console.log("requestPurchase error => ", err);
//   }
// };

// //////////////////////////////////////////////////////////////////////////////////////

// useEffect(() => {
//   RNIap.initConnection().then(() => {
//     RNIap.flushFailedPurchasesCachedAsPendingAndroid()
//       .catch(() => {
//       })
//       .then(() => {
//         purchaseUpdateSubscription = purchaseUpdatedListener(
//           (
//             purchase
//           ) => {
//             // console.log("purchaseUpdatedListener", purchase);
//             const receipt = purchase.transactionReceipt;
//             if (receipt) {
//               yourAPI.deliverOrDownloadFancyInAppPurchase(//unknown
//                   purchase.transactionReceipt
//                 )
//                 .then(async (deliveryResult) => {
//                   if (isSuccess(deliveryResult)) { //unknown

//                     if (Platform.OS === "ios") {
//                       await RNIap.finishTransactionIOS(purchase.transactionId);
//                     } else if (Platform.OS === "android") {
//                       // If consumable (can be purchased again)
//                       await RNIap.consumePurchaseAndroid(
//                         purchase.purchaseToken
//                       );
//                       // If not consumable
//                       await RNIap.acknowledgePurchaseAndroid(
//                         purchase.purchaseToken
//                       );
//                     }

//                     // From react-native-iap@4.1.0 you can simplify above `method`. Try to wrap the statement with `try` and `catch` to also grab the `error` message.
//                     // If consumable (can be purchased again)
//                     await RNIap.finishTransaction(purchase, true);
//                     // If not consumable
//                     await RNIap.finishTransaction(purchase, false);
//                   } else {
//                     // Retry / conclude the purchase is fraudulent, etc...
//                   }
//                 });
//             }
//           }
//         );

//         purchaseErrorSubscription = purchaseErrorListener(
//           (error) => {
//             console.warn("purchaseErrorListener", error);
//           }
//         );
//       });
//   });
// }, []);
