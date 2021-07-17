import { Icon, Picker, Toast } from 'native-base';
import React, { useState } from 'react';
import {
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	Image,
	TextInput,
	ScrollView,
	Pressable,
} from 'react-native';
import colors from '../../../constants/colors';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { AntDesign } from '@expo/vector-icons';
import { useFormik } from 'formik';
import { Input } from 'react-native-elements';
import { displayError, fetchAuthToken } from '../../../utils/misc';
import appApi from '../../../api/appApi';
import { Switch, ToggleButton } from 'react-native-paper';
import { useContext } from 'react';
import { Context as UserContext } from '../../../context/UserContext';
import _font from '../../../styles/fontStyles';
import { RFValue } from 'react-native-responsive-fontsize';
import ButtonPrimaryBig from '../../../components/ButtonPrimaryBig';
import moment from 'moment';

const AddRepair = ({ transaction, property, toggleShowAddRepair }) => {
	const {
		state: { user },
	} = useContext(UserContext);
	const [date, setDate] = useState(new Date());

	const [show, setShow] = useState(false);

	const [isLoading, setIsLoading] = useState(false);
	const [ordering, setOrdering] = useState(false);

	const { values, setFieldValue, handleSubmit } = useFormik({
		initialValues: {
			dateOrdered: '',
			dateNeeded: '',
			item: '',
			condition: '',
			recommendation: '',
			memo: '',
			required: false,
			repairsNeeded: '',
			repairRecommendation: '',
		},
		onSubmit: (valuez) => {
			onSubmitRepairs();
		},
	});

	console.log(property.transaction_id, transaction.transaction_id);

	const sendRepair = async () => {
		try {
			setIsLoading(true);
			var datestr = new Date().toUTCString();
			const data = new FormData();
			/*
		{
			date_created: '2021-07-15 19:09:48',
			date_ordered: '2021-07-15 18:09:48',
			date_received: null,
			expected_delivery_date: '2021-07-17 19:09:48',
			id: '16',
			item: 'Item 1 form web',
			memo: 'Memo 1 from web',
			property_transaction_id: '60705998',
			recommended_repair: 'Rec 1 from web',
			repair_id: '133bd9260062daea7851e419f5acb400',
			required: '1',
			status: '0',
			transaction_id: 'bd5a1aae33b2c9286e1ee123cf48397c',
			}
			 */
			data.append('date_created', datestr);
			data.append('date_ordered', datestr);
			data.append('expected_delivery_date', values.dateNeeded);
			data.append('condition', values.condition);
			data.append('item', values.item);
			data.append('memo', values.memo);
			data.append('property_transaction_id', property.transaction_id);
			data.append('recommended_repair', values.recommendation);
			data.append('required', values.required ? 1 : 0);
			data.append('repairs_needed', values.required ? 1 : 0);
			data.append('transaction_id', transaction.transaction_id);
			data.append('user_id', user.unique_id);
			/*
			URL: repairs.php
			Parameters: user_id, transaction_id, property_transaction_id,
			repairs_needed(0 or 1), item, recommended_repair
			Type: POST
			 */

			const token = await fetchAuthToken();
			const response = await appApi.post(`/repairs.php`, data, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			setIsLoading(false);
			toggleShowAddRepair(false);
			// return response;
			console.log(response);
			// if (response.data.response.status == 200) {
			// 	Toast.show({
			// 		type: 'success',
			// 		text: `Repairs added successfully`,
			// 		duration: 4000,
			// 	});
			// } else {
			// 	Toast.show({
			// 		type: 'warning',
			// 		text: response.data.response.message,
			// 		duration: 4000,
			// 	});
			// }
		} catch (error) {
			setIsLoading(false);
			displayError(error);
			toggleShowAddRepair(true);
		}
	};

	console.log(values);
	// console.log(JSON.stringify(itemsArr));
	// console.log(JSON.stringify(rpArr));

	const onSubmitRepairs = async () => {
		try {
			await sendRepair();
			// const newv = [
			// 	{
			// 		item: '',
			// 		condition: '',
			// 		recommendation: '',
			// 		dateNeeded: '',
			// 		memo: '',
			// 		required: false,
			// 	},
			// ];
			// setFieldValue('recommendations', newv);
		} catch (error) {
			console.log(error);
		}
	};

	const onDateChange = (event, selectedDate, i) => {
		const currentDate = selectedDate || date;
		setShow(false);
		setDate(currentDate);
		setFieldValue('dateNeeded', currentDate);
	};

	const handleInputChange = (text, index, name) => {
		const valuez = [...values.recommendations];
		valuez[index] = { ...valuez[index], [name]: text };
		setFieldValue('recommendations', valuez);
	};

	const handleAddFields = () => {
		const valuez = [...values.recommendations];
		valuez.push({ item: '', condition: '', recommendation: '' });
		setFieldValue('recommendations', valuez);
	};

	const handleRemoveFields = (i) => {
		const valuez = [...values.recommendations];
		const newValuez = valuez.filter((item, index) => index !== i);
		setFieldValue('recommendations', newValuez);
	};

	const deleteRepairItem = (i) => {
		const valuez = [...values.recommendations];
		const filteredValues = valuez.filter((v, ind) => {
			return ind != i;
		});
		setFieldValue('recommendations', filteredValues);
	};

	const orderInspection = async () => {
		try {
			setOrdering(true);
			const token = await fetchAuthToken();
			const data = new FormData();
			data.append('seller_agent_id', property.listing_agent_id);
			data.append('buyer_agent_id', transaction.buyer_agent_id);
			data.append('transaction_id', transaction.transaction_id);
			const response = await appApi.post(`/order_inspection.php`, data, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			if (response.data.response.status == 200) {
				Toast.show({
					type: 'success',
					text: response.data.response.message,
				});
			} else {
				Toast.show({
					type: 'warning',
					text: response.data.response.message,
				});
			}
			setOrdering(false);
		} catch (error) {
			displayError(error);
			setOrdering(false);
		}
	};

	return (
		<ScrollView style={{}}>
			<View>
				<Text style={styles.title}>Add Repair</Text>
			</View>
			{values.required && show && (
				<RNDateTimePicker
					testID='dateTimePicker'
					value={values.dateNeeded || new Date()}
					mode={'date'}
					is24Hour={true}
					display='default'
					onChange={(event, selectedDate) => {
						onDateChange(event, selectedDate);
					}}
				/>
			)}

			<View style={{}}>
				<View
					style={{
						borderBottomWidth: RFValue(1),
						borderBottomColor: colors.lightGrey,
						marginBottom: RFValue(10),
					}}
				>
					<View style={styles.textInputContainer}>
						<Text style={styles.label}>Item</Text>
						<View style={styles.textInputWrapper}>
							<TextInput
								// placeholder='Item'
								// placeholderTextColor={'#ccc'}
								value={values.item}
								onChangeText={(text) => setFieldValue('item', text)}
								style={styles.textInput}
							/>
						</View>
					</View>

					<View style={styles.textInputContainer}>
						<Text style={styles.label}>Condition</Text>
						<View style={styles.textInputWrapper}>
							<TextInput
								// placeholder='Conditions'
								// placeholderTextColor={'#ccc'}
								value={values.condition}
								onChangeText={(text) => setFieldValue('condition', text)}
								style={styles.textInput}
							/>
						</View>
					</View>

					<View style={styles.textInputContainer}>
						<Text style={styles.label}>Repair Recommendation</Text>
						<View style={styles.textInputWrapper}>
							<TextInput
								// placeholder='Repair Recommendation'
								// placeholderTextColor={'#ccc'}
								value={values.recommendation}
								onChangeText={(text) => setFieldValue('recommendation', text)}
								style={styles.textInput}
							/>
						</View>
					</View>

					{/*{values.recommendations.length > 1 && (*/}
					{/*	<TouchableOpacity*/}
					{/*		style={{ marginBottom: 30 }}*/}
					{/*		onPress={() => deleteRepairItem(i)}*/}
					{/*	>*/}
					{/*		<Text>*/}
					{/*			<AntDesign name='delete' /> Remove*/}
					{/*		</Text>*/}
					{/*	</TouchableOpacity>*/}
					{/*)}*/}
				</View>
				<View style={styles.textInputContainer}>
					<Text style={styles.label}>Memo</Text>
					<View style={styles.textInputWrapper}>
						<TextInput
							// placeholder='Memo'
							// placeholderTextColor={'#ccc'}
							value={values.memo}
							onChangeText={(text) => setFieldValue('memo', text)}
							style={styles.textInput}
						/>
					</View>
				</View>
				{values.required && (
					<View style={styles.textInputContainer}>
						<Text style={styles.label}>Expected Delivery Date</Text>
						<TouchableOpacity
							onPress={() => setShow(true)}
							style={styles.textInputWrapper}
						>
							<TextInput
								// placeholder='Memo'
								// placeholderTextColor={'#ccc'}
								value={`${moment(values.dateNeeded).format('DD/MM/YYYY')}`}
								// onChangeText={(text) => setFieldValue('memo', text)}
								style={styles.textInput}
								editable={false}
							/>
						</TouchableOpacity>
					</View>
				)}
				<View style={{ flexDirection: 'row', alignItems: 'center' }}>
					<Switch
						value={values.required}
						color={colors.white}
						style={{ alignSelf: 'flex-start' }}
						onValueChange={() => {
							setFieldValue('required', !values.required);
							setShow(!show);
						}}
					/>
					<Text style={styles.text}>Required?</Text>
				</View>
				{/*<ButtonPrimaryBig*/}
				{/*	title={'+ Add More'}*/}
				{/*	disabled={isLoading}*/}
				{/*	onPress={handleAddFields}*/}
				{/*	containerStyle={{*/}
				{/*		backgroundColor: colors.lightGrey,*/}
				{/*		marginTop: RFValue(30),*/}
				{/*		height: RFValue(30),*/}
				{/*	}}*/}
				{/*	titleStyle={{ color: colors.brown }}*/}
				{/*/>*/}
				<ButtonPrimaryBig
					title={isLoading ? 'Loading...' : 'Send'}
					disabled={isLoading}
					onPress={handleSubmit}
					containerStyle={{
						backgroundColor: colors.white,
						marginTop: RFValue(30),
					}}
					titleStyle={{ color: '#000' }}
				/>
			</View>
		</ScrollView>
	);
};

export default AddRepair;

const styles = StyleSheet.create({
	label: { ..._font.Medium, color: colors.white },
	moreBtn: {
		backgroundColor: colors.white,
		alignSelf: 'flex-start',
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 20,
		marginVertical: 10,
		paddingVertical: 5,
		borderRadius: 10,
	},
	item: { marginBottom: 0 },
	title: { ..._font.H5, color: colors.white, marginBottom: RFValue(20) },
	text: { ..._font.Medium, color: colors.white },
	subtext: { ..._font.Medium, fontSize: RFValue(13) },
	textInputTitle: {
		..._font.Medium,
		color: colors.black,
		fontSize: RFValue(13),
		marginTop: RFValue(10),
	},
	containerStyle: {
		height: RFValue(50),

		backgroundColor: '#FFFFFF',
		margin: 0,
		padding: 0,
	},

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
