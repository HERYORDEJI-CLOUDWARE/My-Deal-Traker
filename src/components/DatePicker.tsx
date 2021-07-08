import React from 'react';
import { StyleSheet, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Text } from 'native-base';
import moment from 'moment';
import colors from '../constants/colors';
import { RFValue } from 'react-native-responsive-fontsize';
import _font from '../styles/fontStyles';

const DatePicker = ({
	date,
	setDate,
	text,
	containerStyle,
	wrapperStyle,
	viewOffer = false,
	titleStyle,
}) => {
	const [show, setShow] = useState(false);

	const viewOfferStyle = {
		container: {
			..._font.Medium,

			color: '#FFFFFF',
			// height: RFValue(50),
			padding: 0,
			margin: 0,
			borderWidth: 0,
			justifyContent: 'center',
			flex: 1,
			// paddingHorizontal: RFValue(10),
		},
		wrapperStyle: {
			..._font.Medium,

			color: '#FFFFFF',
			// height: RFValue(50),
			padding: 0,
			margin: 0,
			borderWidth: 0,
			justifyContent: 'center',
			flex: 1,
			// paddingHorizontal: RFValue(10),
		},
		textStyle: {
			color: '#FFFFFF',
		},
	};

	const onChange = (event, selectedDate) => {
		const currentDate = selectedDate || date;
		setShow(false);
		setDate(currentDate);
	};

	return (
		<View style={{ marginBottom: RFValue(20) }}>
			<Text
				style={{
					..._font.Small,
					fontSize: RFValue(14),
					color: colors.black,
					...styles.title,
					...titleStyle,
				}}
			>
				{text || 'Date'}
			</Text>

			<View
				style={{
					...styles.containerStyle,
					..._font.Medium,
					height: viewOffer ? RFValue(30) : RFValue(50),
					padding: 0,
					margin: 0,
					borderWidth: 0,
					justifyContent: 'center',
					flex: 1,
					paddingHorizontal: viewOffer ? RFValue(0) : RFValue(10),
					backgroundColor: viewOffer ? 'transparent' : '#FFF',
				}}
			>
				{date ? (
					<Text
						onPress={() => setShow(true)}
						style={{
							..._font.Medium,
							color: viewOffer ? '#FFF' : '#000',
						}}
					>
						{moment(date).format('dddd DD MMMM, YYYY')}{' '}
					</Text>
				) : (
					<Text
						style={{
							..._font.Medium,
							color: colors.lightGrey,
						}}
						onPress={() => setShow(true)}
					>
						Select Date
					</Text>
				)}
			</View>
			<View>
				{show && (
					<DateTimePicker
						testID='dateTimePicker'
						value={date || new Date()}
						mode={'date'}
						is24Hour={true}
						display='default'
						onChange={onChange}
					/>
				)}
			</View>
		</View>
	);
};

export default DatePicker;

const styles = StyleSheet.create({
	label: {
		color: colors.white,
	},
	title: { ..._font.Medium, color: colors.black },
	containerStyle: {
		height: RFValue(50),
		backgroundColor: '#FFFFFF',
		margin: 0,
		padding: 0,
	},
});
