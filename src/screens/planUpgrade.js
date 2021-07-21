import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
	ActivityIndicator,
	Modal,
	Pressable,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import colors from '../constants/colors';
import DropDownPicker from 'react-native-dropdown-picker';
import _font from '../styles/fontStyles';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import ButtonPrimaryBig from '../components/ButtonPrimaryBig';
import { RFValue } from 'react-native-responsive-fontsize';
import * as NB from 'native-base';
import { WebView } from 'react-native-webview';
import { payPalHtml } from '../components/PayPalWeb';
import { displayError, fetchAuthToken } from '../utils/misc';
import appApi from '../api/appApi';
import LogoPage from '../components/LogoPage';
import HomeHeader from '../components/HomeHeader';
import { Context as UserContext } from '../context/UserContext';

const PlanUpgrade = () => {
	const {
		state: { user },
	} = useContext(UserContext);

	const [showGateway, setShowGateway] = useState(false);
	const [prog, setProg] = useState(false);
	const [progClr, setProgClr] = useState('#000');
	const [showResponseModal, setShowResponseModal] = useState(false);
	const [paymentResponse, setPaymentResponse] = useState(undefined);
	const [paymentStatus, setPaymentStatus] = useState(undefined);

	const [paidPlans, setPaidPlans] = useState([]);
	const [loadingPlan, setLoadingPlan] = useState(null);

	const webviewRef = React.useRef(null);

	function webViewgoback() {
		if (webviewRef.current) webviewRef.current.goBack();
	}

	function webViewNext() {
		if (webviewRef.current) webviewRef.current.goForward();
	}

	function LoadingIndicatorView() {
		return (
			<ActivityIndicator
				color='#009b88'
				size='large'
				style={styles.ActivityIndicatorStyle}
			/>
		);
	}

	const [open, setOpen] = useState(false);
	const [value, setValue] = useState('Bronze');
	const [amount, setAmount] = useState({ amount: '3', time: '1 day' });
	const [items, setItems] = useState([]);
	const [selectedPlan, setSelectedPlan] = useState(null);

	const onSelectPlan = (price) =>
		setSelectedPlan(
			paidPlans?.filter((plan, index) => plan.price === price)[0],
		);

	const navigation = useNavigation();

	const paypal = require('../../assets/paypal.png');

	const getPaidPlans = async () => {
		try {
			const token = await fetchAuthToken();
			return await appApi.get(
				`https://mydealtracker.staging.cloudware.ng/admin_api/fetch_paid_plans.php`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);
		} catch (e) {
			displayError(e);
		}
	};

	const Amount = () => {
		switch (value) {
			case 'Bronze':
				setAmount({ amount: '3', time: '1 day' });
				break;
			case 'Gold':
				setAmount({ amount: '15', time: '1 day' });
				break;
			case 'Platinum':
				setAmount({ amount: '15', time: '1 year' });
				break;
			case 'Sapphire':
				setAmount({ amount: '25', time: '2 years' });
				break;
			case 'Master':
				setAmount({ amount: '75', time: '1 month' });
				break;
		}
	};

	/*
To get the data on the React Native side, we’ll use onMessage. 
Create the following function and add it to the onMessage prop:
*/

	function onMessage(e) {
		let data = e.nativeEvent.data;
		setShowGateway(false);
		let payment = JSON.parse(data);
		let {
			id,
			status,
			payer: { email_address, payer_id },
			purchase_units: [
				{
					payments: { captures },
				},
			],
		} = payment;
		if (payment.status === 'COMPLETED') {
			// Alert.alert('PAYMENT MADE SUCCESSFULLY!');
			setPaymentStatus(payment.status);
			savePayment(
				id,
				status,
				email_address,
				captures[0].id,
				captures[0].amount.value,
			).then((res) => console.log(res.data));
			setShowResponseModal(true);
			setPaymentResponse({
				heading: 'Yesss Congrats!!!',
				body: 'Payment made successfuly',
			});
		} else {
			Alert.alert('PAYMENT FAILED. PLEASE TRY AGAIN.');
			setPaymentStatus(payment.status);
			setShowResponseModal(true);
			setPaymentResponse({
				heading: 'Ooops Sorry!!!',
				body: 'Payment failed. Please try again',
			});
		}
		console.log(data);
	}

	const initialHtmlInject = () =>
		`document.getElementById("subAmount").innerHTML = "${selectedPlan?.price}"
		document.getElementById("subPlan").innerHTML = "${selectedPlan?.name}";
		`;

	const renderPaymentValidModal = (
		<Modal
			swipeDirection={'down'}
			isVisible={true}
			// isVisible={showResponseModal}
			onBackButtonPress={() => setShowResponseModal(false)}
			transparent={true}
		>
			<View
				style={{
					flex: 1,
					justifyContent: 'center',
					backgroundColor: colors.black + '99',
				}}
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
					<Text
						style={{
							...styles.fileValidModalText,
							..._font.Big,
							color: colors.brown,
						}}
					>
						{paymentResponse?.heading}
					</Text>
					<Text style={styles.fileValidModalText}>{paymentResponse?.body}</Text>
					<Pressable
						onPress={() => setShowResponseModal(false)}
						style={{
							padding: RFValue(10),
							alignItems: 'flex-end',
							paddingBottom: RFValue(0),
						}}
					>
						<Text>Okay</Text>
					</Pressable>
				</View>
			</View>
		</Modal>
	);

	const savePayment = async (
		orderId,
		orderStatus,
		payerEmail,
		paymentId,
		amountPaid,
	) => {
		try {
			const token = await fetchAuthToken();
			const data = new FormData();
			data.append('user_id', user?.unique_id);
			data.append('plan_id', selectedPlan?.unique_id);
			//
			data.append('order_status', orderStatus);
			data.append('email', payerEmail);
			data.append('payment_id', paymentId);
			data.append('order_id', orderId);
			data.append('amount', amountPaid);
			const response = await appApi.post(`/plan_subscription.php`, data, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			/*
			URL: plan_subscription.php
			Parameters: user_id, plan_id, order_status, email, payment_id, payer_id,
									order_id, amount_paid
			Type: POST
			 */
			return response;
		} catch (e) {
			displayError(e);
		}
	};

	const verifyPayment = async () => {
		try {
			const token = await fetchAuthToken();
			const response = await appApi.get(
				`/get_plan_details.php?plan_id=${selectedPlan.unique_id}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);
			/*
			URL: get_plan_details.php
			Parameter: plan_id
			Type: GET
			 */
			return response;
		} catch (e) {
			displayError(e);
		}
	};

	useFocusEffect(
		useCallback(() => {
			setLoadingPlan(true);
			// Amount();
			getPaidPlans().then((res) => {
				const response = res.data.response.data;
				const _response = response.map((res, index) => ({
					name: res.name,
					description: res.description,
					maximum: res.maximum,
					period: res.period,
					period_length: res.period_length,
					price: res.price,
				}));
				setPaidPlans(response);
				setLoadingPlan(false);
				console.log('getPaidPlans', response);
			});
		}, []),
	);

	if (loadingPlan) {
		return (
			<NB.Container style={styles.container}>
				<ActivityIndicator color={colors.white} size={'large'} />
			</NB.Container>
		);
	}

	return (
		<NB.Container style={styles.container}>
			<NB.Content contentContainerStyle={styles.cardView}>
				<View style={styles.cardHeader}>
					<Text style={styles.cardHeaderText}>Plan Subscription</Text>
				</View>
				<View style={styles.cardBody}>
					{selectedPlan ? (
						<View>
							<Text style={{ ..._font.Medium, color: colors.lightBrown }}>
								CAD {selectedPlan.price} for {selectedPlan?.period_length}{' '}
								{selectedPlan?.period}
								{selectedPlan?.period_length > 1 && 's'}
							</Text>
							<Text
								style={{
									..._font.Big,
									marginVertical: RFValue(10),
									color: colors.brown,
								}}
							>
								{selectedPlan?.name} Plan
							</Text>
							<Text style={{ ..._font.Medium, color: colors.fair }}>
								Number of available listing in plan: {selectedPlan?.maximum}
							</Text>
							<Text style={{ ..._font.Medium, color: colors.fair }}>
								Allows rollover?{' '}
								{selectedPlan?.allow_rollover === '0' ? 'No' : 'Yes'}
							</Text>
						</View>
					) : (
						<View>
							<Text
								style={{
									..._font.Big,
									marginVertical: RFValue(10),
									color: colors.brown,
									textAlign: 'center',
								}}
							>
								Kindly select a plan from the dropdown list below
							</Text>
						</View>
					)}
					<View
						style={{
							marginTop: RFValue(20),
							backgroundColor: 'White',
							// flex: 1,
							zIndex: 10000,
							marginTop: RFValue(40),
						}}
					>
						<DropDownPicker
							loading={loadingPlan}
							schema={{
								label: 'name',
								value: 'price',
							}}
							dropDownDirection={'TOP'}
							itemKey={'name'}
							open={open}
							value={value}
							items={paidPlans}
							setOpen={setOpen}
							setValue={setValue}
							setItems={setItems}
							// maxHeight={RFValue(200)}
							onChangeValue={(value) => onSelectPlan(value)}
							zIndex={100000}
							style={{
								// flex: 1,
								zIndex: 10000,
								borderWidth: RFValue(2),

								// backgroundColor:'grey',
								borderColor: colors.lightBrown,
								backgroundColor: colors.brown,
								// height: RFValue(209),
							}}
							containerStyle={{
								// flex: 1,
								zIndex: 10000,
								backgroundColor: colors.brown,
								borderWidth: 0,
								borderRadius: 10,
							}}
							textStyle={{
								..._font.Small,
								fontSize: RFValue(14),
								color: colors.black,
							}}
							labelStyle={{
								..._font.Small,
								fontSize: RFValue(14),
								color: colors.white,
							}}
							arrowIconStyle={{
								color: colors.white,
							}}
						/>
					</View>
					<ButtonPrimaryBig
						title={'Subscribe'}
						onPress={() => setShowGateway(true)}
						containerStyle={{
							height: RFValue(40),
							width: '100%',
							marginTop: RFValue(20),
						}}
					/>
					{/* <TouchableOpacity
						onPress={() => navigation.navigate('subPaymentPage')}
						style={{
							flexDirection: 'row',
							height: hp(4),
							paddingTop: 6,
							padding: 5,
							marginTop: hp(3),
							backgroundColor: colors.brown,
							borderRadius: 5,
						}}
					>
						<Text
							style={{ ..._font.Medium, color: colors.white, marginRight: 10 }}
						>
							Sub
						</Text>
						<Image source={paypal} style={{ width: wp(18), height: hp(2) }} />
					</TouchableOpacity> */}
				</View>
			</NB.Content>
			{showResponseModal && renderPaymentValidModal}
			{showGateway ? (
				<Modal
					visible={showGateway}
					onDismiss={() => setShowGateway(false)}
					onRequestClose={() => setShowGateway(false)}
					animationType={'fade'}
					// transparent={false}
					backgroundColor={colors.lightBrown}
					statusBarTranslucent={true}
				>
					<View style={styles.webViewCon}>
						<View style={styles.wbHead}>
							<TouchableOpacity
								style={{ padding: RFValue(13) }}
								onPress={() => setShowGateway(false)}
							>
								<NB.Icon
									type='Feather'
									name={'x'}
									style={{ color: colors.white, fontSize: RFValue(20) }}
								/>
							</TouchableOpacity>
							<Text
								style={{
									..._font.Medium,
									color: colors.white,
									flex: 1,
									textAlign: 'center',
								}}
							>
								Payment Portal
							</Text>
							<View style={{ padding: 13 }}>
								<NB.Icon
									type='Feather'
									name={'rotate-cw'}
									style={{ color: colors.white, fontSize: RFValue(20) }}
								/>
							</View>
						</View>
						<WebView
							// source={{ html: payPalHtml_ }}
							// source={{ uri: '192.168.100.33:3000' }}
							source={{ uri: 'https://mydealtracker-2021.web.app' }}
							style={{ flex: 1 }}
							renderLoading={LoadingIndicatorView}
							startInLoadingState={true}
							ref={webviewRef}
							injectedJavaScript={initialHtmlInject()}
							onLoadStart={() => {
								setProg(true);
								setProgClr('#000');
							}}
							onLoadProgress={() => {
								setProg(true);
								setProgClr('#00457C');
							}}
							onLoadEnd={() => {
								setProg(false);
							}}
							onLoad={() => {
								setProg(false);
							}}
							onMessage={onMessage}
						/>
					</View>
				</Modal>
			) : null}
		</NB.Container>
	);
};

// const initialHtmlInject =
// 	() => `document.getElementsByClassName( 'App' ).createElement = <PayPalButton
// 				createOrder={(data, actions) => _createOrder(data, actions)}
// 				onApprove={(data, actions) => _onApprove(data, actions)}
// 				onCancel={() => _onError('Canceled')}
// 				onError={(err) => _onError(err)}
// 			/>
// `;

const styles = StyleSheet.create({
	container: {
		// flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: colors.bgBrown,
		padding: RFValue(20),
		paddingTop: RFValue(50),
	},

	cardView: {
		// width: wp(80),
		// height: hp(60),
		borderRadius: 10,
		flex: 1,
	},

	cardHeader: {
		backgroundColor: colors.white,
		marginBottom: RFValue(5),
		padding: RFValue(10),
		justifyContent: 'center',
		alignItems: 'center',
		borderTopRightRadius: RFValue(5),
		borderTopLeftRadius: RFValue(5),
	},

	cardHeaderText: {
		..._font.H6,
		color: colors.brown,
	},

	cardBody: {
		backgroundColor: colors.white,
		borderBottomRightRadius: RFValue(5),
		borderBottomLeftRadius: RFValue(5),
		alignItems: 'center',
		padding: RFValue(20),
	},
	webViewCon: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		// padding: RFValue(10),
		// paddingHorizontal: RFValue(30),
		// paddingBottom: RFValue(30),
	},
	wbHead: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: colors.lightBrown,
		zIndex: 25,
		paddingTop: RFValue(20),
	},
	fileValidModalText: { ..._font.Medium, color: colors.brown },
	ActivityIndicatorStyle: {
		flex: 1,
		justifyContent: 'center',
	},
});

export default PlanUpgrade;

const plans = [
	{
		allow_rollover: '0',
		created_by: 'jsduisdjksd8933jjs3',
		date_created: '2021-02-03 04:36:30',
		date_updated: '2021-03-27 18:31:41',
		description: 'This is a Bronze plan',
		id: '4',
		maximum: '50',
		name: 'Bronze',
		period: 'day',
		period_length: '1',
		price: '3',
		unique_id: '60ab37fd106b4c086e6c1643a69f0243',
	},
	{
		allow_rollover: '0',
		created_by: 'jsduisdjksd8933jjs3',
		date_created: '2021-02-03 04:38:21',
		date_updated: '2021-03-27 18:30:25',
		description: 'This is a Gold plan',
		id: '5',
		maximum: '75',
		name: 'Gold',
		period: 'day',
		period_length: '1',
		price: '15',
		unique_id: 'eb8d4b2794eb6a1f0a0dbd2ef907de45',
	},
	{
		allow_rollover: '0',
		created_by: 'jsduisdjksd8933jjs3',
		date_created: '2021-02-03 04:40:30',
		date_updated: '2021-03-27 18:31:19',
		description: 'Platinum plan',
		id: '6',
		maximum: '100',
		name: 'Platinum',
		period: 'day',
		period_length: '1',
		price: '15',
		unique_id: '8bfaf857732b49ede44f837b6492ac90',
	},
	{
		allow_rollover: '0',
		created_by: '84934yyyey3738238',
		date_created: '2021-02-03 13:18:07',
		date_updated: '2021-03-27 18:31:30',
		description: 'Extraordinary plan',
		id: '7',
		maximum: '120',
		name: 'Sapphire',
		period: 'year',
		period_length: '2',
		price: '25',
		unique_id: 'a552ac9385f854e403dff10214174196',
	},
	{
		allow_rollover: '0',
		created_by: '84934yyyey3738238',
		date_created: '2021-01-28 13:49:31',
		date_updated: '2021-03-27 18:31:51',
		description: 'Master plan',
		id: '3',
		maximum: '150',
		name: 'Master',
		period: 'month',
		period_length: '1',
		price: '75',
		unique_id: 'c89aa2880290114883422cb3b75249a8',
	},
];
