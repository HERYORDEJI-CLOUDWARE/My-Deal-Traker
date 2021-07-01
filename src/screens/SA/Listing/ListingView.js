import { Card, Text } from "native-base";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import moment from "moment";
import colors from "../../../constants/colors";
import { navigate } from "../../../nav/RootNav";
import LogoPage from "../../../components/LogoPage";
import {
  formatListType,
  formatOccupancy,
  formatStatus,
  propertyType,
} from "../../../utils/misc";
import CustomHeader from "../../../components/CustomHeader"

const ListingView = ({ route, navigation }) => {
  const { property } = route.params;

  const List = ({ title, info }) => (
    <View style={styles.list}>
      <Text style={styles.title}>{title}</Text>
      <Text>{info}</Text>
    </View>
  );


  return (
    <LogoPage title="Property Details" navigation={navigation} >
      <Card style={styles.card}>
        <View style={styles.list}>
          <Text style={styles.title}>Listing Number:</Text>
          <Text>{property.listing_number}</Text>
        </View>
        <View style={styles.list}>
          <Text style={styles.title}>Listing Price:</Text>
          <Text>CAD {property.listing_price}</Text>
        </View>

        <List
          title="Date Added:"
          info={moment(property.date_created).format("Do MMM YYYY")}
        />
        <List title="Property address:" info={property.address} />
        <List title="Property city:" info={property.city} />
        <List
          title="Property closing date:"
          info={moment(property.closing_date).format("Do MMM YYYY")}
        />
        <List title="List branch:" info={property.list_branch} />

        <List title="Listing Source:" info={property.listing_source} />

        <List
          title="Listing Type:"
          info={formatListType(property.listing_type)}
        />

        <List title="Major Intersection" info={property.major_intersection} />

        <List title="Major Nearest Town" info={property.major_nearest_town} />

        <List title="Occupancy" info={formatOccupancy(property.occupancy)} />

        <List title="Possession" info={property.possession} />

        {property.possession === "Other" ? (
          <List title="Possession Date:" info={property.possession_date} />
        ) : null}

        <List title="Postal Code:" info={property.postal_code} />

        <List title="Property Details:" info={property.property_details} />

        <List title="Property Type:" info={propertyType(property.property_type)} />

        <List title="Realtor:" info={property.realtor} />

        <List title="State:" info={property.state} />

        <List title="Status:" info={formatStatus(property.status)} />



        <TouchableOpacity
          style={{
            backgroundColor: colors.brown,
            paddingVertical: 10,
          }}
          onPress={() => navigate("listingTransactions", { property })}
        >
          <Text style={{ textAlign: "center", color: colors.white }}>
            View Transactions
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: colors.brown,
            marginBottom: 10,
            paddingVertical: 10,
            marginTop: 10,
          }}
          onPress={() => navigate("listingChecklist", { property })}
        >
          <Text style={{ textAlign: "center", color: colors.white }}>
            Checklists
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: colors.brown,
            marginBottom: 10,
            paddingVertical: 10,
          }}
          onPress={() => navigate("listingLawyer", { property })}
        >
          <Text style={{ textAlign: "center", color: colors.white }}>
            Lawyer
          </Text>
        </TouchableOpacity>
      </Card>
    </LogoPage>
  );
};

export default ListingView;

const styles = StyleSheet.create({
  card: {
    padding: 15,
  },
  title: {
    paddingVertical: 5,
  },
  list: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
