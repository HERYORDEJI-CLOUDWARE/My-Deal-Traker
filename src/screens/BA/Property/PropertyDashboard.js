import { Card, Container, Header, Text, Toast } from 'native-base';
import React from 'react';
import { useState, useContext, useEffect, useCallback, useRef } from 'react';
import {
	Image,
	StyleSheet,
	TouchableOpacity,
	View,
	Dimensions,
	ScrollView,
	ActivityIndicator,
} from 'react-native';
import * as RN from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import colors from '../../../constants/colors';
import Closing from '../Closing/Closing';
import Conditions from '../Conditions/Conditions';
import Report from '../Report/Report';
import PropertyTab from './PropertyTab';
import moment from 'moment';
import { navigate } from '../../../nav/RootNav';
import { AntDesign } from '@expo/vector-icons';
import LogoPage from '../../../components/LogoPage';
import { formatStatus } from '../../../utils/misc';
import CustomHeader from '../../../components/CustomHeader';
import appApi from '../../../api/appApi';
import { fetchAuthToken } from '../../../utils/misc';
import { RFValue } from 'react-native-responsive-fontsize';
import _font from '../../../styles/fontStyles';
import _colors from '../../../constants/colors';
import axios from 'axios';
import { getRandomProperties } from '../../../context/UserContext';

const { width, height } = Dimensions.get('window');

