import * as React from 'react';
import {
	Text,
	View,
	StyleSheet,
	TouchableOpacity,
	Pressable,
} from 'react-native';
import { Input } from 'react-native-elements';
import GoBack from '../../../components/GoBack';
import colors from '../../../constants/colors';
import DatePicker from '../../../components/DatePicker';
import { ActionSheet, Toast, Container, Content } from 'native-base';
import InputBar from '../../../components/InputBar';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { RFValue } from 'react-native-responsive-fontsize';
import ButtonPrimaryBig from '../../../components/ButtonPrimaryBig';
import _font from './../../../styles/fontStyles';
import { _currency } from './../../../utils/misc';
import numbro from 'numbro';

const Step2 = ({ next, back, values, handleChange, setFieldValue }) => {
	var STATUS_BUTTONS = [
		'Active',
		'Offer-in place',
		'Suspended',
		'Sold',
		'Cancel',
	];
	var STATUS_CANCEL_INDEX = 4;

	var LISTING_TYPE_BUTTONS = ['Sale', 'Lease', 'Cancel'];
	var LISTING_TYPE_CANCEL_INDEX = 2;

	var OCCUPANCY_BUTTONS = [
		'Owner Occupied',
		'Tenant Occupied',
		'Vacant',
		'Cancel',
	];
	var OCCUPANCY_CANCEL_INDEX = 3;

	var POSSESSION_BUTTONS = ['Immediately', 'Other', 'Cancel'];
	var POSSESSION_CANCEL_INDEX = 2;

	const movePage = () => {
		if (
			values.status === undefined ||
			values.status === null ||
			values.listingType === undefined ||
			values.listingType === null ||
			!values.listingPrice ||
			!values.majorIntersection ||
			!values.majorNearestTown ||
			values.occupancy === undefined ||
			values.occupancy === null ||
			!values.occupancy ||
			!values.possession ||
			(values.possession == 'Other' && !values.possessionDate)
		) {
			return Toast.show({
				type: 'danger',
				text: 'All fields are required',
			});
		}
		next();
	};

	// const listPrice = numbro(values.listingPrice)
	// 	.format({ thousandSeparated: true })
	// 	.toString();

	// console.log(listPrice);

	const [formatedListingPrice, setFormatedListingPrice] = React.useState('');

	const onEnterPrice = (price) => {
		handleChange('listingPrice');
		setFormatedListingPrice(numbro(price).format({ thousandSeparated: true }));
	};

	return (
		<Content contentContainerStyle={{ paddingBottom: RFValue(60) }}>
			{/* <GoBack back={back} /> */}
			<View style={styles.textInputContainer}>
				<Text style={styles.label}>Status</Text>
				<Pressable
					style={styles.textInputWrapper}
					onPress={() =>
						ActionSheet.show(
							{
								options: STATUS_BUTTONS,
								cancelButtonIndex: STATUS_CANCEL_INDEX,
								title: 'Select Status',
							},
							(buttonIndex) => {
								if (buttonIndex !== 4) {
									setFieldValue('status', buttonIndex);
								}
							},
						)
					}
				>
					<Text
						style={{
							paddingVertical: RFValue(15),
							fontSize: 18,
							...styles.textInput,
							color: 1 <= values.status < 4 ? colors.black : colors.fair,
						}}
					>
						{STATUS_BUTTONS[values.status] || ''}
					</Text>
				</Pressable>
			</View>

			<View style={styles.textInputContainer}>
				<Text style={styles.label}>Listing Type</Text>
				<Pressable
					style={styles.textInputWrapper}
					onPress={() =>
						ActionSheet.show(
							{
								options: LISTING_TYPE_BUTTONS,
								cancelButtonIndex: LISTING_TYPE_CANCEL_INDEX,
								title: 'Select Listing Type',
							},
							(buttonIndex) => {
								if (buttonIndex !== 2) {
									setFieldValue('listingType', buttonIndex);
								}
							},
						)
					}
				>
					<Text
						style={{
							paddingVertical: 10,
							fontSize: 18,
							color: colors.white,
							...styles.textInput,
						}}
					>
						{LISTING_TYPE_BUTTONS[values.listingType] || ''}
					</Text>
				</Pressable>
			</View>

			<InputBar
				label={'Listing Price'}
				keyboardType={'number-pad'}
				// value={`${_currency(values.listingPrice)}`}
				// value={`${formatedListingPrice}`}
				onChangeText={handleChange('listingPrice')}
				// onChangeText={(text) => onEnterPrice(text)}
			/>

			<InputBar
				label={'Major Intersection'}
				value={values.majorIntersection}
				onChangeText={handleChange('majorIntersection')}
			/>

			<InputBar
				label={'Major Nearest Town'}
				value={values.majorNearestTown}
				onChangeText={handleChange('majorNearestTown')}
			/>
			<View style={styles.textInputContainer}>
				<Text style={styles.label}>Occupancy</Text>
				<TouchableOpacity
					style={styles.textInputWrapper}
					onPress={() =>
						ActionSheet.show(
							{
								options: OCCUPANCY_BUTTONS,
								cancelButtonIndex: OCCUPANCY_CANCEL_INDEX,
								title: 'Select Occupancy',
							},
							(buttonIndex) => {
								if (buttonIndex !== 3) {
									setFieldValue('occupancy', buttonIndex);
								}
							},
						)
					}
				>
					<Text
						style={{
							paddingVertical: 10,
							fontSize: 18,
							color: colors.white,
							...styles.textInput,
						}}
					>
						{OCCUPANCY_BUTTONS[values.occupancy] || ''}
					</Text>
				</TouchableOpacity>
			</View>

			<View style={styles.textInputContainer}>
				<Text style={styles.label}>Possession</Text>
				<TouchableOpacity
					onPress={() =>
						ActionSheet.show(
							{
								options: POSSESSION_BUTTONS,
								cancelButtonIndex: POSSESSION_CANCEL_INDEX,
								title: 'Select Possession',
							},
							(buttonIndex) => {
								if (buttonIndex !== 2) {
									setFieldValue('possession', POSSESSION_BUTTONS[buttonIndex]);
								}
							},
						)
					}
					style={styles.textInputWrapper}
				>
					<Text
						style={{
							paddingVertical: 10,
							fontSize: 18,
							color: colors.white,
							...styles.textInput,
						}}
					>
						{values.possession || ''}
					</Text>
				</TouchableOpacity>
			</View>

			{values.possession === 'Other' ? (
				<View>
					<DatePicker
						text='Possession Date'
						titleStyle={styles.label}
						date={values.possessionDate}
						setDate={(currentDate) =>
							setFieldValue('possessionDate', currentDate)
						}
					/>
				</View>
			) : null}

			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'space-between',
					flex: 1,
				}}
			>
				<ButtonPrimaryBig
					title={'Back'}
					onPress={back}
					containerStyle={{
						backgroundColor: colors.bgBrown,
						elevation: 2,
						flex: 0.4,
					}}
				/>
				<ButtonPrimaryBig
					title={'Continue'}
					titleStyle={{ color: colors.black }}
					onPress={movePage}
					containerStyle={{
						backgroundColor: colors.white,
						elevation: 2,
						flex: 0.4,
					}}
				/>
			</View>
		</Content>
	);
};

