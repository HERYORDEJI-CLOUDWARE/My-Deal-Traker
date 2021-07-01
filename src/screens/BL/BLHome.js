import { useFocusEffect } from "@react-navigation/native";
import { Card, Toast } from "native-base";
import React, { useCallback, useContext, useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import appApi from "../../api/appApi";
import HomeHeader from "../../components/HomeHeader";
import ListEmptyComponent from "../../components/ListEmptyComponent";
import ListingCard from "../../components/ListingCard";
import LogoPage from "../../components/LogoPage";
import colors from "../../constants/colors";
import { Context } from "../../context/UserContext";
import { displayError, fetchAuthToken, formatStatus } from "../../utils/misc";
import moment from "moment";
import { ActivityIndicator } from "react-native";

const BLHome = ({ navigation }) => {
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const {
    state: { user, b_lawyerProps },
    fetchBuyerLawyerTrans,
  } = useContext(Context);

  const init = async () => {
    await fetchBuyerLawyerTrans(user.email);
    setIsLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      init();
    }, [])
  );

  if (isLoading) {
    return (
      <LogoPage dontShow={true}>
        <React.Fragment>
          <HomeHeader
            search={search}
            setSearch={setSearch}
            searchScreen="searchScreen"
          />
        </React.Fragment>
        <ActivityIndicator color={colors.white} />
      </LogoPage>
    );
  }

  return (
    <LogoPage dontShow={true}>
      <>
        <FlatList
          data={b_lawyerProps}
          keyExtractor={(item) => item.toString()}
          ListHeaderComponent={
            <React.Fragment>
              <HomeHeader
                search={search}
                setSearch={setSearch}
                searchScreen="blSearchScreen"
              />
            </React.Fragment>
          }
          ListEmptyComponent={<ListEmptyComponent />}
          renderItem={({ item }) => {
            return (
              <View>
                <ListingCard
                  navigation={navigation}
                  view="BLSelectedProperty"
                  listNo={item.listing_number}
                  listNo={item.listing_number}
                  status={formatStatus(item.status)}
                  city={item.city}
                  dad={moment(item.date_created).format("MM/DD/YYYY")}
                  item={item}
                />
              </View>
            );
          }}
        />
      </>
    </LogoPage>
  );
};

export default BLHome;

const styles = StyleSheet.create({
  noresult: {
    textAlign: "center",
    fontFamily: "pop-reg",
    fontSize: 18,
    opacity: 0.9,
    color: colors.white,
  },
});
