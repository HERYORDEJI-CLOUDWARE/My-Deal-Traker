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
import { useFocusEffect } from '@react-navigation/native';
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

const BuyerHomepage = ({ navigation }) => {
	const [randomProperties, setRandomProperties] = useState({});

	const [isLoading, setIsLoading] = useState(true);
	const search = useRef({});
	const mortgageBrokerProperty = useRef({});

	const [searchValue, setSearchValue] = useState('');

	const {
		state: { user, buyerTrans },
		fetchBuyerTrans,
		logout,
	} = useContext(UserContext);

	useFocusEffect(
		useCallback(() => {
			init();
		}, []),
	);

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
				// console.log(res.data);
				mortgageBrokerProperty.current = data;
				// search.current = data
				navigation.navigate('mortgageSearchScreen', {
					search: mortgageBrokerProperty,
				});
			})
			.catch((err) => {
				// console.log(err);
			});
	};

	const init = async () => {
		await fetchBuyerTrans(user.email);
		await FetchRandomProperties();
		setIsLoading(false);
	};

	if (isLoading) {
		return (
			<React.Fragment>
				<LogoPage dontShow={true}>
					<ActivityIndicator size='large' color={colors.white} />
				</LogoPage>
			</React.Fragment>
		);
	}

	const renderItem = ({ item }) => {
		return (
			<View style={styles.renderItemWrapper}>
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

				<RN.Pressable
					style={styles.seeMoreWrapper}
					onPress={() => getMortgageBrokerProperty(item.transaction_id)}
				>
					<Text style={styles.seeMoreText}>See More Details</Text>
				</RN.Pressable>
			</View>
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

	return (
		<NB.Container style={styles.container}>
			<RN.View>
				<SearchBar
					placeholder={'Search for properties by ID or name'}
					placeholderTextColor={'grey'}
					// value={search}
					autoCapitalize='none'
					containerStyle={styles.searchBarContainer}
					inputContainerStyle={styles.searchBarInput}
					lightTheme={true}
					onSubmitEditing={submitSearch}
					platform={'default'}
					searchIcon={false}
					onChangeText={(text) => setSearchValue(text)}
					clearIcon={false}
				/>
			</RN.View>
			{randomProperties.length < 1 ? (
				<View style={{ marginTop: 200 }}>
					<ActivityIndicator size='large' color='white' />
				</View>
			) : (
				<RN.FlatList
					bounces={false}
					bouncesZoom={false}
					showsVerticalScrollIndicator={false}
					// data={[]}
					data={randomProperties}
					renderItem={renderItem}
					keyExtractor={(item) => item.unique_id}
					contentContainerStyle={styles.contentContainer}
					// ListEmptyComponent={() => <RN.Text>Yusuf</RN.Text>}
				/>
			)}
			{/* Logout button */}
			<RN.Pressable style={styles.logoutButtonWrapper} onPress={logout}>
				<NB.Icon
					name={'logout'}
					type={'MaterialCommunityIcons'}
					style={styles.logoutButtonIcon}
				/>
				<RN.Text style={styles.logoutButtonTitle}>Log out</RN.Text>
			</RN.Pressable>
		</NB.Container>
	);
};

export default BuyerHomepage;

const styles = StyleSheet.create({
	container: {
		backgroundColor: colors.bgBrown,
		flex: 1,
		paddingTop: RFValue(40),
	},
	contentContainer: { paddingTop: RFValue(20), paddingHorizontal: RFValue(20) },
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
		// fontSize: RFValue(14),
		color: colors.fair,
		flex: 0.3,
	},
	flatListStyle2: {
		..._font.Small,
		fontFamily: 'pop-medium',
		// fontSize: RFValue(14),
		textAlign: 'left',
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
	seeMoreWrapper: { alignItems: 'flex-end' },
});