const PropertyDashboard = ({
	property,
	transaction,
	isLoading,
	transactionStarted,
	fetchTransaction,
	setSelected,
	navigation,
	route,
}) => {
	const [view, setView] = useState('');
	const [mortgageBroker, setMortgageBroker] = useState(undefined);
	const [loadingBroker, setLoadingBroker] = React.useState(true);

	// const [buyerAgentResponse, setBuyerAgentResponse] = useState([])
	const buyerAgentResponse = useRef({});
	const [loading, setLoading] = useState(true);
	// const {transaction_id} = route.params

	// console.log(transaction, '\n \n', property);

	const checkBuyerAgent = async () => {
		setLoadingBroker(true);
		const token = await fetchAuthToken();
		const data = new FormData();
		// transaction ? // console.log(transaction.transaction_id) : // console.log("empty")
		// // console.log(transaction.transaction_id)
		appApi
			.get(
				`/get_property_mortgage_broker.php?transaction_id=${
					transaction?.transaction_id ?? property?.transaction_id
				}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			)
			.then((res) => {
				let response = res.data.response.data;
				setMortgageBroker({
					broker: response,
				});
				buyerAgentResponse.current = response;
				setLoadingBroker(false);
			})
			.catch((err) => {
				console.log('API conection failed');
				setLoadingBroker(false);
			});
	};

	const getBroker = async () => {
		try {
			const token = await fetchAuthToken();
			const res = await appApi.get(
				`/get_property_mortgage_broker.php?transaction_id=${transaction?.transaction_id}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);
			return res;
		} catch (err) {
			console.log('API conection failed');
		}
	};

	// useEffect(() => {
	// 	setLoadingBroker(true);
	// 	getBroker().then((res) => {
	// 		// let response = res.response.data;
	// 		setMortgageBroker(res.data.response.data);
	// 		setLoadingBroker(false);
	// 		console.log('mortgageBroker..., ', res.data.response.data);
	// 	});
	// }, []);

	useFocusEffect(
		useCallback(() => {
			setLoadingBroker(true);
			getBroker().then((res) => {
				// let response = res.response.data;
				setMortgageBroker(res.data.response.data);
				setLoadingBroker(false);
				// console.log('mortgageBroker..==., ', res.data.response.data);
			});
		}, []),
	);

	// console.log(mortgageBroker);

	let rendered = <View style={{ minHeight: 160 }} />;

	if (view === 'property') {
		rendered = (
			<PropertyTab
				property={property}
				transaction={transaction}
				isLoading={isLoading}
				setSelected={setSelected}
			/>
		);
	}

	if (view === 'closing') {
		rendered = <Closing />;
	}

	if (view === 'conditions') {
		rendered = <Conditions transaction={transaction} property={property} />;
	}

	if (view === 'report') {
		rendered = <Report />;
	}

	if (loadingBroker) {
		return (
			<LogoPage>
				<ActivityIndicator size='large' color={colors.white} />
			</LogoPage>
		);
	}

	return (
		<LogoPage>
			<React.Fragment>
				<View
					style={{
						flexDirection: 'row',
						// justifyContent: "space-around",
					}}
				>
					<View style={styles.topWrapper}>
						<View style={styles.statusWrapper}>
							<Text style={styles.statusKey}>Status:</Text>
							<Text style={styles.statusValue}>
								{formatStatus(property.status)}
							</Text>
						</View>
						<Text style={styles.date}>
							{moment(property.date_created).format('MM/DD/YYYY')}
						</Text>
					</View>
				</View>

				<View style={{}}>
					<TouchableOpacity
						activeOpacity={0.9}
						onPress={() =>
							navigate('baPropertyInfo', {
								property,
								transaction,
								isLoading,
								fetchTransaction,
							})
						}
						style={styles.box}
					>
						<Text style={styles.boxTitle}>Property</Text>
						<AntDesign
							name='right'
							size={RFValue(15)}
							color={_colors.lightBrown}
						/>
					</TouchableOpacity>
					<TouchableOpacity
						activeOpacity={0.9}
						onPress={() => {
							if (!transaction) {
								return Toast.show({
									text: 'You have not shown interest in this property',
									type: 'danger',
									duration: 4500,
								});
							}
							navigate('baConditions', { transaction, property });
							// setView("conditions")
						}}
						style={styles.box}
					>
						<Text style={styles.boxTitle}>Conditions</Text>
						<AntDesign
							name='right'
							size={RFValue(15)}
							color={_colors.lightBrown}
						/>
					</TouchableOpacity>
					{/* <View style={{ marginTop: 35 }} /> */}
					{transaction && (
						<TouchableOpacity
							activeOpacity={0.9}
							onPress={() =>
								navigate('baLawyerView', { transaction: transaction, property })
							}
							style={styles.box}
						>
							<Text style={styles.boxTitle}>Lawyer</Text>
							<AntDesign
								name='right'
								size={RFValue(15)}
								color={_colors.lightBrown}
							/>
						</TouchableOpacity>
					)}
					{transaction && (
						<TouchableOpacity
							activeOpacity={0.9}
							onPress={() =>
								navigate('fileUpload', { transaction: transaction })
							}
							style={styles.box}
						>
							<Text style={styles.boxTitle}>Files and uploads</Text>
							<AntDesign
								name='right'
								size={RFValue(15)}
								color={_colors.lightBrown}
							/>
						</TouchableOpacity>
					)}
					<RN.View>
						<TouchableOpacity
							activeOpacity={0.9}
							onPress={() =>
								navigate('viewMortgageBroker', {
									transaction: transaction,
									property: property,
								})
							}
							// onPress={() => {
							// 	if (mortgageBroker !== null) {
							// 		navigate('viewMortgageBroker', {
							// 			buyerAgentResponse: mortgageBroker,
							// 		});
							// 	} else {
							// 		navigate('addMortgageBroker', {
							// 			transaction: transaction,
							// 			property: property,
							// 		});
							// 	}
							// }}
							style={styles.box}
						>
							<Text style={styles.boxTitle}>Mortgage Broker</Text>
							<AntDesign
								name='right'
								size={RFValue(15)}
								color={_colors.lightBrown}
							/>
						</TouchableOpacity>
						{/* <TouchableOpacity
								activeOpacity={0.9}
								onPress={() =>
									navigate('addMortgageBroker', {
										transaction: transaction,
										property: property,
									})
								}
								style={styles.box}
							>
								<Text style={styles.boxTitle}>Add Mortgage Broker</Text>
								<AntDesign
									name='right'
									size={RFValue(15)}
									color={_colors.lightBrown}
								/>
							</TouchableOpacity> */}
						{/* )} */}
					</RN.View>
					{/* )} */}
				</View>

				<View>{rendered}</View>
			</React.Fragment>
		</LogoPage>
	);
};

export default PropertyDashboard;

const styles = StyleSheet.create({
	box: {
		padding: RFValue(20),
		paddingVertical: RFValue(10),
		alignItems: 'center',
		backgroundColor: '#FFF',
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: RFValue(20),
	},
	boxTitle: {
		..._font.Big,
		textAlign: 'center',
		color: colors.brown,
		fontSize: RFValue(18),
	},
	statusWrapper: { flexDirection: 'row' },
	statusKey: {
		..._font.Medium,
		// fontSize: 20,
		color: colors.white,
		paddingRight: RFValue(10),
	},
	statusValue: {
		..._font.Medium,
		// fontSize: 20,
		color: colors.white,
		fontFamily: 'pop-semibold',
	},
	topWrapper: { marginBottom: RFValue(20) },
	date: { ..._font.Medium, color: colors.white },
});
