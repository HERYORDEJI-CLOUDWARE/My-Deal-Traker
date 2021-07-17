import React, { useState, useEffect } from 'react';
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
import colors from '../../../constants/colors';
import ListingCard from '../../../components/ListingCard';
import {
	displayError,
	fetchAuthToken,
	formatStatus,
} from '../../../utils/misc';
import appApi from '../../../api/appApi';
import { AntDesign } from '@expo/vector-icons';
import { useContext } from 'react';
import { Context as UserContext } from '../../../context/UserContext';
import PropertyListingCard from '../../../components/PropertyListCard';
import moment from 'moment';
import _font from '../../../styles/fontStyles';
import { RFValue } from 'react-native-responsive-fontsize';
import LogoPage from '../../../components/LogoPage';

const SaSearchResult = ({ route, navigation }) => {
	const { search, searchItemViewScreen } = route.params;
	const {
		state: { salistings },
	} = useContext(UserContext);

	const d = [1, 2];

	const [dataSearchResult, setSearchResult] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	const getSaListing = () => {
		setIsLoading(true);
		const list = salistings
			? salistings.filter(
					(s) =>
						s.address.toLowerCase().includes(search.toLowerCase()) ||
						s.listing_number.toLowerCase().includes(search.toLowerCase()),
			  )
			: [];
		setSearchResult(list);
		setIsLoading(false);
	};

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
			setIsLoading(false);
			setSearchResult(response.data.response.data);
		} catch (error) {
			setIsLoading(false);
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

	useEffect(() => {
		// getSaListing();
		makeSearch();
	}, []);

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
					ListHeaderComponent={<ListHeader />}
					keyExtractor={(it, ind) => ind.toString()}
					renderItem={({ item }) => {
						return (
							<React.Fragment>
								<PropertyListingCard
									navigation={navigation}
									view='saSelected'
									listNo={item.listing_number}
									status={item.status}
									city={item.city}
									dad={moment(item.listing_date).format('Do MMM YYYY')}
									item={item}
								/>
							</React.Fragment>
						);
					}}
				/>
			</View>
		</LogoPage>
	);
};

export default SaSearchResult;

const styles = StyleSheet.create({
	noresult: {
		textAlign: 'center',
		fontFamily: 'pop-reg',
		fontSize: 18,
		opacity: 0.5,
	},
});
