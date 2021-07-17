import { Card, Text, Toast } from 'native-base';
import React, { useCallback, useState } from 'react';
import {
	Image,
	StyleSheet,
	TouchableOpacity,
	View,
	Dimensions,
	ScrollView,
} from 'react-native';
import PropertyHeader from '../../../components/PropertyHeader';
import _font from '../../../styles/fontStyles';
import colors from '../../../constants/colors';
import { navigate } from '../../../nav/RootNav';
import SLClosing from '../closing/SLClosing';
import moment from 'moment';
import { displayError, fetchAuthToken } from '../../../utils/misc';
import appApi from '../../../api/appApi';
import { useFocusEffect } from '@react-navigation/native';
import LogoPage from '../../../components/LogoPage';
import { AntDesign } from '@expo/vector-icons';
import { ActivityIndicator } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

const { width } = Dimensions.get('window');

const SLPropertyView = ({ property, navigation }) => {
	const [view, setView] = useState('property');

	const [theApproved, setTheApproved] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	const [theTransaction, setTheTransaction] = useState(null);

	const [proptTrans, setProptTrans] = useState(null);

	const getProptTrans = async () => {
		try {
			const token = await fetchAuthToken();
			const data = new FormData();
			return await appApi.get(
				`/get_property_transactions.php?property_transaction_id=${property.transaction_id}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);
		} catch (error) {}
	};

	useFocusEffect(
		useCallback(() => {
			fetchTransaction(property.transaction_id);
			// getApprovedOffer();
			getProptTrans().then((res) => {
				setProptTrans(res.data.response.data[0]);
			});
		}, []),
	);

	const getApprovedOffer = async () => {
		try {
			const token = await fetchAuthToken();
			const response = await appApi.get(
				`/get_property_approved_offer.php?property_id=${property.transaction_id}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);
			if (response.data.response.status == 200) {
				setTheApproved(response.data.response.data);
				fetchTransaction(response.data.response.data.transaction_id);
			} else {
				Toast.show({
					type: 'warning',
					text: response.data.response.message,
				});
			}
		} catch (error) {
			displayError(error);
		}
	};

	const fetchTransaction = async (id) => {
		try {
			setIsLoading(true);
			const token = await fetchAuthToken();
			const response = await appApi.get(
				`/get_transaction_details.php?transaction_id=${id}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);
			if (response.data.response.status == 200) {
				setTheTransaction(response.data.response.data);
				console.log('response.da', response.data.response.data);
				setIsLoading(false);
			} else {
				Toast.show({
					type: 'warning',
					text: response.data.response.message,
				});
			}
			setIsLoading(false);
		} catch (error) {
			displayError(error);
		}
	};

	console.log('theTransaction...', theTransaction);

	const HeaderButtons = () => (
		<React.Fragment>
			<View style={{}}>
				<TouchableOpacity
					activeOpacity={0.9}
					onPress={() => {
						navigate('SLPropertyInfo', { property });
						// setView("property")
					}}
					style={styles.box}
				>
					<Text style={styles.boxTitle}>Property</Text>
					<AntDesign
						name='right'
						size={RFValue(15)}
						color={colors.lightBrown}
					/>
				</TouchableOpacity>

				<TouchableOpacity
					activeOpacity={0.9}
					onPress={() => {
						navigate('slClosing', { property, transaction: proptTrans });
						// setView("closing")
					}}
					style={styles.box}
				>
					<Text style={styles.boxTitle}>Closing</Text>
					<AntDesign
						name='right'
						size={RFValue(15)}
						color={colors.lightBrown}
					/>
				</TouchableOpacity>

				<TouchableOpacity
					activeOpacity={0.9}
					onPress={() => {
						navigate('fileUpload', { transaction: proptTrans });
					}}
					style={styles.box}
				>
					<Text style={styles.boxTitle}>Files & Uploads</Text>
					<AntDesign
						name='right'
						size={RFValue(15)}
						color={colors.lightBrown}
					/>
				</TouchableOpacity>
			</View>
		</React.Fragment>
	);

	let rendered = <View />;
	if (view === 'closing') {
		rendered = <SLClosing />;
	}
	if (view === 'report') {
		rendered = <Text>REPORT</Text>;
	}

	// if (isLoading) {
	// 	return (
	// 		<LogoPage navigation={navigation}>
	// 			<ActivityIndicator color={'red'} size='large' />
	// 		</LogoPage>
	// 	);
	// }

	// if (!theApproved) {
	// 	return (
	// 		<LogoPage navigation={navigation}>
	// 			<View
	// 				style={{
	// 					alignItems: 'center',
	// 				}}
	// 			>
	// 				<AntDesign name='warning' size={100} color={colors.white} />
	// 				<Text
	// 					style={{
	// 						textAlign: 'center',
	// 						paddingHorizontal: 50,
	// 						color: colors.white,
	// 					}}
	// 				>
	// 					No approved transaction for this property at the moment
	// 				</Text>
	// 			</View>
	// 		</LogoPage>
	// 	);
	// }

	return (
		<>
			<PropertyHeader
				transactionID={property.transaction_id}
				status='Active'
				date={moment(property.date_created).format('MM/DD/YYYY')}
				navigation={navigation}
			/>
			<HeaderButtons />
			{rendered}
		</>
	);
};

export default SLPropertyView;

const styles = StyleSheet.create({
	topWrapper: { marginBottom: RFValue(20) },
	box: {
		padding: RFValue(20),
		paddingVertical: RFValue(10),
		alignItems: 'center',
		backgroundColor: '#FFF',
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: RFValue(20),
	},
	boxTitle: {
		..._font.Big,
		textAlign: 'center',
		color: colors.brown,
		fontSize: RFValue(18),
	},
	listTitle: {
		padding: RFValue(10),
		fontSize: RFValue(20),
		color: colors.lightGrey,
		textAlign: 'left',
	},
	listValue: {
		padding: RFValue(10),
		fontSize: RFValue(20),
		color: colors.white,
		textAlign: 'left',
	},
	statusWrapper: { flexDirection: 'row' },
	statusKey: {
		..._font.Medium,
		// fontSize: 20,
		color: colors.white,
		paddingRight: RFValue(10),
	},
	statusValue: {
		..._font.Medium,
		// fontSize: 20,
		color: colors.white,
		fontFamily: 'pop-semibold',
	},
	date: { ..._font.Medium, color: colors.white },
});
