import { Card, Toast } from "native-base";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import appApi from "../../../api/appApi";
import ListItem from "../../../components/ListItem";
import colors from "../../../constants/colors";
import { fetchAuthToken } from "../../../utils/misc";

const { width } = Dimensions.get("window");



const PropertyDetails = ({ move, property, navigation }) => {
  useEffect(() => {
    fetchPropertyInfo();
  }, []);

  const [propertyInfo, setPropertyInfo] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchPropertyInfo = async () => {
    try {
      const token = await fetchAuthToken();
      const response = await appApi.get(
        `/get_property_details.php?property_transaction_id=${property.property_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if(response.data.response.status == 200){
        setPropertyInfo(response.data.response.data[0]);
        setIsLoading(false);
      } else {
        Toast.show({
          type: "danger",
          text: response.data.response.message
        })
      }
    } catch (error) {};
  };

  if(isLoading){
    return <ActivityIndicator color={colors.white} size="large" />
  }

  return (
    <SafeAreaView style={{ backgroundColor: colors.bgBrown, flex: 1 }}>
      <ScrollView>
        <View>
          <ListItem title="Listing #" value={propertyInfo.listing_number} />
          <ListItem title="Property Type" value={propertyInfo.property_type} />
          <ListItem title="Listing Date" value={propertyInfo.listing_date} />
          <ListItem
            title="Property Address:"
            value={propertyInfo.property_address}
          />
          <ListItem
            title="Property Details"
            value={propertyInfo.property_details}
          />
          <ListItem
            title="Major Intersection"
            value={propertyInfo.major_intersection}
          />
          <ListItem
            title="Major Nearest Town"
            value={propertyInfo.major_nearest_town}
          />
          <ListItem title="Occupancy" value={propertyInfo.occupancy} />
          <ListItem title="Possession" value={propertyInfo.possession} />
        </View>

        <View style={{ marginVertical: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default PropertyDetails;

const styles = StyleSheet.create({
  box: {
    width: width / 2.5,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  boxText: {
    textAlign: "center",
    color: colors.brown,
    fontSize: 24,
  },
  listTitle: {
    padding: 10,
    fontSize: 20,
    color: colors.lightGrey,
    textAlign: "left",
  },
  listValue: {
    padding: 10,
    fontSize: 20,
    color: colors.white,
    textAlign: "left",
  },
});
