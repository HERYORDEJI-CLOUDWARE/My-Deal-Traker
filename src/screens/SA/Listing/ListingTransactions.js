import { Container, Toast } from "native-base";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text } from "react-native";
import { FlatList, View } from "react-native";
import appApi from "../../../api/appApi";
import ListEmptyComponent from "../../../components/ListEmptyComponent";
import ListingCard from "../../../components/ListingCard";
import colors from "../../../constants/colors";
import { displayError, fetchAuthToken } from "../../../utils/misc";
import moment from "moment";
import TransactionListCard from "../../../components/TransactionListCard";
import CustomHeader from "../../../components/CustomHeader";

const ListingTransactions = ({ route, navigation }) => {
  const { property } = route.params;

  const [transactionsList, setTransactionsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const token = await fetchAuthToken();
      const response = await appApi.get(
        `/get_property_transactions.php?property_transaction_id=${property.transaction_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.response.status == 200) {
        setTransactionsList(response.data.response.data);
        setIsLoading(false);
      } else {
        setTransactionsList(response.data.response.data);
        Toast.show({
          type: "warning",
          text: response.data.response.message,
          duration: 3500,
        });
        setIsLoading(false);
      }
    } catch (error) {
      displayError(error);
    }
  };

  if (isLoading) {
    return (
      <Container
        style={{
          backgroundColor: colors.bgBrown,
          flex: 1,
          // justifyContent: "center",
          // alignItems: "center",
        }}
      >
        <CustomHeader navigation={navigation} />
        <ActivityIndicator size="large" color={colors.white} />
      </Container>
    );
  }

  return (
    <View style={{ backgroundColor: colors.bgBrown, flex: 1 }}>
      <FlatList
        ListEmptyComponent={
          <ListEmptyComponent
            title="No transactions available for this property"
            info=" "
          />
        }
        data={transactionsList}
        ListHeaderComponent={
          <CustomHeader title="Property Transactions" navigation={navigation} />
        }
        renderItem={({ item }) => {
          return (
            <React.Fragment>
              <TransactionListCard
                navigation={navigation}
                transId={item.transaction_id}
                dad={moment(item.creation_date).format("Do MMM, YYYY")}
                view="saSelected"
                item={item}
              />
            </React.Fragment>
          );
        }}
      />
    </View>
  );
};

export default ListingTransactions;
