import React from 'react';
import {
	View,
	StyleSheet,
	Dimensions,
	Text,
	TouchableOpacity,
} from 'react-native';
import { Card } from 'react-native-elements';
import colors from '../constants/colors';
import { useNavigation } from '@react-navigation/native';
import { RFValue } from 'react-native-responsive-fontsize';
import _font from '../styles/fontStyles';

const { width } = Dimensions.get('window');

interface Props {
	view: string;
	listNo: string;
	status: string;
	city: string;
	dad: string;
	item: object;
	transId: string;
	property_id: string;
	transaction_id: string;
}

const ListingCard = ({
	view,
	listNo,
	status,
	city,
	dad,
	type,
	item,
	transId,
	property_id,
	transaction_id,
}: Props) => {
	const navigation = useNavigation();

	const onPress = () => {
		navigation.navigate(view, {
			property: item,
			transaction_id: item?.transaction_id,
			property_id: property_id,
		});
	};

	// console.log('item', item);

	return (
		<TouchableOpacity
			onPress={onPress}
			activeOpacity={0.8}
			style={{
				flex: 1,
				elevation: RFValue(3),
				backgroundColor: colors.white,
				padding: RFValue(20),
				borderRadius: RFValue(10),
				marginBottom: RFValue(20),
				overflow: 'hidden',
			}}
		>
			{transId ? (
				<View style={styles.rowWrapper}>
					<Text style={styles.key}>Transaction ID : </Text>
					<Text style={styles.value}>{transId}</Text>
				</View>
			) : null}
			{listNo ? (
				<View style={styles.rowWrapper}>
					<Text style={styles.key}>Listing Number:</Text>
					<Text style={styles.value}>{listNo}</Text>
				</View>
			) : null}

			<View style={styles.rowWrapper}>
				<Text style={styles.key}>Type: </Text>
				<Text style={styles.value}>
					{type === '0' ? 'Commercial' : 'Residential'}
				</Text>
			</View>

			<View style={styles.rowWrapper}>
				<Text style={styles.key}>Status:</Text>
				<Text style={styles.value}>{status}</Text>
			</View>

			{city ? (
				<View style={styles.rowWrapper}>
					<Text style={styles.key}>City: </Text>
					<Text style={styles.value}>{city}</Text>
				</View>
			) : null}

			{/* <View style={styles.rowWrapper}>
						<Text style={styles.key}>Date Added: </Text>
						<Text style={styles.value}>{dad}</Text>
					</View> */}

			<Text style={styles.seeMore}>See more details</Text>
		</TouchableOpacity>
	);
};

export default ListingCard;

const styles = StyleSheet.create({
	card: {
		// width: width * 0.8,
		// alignSelf: 'center',
		// padding: RFValue(20),
		// marginBottom: RFValue(20),
		// borderRadius: RFValue(10),
		// overflow: 'hidden',
		// elevation: 3,
		// margin: 0,
	},
	innerCircle: {
		width: RFValue(70),
		height: RFValue(70),
		backgroundColor: colors.white,
		position: 'absolute',
		bottom: -RFValue(50),
		left: -RFValue(50),
		borderRadius: RFValue(50),
		borderWidth: RFValue(2),
		borderColor: colors.brown,
		zIndex: -10000,
	},
	upperCircle: {
		width: RFValue(70),
		height: RFValue(70),
		backgroundColor: colors.white,
		position: 'absolute',
		top: -RFValue(70),
		left: (width * 0.8) / 3,
		borderRadius: RFValue(50),
		borderWidth: RFValue(2),
		borderColor: colors.brown,
		zIndex: -10000,
	},
	rowWrapper: { flex: 1, flexDirection: 'row', alignItems: 'flex-start' },
	key: {
		..._font.Small,
		fontSize: RFValue(14),
		color: colors.fairGrey,
		flex: 0.4,
		marginRight: RFValue(5),
	},
	value: {
		..._font.Small,
		fontSize: RFValue(14),
		fontFamily: 'pop-medium',
		flex: 0.6,
	},
	seeMore: {
		..._font.Small,
		textAlign: 'right',
		color: colors.brown,
		alignSelf: 'flex-end',
		marginTop: RFValue(5),
		borderBottomWidth: RFValue(1),
		borderBottomColor: colors.brown,
	},
});
