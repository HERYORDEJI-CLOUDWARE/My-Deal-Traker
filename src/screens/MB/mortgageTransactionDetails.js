import React, { useContext, useRef } from 'react';
import { FlatList } from 'react-native';
import { Text, View, StyleSheet } from 'react-native';
import LogoPage from '../../components/LogoPage';
import colors from '../../constants/colors';
import { Context } from '../../context/UserContext';
import { TouchableOpacity } from 'react-native';
import { fetchAuthToken } from '../../utils/misc';
import moment from 'moment';
import {
	widthPercentageToDP as wp,
	heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const MortgageTransactionDetails = ({ navigation, route }) => {
	const {
		state: { user },
	} = useContext(Context);

	const { transactionDetails } = route.params;

	const renderItem = ({ item }) => {
		return (
			<View
				style={{
					backgroundColor: 'white',
					width: wp(90),
					marginHorizontal: 20,
					padding: 10,
					height: hp(20),
					marginTop: 20,
					flexDirection: 'column',
					justifyContent: 'space-between',
					borderRadius: 10,
				}}
			>
				<Text style={styles.flastListStyle}>
					Transaction: {item.transaction_id}
				</Text>
				<Text style={styles.flastListStyle}>
					Date Added: {moment(item.property_listing_date).format('MM/DD/YYYY')}
				</Text>
				<Text style={styles.flastListStyle}>
					Status:{' '}
					{item.property_status === '0'
						? 'active'
						: item.property_status == '1'
						? 'offer in place'
						: item.property_status == '2'
						? 'suspended'
						: 'sold'}
				</Text>
				<TouchableOpacity
					style={{ alignItems: 'flex-end' }}
					onPress={() =>
						navigation.navigate('buyerSelectedProperty', {
							transaction_id: item.transaction_id,
							property_id: item.property_id,
						})
					}
				>
					<Text style={styles.viewMore}>View more details</Text>
				</TouchableOpacity>
			</View>
		);
	};
	return (
		<LogoPage navigation={navigation}>
			{transactionDetails.current ? (
				<FlatList
					data={transactionDetails.current}
					renderItem={renderItem}
					keyExtractor={(item) => item.unique_id}
				/>
			) : (
				<View style={styles.noResults}>
					<Text style={{ fontSize: 25, fontWeight: 'bold' }}>
						No Results found
					</Text>
				</View>
			)}
		</LogoPage>
	);
};

styles = StyleSheet.create({
	flastListStyle: {
		fontSize: hp(2.1),
		color: 'black',
		fontWeight: 'bold',
	},
	viewMore: {
		color: colors.brown,
		borderBottomColor: 'blue',
		borderBottomWidth: 0.9,
		padding: 2,
		borderLeftColor: 'white',
	},
	noResults: {
		height: hp(10),
		width: wp(90),
		backgroundColor: 'white',
		alignSelf: 'center',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 10,
		marginTop: 60,
	},
});

export default MortgageTransactionDetails;
