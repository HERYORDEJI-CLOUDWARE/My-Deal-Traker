import * as React from 'react';
import * as RN from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import _font from '../styles/fontStyles';
import _colors from '../constants/colors';

interface Props {
	title: string;
	containerStyle?: RN.ViewStyle;
	onPress: () => void;
}

export default function ButtonSecondaryBig(props: Props) {
	return (
		<RN.Pressable
			style={{ ...styles.container, ...props.containerStyle }}
			{...props}
		>
			<RN.Text style={styles.title}>{props.title}</RN.Text>
		</RN.Pressable>
	);
}

const styles = RN.StyleSheet.create({
	container: {
		backgroundColor: _colors.fair + '80',
		alignItems: 'center',
		justifyContent: 'center',
		height: RFValue(50),
		borderRadius: RFValue(10),
	},
	title: { ..._font.Medium, color: _colors.white },
});
