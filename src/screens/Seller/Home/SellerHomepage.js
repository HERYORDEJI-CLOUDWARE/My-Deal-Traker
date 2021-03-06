import React, { useContext, useState, useCallback } from 'react';
import { FlatList } from 'react-native';
import * as RN from 'react-native';
import LogoPage from '../../../components/LogoPage';
import ListEmptyComponent from '../../../components/ListEmptyComponent';
import HomeHeader from '../../../components/HomeHeader';
import ListingCard from '../../../components/ListingCard';
import {
	displayError,
	fetchAuthToken,
	formatStatus,
} from '../../../utils/misc';
import appApi from '../../../api/appApi';
import {
	Context as UserContext,
	getRandomProperties,
	getSellerProperties,
} from '../../../context/UserContext';
import { Toast } from 'native-base';
import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native';
import colors from '../../../constants/colors';
import { View } from 'react-native';
import TransactionListCard from '../../../components/TransactionListCard';
import moment from 'moment';

const SellerHomepage = ({ navigation }) => {
	const [search, setSearch] = useState('');
	const [randomProptList, setRandomProptList] = useState(undefined);
	const [sellerProptList, setSellerProptList] = useState(undefined);

	const {
		state: { user, sellerTrans },
		fetchSellerTrans,
	} = useContext(UserContext);
	const [isLoading, setIsLoading] = useState(true);

	const init = async () => {
		try {
			await fetchSellerTrans(user.email);
			setIsLoading(false);
		} catch (error) {
			displayError(error);
			setIsLoading(false);
		}
	};

	useFocusEffect(
		useCallback(() => {
			init();
			getSellerProperties(user.email).then((res) => {
				// let resp = res;
				// let response = resp['response'];
				// let data = response['data'];
				// let { properties } = JSON.parse(data);
				setSellerProptList(res.response.data);
			});
			getRandomProperties().then((res) => {
				let resp = res;
				let response = resp['response'];
				let data = response['data'];
				let { properties } = JSON.parse(data);
				setRandomProptList(properties);
			});
		}, []),
	);

	const ListEmpty = () => {
		if (isLoading) {
			return (
				<React.Fragment>
					<LogoPage dontShow={true}>
						<RN.ActivityIndicator size='large' color={colors.white} />
					</LogoPage>
				</React.Fragment>
			);
		}
		<React.Fragment>
			<RN.View style={styles.listEmptyWrapper}>
				<RN.Image
					source={require('../../../assets/img/no_deals.png')}
					style={styles.listEmptyImage}
				/>
			</RN.View>

			<RN.Text style={styles.noresult}>
				You have no recent search/activities
			</RN.Text>
			<RN.Text style={styles.noresult}>
				Search for property to start deal
			</RN.Text>
		</React.Fragment>;
	};

	return (
		<LogoPage dontShow={true}>
			<FlatList
				data={sellerProptList ?? randomProptList}
				ListEmptyComponent={ListEmpty()}
				ListHeaderComponent={
					<React.Fragment>
						<HomeHeader
							search={search}
							setSearch={setSearch}
							searchScreen='sellerSearch'
							notSearching={false}
							searchItemViewScreen={'SellerSelectedProp'}
						/>
					</React.Fragment>
				}
				keyExtractor={(item, index) => index.toString()}
				renderItem={({ item }) => {
					const shared = {
						property: item.property_details ?? item,
						transaction: item.transaction_details ?? item,
						transaction_id: item.transaction_details?.transaction_id ?? item,
					};
					return (
						<TransactionListCard
							navigation={navigation}
							// transId={item.transaction_id}
							dad={moment(item.creation_date).format('Do MMM, YYYY')}
							view='SellerSelectedProp'
							item={item}
							listNo={
								item?.property_details?.listing_number ?? item?.listing_number
							}
							status={formatStatus(
								item?.property_details?.status ?? item?.status,
							)}
							city={item?.property_details?.city ?? item?.city}
							// dad={item?.property_details?.date_created ?? item?.date_created}
							// item={shared}
							// view='buyerSelectedProperty'
						/>
					);
				}}
			/>
		</LogoPage>
	);
};

export default SellerHomepage;
