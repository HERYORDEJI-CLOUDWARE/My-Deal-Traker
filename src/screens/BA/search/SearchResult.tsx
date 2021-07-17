import React, { useEffect, useState } from 'react';
import {
	ActivityIndicator,
	FlatList,
	Image,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../../constants/colors';
import ListingCard from '../../../components/ListingCard';
import { AntDesign } from '@expo/vector-icons';
import LogoPage from '../../../components/LogoPage';
import {
	displayError,
	fetchAuthToken,
	formatStatus,
} from '../../../utils/misc';
import appApi from '../../../api/appApi';
import moment from 'moment';
import ListEmptyComponent from '../../../components/ListEmptyComponent';
import { createTrue } from 'typescript';
import _font from '../../../styles/fontStyles';
import { RFValue } from 'react-native-responsive-fontsize';
import SearchInputBar from '../../../components/SearchBar';

const SearchResult = ({ route, navigation }) => {
	const { search, searchScreen, searchItemViewScreen } = route.params;

	const d = [1, 2];
	const [dataSearchResult, setSearchResult] = useState([]);
	const [isLoading, setisLoading] = useState(true);

	useEffect(() => {
		makeSearch();
	}, []);

	const makeSearch = async () => {
		try {
			const data = new FormData();
			data.append('keyword', search.toString().trim());
			const token = await fetchAuthToken();
			const response = await appApi.post(`/search_property.php`, data, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			setisLoading(false);
			setSearchResult(response.data.response.data);
		} catch (error) {
			setisLoading(false);
			displayError(error);
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
		<LogoPage>
			<View>
				<FlatList
					data={dataSearchResult}
					ListHeaderComponent={ListHeader}
					keyExtractor={(it, ind) => ind.toString()}
					ListEmptyComponent={
						<Text style={{ ..._font.Medium }}>The list is empty</Text>
					}
					renderItem={({ item }) => {
						const shared = {
							property: item.property_details ?? item,
							transaction: item.transaction_details ?? item,
							transaction_id: item.transaction_details?.transaction_id ?? item,
						};
						return (
							<React.Fragment>
								{/*<ListingCard*/}
								{/*	navigation={navigation}*/}
								{/*	listNo={item.listing_number}*/}
								{/*	listNo={item.listing_number}*/}
								{/*	status={formatStatus(item.status)}*/}
								{/*	city={item.city}*/}
								{/*	// dad={moment(jsData).format("Do MMM YYYY")}*/}
								{/*	dad={moment(item.date_created).format('MM/DD/YYYY')}*/}
								{/*	item={item}*/}
								{/*	view='selectedPropertyScreen'*/}
								{/*/>*/}

								<ListingCard
									listNo={
										item?.listing_number ??
										item?.property_details?.listing_number
									}
									status={formatStatus(
										item?.status ?? item?.property_details?.status,
									)}
									city={item?.city ?? item?.property_details?.city}
									dad={
										item?.date_created ?? item?.property_details?.date_created
									}
									item={item}
									// item={shared}
									view={searchItemViewScreen}
									// view={searchScreen}
								/>
							</React.Fragment>
						);
					}}
				/>
			</View>
		</LogoPage>
	);
};

export default SearchResult;

const styles = StyleSheet.create({
	noresult: {
		textAlign: 'center',
		fontFamily: 'pop-reg',
		fontSize: 18,
		opacity: 0.5,
	},
});
