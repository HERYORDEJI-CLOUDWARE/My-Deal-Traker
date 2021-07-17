import React, { useContext, useEffect, useState, useCallback } from 'react';
import {
	FlatList,
	Image,
	ActivityIndicator,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../../constants/colors';
import ListingCard from '../../../components/ListingCard';
import { AntDesign } from '@expo/vector-icons';
import appApi from '../../../api/appApi';
import moment from 'moment';
import { Context, getSearchedProperty } from '../../../context/UserContext';
import { useFocusEffect } from '@react-navigation/native';
import LogoPage from '../../../components/LogoPage';
import {
	displayError,
	fetchAuthToken,
	formatStatus,
} from '../../../utils/misc';
import _font from '../../../styles/fontStyles';
import { RFValue } from 'react-native-responsive-fontsize';
import SearchInputBar from '../../../components/SearchBar';
import ListEmptyComponent from '../../../components/ListEmptyComponent';

const SLSearchScreen = ({ route, navigation }) => {
	const { search } = route.params;

	const {
		state: { user, lawyersProp },
		fetchLawyerTrans,
	} = useContext(Context);

	const [dataSearchResult, setSearchResult] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	// useEffect(() => {
	// 	makeSearch();
	// }, []);

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

	useFocusEffect(
		useCallback(() => {
			setIsLoading(true);
			getSearchedProperty(search).then((res) => {
				setSearchResult(res.data.response.data);
				setIsLoading(false);
			});
		}, []),
	);

	// useFocusEffect(
	// 	useCallback(() => {
	// 		fetchLawyerTrans();
	// 	}, []),
	// );

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
					// data={
					// 	lawyersProp
					// 		? lawyersProp.filter(
					// 				(s) =>
					// 					s.address.toLowerCase().includes(search.toLowerCase()) ||
					// 					s.listing_number
					// 						.toLowerCase()
					// 						.includes(search.toLowerCase()) ||
					// 					s.city.toLowerCase().includes(search.toLowerCase()),
					// 		  )
					// 		: []
					// }
					data={dataSearchResult}
					ListHeaderComponent={ListHeader}
					ListEmptyComponent={<ListEmptyComponent search={true} />}
					keyExtractor={(it, ind) => ind.toString()}
					renderItem={({ item }) => {
						return (
							<React.Fragment>
								<ListingCard
									navigation={navigation}
									listNo={item.listing_number}
									listNo={item.listing_number}
									status={item.status}
									city={item.city}
									// dad={moment(jsData).format("Do MMM YYYY")}
									dad={moment(item.date_created).format('MM/DD/YYYY')}
									item={item}
									view='SLSelectedProperty'
								/>
							</React.Fragment>
						);
					}}
				/>
			</View>
		</LogoPage>
	);
};

export default SLSearchScreen;

const styles = StyleSheet.create({
	noresult: {
		textAlign: 'center',
		fontFamily: 'pop-reg',
		fontSize: 18,
		opacity: 0.5,
	},
});
