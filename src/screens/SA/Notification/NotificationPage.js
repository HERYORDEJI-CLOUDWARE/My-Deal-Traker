import { Card, Container, Header, Text, Toast } from 'native-base';
import React, { useCallback, useEffect } from 'react';
import {
	StyleSheet,
	TouchableOpacity,
	View,
	Dimensions,
	ActivityIndicator,
	Alert,
} from 'react-native';
import colors from '../../../constants/colors';
import { AntDesign } from '@expo/vector-icons';
import { useState } from 'react';
import { navigate } from '../../../nav/RootNav';
import {
	displayError,
	fetchAuthToken,
	numberWithCommas,
} from '../../../utils/misc';
import appApi from '../../../api/appApi';
import { useContext } from 'react';
import { Context as UserContext } from '../../../context/UserContext';
import LogoPage from '../../../components/LogoPage';
import { useFocusEffect } from '@react-navigation/native';
import moment from 'moment';
import { ScrollView } from 'react-native';
import _font from '../../../styles/fontStyles';
import { RFValue } from 'react-native-responsive-fontsize';

const { width } = Dimensions.get('window');

const NotificationPage = ({ transaction, property }) => {
	const {
		state: { user },
	} = useContext(UserContext);

	const [showMore, setShowMore] = useState(false);

	const [isLoading, setIsLoading] = useState(true);
	const [isDeclining, setIsDeclining] = useState(false);

	const [theOffer, setTheOffer] = useState('');
	const [offerForMe, setOfferForMe] = useState([]);

	const user_id = user.unique_id;

	useFocusEffect(
		useCallback(() => {
			if (transaction) {
				fetchOffer();
			}
		}, []),
	);

	const fetchOffer = async () => {
		try {
			const token = await fetchAuthToken();
			const data = new FormData();
			data.append('transaction_id', transaction.transaction_id);
			const response = await appApi.post(
				`/display_offer_per_transaction.php`,
				data,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);
			setTheOffer(response.data.response.data);
			if (response.data.response.status == 200) {
				setTheOffer(response.data.response.data);
				const myOwnOffers =
					response.data.response.data.offer_conversation_json.filter((r) => {
						return r.to_who.id == user_id;
					});
				setOfferForMe(myOwnOffers.reverse());
				setIsLoading(false);
			} else {
				Toast.show({
					type: 'warning',
					text: response.data.response.message,
				});
				setIsLoading(false);
			}
		} catch (error) {
			displayError(error);
		}
	};

	if (!transaction) {
		return (
			<LogoPage style={{ backgroundColor: colors.bgBrown }}>
				<Text style={{ textAlign: 'center', color: colors.white }}>
					No transaction in progress for this property
				</Text>
			</LogoPage>
		);
	}

	if (isLoading) {
		return (
			<Container style={{ backgroundColor: colors.bgBrown }}>
				<Header style={{ backgroundColor: colors.bgBrown }} />
				<ActivityIndicator size='large' color={colors.white} />
			</Container>
		);
	}

	if (offerForMe.length < 1) {
		return (
			<LogoPage dontShow={true}>
				<View style={{ paddingVertical: RFValue(20) }}>
					<Text
						style={{
							..._font.Medium,
							// textAlign: 'center',
							color: colors.white,
						}}
					>
						You have not received an offer for this transaction
					</Text>
				</View>
			</LogoPage>
		);
	}

	let approved = null;

	if (transaction.make_offer_status == '1') {
		approved = (
			<View style={{ paddingVertical: 30 }}>
				<AntDesign
					name='checkcircle'
					size={100}
					color={colors.white}
					style={{ alignSelf: 'center' }}
				/>
				<Text
					style={{ color: colors.white, textAlign: 'center', marginTop: 30 }}
				>
					An offer has been approved for this transaction
				</Text>
			</View>
		);
	}

	const ListItem = ({ title, value }) => (
		<View
			style={{
				// flexDirection: "row",
				flexWrap: 'wrap',
				borderWidth: 0.41,
				alignItems: 'center',
				borderColor: 'rgba(0,0,0,0.5)',
				// paddingHorizontal: 20,
			}}
		>
			<Card style={{ width: width - 45, backgroundColor: colors.bgBrown }}>
				<Text style={styles.listTitle}>{title} </Text>
			</Card>
			<Text style={styles.listValue}>{value}</Text>
		</View>
	);

	const declineOffer = async () => {
		try {
			setIsDeclining(true);
			const token = await fetchAuthToken();
			const data = new FormData();
			data.append('transaction_id', transaction.transaction_id);
			const response = await appApi.post(`/decline_make_offer.php`, data, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
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
			setIsDeclining(false);
		} catch (error) {
			displayError(error);
			setIsDeclining(false);
		}
	};

	return (
		<LogoPage dontShow={true}>
			<ScrollView>
				<View style={{ paddingHorizontal: 20 }}>
					<View style={{ flexDirection: 'row', alignItems: 'center' }}>
						<Text style={styles.title}>Make Offer Notification</Text>
						<Text style={{ color: colors.white, flex: 1, textAlign: 'right' }}>
							{moment(transaction.creation_date).format('MM/DD/YYYY')}
						</Text>
					</View>
					{/* <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ ...styles.title, fontSize: 20 }}>
              Transaction ID:
            </Text>
            <Text style={{ color: colors.white, flex: 1, textAlign: "right" }}>
              {transaction.transaction_id}
            </Text>
          </View> */}
					<ListItem
						title='Transaction ID:'
						value={transaction.transaction_id}
					/>

					{offerForMe[0].docs.length ? (
						<TouchableOpacity
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								marginTop: 30,
							}}
						>
							<AntDesign name='download' size={23} color={colors.white} />
							<Text style={{ color: colors.white, paddingLeft: 20 }}>
								Download attachment
							</Text>
						</TouchableOpacity>
					) : null}
				</View>

				{!approved ? (
					<React.Fragment>
						<View style={{ paddingHorizontal: 20 }}>
							<Text style={{ color: colors.white, textAlign: 'center' }}>
								{`${offerForMe[0].by_who.name} with email ${offerForMe[0].by_who.email} made an offer`}
							</Text>

							<Text style={{ color: colors.white }}>
								<Text style={{ color: colors.white, fontSize: 20 }}>
									Amount:{' '}
								</Text>{' '}
								{'CAD ' + numberWithCommas(offerForMe[0].by_who.price)}
							</Text>

							{offerForMe[0].note_given ? (
								<Text style={{ color: colors.white }}>
									<Text style={{ color: colors.white, fontSize: 20 }}>
										Notes:{' '}
									</Text>{' '}
									{offerForMe[0].note_given}
								</Text>
							) : null}
						</View>
						<View>
							<TouchableOpacity
								style={styles.btn}
								onPress={() => navigate('acceptOffer', { transaction })}
							>
								<Text>Accept Offer</Text>
							</TouchableOpacity>

							<TouchableOpacity
								style={{ ...styles.btn, backgroundColor: '#E4A689' }}
								onPress={() => {
									Alert.alert(
										'Confirm',
										'Are you sure you want to decline this offer?',
										[
											{
												text: 'NO',
											},
											{
												text: 'YES',
												onPress: declineOffer,
											},
										],
									);
								}}
							>
								{isDeclining ? (
									<ActivityIndicator color={colors.white} />
								) : (
									<Text>Decline Offer</Text>
								)}
							</TouchableOpacity>

							<TouchableOpacity
								style={showMore ? styles.showMoreBtn : styles.notshowMoreBtn}
								onPress={() => setShowMore(!showMore)}
							>
								<Text
									style={{
										borderWidth: 0,
										color: showMore ? colors.white : colors.black,
									}}
								>
									More options
								</Text>
								<AntDesign
									name={showMore ? 'up' : 'down'}
									style={{ marginLeft: 20 }}
								/>
							</TouchableOpacity>

							{showMore && (
								<View style={{ marginHorizontal: 40, marginTop: 20 }}>
									<Card style={{ borderRadius: 10 }}>
										{/* <Text style={styles.showMoreText}>Add Review Offer</Text> */}
										<Text
											style={styles.showMoreText}
											onPress={() =>
												navigate('baCounterOffer', { transaction, offerForMe })
											}
										>
											Counter Offer
										</Text>
										<Text style={styles.showMoreText}>
											Terminate Transaction
										</Text>
										<Text style={styles.showMoreText}>
											Download Template pdf
										</Text>
									</Card>
								</View>
							)}
						</View>
					</React.Fragment>
				) : (
					<React.Fragment>{approved}</React.Fragment>
				)}

				<Text
					onPress={() => navigate('baConditions', { transaction, property })}
					style={{
						textAlign: 'center',
						backgroundColor: colors.white,
						alignSelf: 'center',
						paddingHorizontal: 10,
						paddingVertical: 10,
						marginTop: 25,
					}}
				>
					Go to conditions{' '}
				</Text>
			</ScrollView>
		</LogoPage>
	);
};

