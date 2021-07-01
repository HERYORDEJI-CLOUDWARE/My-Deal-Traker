import React, { useContext, useState, useCallback } from "react";
import { FlatList } from "react-native";
import LogoPage from "../../../components/LogoPage";
import ListEmptyComponent from "../../../components/ListEmptyComponent";
import HomeHeader from "../../../components/HomeHeader";
import ListingCard from "../../../components/ListingCard";
import { displayError, fetchAuthToken } from "../../../utils/misc";
import appApi from "../../../api/appApi";
import { Context as UserContext } from "../../../context/UserContext";
import { Toast } from "native-base";
import { useFocusEffect } from "@react-navigation/native";
import { ActivityIndicator } from "react-native";
import colors from "../../../constants/colors";
import { View } from "react-native";
import TransactionListCard from "../../../components/TransactionListCard";
import moment from "moment";

const SellerHomepage = ({ navigation }) => {
  const [search, setSearch] = useState("");

  const {
    state: { user, sellerTrans },
    fetchSellerTrans
  } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);

  const init = async () => {
    try {
      await fetchSellerTrans(user.email);
      setIsLoading(false);
    } catch (error) {
      displayError(error);
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      init();
    }, [])
  );



  if (isLoading) {
    return (
      <React.Fragment>
        <LogoPage>
          <ActivityIndicator size="large" color={colors.white} />
        </LogoPage>
      </React.Fragment>
    );
  }


  return (
    <LogoPage dontShow={true} >
      <FlatList
        data={sellerTrans}
        ListEmptyComponent={
          <ListEmptyComponent
            title="You currently have no property"
            info="  "
          />
        }
        ListHeaderComponent={
          <React.Fragment>
            <HomeHeader
              search={search}
              setSearch={setSearch}
              searchScreen="sellerSearch"
              notSearching={false}
            />
          </React.Fragment>
        }
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <View>
              <TransactionListCard
                navigation={navigation}
                transId={item.transaction_id}
                dad={moment(item.creation_date).format("Do MMM, YYYY")}
                view="SellerSelectedProp"
                item={item}
              />
            </View>
          );
        }}
      />
    </LogoPage>
  );
};

export default SellerHomepage;
