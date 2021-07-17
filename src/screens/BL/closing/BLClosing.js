import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { ActionSheet, Toast } from 'native-base';
import colors from '../../../constants/colors';
import { Input } from 'react-native-elements';
import { RadioButton, Switch } from 'react-native-paper';
import LogoPage from '../../../components/LogoPage';
import InputBar from '../../../components/InputBar';
import { displayError, fetchAuthToken } from '../../../utils/misc';
import appApi from '../../../api/appApi';
import { useContext } from 'react';
import { Context } from '../../../context/UserContext';
import { ActivityIndicator } from 'react-native';
import { navigate } from '../../../nav/RootNav';
import { RFValue } from 'react-native-responsive-fontsize';
import _font from '../../../styles/fontStyles';

const BLClosing = ({ route, navigation }) => {
	const { property } = route.params;
	const {
		state: { user },
	} = useContext(Context);
	const [ref, setRef] = useState('');
	const [notification, setNotification] = useState('0');
	const [cellphone, setCellphone] = useState('');
	const [referralName, setReferralName] = useState('');
	const [refPhone, setRefPhone] = useState('');
	const [current_city, setCurrent_city] = useState('');
	const [currentState, setCurrentState] = useState('');
	const [currentPostal, setCurrentPostal] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const toggleSwitch = () => {
		// setIsEnabled((previousState) => !previousState)
		if (notification) {
			setNotification(0);
		} else {
			setNotification(1);
		}
	};

	const onClosing = async () => {
		try {
			setIsLoading(true);
			const token = await fetchAuthToken();
			const data = new FormData();
			data.append('referral_source', ref);
			data.append('referrer_name', referralName);
			data.append('referrer_phone', refPhone);
			data.append('cellphone', cellphone);
			data.append('city', current_city);
			data.append('state', currentState);
			data.append('postal_code', currentPostal);
			data.append('update_notification', notification);
			data.append('property_transaction_id', property.transaction_id);
			data.append('purchaser_lawyer', 1);
			data.append('user_id', user.unique_id);
			// data.append("current_address", `${current_city} ${currentState} ${currentPostal}`);
			const response = await appApi.post(`/buyer_lawyer.php`, data, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (response.data.response.status == 200) {
				Toast.show({
					type: 'success',
					text: response.data.response.message,
				});
				navigation.goBack();
			} else {
				Toast.show({
					type: 'warning',
					text: response.data.response.message,
				});
			}
			setIsLoading(false);
		} catch (error) {
			displayError(error);
			setIsLoading(false);
		}
	};
	var BUTTONS = ['Existing client', 'Bank', 'Agent', 'Cancel'];
	var CANCEL_INDEX = 3;

	/*
          <Picker mode="dropdown">
          <Picker.Item label="Select" value="" color={colors.white} />
          <Picker.Item label="Existing client" value="Existing client" />
          <Picker.Item label="Bank" value="Bank" />
          <Picker.Item label="Agent" value="Agent" />
        </Picker>
  */

	return (
		<LogoPage navigation={navigation}>
			<View>
				<Text style={styles.title}>Closing</Text>
			</View>

			<Text style={{ ..._font.Medium, ...styles.label, fontSize: RFValue(14) }}>
				Referral Source
			</Text>
			<TouchableOpacity
				onPress={() => {
					ActionSheet.show(
						{
							options: BUTTONS,
							cancelButtonIndex: CANCEL_INDEX,
							title: 'Select Referral Source',
						},
						(buttonIndex) => {
							if (buttonIndex !== CANCEL_INDEX) {
								setRef(BUTTONS[buttonIndex]);
							}
						},
					);
				}}
				style={
					{
						// height: RFValue(50),
						// marginBottom: RFValue(20),
						// backgroundColor: colors.white,
					}
				}
			>
				<InputBar editable={false} value={ref ?? ''} />
			</TouchableOpacity>

			{ref === 'Agent' ? (
				<View>
					<InputBar
						label='Referral Name'
						value={referralName}
						onChangeText={setReferralName}
						placeholderTextColor={colors.lightGrey}
					/>
					<InputBar
						label='Referral Phone'
						value={refPhone}
						onChangeText={setRefPhone}
						placeholderTextColor={colors.lightGrey}
						keyboardType='phone-pad'
					/>
				</View>
			) : null}

			<InputBar
				label={'Telephone Number'}
				value={cellphone}
				keyboardType='phone-pad'
				onChangeText={setCellphone}
			/>

			<InputBar
				label={'Current City'}
				placeholderTextColor={colors.lightGrey}
				value={current_city}
				onChangeText={setCurrent_city}
			/>

			<InputBar
				label={'States'}
				value={currentState}
				onChangeText={setCurrentState}
			/>

			<InputBar
				label={'Postal/Zip code'}
				value={currentPostal}
				onChangeText={setCurrentPostal}
			/>

			<View style={{ flexDirection: 'row', alignItems: 'center' }}>
				<View style={{ alignSelf: 'flex-start' }}>
					<Switch
						value={notification == '0' ? false : true}
						onValueChange={toggleSwitch}
						trackColor={{ false: colors.fair, true: colors.white }}
					/>
				</View>
				<Text style={{ ...styles.label, color: colors.white, flexShrink: 1 }}>
					Send me notifications for transaction update
				</Text>
			</View>

			{notification != '0' ? (
				<React.Fragment>
					<View>
						<TouchableOpacity
							style={{ flexDirection: 'row', alignItems: 'center' }}
							onPress={() => setNotification('1')}
						>
							<RadioButton
								value='1'
								status={notification == '1' ? 'checked' : 'unchecked'}
								onPress={() => setNotification('1')}
							/>
							<Text>Text </Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={{ flexDirection: 'row', alignItems: 'center' }}
							onPress={() => setNotification('2')}
						>
							<RadioButton
								value='2'
								status={notification == '2' ? 'checked' : 'unchecked'}
								onPress={() => setNotification('2')}
							/>
							<Text>Email </Text>
						</TouchableOpacity>
					</View>
				</React.Fragment>
			) : null}

			<TouchableOpacity
				style={{
					backgroundColor: colors.white,
					// alignSelf: 'center',
					alignItems: 'center',
					justifyContent: 'center',
					height: RFValue(40),
					paddingHorizontal: RFValue(30),
					borderRadius: RFValue(5),
					marginVertical: RFValue(20),
				}}
				onPress={onClosing}
			>
				<Text
					style={{
						...styles.label,
						color: colors.brown,
						fontSize: RFValue(14),
					}}
				>
					{isLoading ? 'Loading...' : 'Save'}
				</Text>
			</TouchableOpacity>

			<TouchableOpacity
				style={{
					backgroundColor: colors.brown,
					// alignSelf: 'center',
					alignItems: 'center',
					justifyContent: 'center',
					height: RFValue(40),
					paddingHorizontal: RFValue(30),
					borderRadius: RFValue(5),
					marginVertical: RFValue(20),
				}}
				onPress={() => {
					navigate('approvedOffer', { property });
				}}
			>
				<Text
					style={{
						...styles.label,
						color: colors.white,
						fontSize: RFValue(14),
					}}
				>
					View approved offer
				</Text>
			</TouchableOpacity>
		</LogoPage>
	);
};

export default BLClosing;

const styles = StyleSheet.create({
	title: { ..._font.H5, color: colors.white },
	label: {
		color: colors.white,
	},
});
