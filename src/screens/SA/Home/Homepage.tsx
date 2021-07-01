import { useFocusEffect } from "@react-navigation/native";
import { Card } from "native-base";
import React, { useCallback, useEffect, useState } from "react";
import { useContext } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import HomeHeader from "../../../components/HomeHeader";
import ListEmptyComponent from "../../../components/ListEmptyComponent";
import LogoPage from "../../../components/LogoPage";
import PropertyListingCard from "../../../components/PropertyListCard";
import colors from "../../../constants/colors";
import { Context as UserContext } from "../../../context/UserContext";
import { navigate } from "../../../nav/RootNav";
import moment from "moment";
import { ActivityIndicator } from "react-native";




const SAHomepage = ({ navigation }) => {
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const {
    state: { user, salistings, subStatus },
    fetchSAListings,
    fetchSubStatus,
  } = useContext(UserContext);

  const init = async () => {
    try {
      await fetchSAListings(user.unique_id);
      await fetchSubStatus(user.unique_id);
      setIsLoading(false);
    } catch (error) {}
  };

  useFocusEffect(
    useCallback(() => {
      init();
    }, [])
  );




  const available_listing = subStatus?.total_allowed_listings_in_active_plans;

  if (isLoading) {
    return (
      <LogoPage dontShow={true}>
        {ListHeader}
        <ActivityIndicator size="large" color={colors.white} />
      </LogoPage>
    );
  }

  const ListHeader = (
    <React.Fragment>
      <HomeHeader
        search={search}
        setSearch={setSearch}
        searchScreen={"saSearchScreen"}
        text="Your listings"
        subStatus={subStatus}
      />

      <View
        style={{
          paddingHorizontal: 34,
          alignSelf: "flex-end",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            if (available_listing < 1) {
              return Alert.alert(
                "Limit reached",
                "You need to upgrade your current plan to add more listings",
                [
                  {
                    text: "Upgrade",
                    onPress: () => navigate(""),
                  },
                  {
                    text: "Cancel",
                  },
                ]
              );
            }
            navigate("addNewListing");
          }}
        >
          <Card
            style={{
              paddingHorizontal: 10,
              borderRadius: 30,
              paddingVertical: 5,
            }}
          >
            <Text style={{ color: colors.brown }}>New Listing +</Text>
          </Card>
        </TouchableOpacity>
      </View>
    </React.Fragment>
  );


  return (
    <LogoPage dontShow={true}>
      <>
        <FlatList
          data={salistings}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={
            <ListEmptyComponent info="Create a new listing to get started" />
          }
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
      </>

    </LogoPage>
  );
};

export default SAHomepage;

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
