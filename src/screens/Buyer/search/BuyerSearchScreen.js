import { AntDesign } from '@expo/vector-icons';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList } from 'react-native';
import { Text, View } from 'react-native';
import ListEmptyComponent from '../../../components/ListEmptyComponent';
import ListingCard from '../../../components/ListingCard';
import LogoPage from '../../../components/LogoPage';
import colors from '../../../constants/colors';
import moment from 'moment';
import { Context, getSearchedProperty } from '../../../context/UserContext';
import {
	catchError,
	displayError,
	fetchAuthToken,
	formatStatus,
} from '../../../utils/misc';
import appApi from '../../../api/appApi';
import _font from '../../../styles/fontStyles';
import { RFValue } from 'react-native-responsive-fontsize';
import { Toast } from 'native-base';
import * as RN from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const BuyerSearchScreen = ({ navigation, route }) => {
	const {
		state: { buyerTrans, user },
	} = useContext(Context);

	const { search } = route.params;
	const [dataSearchResult, setSearchResult] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	// useEffect(() => {
	// 	makeSearch();
	// }, []);

	useFocusEffect(
		useCallback(() => {
			setIsLoading(true);
			getSearchedProperty(search).then((res) => {
				setSearchResult(res.data.response.data);
				setIsLoading(false);
			});
		}, []),
	);

	console.log(dataSearchResult[0], '..');

	const makeSearch = async () => {
		try {
			setIsLoading(true);
			const token = await fetchAuthToken();
			const response = await appApi.get(
				`/fetch_transaction_for_buyer.php?buyer_email=${user.email}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);

			setSearchResult(response.data.response.data);
			setIsLoading(false);
		} catch (error) {
			setIsLoading(false);
			displayError(error);
			catchError(error);
		}
	};

	const ListHeader = (
		<>
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
				}}
			>
				<AntDesign
					name='arrowleft'
					size={30}
					onPress={() => navigation.goBack()}
				/>
				<Text
					style={{
						..._font.H4,
						color: colors.white,
						paddingHorizontal: RFValue(20),
					}}
				>
					Search
				</Text>
			</View>
			{/* <SearchInputBar /> */}
			<View style={{ marginVertical: RFValue(10) }}>
				<Text
					style={{
						..._font.Medium,
						fontFamily: 'pop-reg',
						color: colors.white,
					}}
				>
					Search Results
				</Text>
			</View>
		</>
	);

	if (isLoading) {
		return (
			<LogoPage dontShow={true}>
				{ListHeader}
				<ActivityIndicator size={'large'} color={colors.white} />
			</LogoPage>
		);
	}

	return (
		<LogoPage navigation={navigation}>
			<FlatList
				data={dataSearchResult}
				// data={dataSearchResult}
				ListEmptyComponent={<ListEmptyComponent />}
				ListHeaderComponent={ListHeader}
				keyExtractor={(it, ind) => ind.toString()}
				renderItem={({ item }) => {
					const shared = {
						property: item.property_details ?? item,
						transaction: item.transaction_details ?? item,
						// transaction_id: item.transaction_details?.transaction_id ?? item,
					};
					return (
						<React.Fragment>
							{/*<ListingCard*/}
							{/*	navigation={navigation}*/}
							{/*	transaction_id={item.transaction_details.transaction_id}*/}
							{/*	property_id={item.transaction_details.property_id}*/}
							{/*	listNo={item.property_details.listing_number}*/}
							{/*	status={formatStatus(item.property_details.status)}*/}
							{/*	city={item.property_details.city}*/}
							{/*	dad={moment(item.property_details.date_created).format(*/}
							{/*		'MM/DD/YYYY',*/}
							{/*	)}*/}
							{/*	item={shared}*/}
							{/*	view='buyerSelectedProperty'*/}
							{/*/>*/}

							<ListingCard
								navigation={navigation}
								listNo={
									item?.property_details?.listing_number ?? item?.listing_number
								}
								transId={
									item?.property_details?.transaction_id ?? item?.transaction_id
								}
								type={
									item?.property_details?.property_type ?? item?.property_type
								}
								status={formatStatus(
									item?.property_details?.status ?? item?.status,
								)}
								city={item?.property_details?.city ?? item?.city}
								dad={item?.property_details?.date_created ?? item?.date_created}
								item={shared}
								view={'buyerSelectedProperty'}
							/>
						</React.Fragment>
					);
				}}
			/>
		</LogoPage>
	);
};

export default BuyerSearchScreen;
