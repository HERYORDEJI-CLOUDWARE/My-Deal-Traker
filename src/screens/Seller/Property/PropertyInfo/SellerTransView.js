import { AntDesign } from '@expo/vector-icons';
import { Card, Text } from 'native-base';
import React from 'react';
import { useState } from 'react';
import {
	Image,
	StyleSheet,
	TouchableOpacity,
	View,
	Dimensions,
	ActivityIndicator,
} from 'react-native';
import LogoPage from '../../../../components/LogoPage';
import PropertyHeader from '../../../../components/PropertyHeader';
import colors from '../../../../constants/colors';
import { navigate } from '../../../../nav/RootNav';
import { formatStatus } from '../../../../utils/misc';
import SaPropertyInfo from '../../../SA/Property/views/PropertyTab/PropertyInfo';
import { RFValue } from 'react-native-responsive-fontsize';
import moment from 'moment';
import _colors from '../../../../constants/colors';
import _font from '../../../../styles/fontStyles';
import { useFocusEffect } from '@react-navigation/native';
import { getPropertyTransaction } from '../../../../context/UserContext';

const { width } = Dimensions.get('window');

const SellerPropertyView = ({ property, navigation }) => {
	const [proptTrans, setProptTrans] = React.useState([]);
	const [isLoadingTrans, setIsLoadingTrans] = React.useState(true);

	useFocusEffect(
		React.useCallback(() => {
			let transaction_id =
				property?.transaction_id ?? transaction?.transaction_id;
			setIsLoadingTrans(true);
			getPropertyTransaction(transaction_id).then((res) => {
				setProptTrans(res.data.response.data[0]);
				setIsLoadingTrans(false);
			});
		}, []),
	);

	console.log(proptTrans);

	let rendered = <View property={property} />;

	return (
		<LogoPage dontShow={true}>
			<View style={styles.topWrapper}>
				<View style={styles.statusWrapper}>
					<Text style={styles.statusKey}>Status:</Text>
					<Text style={styles.statusValue}>
						{formatStatus(property.status)}
					</Text>
				</View>
				<Text style={styles.date}>
					{moment(property.date_created).format('MM/DD/YYYY')}
				</Text>
			</View>

			{isLoadingTrans ? (
				<View>
					<ActivityIndicator size={'large'} color={colors.white} />
				</View>
			) : (
				<View>
					<TouchableOpacity
						activeOpacity={0.9}
						onPress={() => {
							navigate('sellerPropertyDetails', {
								property,
								transaction: proptTrans,
							});
						}}
						style={styles.box}
					>
						<Text style={styles.boxTitle}>Property</Text>
						<AntDesign
							name='right'
							size={RFValue(15)}
							color={_colors.lightBrown}
						/>
					</TouchableOpacity>

					{/* <TouchableOpacity
				activeOpacity={0.9}
				onPress={() => navigate('sellerConditions', { property })}
				style={styles.box}
			>
				<Text style={styles.boxTitle}>Conditions</Text>
				<AntDesign name='right' size={RFValue(15)} color={_colors.lightBrown} />
			</TouchableOpacity> */}

					{/* <TouchableOpacity
				activeOpacity={0.9}
				onPress={() => navigate('listingLawyer', { property })}
				style={styles.box}
			>
				<Text style={styles.boxTitle}>Closing</Text>
				<AntDesign name='right' size={RFValue(15)} color={_colors.lightBrown} />
			</TouchableOpacity> */}

					<TouchableOpacity
						activeOpacity={0.9}
						onPress={() => navigate('fileUpload', { transaction: proptTrans })}
						style={styles.box}
					>
						<Text style={styles.boxTitle}>Files and Uploads</Text>
						<AntDesign
							name='right'
							size={RFValue(15)}
							color={_colors.lightBrown}
						/>
					</TouchableOpacity>
				</View>
			)}
		</LogoPage>
	);
};

export default SellerPropertyView;

const styles = StyleSheet.create({
	boxText: {
		textAlign: 'center',
		color: colors.brown,
		fontSize: 24,
	},
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
