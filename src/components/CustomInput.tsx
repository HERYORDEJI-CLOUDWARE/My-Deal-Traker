import React from 'react';
import {
	StyleProp,
	TextStyle,
	StyleSheet,
	TextInputProps as RNTextInputProps,
	TextInput,
} from 'react-native';
import * as RN from 'react-native';
import { Input } from 'react-native-elements';
import { FontAwesome as Icon } from '@expo/vector-icons';
import * as NB from 'native-base';
import { Text } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import _colors from '../constants/colors';
import _font from '../styles/fontStyles';

interface Props {
	placeholder: string;
	value: string;
	leftIconName?: any;
	label?: string;
	style?: StyleProp<TextStyle>;
	secureTextEntry?: boolean;
	rightIconName?: any;
	rightIconPress?: () => void;
	inputStyle?: StyleProp<TextStyle>;
	onChangeText?: (e: string) => void;
	multiline?: boolean;
	returnKeyType?: any;
	returnKeyLabel?: any;
	keyboardType?: any;
	autoCapitalize?: any;
	error?: string;
	touched?: boolean;
	password?: true;
}

type Somer = {
	nam: boolean;
};

const leftIconType = {
	'Email Address': 'mail',
	Password: 'lock',
	'Confirm Password': 'lock',
	'Full Name': 'user',
	Telephone: 'phone',
};

const CustomInput = (props: Props) => {
	const [showPassword, setShowPassword] = React.useState(false);

	const toggleShowPassword = () => setShowPassword(!showPassword);

	return (
		<RN.View style={styles.container}>
			{props.error && <Text style={styles.error}>{props.error}</Text>}
			{/*{props.label && <Text style={styles.labelStyle}>{props.label}</Text>}*/}

			<RN.View
				style={[
					styles.wrapper,
					{ borderColor: props.error ? 'red' : _colors.fair },
				]}
			>
				<NB.Icon
					name={leftIconType[`${props.placeholder}`]}
					style={styles.leftIcon}
					type={'Feather'}
				/>
				<RN.TextInput
					placeholder={props.placeholder}
					placeholderTextColor={_colors.fair}
					style={[styles.input, props.inputStyle]}
					value={props.value}
					onChangeText={props.onChangeText}
					secureTextEntry={props.password && !showPassword}
					multiline={props.multiline}
					returnKeyLabel={props.returnKeyLabel}
					keyboardType={props.keyboardType}
					returnKeyType={props.returnKeyType}
					autoCapitalize={props.autoCapitalize}
				/>

				{props.password && (
					<RN.Pressable onPress={toggleShowPassword}>
						<NB.Icon
							name={!showPassword ? 'eye' : 'eye-off'}
							style={styles.rightIcon}
							type={'Feather'}
						/>
					</RN.Pressable>
				)}
			</RN.View>
		</RN.View>
	);
};

export default CustomInput;

const styles = StyleSheet.create({
	container: {
		marginBottom: RFValue(20),
	},
	wrapper: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderWidth: RFValue(1),
		borderRadius: RFValue(10),
		height: RFValue(50),
		// justifyContent: 'center',
		paddingHorizontal: RFValue(10),
	},
	input: {
		..._font.Medium,
		borderRadius: RFValue(10),
		paddingHorizontal: RFValue(10),
		alignItems: 'center',
		margin: 0,
		padding: 0,
		justifyContent: 'center',
		height: RFValue(50),
	},
	labelStyle: { fontFamily: 'pop-reg' },
	error: {
		paddingHorizontal: 10,
		color: 'red',
	},
	leftIcon: { color: _colors.fair, fontSize: RFValue(25) },
	rightIcon: { color: _colors.fair, fontSize: RFValue(25) },
});
