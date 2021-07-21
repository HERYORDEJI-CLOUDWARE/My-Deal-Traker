import { AntDesign } from '@expo/vector-icons';
import { Text, Toast } from 'native-base';
import React, { useState } from 'react';
import { useContext } from 'react';
import {
	Alert,
	Dimensions,
	Platform,
	TouchableOpacity,
	View,
} from 'react-native';
import colors from '../constants/colors';
import { Context as UserContext } from '../context/UserContext';
import { navigate } from '../nav/RootNav';
import CustomInput from './CustomInput';
import { FontAwesome as Icon } from '@expo/vector-icons';
import { Searchbar as SearchBar } from 'react-native-paper';
// import { SearchBar } from 'react-native-elements';
import { getRole } from '../utils/misc';
import appApi from '../api/appApi';
import { fetchAuthToken } from '../utils/misc';
import axios from 'axios';
import * as NB from 'native-base';
import * as RN from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import _font from '../styles/fontStyles';
import SearchInputBar from './SearchBar';

const HomeHeader = ({
	search,
	setSearch,
	searchScreen,
	text,
	notSearching,
	searchItemViewScreen,
	// subStatus,
}) => {
	const {
		state: { user, subStatus },
		logout,
		fetchSubStatus,
	} = useContext(UserContext);

	const [properties, setProperties] = useState([]);
	console.log('...subStatus...', subStatus);

	React.useEffect(() => {
		fetchSubStatus(user.unique_id);
		_fetchSubStatus();
	}, []);

	const _fetchSubStatus = async () => {
		try {
			const token = await fetchAuthToken();
			const response = await appApi.get(
				`/get_user_active_plans_with_details.php?user_id=${user.unique_id}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);
			// console.log(response.data.response.status);
			if (response.data.response.status === 200) {
				console.log('response.data.', response.data.response.data);
			} else {
				console.log(response.data.response);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const submitSearch = async () => {
		const token = await fetchAuthToken();
		// // console.log(token)

		const data = new FormData();
		data.append('keyword', text);

		axios
			.get(
				'http://mydealtracker.staging.cloudware.ng/api/search_property.php',
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			)
			.then((res) => {
				// // console.log(token);
				// console.log(res.data.response.data);
				const response = res.data.response.data;
				setSearch(response);
			})
			.catch((err) => {
				// console.log(err);
			});
	};

	const onSubmitSearch = () => {
		if (!search) {
			if (Platform.OS === 'android') {
				return Toast.show({
					text: 'Field cannot be blank',
					position: 'bottom',
				});
			} else {
				return Alert.alert('Error', 'Field cannot be blank');
			}
		}
		// submitSearch()
		navigate(searchScreen || 'searchScreen', { search });
		setSearch('');
	};

	return (
		<React.Fragment>
			<RN.View style={styles.topWrapper}>
				<RN.View>
					{user && user.role ? (
						<View style={{ flex: 1, flexDirection: 'row' }}>
							<Text style={styles.loggedInAsText}>Logged in as: </Text>
							<TouchableOpacity
								onPress={() => {
									navigate('upgradePlan');
								}}
								style={styles.loggedInAsButton}
							>
								<Text style={styles.loggedInAsRole}>
									{user && getRole(user.role)}
								</Text>
							</TouchableOpacity>
						</View>
					) : null}

					{user ? (
						<Text style={styles.remaining}>
							Available listing:{' '}
							{subStatus?.total_remaining_listings_in_active_plans ?? '0'} /{' '}
							{subStatus?.total_allowed_listings_in_active_plans ?? '0'}
						</Text>
					) : null}
				</RN.View>
				<RN.Image
					source={require('../assets/img/app_logo.png')}
					style={styles.topLogo}
				/>
				{/* {!notSearching && <Text style={styles.searchHeading}>Search</Text>} */}
			</RN.View>

			{!notSearching && (
				<View style={styles.searchbarWrapper}>
					<SearchInputBar
						placeholder={'Search address or listing number'}
						// value={search}
						// onChangeText={setSearch}
						// containerStyle={styles.searchBarContainer}
						// inputStyle={styles.searchBarInput}
						// lightTheme={true}
						// onSubmitSearch={onSubmitSearch}
						searchScreen={searchScreen ?? 'searchScreen'}
						searchItemViewScreen={searchItemViewScreen}

						// platform={'default'}
						// searchIcon={false}
					/>
				</View>
			)}

			{/* <View
				style={{
					paddingHorizontal: 34,
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'space-between',
				}}
			>
				<Text
					style={{ fontFamily: 'pop-reg', fontSize: 18, color: colors.white }}
				>
					{text || ' My deals'}
				</Text>
			</View> */}

			{/* Logout button */}
			{/* <RN.Pressable style={styles.logoutButtonWrapper} onPress={logout}>
				<NB.Icon
					name={'logout'}
					type={'MaterialCommunityIcons'}
					style={styles.logoutButtonIcon}
				/>
				<RN.Text style={styles.logoutButtonTitle}>Log out</RN.Text>
			</RN.Pressable> */}
		</React.Fragment>
	);
};

export default HomeHeader;

const styles = RN.StyleSheet.create({
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
	loggedInAsText: {
		..._font.Medium,
		color: colors.white,
		// fontFamily: 'pop-light',
	},
	loggedInAsButton: {
		backgroundColor: 'black',
		marginLeft: RFValue(10),
		borderRadius: RFValue(10),
		paddingHorizontal: RFValue(10),
		justifyContent: 'center',
	},
	loggedInAsRole: {
		..._font.Small,
		color: colors.white,
	},
	topWrapper: {
		// paddingTop: RFValue(66),
		// paddingBottom: RFValue(45),
		flexDirection: 'row',
		// alignItems: 'center',
		justifyContent: 'space-between',
		borderBottomWidth: RFValue(1),
		borderBottomColor: colors.brown,
	},
	remaining: {
		..._font.Medium,
		color: colors.white,
		paddingVertical: RFValue(10),
	},
	searchHeading: {
		..._font.H5,
		color: colors.white,
		// fontSize: 36,
		fontFamily: 'pop-semibold',
	},
	searchbarWrapper: { marginVertical: RFValue(10) },
	searchBarContainer: {
		// backgroundColor: 'transparent',
		// margin: 0,
		// padding: 0,
		// borderRadius: RFValue(50),
		height: RFValue(50),
		// borderTopWidth: 0,
	},
	searchBarInput: {
		// borderRadius: RFValue(50),
		height: RFValue(50),
		// backgroundColor: '#fff',
		// borderColor: 'transparent',
		..._font.Medium,
	},
	topLogo: {
		width: RFValue(50),
		height: RFValue(50),
		opacity: 0.8,
		resizeMode: 'cover',
	},
});

const lll = {
	allow_rollover: '0',
	allowed_listings: '5',
	date_subscribed: '2021-05-05 09:55:47',
	description: 'Enjoy free plan',
	expiry_date: '2021-05-15 09:55:47',
	has_rollover: '0',
	listings_made: '0',
	maximum: '5',
	name: 'Free',
	period: 'day',
	period_length: '10',
	plan_id: '1',
	price: null,
	remaining_listings: '5',
	subscription_id: '3efa8a4b4310e3a7d678b47356e9b8c5',
	supposed_total_allowed_listings: '55',
	supposed_total_allowed_listings_in_active_plans: '50',
	supposed_total_remaining_listings: '54',
	supposed_total_remaining_listings_in_active_plans: '55',
	total_allowed_listings: '55',
	total_allowed_listings_in_active_plans: '50',
	total_property_listed: '1',
	total_property_listed_in_active_plans: '1',
	total_remaining_listings: '54',
	total_remaining_listings_in_active_plans: '49',
	total_subscription: '2',
	total_subscription_in_active_plans: '1',
	unique_id: '1',
	user_id: 'f32ab9dcc2de579feca0af7e13f9ffb8',
};
