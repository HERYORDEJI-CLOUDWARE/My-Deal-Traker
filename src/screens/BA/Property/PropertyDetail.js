import React, { useEffect, useContext, useState, useCallback } from 'react';
import {
	Dimensions,
	StyleSheet,
	Text,
	View,
	Image,
	ScrollView,
	TouchableOpacity,
	RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import appApi from '../../../api/appApi';
import colors from '../../../constants/colors';
import { useNavigation } from '@react-navigation/native';
import {
	displayError,
	fetchAuthToken,
	formatListType,
	numberWithCommas,
	propertyType,
} from '../../../utils/misc';
import { Context as UserContext } from '../../../context/UserContext';
import { Card, Toast } from 'native-base';
import moment from 'moment';
import { useFocusEffect } from '@react-navigation/native';
import ListItem from '../../../components/ListItem';
import { RFValue } from 'react-native-responsive-fontsize';
import ButtonPrimaryBig from '../../../components/ButtonPrimaryBig';
import { navigate } from '../../../nav/RootNav';

const { width } = Dimensions.get('window');

const wait = (timeout) => {
	return new Promise((resolve) => {
		setTimeout(resolve, timeout);
	});
};

const PropertyDetails = ({
	move,
	property,
	makeOffer,
	transactionStarted,
	theTransaction,
	setSelected,
	hideBtn,
}) => {
	const {
		state: { user },
	} = useContext(UserContext);

	const navigation = useNavigation();

	const [requestingShow, setRequestingShow] = useState(false);

	const [transaction, setTheTransaction] = useState(theTransaction);

	const [refreshing, setRefreshing] = React.useState(false);

	const onRefresh = React.useCallback(async () => {
		setRefreshing(true);
		await fetchTransaction();
		wait(2000).then(() => setRefreshing(false));
	}, []);

	const fetchTransaction = async () => {
		try {
			const token = await fetchAuthToken();
			const data = new FormData();
			data.append('buyer_agent_id', user.unique_id);
			data.append(
				'property_transaction_id',
				property?.transaction_id ?? transaction?.transaction_id,
			);
			const response = await appApi.post(
				`/fetch_transaction_with_id.php`,
				data,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);
			if (response.data.response.status == 200) {
				setTheTransaction(response.data.response.data[0]);
			} else {
				Toast.show({
					type: 'warning',
					text: response.data.response.message,
				});
			}
		} catch (error) {
			displayError(error);
		}
	};

	const requestShow = async () => {
		try {
			setRequestingShow(true);
			const token = await fetchAuthToken();
			const data = new FormData();
			data.append('user_id', user.unique_id);
			data.append(
				'property_transaction_id',
				property?.transaction_id ?? transaction?.transaction_id,
			);
			data.append(
				'requesting_agent_realtor',
				property?.realtor ?? transaction?.realtor,
			);
			data.append('transaction_id', transaction?.transaction_id);
			data.append('branch', property?.list_branch ?? transaction?.list_branch);
			const response = await appApi.post(`/submit_show_request.php`, data, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			setRequestingShow(false);
			await fetchTransaction();
			if (response.data.response.status == 200) {
				Toast.show({
					type: 'success',
					text: response.data.response.message,
					duration: 4000,
				});
			} else {
				Toast.show({
					type: 'warning',
					text: response.data.response.message,
					duration: 4000,
				});
			}
		} catch (error) {
			setRequestingShow(false);
			displayError(error);
		}
	};

	const checkOccupancy = (key) => {
		switch (key) {
			case '0':
				return 'Owner occupied';
			case '1':
				return 'Tenant occupied';
			case '2':
				return 'Vacant';
			default:
				return 'Unknown';
		}
	};

	useFocusEffect(
		useCallback(() => {
			fetchTransaction();
		}, []),
	);

	return (
		<>
			{/*<ScrollView*/}
			{/*  refreshControl={*/}
			{/*    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />*/}
			{/*  }*/}
			{/*>*/}
			<View style={{ marginBottom: RFValue(30) }}>
				<ListItem title='Transaction ID' value={transaction?.transaction_id} />
				<ListItem title='Listing #' value={property?.listing_number} />
				<ListItem title='Type' value={propertyType(property?.property_type)} />
				<ListItem
					title='Listing Date'
					value={moment(property?.date_created).format('MM/DD/YYYY')}
				/>
				<ListItem
					title='Listing Type'
					value={formatListType(property?.listing_type)}
				/>
				<ListItem title='Address:' value={property?.property_address} />
				<ListItem title='City:' value={property?.city} />
				<ListItem title='Details' value={property?.property_details} />
				<ListItem
					title='Price'
					value={numberWithCommas(property?.listing_price)}
				/>
				<ListItem
					title='Major Intersection'
					value={property?.major_intersection}
				/>
				<ListItem
					title='Major Nearest Town'
					value={property?.major_nearest_town}
				/>
				<ListItem
					title='Occupancy'
					value={checkOccupancy(property?.occupancy)}
				/>
				<ListItem title='Possession' value={property?.possession} />
				{property?.possession === 'Other' ? (
					<ListItem title='Possession Date' value={property?.possession_date} />
				) : null}
			</View>

			{!hideBtn ? (
				<React.Fragment>
					{!transaction ? (
						<ButtonPrimaryBig
							containerStyle={{
								backgroundColor: colors.brown,
								marginBottom: RFValue(20),
							}}
							title={'Interested in this Property?'}
							onPress={move}
						/>
					) : null}
					{transaction && transaction.show_property_approval_status == '0' ? (
						<React.Fragment>
							<View style={{}}>
								<ButtonPrimaryBig
									containerStyle={{
										backgroundColor: colors.brown,
										marginBottom: RFValue(20),
									}}
									disabled={requestingShow}
									title={
										requestingShow
											? 'Loading...'
											: transaction.show_property_status == '0'
											? 'Request to Show Property'
											: 'Request to see property, pending approval'
									}
									onPress={requestShow}
								/>
							</View>
						</React.Fragment>
					) : null}
					{transaction && transaction.make_offer_initiation_status == '0' ? (
						<React.Fragment>
							<ButtonPrimaryBig
								containerStyle={{ backgroundColor: colors.fair }}
								disabled={requestingShow}
								title={'Make an offer?'}
								onPress={() => {
									makeOffer();
								}}
							/>
						</React.Fragment>
					) : (
						<React.Fragment>
							{transaction && (
								<ButtonPrimaryBig
									containerStyle={{ backgroundColor: colors.fair }}
									disabled={requestingShow}
									title={'View Offer'}
									onPress={() =>
										navigate('baViewOffer', {
											property,
											theTransaction: transaction,
										})
									}
								/>
							)}
						</React.Fragment>
					)}
				</React.Fragment>
			) : null}

			<View style={{ marginVertical: 30 }} />
			{/*</ScrollView>*/}
		</>
	);
};

export default PropertyDetails;

const styles = StyleSheet.create({
	box: {
		width: width / 2.5,
		padding: 15,
		alignItems: 'center',
		justifyContent: 'center',
	},
	boxText: {
		textAlign: 'center',
		color: colors.brown,
		fontSize: 24,
	},
	listTitle: {
		padding: 10,
		fontSize: 20,
		color: colors.black,
		textAlign: 'left',
		fontWeight: 'bold',
		// width: width * 0.4
	},
	listValue: {
		padding: 10,
		fontSize: 20,
		color: colors.white,
		textAlign: 'left',
		// width: width * 0.4
	},
	label: {
		color: colors.bgBrown,
	},
	btn: {
		backgroundColor: colors.white,
		alignSelf: 'center',
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderRadius: 10,
		elevation: 1,
	},
});
