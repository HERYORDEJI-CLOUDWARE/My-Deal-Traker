import React, { useContext, useState, useEffect } from 'react';
import {
	FlatList,
	Image,
	ScrollView,
	StyleSheet,
	Text,
	View,
	ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LogoPage from '../../../components/LogoPage';
import {
	displayError,
	fetchAuthToken,
	formatStatus,
} from '../../../utils/misc';
import appApi from '../../../api/appApi';
import colors from '../../../constants/colors';
import ListingCard from '../../../components/ListingCard';
import { AntDesign } from '@expo/vector-icons';
import { Context } from '../../../context/UserContext';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import _font from '../../../styles/fontStyles';
import { RFValue } from 'react-native-responsive-fontsize';
import SearchInputBar from '../../../components/SearchBar';

const BLSearchResult = ({ route, navigation }) => {
	const { search } = route.params;

	const {
		state: { user, b_lawyerProps },
		fetchBuyerLawyerTrans,
	} = useContext(Context);

	useFocusEffect(
		useCallback(() => {
			fetchBuyerLawyerTrans();
		}, []),
	);

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

	const ListHeader = () => (
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
					// 	b_lawyerProps
					// 		? b_lawyerProps.filter(
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
					ListHeaderComponent={<ListHeader />}
					keyExtractor={(it, ind) => ind.toString()}
					renderItem={({ item }) => {
						return (
							<React.Fragment>
								<ListingCard
									view='BLSelectedProperty'
									listNo={item.listing_number}
									status={item.status}
									city={item.city}
									item={item}
									// transId={item.real_transaction_id}
									dad={item.date_created}
								/>
							</React.Fragment>
						);
					}}
				/>
			</View>
		</LogoPage>
	);
};

export default BLSearchResult;

const styles = StyleSheet.create({
	noresult: {
		textAlign: 'center',
		fontFamily: 'pop-reg',
		fontSize: 18,
		opacity: 0.5,
	},
});
