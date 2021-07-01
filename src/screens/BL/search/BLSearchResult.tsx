import React, { useContext } from "react";
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
import { Context } from "../../../context/UserContext";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

const BLSearchResult = ({ route, navigation }) => {
  const { search } = route.params;

  const {
    state: { user, b_lawyerProps },
    fetchBuyerLawyerTrans,
  } = useContext(Context);

  useFocusEffect(
    useCallback(() => {
      fetchBuyerLawyerTrans();
    }, [])
  );

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
            b_lawyerProps
              ? b_lawyerProps.filter(
                  (s) =>
                    s.address.toLowerCase().includes(search.toLowerCase()) ||
                    s.listing_number
                      .toLowerCase()
                      .includes(search.toLowerCase()) ||
                    s.city.toLowerCase().includes(search.toLowerCase())
                )
              : []
          }
          ListHeaderComponent={<ListHeader />}
          keyExtractor={(it, ind) => ind.toString()}
          renderItem={({ item }) => {
            return (
              <React.Fragment>
                <ListingCard
                  navigation={navigation}
                  view="BLSelectedProperty"
                  listNo={item.listing_number}
                  status={item.status}
                  city={item.city}
                  item={item}
                  transId={item.real_transaction_id}
                  dad={item.date_created}
                />
              </React.Fragment>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default BLSearchResult;

const styles = StyleSheet.create({
  noresult: {
    textAlign: "center",
    fontFamily: "pop-reg",
    fontSize: 18,
    opacity: 0.5,
  },
});
