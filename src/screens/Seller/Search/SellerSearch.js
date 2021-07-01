import React, { useContext } from "react";
import { View } from "react-native";
import { FlatList } from "react-native";
import ListEmptyComponent from "../../../components/ListEmptyComponent";
import LogoPage from "../../../components/LogoPage";
import TransactionListCard from "../../../components/TransactionListCard";
import { Context as UserContext } from "../../../context/UserContext";
import moment from "moment";

const SellerSearch = ({ navigation, route }) => {
  const {
    state: { sellerTrans },
    fetchSellerTrans,
  } = useContext(UserContext);

  const { search } = route.params;

  return (
    <LogoPage navigation={navigation}>
      <FlatList
        // data={sellerTrans}
        data={
          sellerTrans
            ? sellerTrans.filter(
                (s) =>
                  s.transaction_id
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                  s.buyer_agent_id.toLowerCase().includes(search.toLowerCase())
              )
            : []
        }
        ListEmptyComponent={<ListEmptyComponent />}
        renderItem={({ item }) => {
          return (
            <React.Fragment>
              <View>
                <TransactionListCard
                  navigation={navigation}
                  transId={item.transaction_id}
                  dad={moment(item.creation_date).format("Do MMM, YYYY")}
                  view="SellerSelectedProp"
                  item={item}
                />
              </View>
            </React.Fragment>
          );
        }}
      />
    </LogoPage>
  );
};

export default SellerSearch;
