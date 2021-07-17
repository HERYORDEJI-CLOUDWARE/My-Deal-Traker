import React, { useCallback, useContext, useState, useRef } from 'react';
import { Image, StyleSheet, Text, View, FlatList } from 'react-native';
import * as NB from 'native-base';
import * as RN from 'react-native';
import appApi from '../../api/appApi';
import HomeHeader from '../../components/HomeHeader';
import ListingCard from '../../components/ListingCard';
import LogoPage from '../../components/LogoPage';
import colors from '../../constants/colors';
import { Context as UserContext } from '../../context/UserContext';
import { displayError, fetchAuthToken, formatStatus } from '../../utils/misc';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { ActivityIndicator, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native';
import axios from 'axios';
import { AntDesign } from '@expo/vector-icons';
import {
	widthPercentageToDP as wp,
	heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import _font from '../../styles/fontStyles';
import { RFValue } from 'react-native-responsive-fontsize';
import { SearchBar } from 'react-native-elements';
import SearchInputBar from '../../components/SearchBar';

const MortgageBrokerHomepage = ({ navigation }) => {
	const [randomProperties, setRandomProperties] = useState({});

	const [isLoading, setIsLoading] = useState(true);
	const search = useRef({});
	const mortgageBrokerProperty = useRef({});

	const [mortgageProptList, setMortgageProptList] = useState(undefined);

	const [searchValue, setSearchValue] = useState('');

	const {
		state: { user, buyerTrans },
		fetchBuyerTrans,
		logout,
	} = useContext(UserContext);

	const submitSearch = async () => {
		const token = await fetchAuthToken();
		const data = new FormData();
		// console.log(searchValue);
		data.append('keyword', searchValue);
		axios
			.post(
				'https://mydealtracker.staging.cloudware.ng/api/search_property.php',
				data,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			)
			.then((res) => {
				const data = res.data.response.data;
				search.current = data;
				navigation.navigate('mortgageSearchScreen', { search: search });
			})
			.catch((err) => {
				// console.log(err);
			});
	};

	const FetchRandomProperties = async () => {
		const token = await fetchAuthToken();
		appApi
			.get('fetch_random_properties.php', {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then((res) => {
				const data = JSON.parse(res.data.response.data);
				setRandomProperties(data.properties);
				// // console.log(data.properties[0])
			})
			.catch((err) => {
				// console.log(err);
			});
	};

	const getMortgageBrokerProperty = async (transaction_id) => {
		const token = await fetchAuthToken();
		appApi
			.get(
				`/get_mortgage_broker_property_transactions.php?phone_email=${user.email}&property_id=${transaction_id}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			)
			.then((res) => {
				const data = res.data.response.data;
				// search.current = data
				// navigation.navigate('mortgageSearchScreen', {
				// 	search: mortgageBrokerProperty,
				// });
			})
			.catch((err) => {
				// console.log(err);
			});
	};

	const getBrokersProperty = async () => {
		try {
			const token = await fetchAuthToken();
			const response = await appApi.get(
				`fetch_mortgage_broker_properties.php?phone_email=${user.email}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);
			return response;
		} catch (e) {
			displayError(e);
		}
	};

	// const init = async () => {
	// 	await fetchBuyerTrans(user.email);
	// 	await FetchRandomProperties();
	// 	setIsLoading(false);
	// };

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

	const ListEmpty = (
		<React.Fragment>
			<View
				style={{
					justifyContent: 'center',
					alignItems: 'center',
					paddingVertical: 25,
				}}
			>
				<Image
					source={require('../../assets/img/no_deals.png')}
					style={{ width: 261, height: 137, resizeMode: 'stretch' }}
				/>
			</View>

			<View style={{ marginTop: 20 }}>
				<Text style={styles.noresult}>
					You have no recent search/activities.
				</Text>
				<Text style={styles.noresult}>Search for property to start deal</Text>
			</View>
		</React.Fragment>
	);

	useFocusEffect(
		useCallback(() => {
			setIsLoading(true);
			// fetchBuyerTrans(user.email);
			// FetchRandomProperties();
			// getMortgageBrokerProperty();
			getBrokersProperty().then((res) => {
				setMortgageProptList(res.data.response.data);
				setIsLoading(false);
			});
		}, []),
	);

	if (isLoading) {
		return (
			<LogoPage dontShow={true}>
				<React.Fragment>
					<HomeHeader
						search={search}
						// setSearch={setSearch}
						// searchScreen={'BLSelectedProperty'}
						searchScreen={'mortgageSearchScreen'}
					/>
				</React.Fragment>
				<ActivityIndicator color={colors.white} />
			</LogoPage>
		);
	}

	return (
		<LogoPage>
			<RN.FlatList
				bounces={false}
				bouncesZoom={false}
				showsVerticalScrollIndicator={false}
				data={mortgageProptList}
				renderItem={renderItem}
				keyExtractor={(item, index) => index.toString()}
				contentContainerStyle={styles.contentContainer}
				ListEmptyComponent={ListEmpty}
				ListHeaderComponent={
					<React.Fragment>
						<HomeHeader
							search={search}
							// setSearch={setSearch}
							// searchScreen={'BLSelectedProperty'}
							searchScreen={'mortgageSearchScreen'}
						/>
					</React.Fragment>
				}
			/>
			{/* Logout button */}
		</LogoPage>
	);
};

export default MortgageBrokerHomepage;

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
