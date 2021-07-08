import { useFocusEffect } from '@react-navigation/native';
import { Card } from 'native-base';
import React, { useCallback, useEffect, useState } from 'react';
import { useContext } from 'react';
import {
	Alert,
	FlatList,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import * as NB from 'native-base';
import { FAB } from 'react-native-paper';
import HomeHeader from '../../../components/HomeHeader';
import ListEmptyComponent from '../../../components/ListEmptyComponent';
import LogoPage from '../../../components/LogoPage';
import PropertyListingCard from '../../../components/PropertyListCard';
import colors from '../../../constants/colors';
import { Context as UserContext } from '../../../context/UserContext';
import { navigate } from '../../../nav/RootNav';
import moment from 'moment';
import { ActivityIndicator } from 'react-native';
import _font from '../../../styles/fontStyles';
import { RFValue } from 'react-native-responsive-fontsize';

const SAHomepage = ({ navigation }) => {
	const [search, setSearch] = useState('');
	const [isLoading, setIsLoading] = useState(true);

	const {
		state: { user, salistings, subStatus },
		fetchSAListings,
		fetchSubStatus,
	} = useContext(UserContext);

	const init = async () => {
		try {
			await fetchSAListings(user.unique_id);
			// let kk = 	await fetchSAListings(user.unique_id);
			await fetchSubStatus(user.unique_id);
			setIsLoading(false);
		} catch (error) {}
	};

	const available_listing = subStatus?.total_allowed_listings_in_active_plans;
	const onAddNewListing = () => {
		if (available_listing < 1) {
			return Alert.alert(
				'Limit reached',
				'You need to upgrade your current plan to add more listings',
				[
					{
						text: 'Upgrade',
						onPress: () => navigate(''),
					},
					{
						text: 'Cancel',
					},
				],
			);
		}
		navigate('addNewListing');
	};

	const renderFab = () => (
		<FAB style={styles.fab} small icon='plus' onPress={onAddNewListing} />
	);

	const ListHeader = (
		<React.Fragment>
			<HomeHeader
				search={search}
				setSearch={setSearch}
				searchScreen={'saSearchScreen'}
				text='Your listings'
				subStatus={subStatus}
			/>
		</React.Fragment>
	);

	useFocusEffect(
		useCallback(() => {
			init();
		}, []),
	);

	if (isLoading) {
		return (
			<LogoPage>
				{ListHeader}
				<ActivityIndicator size='large' color={colors.white} />
			</LogoPage>
		);
	}

	return (
		<LogoPage dontShow={true} fab={renderFab}>
			<>
				<FlatList
					data={salistings}
					contentContainerStyle={{ paddingBottom: RFValue(20) }}
					ListHeaderComponent={ListHeader}
					ListEmptyComponent={
						<ListEmptyComponent info='Create a new listing to get started' />
					}
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
			</>
			{/* <NB.Fab
				// placement={'top-right'}
				icon={
					<NB.Icon
						color='white'
						type={'AntDesign'}
						name={'plus'}
						style={{ fontSize: RFValue(20) }}
					/>
				}
				label={
					<Text style={{ ..._font.Medium, color: colors.fairGrey }}>
						BUTTON
					</Text>
				}
			/> */}
		</LogoPage>
	);
};

export default SAHomepage;

const styles = StyleSheet.create({
	noresult: {
		textAlign: 'center',
		fontFamily: 'pop-reg',
		fontSize: 18,
		opacity: 0.9,
		color: colors.white,
	},
	subBtn: {
		borderWidth: 1,
		paddingVertical: 10,
		paddingHorizontal: 5,
		borderRadius: 10,
		borderColor: colors.bgBrown,
		elevation: 2,
		backgroundColor: colors.white,
		alignSelf: 'center',
	},
	fab: {
		position: 'absolute',
		marginBottom: RFValue(10),
		width: RFValue(60),
		height: RFValue(60),
		borderRadius: RFValue(50),
		backgroundColor: colors.brown,
		alignItems: 'center',
		justifyContent: 'center',
		right: 0,
		bottom: 0,
	},
});
