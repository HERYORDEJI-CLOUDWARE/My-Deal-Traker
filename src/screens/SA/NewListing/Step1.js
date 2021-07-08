// import { Picker } from "@react-native-community/picker";
import { Picker, Text, Toast } from 'native-base';
import React, { useEffect } from 'react';
import {
	StyleSheet,
	TouchableOpacity,
	View,
	ActionSheetIOS,
	Platform,
	Keyboard,
	Animated,
} from 'react-native';
import { Input } from 'react-native-elements';
import colors from '../../../constants/colors';
import { KeyboardAvoidingView } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import _font from './../../../styles/fontStyles';
import { TextInput } from 'react-native';
import ButtonPrimaryBig from '../../../components/ButtonPrimaryBig';
import { Content } from 'native-base';

const Step1 = ({ next, back, values, handleChange, setFieldValue }) => {
	const keyboardHeight = new Animated.Value(0);
	// const imageHeight = new Animated.Value(IMAGE_HEIGHT);
	let keyboardWillShowSub;
	let keyboardWillHideSub;
	useEffect(() => {
		keyboardWillShowSub = Keyboard.addListener(
			'keyboardWillShow',
			keyboardWillShow,
		);
		keyboardWillHideSub = Keyboard.addListener(
			'keyboardWillHide',
			keyboardWillHide,
		);

		return () => {
			keyboardWillShowSub.remove();
			keyboardWillHideSub.remove();
		};
	}, []);

	const keyboardWillShow = (event) => {
		// console.log("showing");
		Animated.parallel([
			Animated.timing(keyboardHeight, {
				duration: event.duration,
				toValue: event.endCoordinates.height,
			}),
		]).start();
	};

	const keyboardWillHide = (event) => {
		Animated.parallel([
			Animated.timing(keyboardHeight, {
				duration: event.duration,
				toValue: 0,
			}),
		]).start();
	};

	const onPress = () =>
		ActionSheetIOS.showActionSheetWithOptions(
			{
				options: ['Cancel', 'Commercial', 'Residential'],
				// destructiveButtonIndex: 2,
				cancelButtonIndex: 0,
				title: 'Select Property Type',
			},
			(buttonIndex) => {
				if (buttonIndex === 0) {
					// cancel action
				} else if (buttonIndex === 1) {
					setFieldValue('propertyType', 0);
				} else if (buttonIndex === 2) {
					setFieldValue('propertyType', 1);
				}
			},
		);

	const movePage = () => {
		console.log(
			values.listNo,
			values.listSource,
			values.propertyType,
			values.propertyDetails,
			values.propertyAddress,
			values.propertyState,
			values.postCode,
		);

		if (
			!values.listNo ||
			!values.listSource ||
			values.propertyType === null ||
			values.propertyType === undefined ||
			!values.propertyDetails ||
			!values.propertyAddress ||
			!values.propertyState ||
			!values.postCode
		) {
			return Toast.show({
				type: 'danger',
				text: 'All fields are required',
				duration: 4000,
			});
		}
		next();
	};

	return (
		<Content contentContainerStyle={{ paddingBottom: RFValue(60) }}>
			{/* Listing Number */}
			<View style={styles.textInputContainer}>
				<Text style={styles.label}>Listing Number</Text>
				<View style={styles.textInputWrapper}>
					<TextInput
						value={values.listNo}
						onChangeText={handleChange('listNo')}
						style={styles.textInput}
					/>
				</View>
			</View>

			{/* Listing Source */}
			<View style={styles.textInputContainer}>
				<Text style={styles.label}>Listing Source</Text>
				<View style={styles.textInputWrapper}>
					<TextInput
						value={values.listSource}
						onChangeText={handleChange('listSource')}
						style={styles.textInput}
					/>
				</View>
			</View>

			{Platform.OS === 'android' ? (
				<View style={styles.textInputContainer}>
					<Text style={styles.label}>Property Type</Text>
					<View style={{ ...styles.textInput }}>
						<Picker
							style={styles.textInput}
							itemStyle={{
								color: 'blue',
								backgroundColor: 'green',
								marginLeft: 0,
								paddingLeft: 10,
								...styles.textInput,
							}}
							// style={{ height: RFValue(30), width: RFValue(200) }}
							selectedValue={values.propertyType}
							onValueChange={(value) => setFieldValue('propertyType', value)}
							mode='dropdown'
						>
							<Picker.Item
								label='Select property type'
								value=''
								color={colors.lightGrey}
							/>
							<Picker.Item label='Commercial' value='0' />
							<Picker.Item label='Residential' value='1' />
						</Picker>
					</View>
				</View>
			) : (
				<TouchableOpacity
					onPress={() => onPress()}
					style={{ paddingBottom: 1 }}
				>
					<Text onPress={onPress} style={styles.label}>
						Select Property Type
					</Text>
					<Text
						style={{
							color: colors.lightGrey,
							paddingVertical: RFValue(10),
							paddingLeft: RFValue(10),
						}}
					>
						{values.propertyType == '0'
							? 'Commercial'
							: values.propertyType == '1'
							? 'Residential'
							: 'Select property type'}
					</Text>
				</TouchableOpacity>
			)}

			{/* Property Details */}
			<View style={styles.textInputContainer}>
				<Text style={styles.label}>Property Details</Text>
				<View style={styles.textInputWrapper}>
					<TextInput
						value={values.propertyDetails}
						onChangeText={handleChange('propertyDetails')}
						style={styles.textInput}
					/>
				</View>
			</View>

			{/* Property Address */}
			<View style={styles.textInputContainer}>
				<Text style={styles.label}>Property Address</Text>
				<View style={styles.textInputWrapper}>
					<TextInput
						value={values.propertyAddress}
						onChangeText={handleChange('propertyAddress')}
						style={styles.textInput}
					/>
				</View>
			</View>

			{/* State */}
			<View style={styles.textInputContainer}>
				<Text style={styles.label}>State</Text>
				<View style={styles.textInputWrapper}>
					<TextInput
						value={values.propertyState}
						onChangeText={handleChange('propertyState')}
						style={styles.textInput}
					/>
				</View>
			</View>

			{/* Postal/Zip Code */}
			<View style={styles.textInputContainer}>
				<Text style={styles.label}>Postal/Zip Code</Text>
				<View style={styles.textInputWrapper}>
					<TextInput
						value={values.postCode}
						onChangeText={handleChange('postCode')}
						style={styles.textInput}
					/>
				</View>
			</View>

			<ButtonPrimaryBig
				onPress={movePage}
				title={'Continue'}
				titleStyle={{ color: colors.black }}
				containerStyle={{
					backgroundColor: colors.lightGrey,
					marginTop: RFValue(10),
				}}
			/>
		</Content>
	);
};

export default Step1;

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
