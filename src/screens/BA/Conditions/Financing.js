import { Icon, Toast } from 'native-base';
import React, { useContext, useState } from 'react';
import {
	Pressable,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	View,
	Text,
} from 'react-native';
import { RadioButton } from 'react-native-paper';
import colors from '../../../constants/colors';

import { useFormik } from 'formik';
import { Input } from 'react-native-elements';
import {
	displayError,
	fetchAuthToken,
	validateEmail,
} from '../../../utils/misc';
import * as DocumentPicker from 'expo-document-picker';
import { Context } from '../../../context/UserContext';
import appApi from '../../../api/appApi';
import _font from '../../../styles/fontStyles';
import { RFValue } from 'react-native-responsive-fontsize';
import ButtonPrimaryBig from '../../../components/ButtonPrimaryBig';
import Modal from 'react-native-modal';

const Financing = ({ transaction, route }) => {
	const [validFile, setValidFile] = useState(undefined);
	const [fileValidModal, setFileValidModal] = useState({ visible: undefined });
	const [fileDataType, setFileDataType] = useState(undefined);

	const validateDocument = (fileName) => {
		let type = fileName.substr(-3);
		if (type == 'pdf') {
			setFileDataType('application/pdf');
			setValidFile(true);
			setFileValidModal({ visible: false });
		} else if (type == 'png') {
			setFileDataType('image/png');
			setValidFile(true);
			setFileValidModal({ visible: false });
		} else if (type == 'jpg') {
			setFileDataType('image/jpeg');
			setValidFile(true);
			setFileValidModal({ visible: false });
		} else if (type == 'jpeg') {
			setFileDataType('image/jpeg');
			setValidFile(true);
			setFileValidModal({ visible: false });
		} else {
			setFileDataType(undefined);
			setValidFile(false);
			setFileValidModal({ visible: true });
			waiveFinancing({});
		}
	};

	const renderFileValidModal = () => (
		<Modal
			swipeDirection={'down'}
			isVisible={fileValidModal.visible}
			onBackButtonPress={() => setFileValidModal({ visible: undefined })}
		>
			<View
				showsVerticalScrollIndicator={false}
				bounces={false}
				style={{
					// flex: 1,
					backgroundColor: '#fff',
					justifyContent: 'center',
					width: '100%',
					padding: RFValue(20),
				}}
			>
				<Text style={styles.fileValidModalText}>Wrong file format</Text>
				<Text style={styles.fileValidModalText}>
					Accepted formats are PNG, JPG, JPEG, PDF
				</Text>
				<Pressable
					onPress={() => {
						setValidFile(undefined);
						setWaiveFinancing(undefined);
						setFileValidModal({ visible: undefined });
					}}
					style={{
						padding: RFValue(10),
						alignItems: 'flex-end',
						paddingBottom: RFValue(0),
					}}
				>
					<Text>Okay</Text>
				</Pressable>
			</View>
		</Modal>
	);

	const [date, setDate] = useState(new Date());

	const {
		state: { user },
	} = useContext(Context);

	// const {transaction_id} = route.params
	const { transaction_id } = transaction;

	console.log(transaction);

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
			// if (!validFile) {
			// 	setFileValidShow({ visible: true });
			// }
			submitFinancing();
		},
	});

	const [financing, setFinancing] = useState(undefined);
	const [mortgageSource, setMortgageSource] = useState(undefined);
	const [waiveFinancing, setWaiveFinancing] = useState(undefined);

	const newSelectFinancing = (source, option, file) => {
		setFinancing(source);
		if (source === 'wf') {
			setWaiveFinancing(file);
			setMortgageSource(undefined);
		} else {
			setMortgageSource(option);
			setWaiveFinancing(undefined);
		}
	};

	console.log('transaction_id', transaction_id);

	const submitFinancing = async () => {
		try {
			setIsAddingFinance(true);
			const token = await fetchAuthToken();
			const data = new FormData();
			data.append('user_id', user.unique_id);
			data.append('transaction_id', transaction_id);
			data.append('role', user.role);
			data.append('mortgage_professional_email', brokerEmail);
			data.append(
				'mortgage_source',
				mortgageSource === 'pbd' ? '1' : mUser === 'tmp' ? '2' : 'wf',
			);
			if (waiveFinancing?.file) {
				data.append(`file`, {
					name: waiveFinancing.file.name,
					type: `${fileDataType}`,
					uri: waiveFinancing.file.uri,
				});
			}
			// data.append("transaction_id", transaction.transaction_id);
			/*
			/add_financing.php
			Type: POST
			Parameters: user_id, transaction_id, role, mortgage_professional_email(Optional),
			 						mortgage_source(Optional), file(Optional)
			*/

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

	const onChange = (event, selectedDate) => {
		const currentDate = selectedDate || date;
		setShow(false);
		setFieldValue('date', currentDate);
	};

	const onSaveBrokerEmail = async () => {
		try {
			if (!validateEmail(brokerEmail)) {
				return Toast.show({
					type: 'danger',
					text: 'Invalid email address',
				});
			}
		} catch (error) {}
	};

	const pickDoc = async (index) => {
		const result = await DocumentPicker.getDocumentAsync();
		validateDocument(result.name);
		if (result.type === 'cancel') {
			return;
		}
		setWaiveFinancing({ type: 'attachment', file: result });
	};

	const IfMortgage = (
		<View style={{ paddingLeft: RFValue(30) }}>
			<View>
				<TouchableOpacity
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						paddingVertical: RFValue(15),
					}}
					onPress={() => newSelectFinancing('ms', { type: 'pbd' })}
				>
					<Icon
						type={'Feather'}
						name={mortgageSource?.type === 'pbd' ? 'check-circle' : 'circle'}
						// onPress={() => setMUser('me')}
					/>
					<Text style={styles.subtext}>Purchaser's Bank Direct</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						paddingVertical: RFValue(10),
					}}
					onPress={() => newSelectFinancing('ms', { type: 'tmp' })}
				>
					<Icon
						type={'Feather'}
						name={mortgageSource?.type === 'tmp' ? 'check-circle' : 'circle'}
						// onPress={() => setMUser('mb')}
					/>
					<Text style={styles.subtext}>Through a Mortgage Professional</Text>
				</TouchableOpacity>
			</View>

			{mortgageSource?.type === 'tmp' ? (
				<View style={{ marginBottom: RFValue(20) }}>
					<Text style={styles.textInputTitle}>Mortgage Broker Email</Text>
					<TextInput
						style={{
							...styles.containerStyle,
							..._font.Medium,
							height: RFValue(50),
							padding: 0,
							margin: 0,
							borderWidth: 0,
							justifyContent: 'center',
							flex: 1,
							paddingHorizontal: RFValue(10),
						}}
						// placeholder='Enter your Legal Name'
						placeholderTextColor={colors.lightGrey}
						// value={user.fullname}
						// disabled
						value={brokerEmail}
						onChangeText={setBrokerEmail}
						keyboardType='email-address'
						autoCorrect={false}
						autoCapitalize='none'
						// onChangeText={handleChange("legalName")}
					/>
				</View>
			) : null}
		</View>
	);

	return (
		<View>
			<View>
				<Text style={styles.title}>Financing</Text>
			</View>

			<View>
				<View style={{}} />

				<View style={styles.fStatus}>
					<TouchableOpacity
						onPress={() => newSelectFinancing('ms', { type: '' }, { file: '' })}
						style={{ flexDirection: 'row', alignItems: 'center' }}
					>
						<Icon
							type={'Feather'}
							name={financing === 'ms' ? 'check-circle' : 'circle'}
							// onPress={() => setMUser('mb')}
						/>
						<Text style={{ color: colors.white, ...styles.text }}>
							Mortgage Source
						</Text>
					</TouchableOpacity>

					{/* {values.financeMethod === "Mortgage Source" ? (
            ) : null} */}
					<React.Fragment>{IfMortgage}</React.Fragment>

					<TouchableOpacity
						onPress={() => newSelectFinancing('wf', { type: '' }, { file: '' })}
						style={{
							flexDirection: 'row',
							alignItems: 'center',
							marginTop: RFValue(10),
						}}
					>
						<Icon
							type={'Feather'}
							name={financing === 'wf' ? 'check-circle' : 'circle'}
							// onPress={() => setMUser('mb')}
						/>
						<Text style={{ color: colors.white, ...styles.text }}>
							Waive Financing
						</Text>
					</TouchableOpacity>

					{financing === 'wf' && (
						<React.Fragment>
							{waiveFinancing?.file?.name && (
								<Text
									style={{
										..._font.Medium,
										marginTop: RFValue(20),
									}}
								>
									{waiveFinancing?.file?.name ?? ''}
								</Text>
							)}
							<TouchableOpacity
								style={{
									backgroundColor: colors.white,
									alignSelf: 'flex-start',
									paddingHorizontal: RFValue(15),
									paddingVertical: RFValue(7),
									marginLeft: RFValue(20),
									marginTop: RFValue(20),
									borderRadius: RFValue(5),
								}}
								onPress={() => pickDoc()}
							>
								<Text style={styles.subtext}>Upload document</Text>
							</TouchableOpacity>
						</React.Fragment>
					)}
					{/* {values.financeMethod === "Waive Financing" ? (
          ) : null} */}
				</View>

				<ButtonPrimaryBig
					title={isAddingFinance ? 'Loading...' : 'Save'}
					onPress={handleSubmit}
					disabled={isAddingFinance}
					containerStyle={{
						backgroundColor: colors.brown,
						marginVertical: RFValue(30),
					}}
				/>

				{/* <View
          style={{
            borderBottomWidth: 1,
            marginVertical: 20,
            paddingVertical: 10,
            alignSelf: "center",
            paddingHorizontal: 20,
          }}
        >
          <Text
            style={{
              color: colors.white,
              textAlign: "center",
              marginHorizontal: 20,
            }}
            onPress={() => setShow(true)}
          >
            {moment(values.date || new Date()).format("L")}
          </Text>
          {show && (
            <RNDateTimePicker
              testID="dateTimePicker"
              value={values.date || new Date()}
              mode={"date"}
              is24Hour={true}
              display="default"
              onChange={onChange}
            />
          )}
        </View> */}
			</View>
			{renderFileValidModal()}
		</View>
	);
};

export default Financing;

const styles = StyleSheet.create({
	title: { ..._font.H5, color: colors.white, marginBottom: RFValue(20) },
	checkPlusText: {
		alignItems: 'center',
	},
	fStatus: {},
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

	textInput: {
		..._font.Medium,
		backgroundColor: '#FFFFFF',
		height: RFValue(50),
		padding: 0,
		margin: 0,
		borderWidth: 0,
		justifyContent: 'center',
		flex: 1,
		paddingHorizontal: RFValue(10),
	},
	fileValidModalText: { ..._font.Medium, color: colors.brown },
});
