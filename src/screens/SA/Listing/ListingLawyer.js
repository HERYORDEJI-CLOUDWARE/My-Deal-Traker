import React, { useCallback, useEffect, useState, useContext } from 'react';
import { AntDesign } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { Card, Container, Toast } from 'native-base';
import {
	ActivityIndicator,
	TouchableOpacity,
	View,
	StyleSheet,
	Text,
} from 'react-native';
import appApi from '../../../api/appApi';
import ButtonPrimaryBig from '../../../components/ButtonPrimaryBig';
import CustomHeader from '../../../components/CustomHeader';
import ListItem from '../../../components/ListItem';
import LogoPage from '../../../components/LogoPage';
import colors from '../../../constants/colors';
import { navigate } from '../../../nav/RootNav';
import { displayError, fetchAuthToken } from '../../../utils/misc';
import { RFValue } from 'react-native-responsive-fontsize';
import _font from '../../../styles/fontStyles';
import { useNavigation } from '@react-navigation/native';
import { Context as UserContext } from '../../../context/UserContext';
import axios from 'axios';

const ListingLawyer = ({ route, navigation }) => {
	const { property } = route.params;

	const {
		state: { user },
	} = useContext(UserContext);

	const [isLoading, setIsLoading] = useState(true);
	const [isRemoving, setIsRemoving] = useState(false);
	const [propertyLawyer, setPropertyLawyer] = useState(null);

	useFocusEffect(
		useCallback(() => {
			fetchListLawyer();
		}, []),
	);

	const fetchListLawyer = async () => {
		try {
			const token = await fetchAuthToken();
			const response = await appApi.get(
				`/get_property_seller_lawyer.php?property_id=${property.transaction_id}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);
			setIsLoading(false);
			if (response.data.response.status == 200) {
				setPropertyLawyer(response.data.response.data);
			} else {
				Toast.show({
					type: 'warning',
					text: response.data.response.message,
				});
			}
		} catch (error) {
			displayError(error);
			setIsLoading(false);
		}
	};

	console.log('user', user);
	console.log('property', property);

	const removeLawyer = async () => {
		// try {
		setIsRemoving(true);
		const token = await fetchAuthToken();
		const data = new FormData();

		data.append('property_id', property.transaction_id);
		data.append('seller_agent_id', property.listing_agent_id);
		data.append('phone_email', user.email);
		/*
			URL: delete_seller_lawyer
			Parameters: property_id, seller_agent_id, phone_email
			Type: POST
			*/
		// 	const response = await appApi.post('/delete_seller_lawyer.php', data, {
		// 		headers: {
		// 			Authorization: `Bearer ${token}`,
		// 		},
		// 	});
		// 	return response;
		// } catch (error) {
		// 	displayError(error);
		// }
		//
		axios
			.post(
				'http://mydealtracker.staging.cloudware.ng/api/delete_seller_lawyer.php',
				data,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			)
			.then((res) => {
				// console.log(res.data);
				Toast.show({
					type: 'success',
					text: 'Deleted',
				});
				setIsRemoving(false);
				navigation.goBack();
			})
			.catch((err) => {
				// console.log(err);
				setIsRemoving(false);
				Toast.show({
					type: 'danger',
					text: err,
				});
			});
	};

	if (isLoading) {
		return (
			<LogoPage>
				<ActivityIndicator size='large' color={colors.white} />
			</LogoPage>
		);
	}

	if (!propertyLawyer) {
		return (
			<LogoPage navigation={navigation}>
				<View style={{ marginVertical: RFValue(30) }}>
					<Text
						style={{ ..._font.Big, color: colors.white, textAlign: 'center' }}
					>
						No lawyer has been added to this property
					</Text>

					<ButtonPrimaryBig
						title={'Add Lawyer'}
						titleStyle={{ color: colors.black }}
						onPress={() => navigate('addListingLawyer', { property })}
						containerStyle={{
							backgroundColor: colors.white,
							marginVertical: RFValue(20),
						}}
					/>
				</View>
			</LogoPage>
		);
	}

	return (
		<LogoPage navigation={navigation}>
			<View>
				<Text
					style={{
						..._font.Big,
						paddingBottom: RFValue(25),
						paddingTop: RFValue(15),
						color: colors.white,
					}}
				>
					A Lawyer has been added for this property
				</Text>
				<ListItem title='First Name' value={propertyLawyer.first_name} />
				<ListItem title='Last Name' value={propertyLawyer.last_name} />
				<ListItem title='Email' value={propertyLawyer.email} />
				<ListItem title='Phone Number' value={propertyLawyer.phone} />
			</View>
			<ButtonPrimaryBig
				disabled={isRemoving ? true : false}
				title={isRemoving ? 'Removing...' : 'Remove Lawyer'}
				containerStyle={{
					marginVertical: RFValue(20),
					backgroundColor: colors.brown,
				}}
				onPress={() => removeLawyer()}
			/>
		</LogoPage>
	);
};

export default ListingLawyer;

const styles = StyleSheet.create({
	text: {
		paddingLeft: 20,
		paddingBottom: 10,
	},
});
