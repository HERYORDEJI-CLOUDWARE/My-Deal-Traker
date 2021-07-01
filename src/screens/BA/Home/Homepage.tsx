import React, { useCallback, useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomInput from "../../../components/CustomInput";
import HomeHeader from "../../../components/HomeHeader";
import LogoPage from "../../../components/LogoPage";
import colors from "../../../constants/colors";
import {
  displayError,
  fetchAuthToken,
  formatStatus,
} from "../../../utils/misc";
import appApi from "../../../api/appApi";
import { useEffect } from "react";
import { useContext } from "react";
import { Context } from "../../../context/UserContext";
import ListingCard from "../../../components/ListingCard";
import moment from "moment";
import { Toast } from "native-base";
import { useFocusEffect } from "@react-navigation/native";
import { ActivityIndicator } from "react-native";

const Homepage = ({ navigation }) => {
  const [search, setSearch] = useState("");
  const [usersProperty, setUsersProperty] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const {
    state: { user },
  } = useContext(Context);

  useFocusEffect(
    useCallback(() => {
      fetchInteresteProperty();
    }, [])
  );

  const fetchInteresteProperty = async () => {
    try {
      const token = await fetchAuthToken();
      const response = await appApi.get(
        `/get_user_interested_property.php?user_id=${user.unique_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ); 
      if (response.data.response.status == 200) {
        setUsersProperty(response.data.response.data);
      } else {
        Toast.show({
          type: "warning",
          text: response.data.response.message,
        });
      }
      setIsFetching(false);
    } 
    catch (error) {
      // displayError(error);
      // setIsFetching(false);
    }
  };

  const ListEmpty = () => (
    <React.Fragment>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: 25,
        }}
      >
        <Image
          source={require("../../../assets/img/no_deals.png")}
          style={{ width: 261, height: 137, resizeMode: "stretch" }}
        />
      </View>

      <View style={{ marginTop: 20 }}>
        <Text style={styles.noresult}>
          You have no recent search/activities.
        </Text>
        <Text style={styles.noresult}>Search for property to start deal</Text>
      </View>
    </React.Fragment>
  );

  if (isFetching) {
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
    <LogoPage
      style={{ backgroundColor: colors.bgBrown, flex: 1 }}
      dontShow={true}
    >
      <>
        <FlatList
          data={
            usersProperty
              ? usersProperty
                  .filter(function (element, index, array) {
                    return index % 2 !== 0;
                  })
                  .reverse()
              : []
          }
          ListHeaderComponent={
            <React.Fragment>
              <HomeHeader
                search={search}
                setSearch={setSearch}
                searchScreen="searchScreen"
              />
            </React.Fragment>
          }
          ListEmptyComponent={<ListEmpty />}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            return (
              <View>
                <ListingCard
                  navigation={navigation}
                  listNo={item.property_details.listing_number}
                  status={formatStatus(item.property_details.status)}
                  city={item.property_details.city}
                  dad={item.property_details.date_created}
                  item={item.property_details}
                  view="selectedPropertyScreen"
                />
              </View>
            );
          }}
        />
      </>
    </LogoPage>
  );
};

export default Homepage;

const styles = StyleSheet.create({
  noresult: {
    textAlign: "center",
    fontFamily: "pop-reg",
    fontSize: 18,
    opacity: 0.9,
    color: colors.white,
  },
});
