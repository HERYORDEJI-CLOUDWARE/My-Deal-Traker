import * as RN from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import _colors from '../constants/colors';

const _font = {
	H1: <RN.TextStyle>{
		fontFamily: 'pop-bold',
		fontSize: RFValue(30),
		color: _colors.black,
	},
	H2: <RN.TextStyle>{
		fontFamily: 'pop-bold',
		fontSize: RFValue(28),
		color: _colors.black,
	},
	H3: <RN.TextStyle>{
		fontFamily: 'pop-bold',
		fontSize: RFValue(26),
		color: _colors.black,
	},
	H4: <RN.TextStyle>{
		fontFamily: 'pop-bold',
		fontSize: RFValue(24),
		color: _colors.black,
	},
	H5: <RN.TextStyle>{
		fontFamily: 'pop-bold',
		fontSize: RFValue(23),
		color: _colors.black,
	},
	H6: <RN.TextStyle>{
		fontFamily: 'pop-bold',
		fontSize: RFValue(20),
		color: _colors.black,
	},
	Big: {
		fontFamily: 'pop-semibold',
		fontSize: RFValue(16),
		color: _colors.black,
	},

	Medium: {
		fontFamily: 'pop-medium',
		fontSize: RFValue(14),
		color: _colors.black,
	},

	Small: {
		fontFamily: 'pop-reg',
		fontSize: RFValue(12),
		color: _colors.black,
	},
};

export default _font;
