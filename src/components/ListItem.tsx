import { Card, Text } from 'native-base';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import colors from '../constants/colors';
import { RFValue } from 'react-native-responsive-fontsize';
import _font from '../styles/fontStyles';

const { width } = Dimensions.get('window');

const ListItem = ({ title, value }) => (
	<View
		style={{
			flexWrap: 'wrap',
			marginBottom: RFValue(10),
		}}
	>
		<View style={styles.listTitleWrapper}>
			<Text style={styles.listTitle}>{title}</Text>
		</View>
		<Text style={styles.listValue}>{value}</Text>
	</View>
);

export default ListItem;

const styles = StyleSheet.create({
	listTitleWrapper: {},
	listTitle: {
		..._font.Small,
		// paddingBottom: RFValue(10),
		fontSize: RFValue(14),
		color: colors.black,
	},
	listValue: {
		..._font.Medium,
		color: colors.white,
		// paddingBottom: RFValue(10),
		fontSize: RFValue(14),
	},
});
