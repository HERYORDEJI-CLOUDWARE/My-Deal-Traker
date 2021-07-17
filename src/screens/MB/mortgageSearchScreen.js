import { AntDesign } from '@expo/vector-icons';
import React, {
	useContext,
	useRef,
	useEffect,
	useCallback,
	useState,
} from 'react';
import { ActivityIndicator, FlatList } from 'react-native';
import { Text, View, StyleSheet } from 'react-native';
import ListEmptyComponent from '../../components/ListEmptyComponent';
import ListingCard from '../../components/ListingCard';
import LogoPage from '../../components/LogoPage';
import colors from '../../constants/colors';
import moment from 'moment';
import { Context, getSearchedProperty } from '../../context/UserContext';
import { formatStatus } from '../../utils/misc';
import { TouchableOpacity } from 'react-native';
import { fetchAuthToken } from '../../utils/misc';
import axios from 'axios';
import {
	widthPercentageToDP as wp,
	heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useFocusEffect } from '@react-navigation/native';
import _font from '../../styles/fontStyles';
import { RFValue } from 'react-native-responsive-fontsize';
import * as RN from 'react-native';

const MortgageSearchScreen = ({ navigation, route }) => {
	const {
		state: { user },
	} = useContext(Context);

	const { search } = route.params;

	const transactionDetails = useRef({});
	const status = useRef('');
	const date = useRef('');

	const [dataSearchResult, setSearchResult] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

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
			<TouchableOpacity
				onPress={() =>
					navigation.navigate('mortgageSelectedProperty', { property: item })
				}
				style={styles.renderItemWrapper}
			>
				<RN.View style={styles.renderItemItem}>
					<Text style={styles.flatListStyle}>Listing Number:</Text>
					<Text style={styles.flatListStyle2}>{item.listing_number}</Text>
				</RN.View>

				<RN.View style={styles.renderItemItem}>
					<Text style={styles.flatListStyle}>Listing Date:</Text>
					<Text style={styles.flatListStyle2}>{item.listing_date}</Text>
				</RN.View>

				<RN.View style={styles.renderItemItem}>
					<Text style={styles.flatListStyle}>Property Type:</Text>
					<Text style={styles.flatListStyle2}>
						{item.property_type == '0' ? 'Commercial' : 'Residential'}
					</Text>
				</RN.View>

				<RN.View style={styles.renderItemItem}>
					<Text style={styles.flatListStyle}>Property address:</Text>
					<Text style={styles.flatListStyle2}>{item.property_address}</Text>
				</RN.View>

				<RN.View style={styles.renderItemItem}>
					<Text style={styles.flatListStyle}>Status:</Text>
					<Text
						style={[styles.flatListStyle2, { textTransform: 'capitalize' }]}
					>
						{item.status === '0'
							? 'active'
							: item.status == '1'
							? 'offer in place'
							: item.status == '2'
							? 'suspended'
							: 'sold'}
					</Text>
				</RN.View>

				<View style={styles.seeMoreWrapper}>
					<Text style={styles.seeMoreText}>See More Details</Text>
				</View>
			</TouchableOpacity>
		);
	};

	const ListHeader = (
		<>
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
				}}
			>
				<AntDesign
					name='arrowleft'
					size={30}
					onPress={() => navigation.goBack()}
				/>
				<Text
					style={{
						..._font.H4,
						color: colors.white,
						paddingHorizontal: RFValue(20),
					}}
				>
					Search
				</Text>
			</View>
			{/* <SearchInputBar /> */}
			<View style={{ marginVertical: RFValue(10) }}>
				<Text
					style={{
						..._font.Medium,
						fontFamily: 'pop-reg',
						color: colors.white,
					}}
				>
					Search Results
				</Text>
			</View>
		</>
	);

	useFocusEffect(
		useCallback(() => {
			setIsLoading(true);
			getSearchedProperty(search).then((res) => {
				setSearchResult(res.data.response.data);
				setIsLoading(false);
			});
		}, []),
	);

	if (isLoading) {
		return (
			<LogoPage dontShow={true}>
				{ListHeader}
				<ActivityIndicator size={'large'} color={colors.white} />
			</LogoPage>
		);
	}

	return (
		<LogoPage navigation={navigation}>
			<FlatList
				data={dataSearchResult}
				renderItem={renderItem}
				keyExtractor={(item) => item.unique_id}
				ListHeaderComponent={ListHeader}
				ListEmptyComponent={<ListEmptyComponent search={true} />}
			/>
		</LogoPage>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: colors.bgBrown,
		flex: 1,
		paddingTop: RFValue(40),
	},
	contentContainer: {},
	noresult: {
		textAlign: 'center',
		fontFamily: 'pop-reg',
		fontSize: 18,
		opacity: 0.9,
		color: colors.white,
	},

	searchBarContainer: {
		backgroundColor: 'transparent',
		margin: 0,
		padding: 0,
		borderRadius: RFValue(50),
		height: RFValue(50),
		borderTopWidth: 0,
		borderBottomWidth: 0,
		paddingHorizontal: RFValue(20),
		color: colors.black,
	},
	searchBarInput: {
		borderRadius: RFValue(50),
		height: RFValue(50),
		backgroundColor: '#fff',
		borderColor: 'transparent',
		color: colors.black,
	},
	renderItemItem: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		flex: 1,
		justifyContent: 'flex-start',
	},
	flatListStyle: {
		..._font.Small,
		fontSize: RFValue(14),
		color: colors.fairGrey,
		flex: 0.4,
		marginRight: RFValue(5),
	},
	flatListStyle2: {
		..._font.Small,
		fontSize: RFValue(14),
		fontFamily: 'pop-medium',
		flex: 0.6,
	},
	logoutButtonTitle: { ..._font.Medium, color: colors.white },
	logoutButtonIcon: {
		color: colors.white,
		fontSize: RFValue(20),
		paddingRight: RFValue(10),
	},
	logoutButtonWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
		marginVertical: RFValue(10),
	},
	renderItemWrapper: {
		backgroundColor: 'white',
		// width: wp(90),
		// marginHorizontal: hp(3),
		padding: RFValue(10),
		// height: hp(25),
		marginBottom: RFValue(20),
		// flexDirection: 'column',
		justifyContent: 'space-between',
		borderRadius: RFValue(10),
	},
	seeMoreText: {
		..._font.Small,
		color: colors.brown,
		fontFamily: 'pop-medium',
	},
	seeMoreWrapper: {
		..._font.Small,
		textAlign: 'right',
		color: colors.brown,
		alignSelf: 'flex-end',
		marginTop: RFValue(5),
		borderBottomWidth: RFValue(1),
		borderBottomColor: colors.brown,
	},
});

export default MortgageSearchScreen;
