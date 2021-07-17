import React, { useEffect, useCallback, useRef, useState } from 'react';
import {
	View,
	Text,
	StyleSheet,
	SafeAreaView,
	ActivityIndicator,
} from 'react-native';
import colors from '../../constants/colors';
import LogoPage from '../../components/LogoPage';
import appApi from '../../api/appApi';
import {
	fetchAuthToken,
	formatListType,
	numberWithCommas,
	propertyType,
} from '../../utils/misc';
import moment from 'moment';
import { useFocusEffect } from '@react-navigation/native';
import {
	widthPercentageToDP as wp,
	heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';
import * as RN from 'react-native';
import * as NB from 'native-base';
import ListItem from '../../components/ListItem';

const MortgageBrokerPropertyDetials = ({ navigation, route }) => {
	const { property, transaction } = route.params;
	const [loading, setLoading] = useState(true);
	// const [properties, setProperties] = useState([])
	const properties = useRef({});

	useEffect(() => {
		getPropertDetails();
	}, [properties]);

	useFocusEffect(
		useCallback(() => {
			init();
		}, []),
	);

	const getPropertDetails = async () => {
		const token = await fetchAuthToken();
		appApi
			.get(
				`/get_property_details.php?property_transaction_id=${property.transaction_id}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			)
			.then((res) => {
				// console.log(res.data.response.data);
				const data = res.data.response.data;
				properties.current = data;
				setLoading(false);
			})
			.catch((err) => {
				// console.log(err);
			});
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

	const init = async () => {
		await getPropertDetails();
	};

	if (loading) {
		return (
			<LogoPage dontShow={true}>
				<RN.ActivityIndicator size='large' color={colors.white} />
			</LogoPage>
		);
	}
	return (
		<LogoPage navigation={navigation}>
			<>
				<View style={{ marginBottom: RFValue(30) }}>
					<ListItem
						title='Transaction ID'
						value={transaction?.transaction_id}
					/>
					<ListItem title='Listing Number' value={property?.listing_number} />
					<ListItem
						title='Property Type'
						value={propertyType(property?.property_type)}
					/>
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
						<ListItem
							title='Possession Date'
							value={property?.possession_date}
						/>
					) : null}
					<ListItem
						title='Closing Date'
						value={moment(properties.current[0].closing_date).format(
							'MM/DD/YYYY',
						)}
					/>
				</View>
			</>
		</LogoPage>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.bgBrown,
	},
	textDetails: {
		fontSize: hp(2.5),
		fontWeight: 'bold',
		//    paddingLeft:hp(5),
		marginBottom: 10,
		color: colors.white,
	},
	group: {},
});

export default MortgageBrokerPropertyDetials;
