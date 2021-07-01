import { Card, Container, Header, Text, Toast } from "native-base";
import React from "react";
import { useState, useContext, useEffect, useCallback, useRef } from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import colors from "../../../constants/colors";
import Closing from "../Closing/Closing";
import Conditions from "../Conditions/Conditions";
import Report from "../Report/Report";
import PropertyTab from "./PropertyTab";
import moment from "moment";
import { navigate } from "../../../nav/RootNav";
import { AntDesign } from "@expo/vector-icons";
import LogoPage from "../../../components/LogoPage";
import { formatStatus } from "../../../utils/misc";
import CustomHeader from "../../../components/CustomHeader";
import appApi from "../../../api/appApi";
import { fetchAuthToken } from "../../../utils/misc";


const { width, height } = Dimensions.get("window");



const PropertyDashboard = ({
  property,
  transaction,
  isLoading,
  transactionStarted,
  fetchTransaction,
  setSelected,
  navigation,
  route
}) => {
  const [view, setView] = useState("");

  // const [buyerAgentResponse, setBuyerAgentResponse] = useState([])
  const buyerAgentResponse = useRef({})
  const [loading, setLoading] = useState(false)
// const {transaction_id} = route.params
  

  const checkBuyerAgent = async () => { 
    const token = await fetchAuthToken();
    const data = new FormData();
    // transaction ? console.log(transaction.transaction_id) : console.log("empty")
    // console.log(transaction.transaction_id)
    appApi.get(`/get_property_mortgage_broker.php?transaction_id=${transaction.transaction_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        },
    })
    .then(
      res => {
        console.log("response is set to: ", res.data.response.data)
        let response = res.data.response.data
        buyerAgentResponse.current = response
        
      }
    )
    .catch(err => {
      console.log(err.response.data)
    })
  }

  useEffect(() => {
    console.log("transaction is", transaction)
    checkBuyerAgent()

   }, [transaction, buyerAgentResponse.current])

  //  useFocusEffect(
  //   useCallback(() => {

      
  //   }, [])
  // );  


  let rendered = <View style={{ minHeight: 160 }} />;

  if (view === "property") {
    rendered = (
      <PropertyTab
        property={property}
        transaction={transaction}
        isLoading={isLoading}
        setSelected={setSelected}
      />
    );
  }

  if (view === "closing") {
    rendered = <Closing />;
  }

  if (view === "conditions") {
    rendered = <Conditions transaction={transaction} property={property} />;
  }

  if (view === "report") {
    rendered = <Report />;
  }

  if (isLoading) {
    return (
      <Container style={{ backgroundColor: colors.bgBrown }}>
        <CustomHeader navigation={navigation} style={{ backgroundColor: colors.bgBrown, marginTop: 20 }} />
        <ActivityIndicator size="large" color={colors.white} />
      </Container>
    );
  }

 

  

  

  return (
    <LogoPage navigation={navigation}>


      <React.Fragment>
        <View
          style={{
            flexDirection: "row",
            // justifyContent: "space-around",
            alignItems: "center",
            paddingVertical: 20,
            paddingHorizontal: 25,
          }}
        >
          <View>
            <Text style={{}}>
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: "pop-semibold",
                  color: colors.white,
                }}
              >
                Status:{" "}
              </Text>
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: "pop-semibold",
                  color: colors.white,
                }}
              >
                {formatStatus(property.status)}
              </Text>
            </Text>
            <View>
              <Text style={{ fontSize: 18, color: colors.white }}>
                {moment(property.date_created).format("MM/DD/YYYY")}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ paddingBottom: 25 }}></View>

        <View style={{ borderBottomWidth: 1, paddingBottom: 25 }}>
          <View
            style={{
              // flexDirection: "row",
              // justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                navigate("baPropertyInfo", {
                  property,
                  transaction,
                  isLoading,
                  fetchTransaction,
                });
                // setView("property")
              }}
            >
              <Card style={styles.box}>
                <Image source={require("../../../assets/img/property.png")} />
                <View style={{ position: "absolute", right: 10 }}>
                  <AntDesign name="right" />
                </View>
              </Card>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                if (!transaction) {
                  return Toast.show({
                    text: "You have not shown interest in this property",
                    type: "danger",
                    duration: 4500,
                  });
                }
                navigate("baConditions", { transaction, property });
                // setView("conditions")
              }}
            >
              <Card style={styles.box}>
                <Image source={require("../../../assets/img/conditions.png")} />
                <View style={{ position: "absolute", right: 10 }}>
                  <AntDesign name="right" />
                </View>
              </Card>
            </TouchableOpacity>
          </View>

          {/* <View style={{ marginTop: 35 }} /> */}

          <View
            style={{
              // flexDirection: "row",
              // justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            {transaction && (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() =>
                  navigate("baLawyerView", { transaction: transaction })
                }
              >
                <Card style={styles.box}>
                  <Text style={{color:colors.lightBrown, fontSize:20, fontWeight:'bold'}}>View Lawyer</Text>
                  <View style={{ position: "absolute", right: 10 }}>
                    <AntDesign name="right" />
                  </View>
                </Card>
              </TouchableOpacity>
            )}
               
            {transaction && (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() =>
                  navigate("fileUpload", { transaction: transaction })
                }
              >
                <Card style={styles.box}>
                  <Text
                    style={{
                      color: colors.bgBrown,
                      fontWeight: "bold",
                      fontSize: 20,
                    }}
                  >
                    Files and uploads
                  </Text>
                  <View style={{ position: "absolute", right: 10 }}>
                    <AntDesign name="right" />
                  </View>
                </Card>
              </TouchableOpacity>
            )}

           {
                buyerAgentResponse.current === null ?
                <TouchableOpacity onPress={()=>navigate("addMortgageBroker", { transaction: transaction, property:property })}>
              <Card style={styles.box}>
                      <Text
                        style={{
                          color: colors.bgBrown,
                          fontWeight: "bold",
                          fontSize: 20,
                        }}
                      >
                        Add Mortgage Broker
                      </Text>
                      <View style={{ position: "absolute", right: 10 }}>
                        <AntDesign name="right" />
                      </View>
                </Card>
           </TouchableOpacity> 
           
           :
          
         

        
         
         <TouchableOpacity onPress={()=>navigate("viewMortgageBroker", { buyerAgentResponse: buyerAgentResponse} )}>
              <Card style={styles.box}>
                      <Text
                        style={{
                          color: colors.bgBrown,
                          fontWeight: "bold",
                          fontSize: 20,
                        }}
                      >
                        View Mortgage Broker
                      </Text>
                      <View style={{ position: "absolute", right: 10 }}>
                        <AntDesign name="right" />
                      </View>
                </Card>
           </TouchableOpacity>
           
           
           
           


           } 
           <Text>{console.log(buyerAgentResponse.current)}</Text>
          </View>
        </View>

        <View>{rendered}</View>
      </React.Fragment>
    </LogoPage>
  );
};

export default PropertyDashboard;

const styles = StyleSheet.create({
  box: {
    width: width * 0.8,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  boxText: {
    textAlign: "center",
    color: colors.brown,
    fontSize: 24,
  },
  listTitle: {
    padding: 10,
    fontSize: 20,
    color: colors.lightGrey,
    textAlign: "left",
  },
  listValue: {
    padding: 10,
    fontSize: 20,
    color: colors.white,
    textAlign: "left",
  },
});
