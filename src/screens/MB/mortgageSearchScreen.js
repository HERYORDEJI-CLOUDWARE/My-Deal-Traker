import { AntDesign } from '@expo/vector-icons';
import React, { useContext, useRef, useEffect } from 'react';
import { FlatList } from 'react-native';
import { Text, View, StyleSheet } from 'react-native';
import ListEmptyComponent from '../../components/ListEmptyComponent';
import ListingCard from '../../components/ListingCard';
import LogoPage from '../../components/LogoPage';
import colors from '../../constants/colors';
import moment from 'moment';
import { Context } from '../../context/UserContext';
import { formatStatus } from '../../utils/misc';
import { TouchableOpacity } from 'react-native';
import { fetchAuthToken } from '../../utils/misc';
import axios from 'axios';
import {
	widthPercentageToDP as wp,
	heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const MortgageSearchScreen = ({ navigation, route }) => {
	const {
		state: { user },
	} = useContext(Context);

	const { search } = route.params;

	const transactionDetails = useRef({});
	const status = useRef('');
	const date = useRef('');

	const getPropertyTransactions = async (transaction_id) => {
		const token = await fetchAuthToken();

		axios
			.get(
				`https://mydealtracker.staging.cloudware.ng/api/get_mortgage_broker_property_transactions.php?phone_email=${user.email}&property_id=${transaction_id}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			)
			.then((res) => {
				const data = res.data.response.data;
				transactionDetails.current = data;
				// console.log(data)
				navigation.navigate('mortgageTransactionDetails', {
					transactionDetails: transactionDetails,
					status: status,
					date: date,
				});
			})
			.catch((err) => {
				// console.log(err)
			});
	};

	const renderItem = ({ item }) => {
		return (
			<View
				style={{
					backgroundColor: 'white',
					width: wp(90),
					marginHorizontal: 20,
					padding: 10,
					height: hp(25),
					marginTop: 20,
					flexDirection: 'column',
					justifyContent: 'space-between',
					borderRadius: 10,
				}}
			>
				<Text style={styles.flastListStyle}>Address: {item.city}</Text>
				<Text style={styles.flastListStyle}>
					Listing Date: {moment(item.listing_date).format('MM/DD/YYYY')}
				</Text>
				<Text style={styles.flastListStyle}>
					Property Type:{' '}
					{item.property_type == '0' ? 'Commercial' : 'Residential'}
				</Text>
				<Text style={styles.flastListStyle}>
					Property address: {item.property_address}
				</Text>
				<Text style={styles.flastListStyle}>
					Status:{' '}
					{item.status === '0'
						? 'active'
						: item.status == '1'
						? 'offer in place'
						: item.status == '2'
						? 'suspended'
						: 'sold'}
				</Text>
				<TouchableOpacity
					style={{ alignItems: 'flex-end' }}
					onPress={() => getPropertyTransactions(item.transaction_id)}
				>
					<Text style={styles.viewMore}>View more details</Text>
				</TouchableOpacity>
			</View>
		);
	};

	const ListHeader = (
		<>
			<View style={{ paddingHorizontal: 34 }}>
				<Text
					style={{
						fontFamily: 'pop-reg',
						fontSize: hp(3),
						color: colors.white,
					}}
				>
					Search Results
				</Text>
			</View>
		</>
	);

	return (
		<LogoPage navigation={navigation}>
			{search.current ? (
				<FlatList
					data={search.current}
					renderItem={renderItem}
					keyExtractor={(item) => item.unique_id}
				/>
			) : (
				<View style={styles.noResults}>
					<Text style={{ fontSize: hp(3), fontWeight: 'bold' }}>
						No Results found
					</Text>
				</View>
			)}
		</LogoPage>
	);
};

styles = StyleSheet.create({
	flastListStyle: {
		fontSize: hp(2),
		color: 'black',
		fontWeight: 'bold',
	},
	viewMore: {
		color: colors.brown,
	},
	noResults: {
		height: hp(10),
		width: wp(70),
		backgroundColor: 'white',
		alignSelf: 'center',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 10,
		marginTop: 60,
	},
});

export default MortgageSearchScreen;
