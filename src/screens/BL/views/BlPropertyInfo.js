import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ListItem from "../../../components/ListItem";
import LogoPage from "../../../components/LogoPage";
import colors from "../../../constants/colors";
import {
  formatListType,
  numberWithCommas,
  propertyType,
} from "../../../utils/misc";
import moment from "moment";

const BlPropertyInfo = ({ route, navigation }) => {
  const { property } = route.params;

  const checkOccupancy = (key) => {
    switch (key) {
      case "0":
        return "Owner occupied";
      case "1":
        return "Tenant occupied";
      case "2":
        return "Vacant";
      default:
        return "Unknown";
    }
  };

  return (
    <LogoPage navigation={navigation} >
      <View>
        <ListItem title="Listing #" value={property.listing_number} />
        <ListItem title="Type" value={propertyType(property.property_type)} />
        <ListItem
          title="Listing Date"
          value={moment(property.date_created).format("MM/DD/YYYY")}
        />
        <ListItem
          title="Listing Type"
          value={formatListType(property.listing_type)}
        />
        <ListItem title="Address:" value={property.property_address} />
        <ListItem title="City:" value={property.city} />
        <ListItem title="Details" value={property.property_details} />
        <ListItem
          title="Price"
          value={"CAD " + numberWithCommas(property.listing_price)}
        />
        <ListItem
          title="Major Intersection"
          value={property.major_intersection}
        />
        <ListItem
          title="Major Nearest Town"
          value={property.major_nearest_town}
        />
        <ListItem
          title="Occupancy"
          value={checkOccupancy(property.occupancy)}
        />
        <ListItem title="Possession" value={property.possession} />
        {property.possession === "Other" ? (
          <ListItem title="Possession Date" value={property.possession_date} />
        ) : null}
      </View>
    </LogoPage>
  );
};

export default BlPropertyInfo;
