import { useFocusEffect } from "@react-navigation/native";
import { Toast } from "native-base";
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
import moment from "moment";
import { ActivityIndicator } from "react-native";
import { formatStatus } from "../../utils/misc";

const SLHome = ({ navigation }) => {
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const {
    state: { user, lawyersProp },
    fetchLawyerTrans,
  } = useContext(Context);

  useFocusEffect(
    useCallback(() => {
      init();
    }, [])
  );

  const init = async () => {
    try {
      await fetchLawyerTrans(user.email);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <LogoPage dontShow={true} >
        <ActivityIndicator size="large" color={colors.white} />
      </LogoPage>
    );
  }

  return (
    <LogoPage dontShow={true}>
      <>
        <FlatList
          data={lawyersProp}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={
            <React.Fragment>
              <HomeHeader
                search={search}
                setSearch={setSearch}
                searchScreen="slSearchScreen"
              />
              {/* <Text>SELLER LAWYER</Text> */}
            </React.Fragment>
          }
          ListEmptyComponent={
            <ListEmptyComponent
              title="You currently have no transactions"
              info="Check back later"
            />
          }
          renderItem={({ item }) => {
            return (
              <View>
                <ListingCard
                  navigation={navigation}
                  view="SLSelectedProperty"
                  listNo={item.listing_number}
                  listNo={item.listing_number}
                  status={formatStatus(item.status)}
                  city={item.city}
                  // dad={moment(jsData).format("Do MMM YYYY")}
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

export default SLHome;

const styles = StyleSheet.create({
  noresult: {
    textAlign: "center",
    fontFamily: "pop-reg",
    fontSize: 18,
    opacity: 0.9,
    color: colors.white,
  },
});
