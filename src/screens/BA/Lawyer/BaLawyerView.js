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
import CustomHeader from '../../../components/CustomHeader';
import ListItem from '../../../components/ListItem';
import LogoPage from '../../../components/LogoPage';
import colors from '../../../constants/colors';
import { navigate } from '../../../nav/RootNav';
import { displayError, fetchAuthToken } from '../../../utils/misc';
import { RFValue } from 'react-native-responsive-fontsize';
import _font from '../../../styles/fontStyles';
import ButtonSecondaryBig from '../../../components/ButtonSecondaryBig';

const BaLawyerView = ({ route, notAgent, navigation }) => {
	const { transaction } = route.params;

	const [isLoading, setIsLoading] = useState(true);
	const [transactionLawyer, setTransactionLawyer] = useState(null);

	useFocusEffect(
		useCallback(() => {
			fetchListLawyer();
		}, []),
	);

	const fetchListLawyer = async () => {
		try {
			const token = await fetchAuthToken();
			const response = await appApi.get(
				`/get_property_buyer_lawyer.php?transaction_id=${transaction.transaction_id}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);
			setIsLoading(false);
			if (response.data.response.status == 200) {
				setTransactionLawyer(response.data.response.data);
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
			<LogoPage dontShow={true} style={{ backgroundColor: colors.bgBrown }}>
				<ActivityIndicator size='large' color={colors.white} />
			</LogoPage>
		);
	}

	if (!transactionLawyer) {
		return (
			<LogoPage dontShow={true}>
				<View>
					<View style={{ marginTop: 50 }} />

					<Text
						style={{ ..._font.H4, color: colors.white, textAlign: 'center' }}
					>
						{'No lawyer has been added to this property'}
					</Text>

					{!notAgent && (
						<ButtonSecondaryBig
							title={'Add Lawyer'}
							onPress={() => navigate('baAddLawyer', { transaction })}
						/>
					)}
				</View>
			</LogoPage>
		);
	}

	return (
		<LogoPage dontShow={true}>
			<Text
				style={{
					..._font.Medium,
					fontSize: RFValue(14),
					paddingBottom: RFValue(25),
					paddingTop: RFValue(15),
					color: colors.white,
				}}
			>
				A Lawyer has been added for this property
			</Text>
			<View>
				<View style={{ backgroundColor: colors.bgBrown }}>
					<ListItem title='First Name' value={transactionLawyer.first_name} />
					<ListItem title='Last Name' value={transactionLawyer.last_name} />
					<ListItem title='Email' value={transactionLawyer.email} />
					<ListItem title='Phone Number' value={transactionLawyer.phone} />
				</View>
			</View>
		</LogoPage>
	);
};

export default BaLawyerView;

const styles = StyleSheet.create({
	text: {
		paddingLeft: 20,
		paddingBottom: 10,
	},
});
