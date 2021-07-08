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
import { fetchAuthToken } from '../../utils/misc';
import moment from 'moment';
import { useFocusEffect } from '@react-navigation/native';
import {
	widthPercentageToDP as wp,
	heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';
import * as RN from 'react-native';
import * as NB from 'native-base';

const MortgageBrokerPropertyDetials = ({ navigation, route }) => {
	const { property_id, transaction_id } = route.params;
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
			.get(`/get_property_details.php?property_transaction_id=${property_id}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
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

	const init = async () => {
		await getPropertDetails();
	};

	return (
		<LogoPage navigation={navigation}>
			{loading ? (
				<View style={{ marginTop: 120 }}>
					<ActivityIndicator color='white' size='large' />
				</View>
			) : (
				<View style={styles.group}>
					<Text style={styles.textDetails}>
						Listing Number: {properties.current[0].listing_number}{' '}
					</Text>
					<Text style={styles.textDetails}>
						Property Type:{' '}
						{properties.current[0].property_type == 0
							? 'Commercial'
							: 'Residential'}{' '}
					</Text>
					<Text style={styles.textDetails}>
						Listing Date:{' '}
						{moment(properties.current[0].date_created).format('MM/DD/YYYY')}
					</Text>
					<Text style={styles.textDetails}>
						Listing Type:{' '}
						{properties.current[0].listing_type == 0 ? 'Sale' : 'Lease'}{' '}
					</Text>
					<Text style={styles.textDetails}>
						Property Address: {properties.current[0].property_address}{' '}
					</Text>
					<Text style={styles.textDetails}>
						Property Price: {properties.current[0].listing_price}{' '}
					</Text>
					<Text style={styles.textDetails}>
						Possession: {properties.current[0].possession}{' '}
					</Text>
					<Text style={styles.textDetails}>
						Property Details: {properties.current[0].property_details}{' '}
					</Text>
					<Text style={styles.textDetails}>
						Major Intersection: {properties.current[0].major_intersection}{' '}
					</Text>
					<Text style={styles.textDetails}>
						Major Nearest Town: {properties.current[0].major_nearest_town}{' '}
					</Text>
					<Text style={styles.textDetails}>
						Occupancy:{' '}
						{properties.current[0].occupancy == 0 ? 'Owner' : 'Occupied'}{' '}
					</Text>
					<Text style={styles.textDetails}>
						Closing Date:{' '}
						{moment(properties.current[0].closing_date).format('MM/DD/YYYY')}{' '}
					</Text>
				</View>
			)}
		</LogoPage>
	);
};

styles = StyleSheet.create({
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
	group: {
		backgroundColor: colors.black,
		width: wp(80),
		justifyContent: 'center',
		alignSelf: 'center',
		padding: 20,
	},
});

export default MortgageBrokerPropertyDetials;
