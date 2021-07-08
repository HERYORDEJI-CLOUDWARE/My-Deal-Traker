import React from 'react';
import { Text, View } from 'react-native';
import LogoPage from '../../components/LogoPage';
import PropertyHeader from '../../components/PropertyHeader';
import colors from '../../constants/colors';
import { formatStatus } from '../../utils/misc';
import moment from 'moment';
import { TouchableOpacity } from 'react-native';
import { navigate } from '../../nav/RootNav';
import { Card } from 'native-base';
import { Image } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const MortgageSelectedProperty = ({
	property,
	transaction,
	navigation,
	route,
}) => {
	const { transaction_id, property_id } = route.params;

	return (
		<LogoPage navigation={navigation}>
			<View
				style={{
					flexDirection: 'row',
					// justifyContent: "space-around",
					alignItems: 'center',
					paddingVertical: 20,
					paddingHorizontal: 25,
				}}
			>
				<View>
					<Text
						style={{
							fontSize: 20,
							fontFamily: 'pop-semibold',
							color: colors.white,
						}}
					>
						{/* {formatStatus(property.status)} */}
					</Text>
					<View>
						<Text style={{ fontSize: 18, color: colors.white }}>
							{/* {moment(property.date_created).format("MM/DD/YYYY")} */}
						</Text>
					</View>
				</View>
			</View>

			<View style={{ paddingBottom: 25 }}></View>

			<View style={{ borderBottomWidth: 1, paddingBottom: 25 }}>
				<View
					style={{
						alignItems: 'center',
					}}
				>
					<TouchableOpacity
						activeOpacity={0.9}
						onPress={() => {
							navigate('mortgageBrokerPropertyDetials', {
								property_id,
								transaction_id,
							});
							// setView("property")
						}}
					>
						<Card style={styles.box}>
							<Image source={require('../../assets/img/property.png')} />
							<View style={{ position: 'absolute', right: 10 }}>
								<AntDesign name='right' />
							</View>
						</Card>
					</TouchableOpacity>
				</View>

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
							navigate('updateMortgageBroker', {
								transaction_id: transaction_id,
								property_id: property_id,
							})
						}
					>
						<Card style={styles.box}>
							<Text
								style={{
									fontSize: 20,
									fontWeight: 'bold',
									color: colors.lightBrown,
								}}
							>
								Mortgage Broker
							</Text>
							<View style={{ position: 'absolute', right: 10 }}>
								<AntDesign name='right' />
							</View>
						</Card>
					</TouchableOpacity>

					<TouchableOpacity
						activeOpacity={0.9}
						onPress={() =>
							navigate('fileUpload', { transaction: transaction_id })
						}
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

export default MortgageSelectedProperty;

const styles = StyleSheet.create({
	box: {
		width: width * 0.8,
		padding: 15,
		alignItems: 'center',
		justifyContent: 'center',
	},
	boxText: {
		textAlign: 'center',
		color: colors.brown,
		fontSize: 24,
	},
	listTitle: {
		padding: 10,
		fontSize: 20,
		color: colors.lightGrey,
		textAlign: 'left',
	},
	listValue: {
		padding: 10,
		fontSize: 20,
		color: colors.white,
		textAlign: 'left',
	},
});
