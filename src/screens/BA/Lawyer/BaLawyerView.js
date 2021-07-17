import { AntDesign } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { Card, Container, Toast } from 'native-base';
import React, { useCallback, useContext, useEffect, useState } from 'react';
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
import axios from 'axios';
import ButtonPrimaryBig from '../../../components/ButtonPrimaryBig';
import { Context as UserContext } from '../../../context/UserContext';

const BaLawyerView = ({ route, notAgent, navigation }) => {
	const { transaction, property } = route.params;

	const {
		state: { user },
	} = useContext(UserContext);

	const [isLoading, setIsLoading] = useState(true);
	const [transactionLawyer, setTransactionLawyer] = useState(null);
	const [isRemoving, setIsRemoving] = useState(false);

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

	const removeLawyer = async () => {
		// try {
		setIsRemoving(true);
		const token = await fetchAuthToken();
		const data = new FormData();

		data.append('transaction_id', transaction.transaction_id);
		data.append('property_id', property.transaction_id);
		data.append('buyer_agent_id', property.listing_agent_id);
		data.append('phone_email', user.email);
		/*
			URL: delete_buyer_lawyer
			Parameters: transaction_id, property_id, buyer_agent_id, phone_email
			Type: POST
			*/
		axios
			.post(
				'http://mydealtracker.staging.cloudware.ng/api/delete_buyer_lawyer.php',
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

export default BaLawyerView;

const styles = StyleSheet.create({
	text: {
		paddingLeft: 20,
		paddingBottom: 10,
	},
});