export default NotificationPage;

const styles = StyleSheet.create({
	title: {
		color: colors.white,
		padding: 20,
		fontSize: 30,
		width: 200,
		textAlign: 'center',
	},
	btn: {
		backgroundColor: colors.white,
		paddingVertical: 10,
		borderRadius: 15,
		alignSelf: 'center',
		// paddingHorizontal: 100,
		marginTop: 30,
		elevation: 2,
		width: width * 0.8,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	showMoreBtn: {
		backgroundColor: colors.bgBrown,
		paddingVertical: 10,
		borderRadius: 15,
		alignSelf: 'center',
		// paddingHorizontal: 100,
		marginTop: 30,
		// elevation: 2,
		width: width * 0.8,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	notshowMoreBtn: {
		backgroundColor: colors.white,
		paddingVertical: 10,
		borderRadius: 15,
		alignSelf: 'center',
		// paddingHorizontal: 100,
		marginTop: 30,
		elevation: 2,
		width: width * 0.8,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
		alignItems: 'center',
		//   justifyContent: "space-around",
		borderWidth: 0,
	},
	showMoreText: {
		color: colors.brown,
		textAlign: 'center',
		paddingVertical: 7,
	},
	listTitle: {
		padding: 10,
		fontSize: 20,
		color: colors.lightGrey,
		textAlign: 'left',
		// width: width * 0.4
	},
	listValue: {
		padding: 10,
		fontSize: 17,
		color: colors.white,
		textAlign: 'left',
		// width: width * 0.4
	},
});
