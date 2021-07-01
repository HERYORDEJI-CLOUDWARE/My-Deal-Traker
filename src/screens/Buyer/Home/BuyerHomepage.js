import React, { useCallback, useContext, useState } from 'react';
import * as RN from 'react-native';
import appApi from '../../../api/appApi';
import HomeHeader from '../../../components/HomeHeader';
import ListingCard from '../../../components/ListingCard';
import LogoPage from '../../../components/LogoPage';
import colors from '../../../constants/colors';
import { Context as UserContext } from '../../../context/UserContext';
import {
	displayError,
	fetchAuthToken,
	formatStatus,
} from '../../../utils/misc';
import { useFocusEffect } from '@react-navigation/native';
import * as NB from 'native-base';
import { RFValue } from 'react-native-responsive-fontsize';
import _font from '../../../styles/fontStyles';

const BuyerHomepage = ({ navigation }) => {
	const [search, setSearch] = useState('');

	const [isLoading, setIsLoading] = useState(true);

	const {
		state: { user, buyerTrans },
		fetchBuyerTrans,
		logout,
	} = useContext(UserContext);

	useFocusEffect(
		useCallback(() => {
			init();
		}, []),
	);

	const init = async () => {
		await fetchBuyerTrans(user.email);
		setIsLoading(false);
	};

	if (isLoading) {
		return (
			<React.Fragment>
				<LogoPage dontShow={true}>
					<RN.ActivityIndicator size='large' color={colors.white} />
				</LogoPage>
			</React.Fragment>
		);
	}

	const ListEmpty = (
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
		</React.Fragment>
	);

	return (
		<LogoPage dontShow={true}>
			<RN.FlatList
				data={buyerTrans}
				ListEmptyComponent={ListEmpty}
				ListHeaderComponent={
					<React.Fragment>
						<HomeHeader
							search={search}
							setSearch={setSearch}
							searchScreen='buyerSearchScreen'
						/>
					</React.Fragment>
				}
				keyExtractor={(item, index) => index.toString()}
				renderItem={({ item }) => {
					const shared = {
						property: item.property_details,
						transaction: item.transaction_details,
					};
					return (
						<RN.View>
							<ListingCard
								navigation={navigation}
								listNo={item.property_details.listing_number}
								status={formatStatus(item.property_details.status)}
								city={item.property_details.city}
								dad={item.property_details.date_created}
								item={shared}
								view='buyerSelectedProperty'
							/>
						</RN.View>
					);
				}}
			/>
		</LogoPage>
	);
};

export default BuyerHomepage;

const styles = RN.StyleSheet.create({
	noresult: {
		..._font.Small,
		textAlign: 'center',
		fontSize: RFValue(14),
		opacity: 0.9,
		color: colors.white,
	},
	listEmptyWrapper: {
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: RFValue(25),
	},
	listEmptyImage: {
		width: RFValue(261),
		height: RFValue(137),
		resizeMode: 'stretch',
	},
});
