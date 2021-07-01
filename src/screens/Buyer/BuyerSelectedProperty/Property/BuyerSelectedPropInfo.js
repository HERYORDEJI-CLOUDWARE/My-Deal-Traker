import React from 'react';
import { Text, View } from 'react-native';
import LogoPage from '../../../../components/LogoPage';
import PropertyHeader from '../../../../components/PropertyHeader';
import colors from '../../../../constants/colors';
import { formatStatus } from '../../../../utils/misc';
import moment from 'moment';
import { TouchableOpacity } from 'react-native';
import { navigate } from '../../../../nav/RootNav';
import { Card } from 'native-base';
import { Image } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import _font from '../../../../styles/fontStyles';
import _colors from '../../../../constants/colors';

const { width } = Dimensions.get('window');

const BuyerSelectedPropInfo = ({ property, transaction, navigation }) => {
	return (
		<LogoPage>
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

			<View style={{ borderBottomWidth: 1, paddingBottom: 25 }}>
				<View
					style={{
						// flexDirection: "row",
						// justifyContent: "space-around",
						alignItems: 'center',
					}}
				>
					<TouchableOpacity
						activeOpacity={0.9}
						onPress={() => {
							navigate('buyerPropertyDetails', {
								property,
								transaction,
							});
							// setView("property")
						}}
					>
						<Card style={styles.box}>
							<Image source={require('../../../../assets/img/property.png')} />
							<View style={{ position: 'absolute', right: 10 }}>
								<AntDesign name='right' />
							</View>
						</Card>
					</TouchableOpacity>

					<TouchableOpacity
						activeOpacity={0.9}
						onPress={() => {
							navigate('buyerConditions', { transaction, property });
							// setView("conditions")
						}}
					>
						<Card style={styles.box}>
							<Image
								source={require('../../../../assets/img/conditions.png')}
							/>
							<View style={{ position: 'absolute', right: 10 }}>
								<AntDesign name='right' />
							</View>
						</Card>
					</TouchableOpacity>
				</View>

				{/* <View style={{ marginTop: 35 }} /> */}

				<View
					style={{
						// flexDirection: "row",
						// justifyContent: "space-around",
						alignItems: 'center',
					}}
				>
					<TouchableOpacity
						activeOpacity={0.9}
						onPress={() =>
							navigate('buyerLawyerView', { transaction: transaction })
						}
					>
						<Card style={styles.box}>
							<Image source={require('../../../../assets/img/closing.png')} />
							<View style={{ position: 'absolute', right: 10 }}>
								<AntDesign name='right' />
							</View>
						</Card>
					</TouchableOpacity>

					<TouchableOpacity
						activeOpacity={0.9}
						onPress={() => navigate('fileUpload', { transaction: transaction })}
					>
						<Card style={styles.box}>
							<Text
								style={{
									color: colors.bgBrown,
									fontWeight: 'bold',
									fontSize: 20,
								}}
							>
								Files and uploads
							</Text>
							<View style={{ position: 'absolute', right: 10 }}>
								<AntDesign name='right' />
							</View>
						</Card>
					</TouchableOpacity>
				</View>
			</View>
		</LogoPage>
	);
};

export default BuyerSelectedPropInfo;

const styles = StyleSheet.create({
	topWrapper: { marginBottom: RFValue(20) },
	box: {
		width: width * 0.8,
		padding: 15,
		alignItems: 'center',
		justifyContent: 'center',
	},
	boxText: {
		textAlign: 'center',
		color: colors.brown,
		fontSize: RFValue(24),
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
