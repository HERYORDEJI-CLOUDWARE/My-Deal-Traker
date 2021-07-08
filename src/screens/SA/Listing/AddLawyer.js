import React, { useContext, useState } from 'react';
import { Input } from 'react-native-elements';
import appApi from '../../../api/appApi';
import LogoPage from '../../../components/LogoPage';
import { Context as UserContext } from '../../../context/UserContext';
import { displayError, fetchAuthToken } from '../../../utils/misc';
import { RadioButton, Switch } from 'react-native-paper';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text, Toast } from 'native-base';
import colors from '../../../constants/colors';
import InputBar from '../../../components/InputBar';
import { RFValue } from 'react-native-responsive-fontsize';
import ButtonPrimaryBig from './../../../components/ButtonPrimaryBig';

const AddLawyer = ({ route, navigation }) => {
	const { property } = route.params;

	const {
		state: { user },
	} = useContext(UserContext);

	const [cellphone, setCellphone] = useState('');
	const [ref, setRef] = useState('');
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [notification, setNotification] = useState('0');
	const [isLoading, setIsLoading] = useState(false);

	const addLawyer = async () => {
		try {
			setIsLoading(true);
			const token = await fetchAuthToken();
			const data = new FormData();
			data.append('property_id', property.transaction_id);
			data.append('seller_agent_id', user.unique_id);
			data.append('first_name', firstName);
			data.append('last_name', lastName);
			data.append('phone', cellphone);
			data.append('email', email);
			const response = await appApi.post(`/add_seller_lawyer.php`, data, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			if (response.data.response.status == 200) {
				navigation.goBack();
			} else {
				Toast.show({
					type: 'warning',
					text: response.data.response.message,
				});
			}
			setIsLoading(false);
		} catch (error) {
			displayError(error);
			setIsLoading(false);
		}
	};

	return (
		<LogoPage navigation={navigation}>
			<View style={{ marginVertical: RFValue(30) }}>
				<InputBar
					label={'First Name'}
					value={firstName}
					onChangeText={setFirstName}
				/>

				<InputBar
					label={'Last Name'}
					value={lastName}
					onChangeText={setLastName}
				/>

				<InputBar
					label={'Phone Number'}
					value={cellphone}
					onChangeText={setCellphone}
					keyboardType='number-pad'
				/>

				<InputBar
					label={'Email'}
					value={email}
					onChangeText={setEmail}
					keyboardType='email-address'
					autoCapitalize='none'
				/>

				<ButtonPrimaryBig
					title={isLoading ? 'Loading...' : 'Save'}
					titleStyle={{ color: isLoading ? colors.fairGrey : colors.black }}
					onPress={addLawyer}
					disabled={isLoading}
					containerStyle={{
						backgroundColor: colors.white,
						marginVertical: RFValue(30),
					}}
				/>
			</View>
		</LogoPage>
	);
};

export default AddLawyer;

const styles = StyleSheet.create({
	label: {
		color: colors.white,
	},
});
