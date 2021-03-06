import { Picker, Toast, Icon } from 'native-base';
import React, { useContext, useState } from 'react';
import {
	StyleSheet,
	TextInput,
	TouchableOpacity,
	View,
	Text,
	Pressable,
} from 'react-native';
import { Input } from 'react-native-elements';
import colors from '../../../../../constants/colors';
import { RFValue } from 'react-native-responsive-fontsize';
import _font from '../../../../../styles/fontStyles';

// import DateTimePicker from "@react-native-community/datetimepicker";
import moment from 'moment';
import { AntDesign, Entypo } from '@expo/vector-icons';
import ReactNativeModal from 'react-native-modal';
import { useFormik } from 'formik';
import * as DocumentPicker from 'expo-document-picker';
import {
	_consologger,
	displayError,
	downloadFile,
	fetchAuthToken,
} from '../../../../../utils/misc';
import appApi from '../../../../../api/appApi';
import { Context as UserContext } from '../../../../../context/UserContext';
import LogoPage from '../../../../../components/LogoPage';
import DatePicker from '../../../../../components/DatePicker';
import ButtonPrimaryBig from '../../../../../components/ButtonPrimaryBig';

const MakePropertyOffer = ({ navigation, route }) => {
	const [date, setDate] = useState(new Date());

	const { property, theTransaction } = route.params;

	const [docUpload, setDocUpload] = useState([]);

	const [showModal, setShowModal] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [downloadProgress, setDownloadProgress] = useState(0);
	const {
		state: { user },
	} = useContext(UserContext);

	const { values, handleChange, handleSubmit, setFieldValue } = useFormik({
		initialValues: {
			legalName: '',
			nameOfSeller: '',
			purchasePrice: '',
			closingDate: '',
			document: '',
			optionalDoc: '',
			notes: '',
			multipleDocs: [],
			docUpload: [],
		},
		onSubmit: (values) => {
			if (!values.closingDate) {
				return Toast.show({
					type: 'danger',
					text: 'Select closing date',
				});
			}
			submitMakeOffer();
		},
	});

	// console.log(theTransaction)

	const submitMakeOffer = async () => {
		try {
			setIsLoading(true);
			const token = await fetchAuthToken();
			const data = new FormData();
			data.append('property_id', property.transaction_id);
			data.append('transaction_id', theTransaction.transaction_id);
			data.append('by_who_id', theTransaction.buyer_agent_id);
			data.append('to_who_id', property.listing_agent_id);
			data.append('note_given', values.notes);
			data.append('price', values.purchasePrice);
			data.append('buyer_name', values.nameOfSeller);
			data.append('file_count', values.multipleDocs.length);
			data.append('closing_date', new Date(values.closingDate).toUTCString());
			if (values.multipleDocs[0]) {
				values.multipleDocs.map((d, i) => {
					data.append(`doc${i + 1}`, {
						name: d.name,
						type: 'application/octet',
						uri: d.uri,
					});
				});
			}
			const response = await appApi.post(`/make_offer_new.php`, data, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			setIsLoading(false);
			if (response.data.response.status == 200) {
				Toast.show({
					type: 'success',
					text: response.data.response.message,
					duration: 5000,
				});
				navigation.goBack();
			} else {
				Toast.show({
					type: 'warning',
					text: `$...{response.data.response.message}`,
					duration: 5000,
				});
			}
		} catch (error) {
			displayError(error);
			setIsLoading(false);
		}
	};

	const selectDoc = async () => {
		const result = await DocumentPicker.getDocumentAsync();
		// if (result.type !== 'cancel') {
		// 	return;
		// }
		// const list = docUpload.map((doc) => JSON.stringify(doc));
		setDocUpload([...docUpload, result]);
		setFieldValue('multipleDocs', [...docUpload, result]);
	};

	const cls = () => _consologger(values.multipleDocs);

	const deleteDoc = (uri) => {
		const docs = docUpload.filter(
			(doc) => doc.uri !== uri && doc.type !== 'cancel',
		);
		setDocUpload(docs);
		setFieldValue('multipleDocs', [...docs]);
	};

	return (
		<LogoPage>
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'space-between',
					borderWidth: 0,
				}}
			>
				<Text
					style={{
						..._font.H5,
						color: colors.white,
					}}
				>
					Submit An Offer
				</Text>
				{/*<TouchableOpacity style={{}} onPress={() => setShowModal(true)}>*/}
				{/*	<Entypo*/}
				{/*		name='dots-three-vertical'*/}
				{/*		size={RFValue(20)}*/}
				{/*		color={colors.white}*/}
				{/*	/>*/}
				{/*</TouchableOpacity>*/}
			</View>

			<View style={{ paddingVertical: RFValue(20) }}>
				<View style={{ marginBottom: RFValue(20) }}>
					<Text style={styles.title}>Your Legal Name</Text>
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
						value={user.fullname}
						disabled
						// onChangeText={handleChange("legalName")}
					/>
				</View>

				<View style={{ paddingBottom: 20 }}>
					<Text style={styles.title}>Name of Buyer</Text>
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
						// placeholder='Enter Name of Buyer'
						placeholderTextColor={colors.lightGrey}
						value={values.nameOfSeller}
						onChangeText={handleChange('nameOfSeller')}
					/>
				</View>

				<View style={{ paddingBottom: 20 }}>
					<Text style={styles.title}>Purchase Price</Text>
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
						// placeholder='Enter amount you are offering to pay'
						placeholderTextColor={colors.lightGrey}
						keyboardType='number-pad'
						value={values.purchasePrice}
						onChangeText={handleChange('purchasePrice')}
					/>
				</View>

				<View style={{ paddingBottom: 20 }}>
					<Text style={styles.title}>Notes (optional)</Text>
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
						// placeholder='Optional Notes'
						placeholderTextColor={colors.lightGrey}
						value={values.notes}
						onChangeText={handleChange('notes')}
					/>
				</View>

				<View>
					<DatePicker
						text='Closing Date'
						date={values.closingDate}
						setDate={(currentDate) => setFieldValue('closingDate', currentDate)}
					/>
				</View>

				<View style={{ marginBottom: RFValue(20) }}>
					<Text style={styles.title}>Upload Purchase Agreement Doc</Text>
					{docUpload.map((d, ind) => {
						return (
							d.type !== 'cancel' && (
								<View
									key={ind}
									style={{
										...styles.containerStyle,
										..._font.Medium,
										height: RFValue(50),
										padding: 0,
										margin: 0,
										borderWidth: 0,
										justifyContent: 'space-between',
										flex: 1,
										paddingHorizontal: RFValue(10),
										paddingRight: RFValue(1),
										marginBottom: RFValue(5),
										flexDirection: 'row',
										alignItems: 'center',
									}}
								>
									<Text style={{ ..._font.Medium }}>{d.name} </Text>
									<Pressable
										onPress={() => deleteDoc(d.uri)}
										style={{
											backgroundColor: colors.lightBrown,
											height: RFValue(48),
											width: RFValue(50),
											alignItems: 'center',
											justifyContent: 'center',
										}}
									>
										<Icon
											name={'delete'}
											type={'Feather'}
											style={{ color: 'red', fontSize: RFValue(23) }}
										/>
									</Pressable>
								</View>
							)
						);
					})}
				</View>

				<ButtonPrimaryBig
					title={'Add Document'}
					onPress={selectDoc}
					containerStyle={{
						backgroundColor: colors.fair,
						width: RFValue(200),
						height: RFValue(40),
						alignSelf: 'center',
					}}
				/>

				{/*<ButtonPrimaryBig*/}
				{/*	title={'Document'}*/}
				{/*	onPress={cls}*/}
				{/*	// onPress={selectDoc}*/}
				{/*	containerStyle={{*/}
				{/*		backgroundColor: colors.fair,*/}
				{/*		width: RFValue(200),*/}
				{/*		height: RFValue(40),*/}
				{/*		alignSelf: 'center',*/}
				{/*	}}*/}
				{/*/>*/}
				<ButtonPrimaryBig
					title={isLoading ? 'Submitting...' : 'Submit'}
					onPress={handleSubmit}
					containerStyle={{
						backgroundColor: !values.closingDate
							? colors.fair + '50'
							: colors.brown,
						marginVertical: RFValue(20),
					}}
				/>
			</View>
			<ReactNativeModal
				isVisible={showModal}
				onBackdropPress={() => setShowModal(false)}
				onBackButtonPress={() => setShowModal(false)}
			>
				<View
					style={{
						backgroundColor: colors.white,
						paddingVertical: 20,
						paddingHorizontal: 10,
					}}
				>
					<TouchableOpacity
						style={{
							flexDirection: 'row',
							alignItems: 'center',
							paddingVertical: 10,
							marginBottom: 20,
						}}
						onPress={async () => {
							setShowModal(false);
							await downloadFile(
								`https://picsum.photos/400`,
								'image.png',
								(progress) => {
									setDownloadProgress(progress);
								},
							);
						}}
					>
						<AntDesign name='download' color='#000' size={20} />

						<Text style={{ paddingLeft: 10 }}>
							Download Template {downloadProgress ? downloadProgress : null}{' '}
						</Text>
					</TouchableOpacity>
					<Text
						style={{
							backgroundColor: colors.bgBrown,
							textAlign: 'center',
							paddingVertical: 10,
							color: colors.white,
						}}
						onPress={() => setShowModal(false)}
					>
						CLOSE
					</Text>
				</View>
			</ReactNativeModal>
		</LogoPage>
	);
};

export default MakePropertyOffer;

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
});
