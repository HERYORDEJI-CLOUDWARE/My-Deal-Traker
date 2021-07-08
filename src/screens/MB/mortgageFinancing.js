import { Text, Toast } from 'native-base';
import React, { useContext, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { RadioButton } from 'react-native-paper';
import colors from '../../constants/colors';
import LogoPage from '../../components/LogoPage';
import { useFormik } from 'formik';
import { Input } from 'react-native-elements';
import { displayError, fetchAuthToken, validateEmail } from '../../utils/misc';
import * as DocumentPicker from 'expo-document-picker';
import { Context } from '../../context/UserContext';
import appApi from '../../api/appApi';

const MortgageFinancing = ({ transaction, navigation, route }) => {
	const [date, setDate] = useState(new Date());

	const {
		state: { user },
	} = useContext(Context);

	// const {transaction_id} = route.params
	const { transaction_id } = route.params;

	const [show, setShow] = useState(false);

	const [mUser, setMUser] = useState('');
	const [brokerEmail, setBrokerEmail] = useState('');
	const [isAddingFinance, setIsAddingFinance] = useState(false);

	const { values, handleChange, setFieldValue, handleSubmit } = useFormik({
		initialValues: {
			mortgageSource: false,
			waiveFinancing: false,
			date: '',
			financeMethod: '',
			attachment: '',
			mortgageSourceInfo: mUser,
		},
		onSubmit: (valuez) => {
			submitFinancing();
		},
	});

	const submitFinancing = async () => {
		try {
			setIsAddingFinance(true);
			const token = await fetchAuthToken();
			const data = new FormData();
			data.append(
				'mortgage_source',
				mUser === 'me' ? '1' : mUser === 'mb' ? '2' : '',
			);
			data.append('mortgage_professional_email', brokerEmail);
			if (values.attachment) {
				data.append(`file`, {
					name: values.attachment.name,
					type: 'application/octet',
					uri: values.attachment.uri,
				});
			}
			// data.append("transaction_id", transaction.transaction_id);
			data.append('transaction_id', transaction_id);

			data.append('user_id', user.unique_id);
			const response = await appApi.post('/add_financing.php', data, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			// console.log(response.data)
			if (response.data.response.status == 200) {
				Toast.show({
					type: 'success',
					text: response.data.response.message,
					duration: 5000,
				});
			} else {
				Toast.show({
					type: 'warning',
					text: response.data.response.message,
					duration: 5000,
				});
			}
			// console.log(response.data)
			setIsAddingFinance(false);
		} catch (error) {
			setIsAddingFinance(false);
			displayError(error);
		}
	};

	const uploadDocs = async () => {
		const token = await fetchAuthToken();
		const data = new FormData();
		data.append('user_id', user.unique_id);
		data.append('role', user.role);
		data.append('transaction_id', transaction_id);
		if (values.attachment) {
			data.append('file', {
				name: values.attachment.name,
				type: 'application/octet',
				uri: values.attachment.uri,
			});
		}
		//   data.append('file', values.attachment)
		// console.log(data)
		appApi
			.post(`/add_financing.php`, data, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then((res) => {
				// console.log("response is set to: ", res.data)
				let response = res.data.response.data;
				Toast.show({
					type: 'success',
					text: res.data.response.message,
					duration: 5000,
				});
			})
			.catch((err) => {
				// console.log(err)
			});
	};

	const pickDoc = async (index) => {
		const result = await DocumentPicker.getDocumentAsync();
		if (result.type === 'cancel') {
			return;
		}
		setFieldValue('attachment', result);
	};

	const IfMortgage = (
		<View style={{ paddingHorizontal: 20 }}>
			<View>
				<TouchableOpacity
					style={{ flexDirection: 'row', alignItems: 'center' }}
					onPress={() => setMUser('me')}
				>
					<RadioButton
						status={mUser === 'me' ? 'checked' : 'unchecked'}
						onPress={() => setMUser('me')}
					/>
					<Text>Purchaser's Bank Direct</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={{ flexDirection: 'row', alignItems: 'center' }}
					onPress={() => setMUser('mb')}
				>
					<RadioButton
						status={mUser === 'mb' ? 'checked' : 'unchecked'}
						onPress={() => setMUser('mb')}
					/>
					<Text>Through a Mortgage Professional</Text>
				</TouchableOpacity>
			</View>

			{mUser === 'mb' ? (
				<View style={{ flexDirection: 'row' }}>
					<Input
						placeholder='Enter mortgage broker email'
						value={brokerEmail}
						onChangeText={setBrokerEmail}
						keyboardType='email-address'
						autoCorrect={false}
						autoCapitalize='none'
						placeholderTextColor={'#ccc'}
						// rightIcon={
						//   <Button
						//     title="Save"
						//     color={colors.brown}
						//     onPress={onSaveBrokerEmail}
						//   />
						// }
						style={{ fontSize: 15 }}
					/>
				</View>
			) : null}
		</View>
	);

	return (
		<LogoPage navigation={navigation}>
			<View>
				<Text style={styles.title}>Financing</Text>
			</View>

			<View>
				<View style={{ marginTop: 30 }} />

				<View style={styles.fstatus}>
					<React.Fragment>
						{values.attachment ? (
							<Text style={{ marginLeft: 20, paddingVertical: 5 }}>
								{values.attachment.name}{' '}
							</Text>
						) : null}
						<TouchableOpacity
							style={{
								backgroundColor: colors.white,
								alignSelf: 'flex-start',
								paddingHorizontal: 15,
								paddingVertical: 7,
								marginLeft: 20,
								borderRadius: 10,
							}}
							onPress={pickDoc}
						>
							<Text>Choose Document</Text>
						</TouchableOpacity>
					</React.Fragment>
				</View>

				<TouchableOpacity
					style={{
						backgroundColor: colors.brown,
						paddingVertical: 10,
						alignSelf: 'center',
						borderRadius: 10,
						marginTop: 25,
						marginRight: 200,
					}}
					onPress={uploadDocs}
					disabled={isAddingFinance}
				>
					<Text style={{ paddingHorizontal: 25, color: colors.white }}>
						{isAddingFinance ? 'Loading...' : 'Upload'}
					</Text>
				</TouchableOpacity>
			</View>
		</LogoPage>
	);
};

export default MortgageFinancing;

const styles = StyleSheet.create({
	title: {
		color: colors.white,
		fontSize: 36,
		paddingLeft: 35,
	},
	checkPlusText: {
		alignItems: 'center',
	},
	fstatus: {
		paddingHorizontal: 30,
	},
});
