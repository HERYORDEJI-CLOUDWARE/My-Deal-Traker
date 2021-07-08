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

const HomeHeader = ({
	search,
	setSearch,
	searchScreen,
	text,
	notSearching,
	// subStatus,
}) => {
	const {
		state: { user, subStatus },
		logout,
		fetchSubStatus,
	} = useContext(UserContext);

	const [properties, setProperties] = useState([]);

	React.useEffect(() => {
		fetchSubStatus(user.unique_id);
	}, []);

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
							Available listing: {subStatus?.total_remaining_listings}/
							{subStatus?.total_allowed_listings_in_active_plans}
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
					<SearchBar
						placeholder={'Search address or listing number'}
						value={search}
						onChangeText={setSearch}
						autoCapitalize='none'
						style={styles.searchBarContainer}
						inputStyle={styles.searchBarInput}
						// lightTheme={true}
						onSubmitEditing={onSubmitSearch}
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
