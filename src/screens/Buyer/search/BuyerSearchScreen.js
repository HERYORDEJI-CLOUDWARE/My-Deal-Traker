import { AntDesign } from "@expo/vector-icons";
import React, { useContext } from "react";
import { FlatList } from "react-native";
import { Text, View } from "react-native";
import ListEmptyComponent from "../../../components/ListEmptyComponent";
import ListingCard from "../../../components/ListingCard";
import LogoPage from "../../../components/LogoPage";
import colors from "../../../constants/colors";
import moment from "moment";
import { Context } from "../../../context/UserContext";
import { formatStatus } from "../../../utils/misc";


const BuyerSearchScreen = ({ navigation, route }) => {
  const {
    state: { buyerTrans },
  } = useContext(Context);

  const { search } = route.params;

  

  const ListHeader = (
    <>
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
    <LogoPage navigation={navigation}>
      <FlatList
        data={
          buyerTrans
            ? buyerTrans.filter(
                (s) =>
                  s.property_details.property_address
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                  s.property_details.city
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                  s.property_details.listing_number.includes(search)
              )
            : []
        }
        ListEmptyComponent={<ListEmptyComponent />}
        ListHeaderComponent={ListHeader}
        keyExtractor={(it, ind) => ind.toString()}
        renderItem={({ item }) => {
          const shared = {
            property: item.property_details,
            transaction: item.transaction_details,
          };
          return (
            <React.Fragment>
              <ListingCard
                navigation={navigation} 
                transaction_id={item.transaction_details.transaction_id}  
                property_id={item.transaction_details.property_id} 
                listNo={item.property_details.listing_number}
                status={formatStatus(item.property_details.status)}
                city={item.property_details.city}
                dad={moment(item.property_details.date_created).format("MM/DD/YYYY")}
                item={shared}
                view="buyerSelectedProperty"
              />
              {console.log(item.property_details, item.transaction_details
                )}
            </React.Fragment>
          );
        }}
      />
    </LogoPage>
  );
};

export default BuyerSearchScreen;
