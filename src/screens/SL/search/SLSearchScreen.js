import React, { useContext, useEffect, useState } from "react";
import {
  FlatList,
  Image,
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "../../../constants/colors";
import ListingCard from "../../../components/ListingCard";
import { AntDesign } from "@expo/vector-icons";
import { displayError, fetchAuthToken } from "../../../utils/misc";
import appApi from "../../../api/appApi";
import moment from "moment";
import LogoPage from "../../../components/LogoPage";
import { Context } from "../../../context/UserContext";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

const SLSearchScreen = ({ route, navigation }) => {
  const { search } = route.params;

  const {
    state: { user, lawyersProp },
    fetchLawyerTrans,
  } = useContext(Context);

  useFocusEffect(
    useCallback(() => {
      fetchLawyerTrans();
    }, [])
  );

  const ListHeader = (
    <>
      <View
        style={{
          paddingLeft: 36,
          paddingTop: 66,
          paddingBottom: 45,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <AntDesign
          name="arrowleft"
          size={30}
          onPress={() => navigation.goBack()}
        />
        <Text
          style={{
            color: colors.white,
            fontSize: 36,
            fontFamily: "pop-semibold",
            paddingHorizontal: 20,
          }}
        >
          Search
        </Text>
      </View>

      <View style={{ paddingHorizontal: 34 }}>
        <Text
          style={{ fontFamily: "pop-reg", fontSize: 18, color: colors.white }}
        >
          Search Results
        </Text>
      </View>
    </>
  );

  return (
    <SafeAreaView style={{ backgroundColor: colors.bgBrown, flex: 1 }}>
      <View>
        <FlatList
          data={
            lawyersProp
              ? lawyersProp.filter(
                  (s) =>
                    s.address.toLowerCase().includes(search.toLowerCase()) ||
                    s.listing_number
                      .toLowerCase()
                      .includes(search.toLowerCase()) ||
                    s.city.toLowerCase().includes(search.toLowerCase())
                )
              : []
          }
          ListHeaderComponent={ListHeader}
          keyExtractor={(it, ind) => ind.toString()}
          renderItem={({ item }) => {
            return (
              <React.Fragment>
                <ListingCard
                  navigation={navigation}
                  listNo={item.listing_number}
                  listNo={item.listing_number}
                  status={item.status}
                  city={item.city}
                  // dad={moment(jsData).format("Do MMM YYYY")}
                  dad={moment(item.date_created).format("MM/DD/YYYY")}
                  item={item}
                  view="SLSelectedProperty"
                />
              </React.Fragment>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default SLSearchScreen;

const styles = StyleSheet.create({
  noresult: {
    textAlign: "center",
    fontFamily: "pop-reg",
    fontSize: 18,
    opacity: 0.5,
  },
});
