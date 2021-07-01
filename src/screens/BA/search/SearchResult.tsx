import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
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
import LogoPage from "../../../components/LogoPage";
import { displayError, fetchAuthToken, formatStatus } from "../../../utils/misc";
import appApi from "../../../api/appApi";
import moment from "moment";
import ListEmptyComponent from "../../../components/ListEmptyComponent"
import { createTrue } from "typescript";

const SearchResult = ({ route, navigation }) => {
  const { search } = route.params;

  const d = [1, 2];
  const [dataSearchResult, setSearchResult] = useState([]);
  const [isLoading, setisLoading] = useState(true);

  useEffect(() => {
    makeSearch();
  }, []);

  const makeSearch = async () => {
    try {
      const data = new FormData();
      data.append("keyword", search.toString().trim());
      const token = await fetchAuthToken();
      const response = await appApi.post(`/search_property.php`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setisLoading(false);
      setSearchResult(response.data.response.data);
    } catch (error) {
      setisLoading(false);
      displayError(error);
    }
  };

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

  if (isLoading) {
    return (
      <LogoPage dontShow={true} >
        {ListHeader}
        <ActivityIndicator size={"large"} color={colors.white} />
      </LogoPage>
    );
  }


  return (
    <LogoPage style={{ backgroundColor: colors.bgBrown, flex: 1 }} dontShow={true} >
      <View>
        <FlatList
          data={dataSearchResult}
          ListHeaderComponent={ListHeader}
          keyExtractor={(it, ind) => ind.toString()}
          ListEmptyComponent={<ListEmptyComponent />}
          renderItem={({ item }) => {

            return (
              <React.Fragment>
                <ListingCard
                  navigation={navigation}
                  listNo={item.listing_number}
                  listNo={item.listing_number}
                  status={formatStatus(item.status)}
                  city={item.city}
                  // dad={moment(jsData).format("Do MMM YYYY")}
                  dad={moment(item.date_created).format("MM/DD/YYYY")}
                  item={item}
                  view="selectedPropertyScreen"
                />
              </React.Fragment>
            );
          }}
        />
      </View>
    </LogoPage>
  );
};

export default SearchResult;

const styles = StyleSheet.create({
  noresult: {
    textAlign: "center",
    fontFamily: "pop-reg",
    fontSize: 18,
    opacity: 0.5,
  },
});
