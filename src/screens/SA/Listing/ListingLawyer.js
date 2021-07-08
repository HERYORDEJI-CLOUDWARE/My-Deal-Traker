import { AntDesign } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { Card, Container, Toast } from 'native-base';
import React, { useCallback, useEffect, useState } from 'react';
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

const ListingLawyer = ({ route, navigation }) => {
	const { property } = route.params;

	const [isLoading, setIsLoading] = useState(true);
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
