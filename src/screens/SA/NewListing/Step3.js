import { Toast } from 'native-base';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { Input } from 'react-native-elements';
import { Switch } from 'react-native-paper';
import DatePicker from '../../../components/DatePicker';
import GoBack from '../../../components/GoBack';
import colors from '../../../constants/colors';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { fetchAuthToken } from '../../../utils/misc';
import appApi from '../../../api/appApi';
import { RadioButton } from 'react-native-paper';
import _font from '../../../styles/fontStyles';
import { RFValue } from 'react-native-responsive-fontsize';
import InputBar from '../../../components/InputBar';
import ButtonPrimaryBig from './../../../components/ButtonPrimaryBig';
import { Content } from 'native-base';

const Step3 = ({
	next,
	back,
	onSave,
	progress,
	goto2,
	values,
	handleChange,
	setFieldValue,
	isLoading,
	progressBar,
}) => {
	const onToggleSwitch = () =>
		setFieldValue('notification', !values.notification);

	const [selectedItems, setSelectedItems] = useState([]);
	const [sellersList, setSellersList] = useState([]);

	useEffect(() => {
		fetchSellers();
	}, []);

	const selectRef = useRef('');

	const fetchSellers = async () => {
		try {
			const token = await fetchAuthToken();
			const response = await appApi.get(`/get_user_with_role.php?role_id=2`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			const nl = [];
			if (response.data.response.status == 200) {
				response.data.response.data.map((r) =>
					nl.push({ name: r.fullname, id: r.unique_id }),
				);
			}
			setSellersList(nl);
		} catch (error) {}
	};

	const onSelectedItemsChange = (selectedItems) => {
		setSelectedItems(selectedItems);
		setFieldValue('sellerName', JSON.stringify(selectedItems));
	};

	const editPurchaserInfo = (value, index, field) => {
		const oldValues = [...values.sellerInfo];
		oldValues[index][field] = value;
		setFieldValue('sellerInfo', oldValues);
	};

	const onClickSave = () => {
		if (
			!values.realtor ||
			!values.listBranch ||
			!values.address ||
			!values.city
		) {
			return Toast.show({
				type: 'danger',
				text: 'All fields are required',
				duration: 4000,
			});
		}

		onSave();
	};

	return (
		<Content contentContainerStyle={{ paddingBottom: RFValue(60) }}>
			{/* <GoBack back={goto2} /> */}

			<View style={{}}>
				<Text
					style={{
						color: colors.white,
						marginBottom: RFValue(20),
						..._font.Big,
					}}
				>
					Seller(s)
				</Text>
				{values.sellerInfo.map((s, i) => {
					return (
						<View
							key={i.toString()}
							style={{
								borderWidth: RFValue(1),
								borderColor: '#ccc',
								padding: RFValue(5),
								marginBottom: RFValue(20),
							}}
						>
							<InputBar
								label={'Seller’s Name'}
								value={s.name}
								onChangeText={(text) => editPurchaserInfo(text, i, 'name')}
							/>

							<InputBar
								label={'Seller’s Phone Number'}
								keyboardType='number-pad'
								value={s.phone}
								onChangeText={(text) => editPurchaserInfo(text, i, 'phone')}
							/>

							<InputBar
								label={'Seller’s Email'}
								keyboardType='email-address'
								autoCorrect={false}
								value={s.email}
								onChangeText={(text) => editPurchaserInfo(text, i, 'email')}
							/>
						</View>
					);
				})}

				<TouchableOpacity
					style={{
						alignSelf: 'flex-end',
						paddingVertical: RFValue(5),
						backgroundColor: colors.white,
						paddingHorizontal: RFValue(10),
						borderRadius: RFValue(5),
						marginBottom: RFValue(10),
					}}
					onPress={() => {
						const oldPur = [...values.sellerInfo];
						oldPur.push({ name: '', phone: '', email: '' });
						setFieldValue('sellerInfo', oldPur);
					}}
				>
					<Text style={{ ..._font.Medium }}>+ Add Seller</Text>
				</TouchableOpacity>

				<InputBar
					label={'Realtor'}
					value={values.realtor}
					onChangeText={handleChange('realtor')}
				/>

				<InputBar
					label={'List Branch'}
					value={values.listBranch}
					onChangeText={handleChange('listBranch')}
				/>

				<InputBar
					label={'Address'}
					value={values.address}
					onChangeText={handleChange('address')}
				/>

				<InputBar
					label={'City'}
					value={values.city}
					onChangeText={handleChange('city')}
				/>

				<DatePicker
					text={'Closing Date'}
					titleStyle={{ color: colors.white }}
					date={values.closeDate}
					setDate={(currentDate) => setFieldValue('closeDate', currentDate)}
				/>

				<View style={{ flexDirection: 'row', alignItems: 'center' }}>
					<View style={{ alignSelf: 'flex-start' }}>
						<Switch
							value={values.notification == '0' ? false : true}
							onValueChange={onToggleSwitch}
						/>
					</View>
					<Text style={{ ...styles.label, color: colors.white, flexShrink: 1 }}>
						Send me notifications for transaction update
					</Text>
				</View>

				{values.notification ? (
					<View>
						<TouchableOpacity
							style={{ flexDirection: 'row', alignItems: 'center' }}
							onPress={() => setFieldValue('notification', '1')}
						>
							<RadioButton
								value='1'
								status={values.notification == '1' ? 'checked' : 'unchecked'}
								onPress={() => setFieldValue('notification', '1')}
							/>
							<Text>Text </Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={{ flexDirection: 'row', alignItems: 'center' }}
							onPress={() => setFieldValue('notification', '2')}
						>
							<RadioButton
								value='2'
								status={values.notification == '2' ? 'checked' : 'unchecked'}
								onPress={() => setFieldValue('notification', '2')}
							/>
							<Text>Email </Text>
						</TouchableOpacity>
					</View>
				) : null}

				<View
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'space-between',
						flex: 1,
						marginVertical: RFValue(10),
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
						title={progress == 1 ? 'Saved' : isLoading ? 'Loading...' : 'Save'}
						titleStyle={{ color: progress == 1 ? colors.white : colors.black }}
						onPress={onClickSave}
						containerStyle={{
							backgroundColor: progress == 1 ? colors.brown : colors.white,
							elevation: 2,
							flex: 0.4,
						}}
					/>
				</View>
			</View>
		</Content>
	);
};

export default Step3;

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
});