export default Step2;

const styles = StyleSheet.create({
	title: {
		fontSize: 30,
		color: colors.white,
		width: 163,
		marginLeft: 36,
		paddingTop: 10,
	},
	transactionIdBlock: {
		flexDirection: 'row',
		paddingHorizontal: 20,
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: '#c4c4c4',
		marginHorizontal: 23,
		opacity: 0.5,
		marginTop: 30,
		borderRadius: 5,
		paddingVertical: 5,
	},
	transactionIdTitle: {
		color: colors.white,
		opacity: 1,
	},
	transactionProgressBlock: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 30,
		marginTop: 30,
	},
	sections: {
		paddingBottom: 5,
	},
	inputStyle: { borderBottomWidth: 0, color: colors.white },
	label: {
		color: colors.black,
	},
	inputStyle: { borderBottomWidth: 0, color: colors.white },
	sections: { height: 35 },
	label: { ..._font.Medium, color: colors.white },
	textInputContainer: {
		marginBottom: RFValue(20),
	},
	textInputWrapper: {
		height: RFValue(50),
	},
	textInput: {
		color: colors.white,
		padding: 0,
		margin: 0,

		height: RFValue(50),
		backgroundColor: colors.white,
		flex: 1,
		paddingHorizontal: RFValue(10),
		..._font.Medium,
	},
});
