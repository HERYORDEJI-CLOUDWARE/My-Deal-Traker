import React, { useCallback, useContext, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { FlatList } from 'react-native';
import ListEmptyComponent from '../../../components/ListEmptyComponent';
import LogoPage from '../../../components/LogoPage';
import TransactionListCard from '../../../components/TransactionListCard';
import {
	Context as UserContext,
	getSearchedProperty,
} from '../../../context/UserContext';
import moment from 'moment';
import { useFocusEffect } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import _font from '../../../styles/fontStyles';
import colors from '../../../constants/colors';
import { RFValue } from 'react-native-responsive-fontsize';

const SellerSearch = ({ navigation, route }) => {
	const {
		state: { sellerTrans },
		fetchSellerTrans,
	} = useContext(UserContext);

	const { search } = route.params;

	const [dataSearchResult, setSearchResult] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useFocusEffect(
		useCallback(() => {
			setIsLoading(true);
			getSearchedProperty(search).then((res) => {
				setSearchResult(res.data.response.data);
				setIsLoading(false);
			});
		}, []),
	);

	console.log('sellerTrans', sellerTrans);
	console.log('\n');
	console.log('search', search);

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
				// data={sellerTrans}
				data={dataSearchResult}
				ListEmptyComponent={<ListEmptyComponent />}
				ListHeaderComponent={ListHeader}
				renderItem={({ item }) => {
					return (
						<React.Fragment>
							<View>
								<TransactionListCard
									navigation={navigation}
									transId={item.transaction_id}
									dad={moment(item.creation_date).format('Do MMM, YYYY')}
									view='SellerSelectedProp'
									item={item}
								/>
							</View>
						</React.Fragment>
					);
				}}
			/>
		</LogoPage>
	);
};

export default SellerSearch;
