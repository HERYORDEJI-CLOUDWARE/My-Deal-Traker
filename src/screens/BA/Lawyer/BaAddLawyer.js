import React, { useContext, useState } from 'react';
import { TextInput, TouchableOpacity, StyleSheet, View } from 'react-native';
import LogoPage from '../../../components/LogoPage';
import colors from '../../../constants/colors';
import { displayError, fetchAuthToken } from '../../../utils/misc';
import { Context as UserContext } from '../../../context/UserContext';
import appApi from '../../../api/appApi';
import { Toast } from 'native-base';
import { Text } from 'react-native';
import _font from '../../../styles/fontStyles';
import { RFValue } from 'react-native-responsive-fontsize';
import ButtonPrimaryBig from '../../../components/ButtonPrimaryBig';

const BaAddLawyer = ({ navigation, route }) => {
	const { transaction } = route.params;

	const {
		state: { user },
	} = useContext(UserContext);
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [cellphone, setCellphone] = useState('');
	const [email, setEmail] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const addLawyer = async () => {
		try {
			setIsLoading(true);
			const token = await fetchAuthToken();
			const data = new FormData();
			data.append('transaction_id', transaction.transaction_id);
			data.append('property_id', transaction.property_id);
			data.append('buyer_agent_id', user.unique_id);
			data.append('first_name', firstName);
			data.append('last_name', lastName);
			data.append('phone', cellphone);
			data.append('email', email);
			const response = await appApi.post(`/add_buyer_lawyer.php`, data, {
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
			<View style={{}}>
				<View style={styles.textInputWrapper}>
					<Text style={styles.title}>First Name</Text>
					<TextInput
						// placeholder='First name'
						value={firstName}
						onChangeText={setFirstName}
						style={styles.textInput}
						placeholderTextColor={colors.lightGrey}
					/>
				</View>

				<View style={styles.textInputWrapper}>
					<Text style={styles.title}>Last Name</Text>
					<TextInput
						// placeholder='Last name'
						value={lastName}
						onChangeText={setLastName}
						style={styles.textInput}
						placeholderTextColor={colors.lightGrey}
					/>
				</View>

				<View style={styles.textInputWrapper}>
					<Text style={styles.title}>Telephone</Text>
					<TextInput
						// placeholder='Cellphone'
						value={cellphone}
						onChangeText={setCellphone}
						style={styles.textInput}
						placeholderTextColor={colors.lightGrey}
						keyboardType='number-pad'
					/>
				</View>

				<View style={styles.textInputWrapper}>
					<Text style={styles.title}>Email</Text>
					<TextInput
						// placeholder='Email'
						value={email}
						onChangeText={setEmail}
						style={styles.textInput}
						placeholderTextColor={colors.lightGrey}
						keyboardType='email-address'
						autoCapitalize='none'
					/>
				</View>

				<ButtonPrimaryBig
					disabled={isLoading}
					title={isLoading ? 'Loading...' : 'Save'}
					onPress={addLawyer}
					containerStyle={{
						backgroundColor: isLoading ? colors.fair + '50' : colors.brown,
						marginVertical: RFValue(20),
					}}
				/>
			</View>
		</LogoPage>
	);
};

export default BaAddLawyer;

const styles = StyleSheet.create({
	textInputWrapper: { marginBottom: RFValue(20) },
	title: { ..._font.Medium, color: colors.black },
	textInput: {
		..._font.Medium,
		backgroundColor: '#FFFFFF',
		height: RFValue(50),
		padding: 0,
		margin: 0,
		borderWidth: 0,
		justifyContent: 'center',
		flex: 1,
		paddingHorizontal: RFValue(10),
	},
});
