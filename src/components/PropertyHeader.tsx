import {} from 'native-base';
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import colors from '../constants/colors';
import _font from '../styles/fontStyles';
import CustomHeader from './CustomHeader';
import moment from 'moment';
import { RFValue } from 'react-native-responsive-fontsize';

const PropertyHeader = ({
	transactionID,
	status,
	date,
	navigation,
	noHeader,
}) => {
	return (
		<View>
			{/* {!noHeader ? <CustomHeader navigation={navigation} /> : null} */}
			<View>
				<View>
					<Text>
						<Text style={styles.statusKey}>Transaction ID: </Text>
						<Text style={styles.statusValue}>{transactionID}</Text>
					</Text>

					<View style={styles.topWrapper}>
						<View style={styles.statusWrapper}>
							<Text style={styles.statusKey}>Status:</Text>
							<Text style={styles.statusValue}>{status}</Text>
						</View>
						<Text style={styles.date}>{moment(date).format('MM/DD/YYYY')}</Text>
					</View>
				</View>
			</View>
		</View>
	);
};

export default PropertyHeader;
const styles = StyleSheet.create({
	topWrapper: { marginBottom: RFValue(20) },
	box: {
		padding: RFValue(20),
		paddingVertical: RFValue(10),
		alignItems: 'center',
		backgroundColor: '#FFF',
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: RFValue(20),
	},
	boxTitle: {
		..._font.Big,
		textAlign: 'center',
		color: colors.brown,
		fontSize: RFValue(18),
	},
	listTitle: {
		padding: RFValue(10),
		fontSize: RFValue(20),
		color: colors.lightGrey,
		textAlign: 'left',
	},
	listValue: {
		padding: RFValue(10),
		fontSize: RFValue(20),
		color: colors.white,
		textAlign: 'left',
	},
	statusWrapper: { flexDirection: 'row' },
	statusKey: {
		..._font.Medium,
		// fontSize: 20,
		color: colors.white,
		paddingRight: RFValue(10),
	},
	statusValue: {
		..._font.Medium,
		// fontSize: 20,
		color: colors.white,
		fontFamily: 'pop-semibold',
	},
	date: { ..._font.Medium, color: colors.white },
});
