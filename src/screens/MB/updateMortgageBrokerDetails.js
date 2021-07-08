import React, { useState, useContext } from 'react';
import {
	View,
	Text,
	SafeAreaView,
	Platform,
	StyleSheet,
	TouchableOpacity,
	Switch,
	Image,
} from 'react-native';
// import {Picker as SelectPicker} from 'native-base'
import { Picker } from '@react-native-picker/picker';

import colors from '../../constants/colors';
import LogoPage from '../../components/LogoPage';
import { TextInput } from 'react-native-gesture-handler';
import { Context as UserContext } from '../../context/UserContext';
import { fetchAuthToken } from '../../utils/misc';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import {
	widthPercentageToDP as wp,
	heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const UpdateMortgageBroker = ({ route, navigation }) => {
	const [referral, setReferral] = useState('');
	const [phone, setPhone] = useState('');
	const [city, setCity] = useState('');
	const [state, setState] = useState('');
	const [postalCode, setPostalCode] = useState('');
	const [referrerName, setReferrerName] = useState('');
	const [referrerPhone, setReferrerPhone] = useState('');
	const [notification, setNotification] = useState(false);
	const [showReferral, setShowReferral] = useState(false);
	const [selectedLanguage, setSelectedLanguage] = useState();

	const {
		state: { user },
	} = useContext(UserContext);

	const navigate = useNavigation();

	const { transaction_id, property_id } = route.params;
	const backIcon = require('../../../assets/arrow.png');

	const ReferralView = () => {
		if (showReferral === false) {
			setShowReferral(true);
		} else {
			setShowReferral(true);
		}
	};

	const submitHandler = async () => {
		const token = await fetchAuthToken();

		const data = new FormData();
		data.append('user_id', user.unique_id);
		data.append('email', user.email);
		data.append('property_transaction_id', property_id);
		data.append('transaction_id', transaction_id);
		data.append('city', city);
		data.append('state', state);
		data.append('postal_code', postalCode);
		data.append('referral_source', referral);
		data.append('cellphone', phone);
		data.append('update_notification', notification);
		data.append('referrer_name', referrerName);
		data.append('referrer_phone', referrerPhone);

		//    // console.log(data)
		axios
			.post(
				'http://mydealtracker.staging.cloudware.ng/api/mortgage_broker.php',
				data,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			)
			.then((res) => {
				// console.log(res.data)
			})
			.catch((err) => {
				// console.log(err)
			});
	};

	return (
		<View style={styles.container}>
			<View style={{ marginHorizontal: 20, marginTop: 40 }}>
				<TouchableOpacity onPress={() => navigation.goBack()}>
					<Image
						source={backIcon}
						style={{ width: 23, height: 23, marginBottom: 5 }}
					/>
				</TouchableOpacity>
				<Text style={{ color: 'white', fontSize: 18 }}>
					Choose Referral Source
				</Text>
				<TouchableOpacity style={{ marginTop: -20 }} onPress={ReferralView}>
					<Picker
						selectedValue={referral}
						style={
							Platform.OS == 'ios' ? styles.referralIOS : styles.referralAndroid
						}
						onValueChange={(itemValue, itemIndex) => setReferral(itemValue)}
					>
						<Picker.Item label='Existing Client' value='Existing Client' />
						<Picker.Item label='Bank' value='Bank' />
						<Picker.Item label='Agent' value='Agent' />
					</Picker>
				</TouchableOpacity>
			</View>

			<View style={{ marginHorizontal: 20, marginTop: -10 }}>
				<Text
					style={{
						fontWeight: 'bold',
						fontSize: 20,
						color: colors.white,
						marginBottom: 5,
					}}
				>
					Phone Number
				</Text>
				<TextInput
					placeholder={'phone number'}
					style={styles.phoneInput}
					onChangeText={(text) => {
						setPhone(text);
					}}
				/>
			</View>
			<View style={{ marginLeft: 20 }}>
				<Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.white }}>
					Current Address
				</Text>
				<TextInput
					style={styles.addressFields}
					placeholder={'City / Town'}
					onChangeText={(text) => {
						setCity(text);
					}}
				/>
				<TextInput
					style={styles.addressFields}
					placeholder={'State'}
					onChangeText={(text) => {
						setState(text);
					}}
				/>
				<TextInput
					style={styles.addressFields}
					placeholder={'Postal Code'}
					onChangeText={(text) => {
						setPostalCode(text);
					}}
				/>

				<View style={{ marginTop: 5, flexDirection: 'row' }}>
					<Switch
						trackColor={{ false: '#767577', true: '#81b0ff' }}
						thumbColor={notification ? '#f5dd4b' : '#f4f3f4'}
						ios_backgroundColor='#3e3e3e'
						onValueChange={setNotification}
						value={notification}
					/>
					<Text style={{ color: colors.white, marginTop: 4, marginLeft: 3 }}>
						Send me notifications for transaction updates
					</Text>
				</View>
				{showReferral === true ? (
					<View>
						<View>
							<Text
								style={{
									color: colors.white,
									fontWeight: 'bold',
									fontSize: 18,
								}}
							>
								Referrer Name
							</Text>
							<TextInput
								placeholder={'referrer name'}
								style={styles.addressFields}
								onChangeText={(text) => setReferrerName(text)}
							/>
						</View>
						<View>
							<Text
								style={{
									color: colors.white,
									fontWeight: 'bold',
									fontSize: 18,
								}}
							>
								Referrer Phone
							</Text>
							<TextInput
								placeholder={'referrer phone'}
								style={styles.addressFields}
								onChangeText={(text) => setReferrerPhone(text)}
							/>
						</View>
					</View>
				) : null}
				<TouchableOpacity style={styles.sendButton} onPress={submitHandler}>
					<Text
						style={{ fontSize: 18, fontWeight: 'bold', color: colors.white }}
					>
						{' '}
						Send
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.waiveFinancingButton}
					onPress={() =>
						navigation.navigate('mortgageFinancing', {
							transaction_id: transaction_id,
						})
					}
				>
					<Text
						style={{ color: colors.white, fontSize: 18, textAlign: 'center' }}
					>
						Waive Financing
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: colors.lightBrown,
		flex: 1,
		padding: 20,
	},
	phoneInput: {
		backgroundColor: colors.white,
		height: hp(6),
		padding: hp(1.3),
		borderRadius: 7,
		fontSize: hp(2.3),
		width: wp(78),
	},
	addressFields: {
		backgroundColor: colors.white,
		fontSize: hp(2.3),
		width: wp(78),
		height: hp(6),
		borderRadius: 7,
		marginTop: 5,
		padding: 10,
		marginBottom: 5,
	},
	sendButton: {
		height: hp(7),
		width: wp(78),
		marginTop: 10,
		backgroundColor: colors.white,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: colors.brown,
		borderRadius: 7,
	},
	waiveFinancingButton: {
		marginTop: 10,
		alignSelf: 'center',
		padding: 3,
		borderBottomColor: colors.white,
		borderWidth: 2,
		borderRightColor: colors.lightBrown,
		borderLeftColor: colors.lightBrown,
		borderTopColor: colors.lightBrown,
	},
	referralIOS: {
		height: hp(10),
		width: wp(50),
		color: colors.white,
		marginBottom: hp(6),
	},
	referralAndroid: {
		height: hp(10),
		width: wp(50),
		color: colors.white,
	},
});

export default UpdateMortgageBroker;
