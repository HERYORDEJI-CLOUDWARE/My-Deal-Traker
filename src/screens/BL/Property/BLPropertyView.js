import { AntDesign } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { Card, Toast } from 'native-base';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import {
	Image,
	StyleSheet,
	TouchableOpacity,
	View,
	Dimensions,
	ScrollView,
	Text,
} from 'react-native';
import appApi from '../../../api/appApi';
import LogoPage from '../../../components/LogoPage';
import PropertyHeader from '../../../components/PropertyHeader';
import colors from '../../../constants/colors';
import { navigate } from '../../../nav/RootNav';
import {
	displayError,
	fetchAuthToken,
	formatStatus,
} from '../../../utils/misc';
import SLClosing from '../closing/BLClosing';
import SLPropertyDetails from './BLPropertyDetail';
import { RFValue } from 'react-native-responsive-fontsize';
import _font from '../../../styles/fontStyles';

const { width } = Dimensions.get('window');

const BLPropertyView = ({ property, navigation }) => {
	const [view, setView] = useState('property');
	const [theApproved, setTheApproved] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [theTransaction, setTheTransaction] = useState('');

	const [proptTrans, setProptTrans] = useState(null);

	// To get property transaction
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
			getApprovedOffer();
			getProptTrans().then((res) => setProptTrans(res.data.response.data[0]));
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
			setIsLoading(false);
		} catch (error) {
			displayError(error);
		}
	};

	const fetchTransaction = async (id) => {
		try {
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

	const HeaderButtons = () => (
		<React.Fragment>
			<View style={{}}>
				<TouchableOpacity
					activeOpacity={0.9}
					onPress={() => navigate('blPropertyInfo', { property })}
					style={styles.box}
				>
					<Text style={styles.boxTitle}>Property</Text>
					<AntDesign
						name='right'
						size={RFValue(15)}
						color={colors.lightBrown}
					/>
				</TouchableOpacity>
				{theApproved && (
					<>
						<TouchableOpacity
							activeOpacity={0.9}
							onPress={() => {
								navigate('blClosingScreen', {
									property,
									transaction: proptTrans,
								});
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
								navigate('fileUpload', { transaction: theTransaction });
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
					</>
				)}
			</View>
		</React.Fragment>
	);

	if (isLoading) {
		return (
			<LogoPage navigation={navigation}>
				<ActivityIndicator color={colors.white} size='large' />
			</LogoPage>
		);
	}

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
		<ScrollView style={{ flex: 1 }}>
			<PropertyHeader
				transactionID={property.transaction_id}
				status={formatStatus(property.status)}
				date={property.date_created}
				navigation={navigation}
			/>
			<HeaderButtons />
		</ScrollView>
	);
};

export default BLPropertyView;

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
