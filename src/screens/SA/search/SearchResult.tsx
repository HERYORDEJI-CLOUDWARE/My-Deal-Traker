import React, { useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "../../../constants/colors";
import ListingCard from "../../../components/ListingCard";
import { AntDesign } from "@expo/vector-icons";
import { useContext } from "react";
import { Context as UserContext } from "../../../context/UserContext";
import PropertyListingCard from "../../../components/PropertyListCard";
import moment from "moment";

const SaSearchResult = ({ route, navigation }) => {
  const { search } = route.params;
  const {
    state: { salistings },
  } = useContext(UserContext);

  const d = [1, 2];

  const ListHeader = () => (
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
            salistings
              ? salistings.filter(
                  (s) =>
                    s.address.toLowerCase().includes(search.toLowerCase()) ||
                    s.listing_number
                      .toLowerCase()
                      .includes(search.toLowerCase())
                )
              : []
          }
          ListHeaderComponent={<ListHeader />}
          keyExtractor={(it, ind) => ind.toString()}
          renderItem={({ item }) => {
            return (
              <React.Fragment>
                <PropertyListingCard
                  navigation={navigation}
                  // view="saSelected"
                  listNo={item.listing_number}
                  status={item.status}
                  city={item.city}
                  dad={moment(item.listing_date).format("Do MMM YYYY")}
                  item={item}
                />
              </React.Fragment>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default SaSearchResult;

const styles = StyleSheet.create({
  noresult: {
    textAlign: "center",
    fontFamily: "pop-reg",
    fontSize: 18,
    opacity: 0.5,
  },
});
