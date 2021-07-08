import * as React from 'react';
import * as RN from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import _colors from './../constants/colors';
import _font from './../styles/fontStyles';

export interface Props {
	onChangeText: (e: string) => void;
	label: string;
	placeholder?: string;
	value?: string;
}

export interface State {}

export default function InputBar(props: Props) {
	return (
		<RN.View style={styles.textInputContainer}>
			<RN.Text style={styles.label}>{props.label}</RN.Text>
			<RN.View style={styles.textInputWrapper}>
				<RN.TextInput
					{...props}
					value={props.value}
					onChangeText={props.onChangeText}
					style={styles.textInput}
				/>
			</RN.View>
		</RN.View>
	);
}

const styles = RN.StyleSheet.create({
	label: { ..._font.Medium, color: _colors.white },
	textInputContainer: {
		marginBottom: RFValue(20),
	},
	textInputWrapper: {
		height: RFValue(50),
	},
	textInput: {
		color: _colors.white,
		padding: 0,
		margin: 0,

		height: RFValue(50),
		backgroundColor: _colors.white,
		flex: 1,
		paddingHorizontal: RFValue(10),
		..._font.Medium,
	},
});
