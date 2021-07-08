import { useFormik } from 'formik';
import { Toast } from 'native-base';
import React, { useEffect, useRef, useState, useContext } from 'react';
import {
	KeyboardAvoidingView,
	Image,
	StyleSheet,
	View,
	Dimensions,
	Text,
	ScrollView,
	Keyboard,
	Animated,
} from 'react-native';
import { Header, Input } from 'react-native-elements';
import colors from '../../../constants/colors';
import { Context as UserContext } from '../../../context/UserContext';
import { displayError } from '../../../utils/misc';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import { AntDesign } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import GoBack from '../../../components/GoBack';
import { Platform } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import _font from './../../../styles/fontStyles';
import { Content } from 'native-base';

const { width } = Dimensions.get('window');

const NewListing = ({ navigation }) => {
	const [progressBar, setProgressBar] = useState(0.25);
	const [isLoading, setIsLoading] = useState(false);
	const {
		state: { user },
		createNewListing,
	} = useContext(UserContext);

	const scroll = useRef();

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

	const { values, handleChange, setFieldValue, handleSubmit } = useFormik({
		initialValues: {
			listNo: '',
			listSource: '',
			propertyType: '',
			propertyAddress: '',
			propertyState: '',
			propertyDetails: '',
			postCode: '',
			status: '',
			listingType: '',
			listingPrice: '',
			majorIntersection: '',
			majorNearestTown: '',
			occupancy: '',
			possession: '',
			sellerName: '',
			sellerPhone: '',
			realtor: '',
			listBranch: '',
			notification: 0,
			city: '',
			address: '',
			closeDate: '',
			possessionDate: '',
			sellerInfo: [{ name: '', phone: '', email: '' }],
		},
		onSubmit: () => {
			onSave();
		},
	});

	const sellers_names = [];
	const sellers_phones = [];
	const sellers_emails = [];

	values.sellerInfo.map((v) => {
		sellers_names.push(v.name);
		sellers_phones.push(v.phone);
		sellers_emails.push(v.email);
	});

	function sameDay(d1, d2) {
		return (
			d1.getFullYear() === d2.getFullYear() &&
			d1.getMonth() === d2.getMonth() &&
			d1.getDate() === d2.getDate()
		);
	}

	const onSave = async () => {
		try {
			if (!values.closeDate) {
				return Toast.show({
					type: 'danger',
					text: 'Please select closing date',
				});
			}
			if (values.possession === 'Other' && !values.possessionDate) {
				return Toast.show({
					type: 'danger',
					text: 'Please select possession date',
				});
			}
			if (values.possession === 'Other') {
				if (
					!sameDay(new Date(values.possessionDate), new Date(values.closeDate))
				) {
					return Toast.show({
						type: 'danger',
						text: 'Possession date cannot be before or after closing date',
						duration: 6000,
					});
				}
			}
			const weekends = [0, 6];
			if (weekends.includes(new Date(values.closeDate).getDay())) {
				return Toast.show({
					type: 'danger',
					text: 'Closing cannot be on weekends',
					duration: 6000,
				});
			}
			setIsLoading(true);
			var datestr = new Date().toUTCString();
			var closing_date_str = new Date(values.closeDate).toUTCString();
			var possession_date = new Date(values.possessionDate).toUTCString();
			const data = new FormData();
			data.append('user_id', user.unique_id);
			data.append('property_details', values.propertyDetails);
			data.append('listing_number', values.listNo);
			data.append('listing_date', datestr);
			data.append('closing_date', closing_date_str);
			data.append('property_type', values.propertyType);
			data.append('property_address', values.propertyAddress);
			data.append('listing_type', values.listingType);
			data.append('listing_price', values.listingPrice);
			data.append('major_intersection', values.majorIntersection);
			data.append('major_nearest_town', values.majorNearestTown);
			data.append('occupancy', values.occupancy);
			data.append('possession', values.possession);
			data.append('possession_date', possession_date);
			data.append('listing_source', values.listSource);

			data.append('sellers_names', JSON.stringify(sellers_names));
			data.append('sellers_cell_phones', JSON.stringify(sellers_phones));
			data.append('sellers_emails', JSON.stringify(sellers_emails));

			data.append('realtor', values.realtor);
			data.append('list_branch', values.listBranch);
			data.append('address', values.address);
			data.append('city', values.city);
			data.append('state', values.propertyState);
			data.append('postal_code', values.postCode);
			data.append('update_notification', values.notification);

			data.append('status', values.status);
			// data.append("sellers", values.sellerName);
			// data.append("sellers_cell_phone", values.sellerPhone);
			await createNewListing(data);
			setIsLoading(false);
			setProgressBar(1);
		} catch (error) {
			displayError(error);
			setIsLoading(false);
		}
	};

	const _renderStep = () => {
		switch (progressBar) {
			case 0.25:
				return (
					<Step1
						values={values}
						handleChange={handleChange}
						setFieldValue={setFieldValue}
						next={Next}
					/>
				);
			case 0.5:
				return (
					<Step2
						next={Next}
						back={Back}
						values={values}
						handleChange={handleChange}
						setFieldValue={setFieldValue}
					/>
				);
			case 0.75:
				return (
					<Step3
						next={Next}
						back={Back}
						onSave={handleSubmit}
						progress={progressBar}
						goto2={goto2}
						values={values}
						handleChange={handleChange}
						setFieldValue={setFieldValue}
						isLoading={isLoading}
						setIsLoading={setIsLoading}
					/>
				);
			case 1:
				return (
					<Step3
						next={Next}
						back={Back}
						onSave={handleSubmit}
						progress={progressBar}
						goto2={goto2}
						values={values}
						handleChange={handleChange}
						setFieldValue={setFieldValue}
					/>
				);
			default:
				break;
		}
	};

	const Next = () => {
		if (progressBar < 1) {
			setProgressBar(progressBar + 0.25);
		}
	};

	const Back = () => {
		if (progressBar > 0.25) {
			setProgressBar(progressBar - 0.25);
		}
	};

	const goto2 = () => {
		setProgressBar(0.5);
	};

	return (
		<Content
			style={{
				flex: 1,
				backgroundColor: colors.bgBrown,
				padding: RFValue(20),
				paddingTop: RFValue(40),
			}}
			// behavior={Platform.select({ ios: 'height', android: 'height' })}
		>
			{/* <View style={{}} />
			<Header
				containerStyle={{ backgroundColor: colors.bgBrown }}
				leftComponent={
					<View style={{ flexDirection: 'row', alignItems: 'center' }}>
						<AntDesign name='arrowleft' size={20} color={colors.white} />
						<Text
							style={{ color: colors.white }}
							onPress={() => navigation.goBack()}
						>
							Back
						</Text>
					</View>
				}
				centerComponent={}
			/> */}

			<View
				style={{
					padding: RFValue(0),
					alignItems: 'center',
					marginBottom: RFValue(20),
				}}
			>
				<Text style={{ ..._font.H6, color: colors.white }}>
					Add New Listing
				</Text>
			</View>

			{/* {progressBar !== 0.25 ? <GoBack back={Back} /> : <View />} */}
			{/* <View
				style={{
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
					// borderWidth:2
				}}
			>
				<Text style={styles.title}>Create New Listing</Text>
				<Image
					source={require('../../../assets/img/app_logo.png')}
					style={{
						width: 90,
						height: 90,
						opacity: 0.8,
						marginRight: 30,
						alignSelf: 'flex-end',
						marginTop: 0,
					}}
				/>
			</View> */}

			{/* <View>
				<View style={styles.transactionIdBlock}>
					<Text style={styles.transactionIdTitle}>Listing Number: </Text>
					<Text style={styles.transactionIdTitle}>{values.listNo} </Text>
				</View>
			</View> */}

			<View>
				<View style={styles.transactionProgressBlock}>
					<Text style={{ ..._font.Big }}>Transaction Details</Text>
					<View
						style={{
							width: width / 2.5,
							backgroundColor: 'rgba(45, 50, 102, 0.2)',
							borderRadius: 5,
							zIndex: -1000,
							height: 10,
						}}
					>
						<View
							style={{
								height: 10,
								width: (width / 2.5) * progressBar,
								backgroundColor: '#fff',
								borderRadius: 5,
							}}
						/>
					</View>
				</View>
			</View>

			{/* STEP VIEW BELOW */}

			<View style={{ marginTop: RFValue(10) }} />
			<>
				<ScrollView>{_renderStep()}</ScrollView>
			</>
		</Content>
	);
};

export default NewListing;

const styles = StyleSheet.create({
	title: {
		fontSize: 25,
		color: colors.white,
		width: width * 0.6,
		marginLeft: 36,
		paddingTop: 10,
	},
	transactionIdBlock: {
		flexDirection: 'row',
		paddingHorizontal: 20,
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.51)',
		marginHorizontal: 23,
		opacity: 1,
		marginTop: 0,
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
	},
	label: {
		color: colors.white,
	},
});
