import { Toast } from 'native-base';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import * as RN from 'react-native';
import * as NB from 'native-base';
import { Input } from 'react-native-elements';
import colors from '../../constants/colors';
import { fetchAuthToken } from '../../utils/misc';
import appApi from '../../api/appApi';
import { RFValue } from 'react-native-responsive-fontsize';
import _font from '../../styles/fontStyles';
import ButtonPrimaryBig from '../../components/ButtonPrimaryBig';
import ButtonSecondaryBig from '../../components/ButtonSecondaryBig';

const ForgotPassword = () => {
	const [email, setEmail] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	function validateEmail(email: string) {
		const re =
			/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(String(email).toLowerCase());
	}

	const onSubmit = async () => {
		if (!validateEmail(email)) {
			return Toast.show({
				type: 'danger',
				text: 'Please enter a valid email address',
			});
		}

		setIsLoading(true);
		const token = await fetchAuthToken();
		const data = new FormData();
		data.append('email', email);
		const response = await appApi.post('/forgot_password.php', data, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		setIsLoading(false);
		setEmail('');
		if (response.data.response.status == 200) {
			Toast.show({
				type: 'success',
				text: response.data.response.message,
			});
		} else {
			Toast.show({
				type: 'warning',
				text: response.data.response.message,
			});
		}
	};

	return (
		<NB.Container style={styles.container}>
			<RN.Text style={styles.infoText}>
				Enter your registered Email below to get the Password Recovery link
			</RN.Text>

			<RN.View style={styles.textInputWrapper}>
				<RN.TextInput
					placeholder='Enter email address'
					placeholderTextColor='#ccc'
					value={email}
					onChangeText={setEmail}
					style={styles.textInput}
				/>
			</RN.View>

			<ButtonSecondaryBig
				title={isLoading ? 'Loading...' : 'Reset Password'}
				onPress={onSubmit}
			/>
		</NB.Container>
	);
};

export default ForgotPassword;

const styles = RN.StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.bgBrown,
		// justifyContent: 'center',
		padding: RFValue(20),
	},
	infoText: {
		..._font.Medium,

		fontSize: RFValue(20),
		color: 'white',
	},
	textInputWrapper: { height: RFValue(50), marginVertical: RFValue(20) },
	textInput: {
		..._font.Medium,
		backgroundColor: colors.white,
		paddingHorizontal: RFValue(10),
		borderRadius: RFValue(5),
		height: RFValue(50),
	},
});
