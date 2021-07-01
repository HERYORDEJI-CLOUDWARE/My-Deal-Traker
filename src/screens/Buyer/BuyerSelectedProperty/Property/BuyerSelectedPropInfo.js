import React from 'react';
import { Text, View } from 'react-native';
import LogoPage from '../../../../components/LogoPage';
import PropertyHeader from '../../../../components/PropertyHeader';
import colors from '../../../../constants/colors';
import { formatStatus } from '../../../../utils/misc';
import moment from 'moment';
import { TouchableOpacity } from 'react-native';
import { navigate } from '../../../../nav/RootNav';
import { AntDesign } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import _font from '../../../../styles/fontStyles';
import _colors from '../../../../constants/colors';

const { width } = Dimensions.get('window');

const BuyerSelectedPropInfo = ({ property, transaction, navigation }) => {
	return (
		<LogoPage dontShow={true}>
			<View style={styles.topWrapper}>
				<View style={styles.statusWrapper}>
					<Text style={styles.statusKey}>Status:</Text>
					<Text style={styles.statusValue}>
						{formatStatus(property.status)}
					</Text>
				</View>
				<Text style={styles.date}>
					{moment(property.date_created).format('MM/DD/YYYY')}
				</Text>
			</View>

			<TouchableOpacity
				activeOpacity={0.9}
				onPress={() =>
					navigate('buyerPropertyDetails', {
						property,
						transaction,
					})
				}
				style={styles.box}
			>
				<Text style={styles.boxTitle}>Property</Text>
				<AntDesign name='right' size={RFValue(15)} color={_colors.lightBrown} />
			</TouchableOpacity>

			<TouchableOpacity
				activeOpacity={0.9}
				onPress={() => navigate('buyerConditions', { transaction, property })}
				style={styles.box}
			>
				<Text style={styles.boxTitle}>Conditions</Text>
				<AntDesign name='right' size={RFValue(15)} color={_colors.lightBrown} />
			</TouchableOpacity>

			<TouchableOpacity
				activeOpacity={0.9}
				onPress={() =>
					navigate('buyerLawyerView', { transaction: transaction })
				}
				style={styles.box}
			>
				<Text style={styles.boxTitle}>Closing</Text>
				<AntDesign name='right' size={RFValue(15)} color={_colors.lightBrown} />
			</TouchableOpacity>

			<TouchableOpacity
				activeOpacity={0.9}
				onPress={() => navigate('fileUpload', { transaction: transaction })}
				style={styles.box}
			>
				<Text style={styles.boxTitle}>Files and Uploads</Text>
				<AntDesign name='right' size={RFValue(15)} color={_colors.lightBrown} />
			</TouchableOpacity>
		</LogoPage>
	);
};

export default BuyerSelectedPropInfo;

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
