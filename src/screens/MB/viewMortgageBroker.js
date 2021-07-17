import React, { useContext } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import colors from '../../constants/colors';
import { View, StyleSheet, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { fetchAuthToken } from '../../utils/misc';
import appApi from '../../api/appApi';
import { Toast } from 'native-base';
import axios from 'axios';
import { Context as UserContext } from '../../context/UserContext';
import LogoPage from '../../components/LogoPage';
import _font from '../../styles/fontStyles';
import { RFValue } from 'react-native-responsive-fontsize';
import ButtonPrimaryBig from '../../components/ButtonPrimaryBig';

const ViewMortgageBroker = ({ route, navigation }) => {
	const { buyerAgentResponse } = route.params;
	const {
		state: { user },
	} = useContext(UserContext);

	console.log(buyerAgentResponse);

	const removeBroker = async () => {
		const token = await fetchAuthToken();
		const data = new FormData();

		data.append('transaction_id', buyerAgentResponse.transaction_id);
		data.append('property_id', buyerAgentResponse.property_id);
		data.append('buyer_agent_id', buyerAgentResponse.buyer_agent_id);
		data.append('phone_email', buyerAgentResponse.email);

		// console.log(token);

		axios
			.post(
				'http://mydealtracker.staging.cloudware.ng/api/delete_mortgage_broker.php',
				data,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			)
			.then((res) => {
				// console.log(res.data);
				Toast.show({
					type: 'success',
					text: 'Deleted',
				});
				navigation.goBack();
			})
			.catch((err) => {
				// console.log(err);
				Toast.show({
					type: 'danger',
					text: err,
				});
			});
	};

	return (
		<LogoPage navigation={navigation}>
			<View style={{}}>
				<Text style={{ ..._font.H5, color: '#FFFFFF' }}>
					Mortgage Broker Details
				</Text>
			</View>
			{buyerAgentResponse !== null ? (
				<View style={styles.container}>
					<View style={styles.rowWrapper}>
						<Text style={styles.key}>Name:</Text>
						<Text style={styles.value}>
							{buyerAgentResponse?.first_name}
							{buyerAgentResponse?.last_name}
						</Text>
					</View>
					<View style={styles.rowWrapper}>
						<Text style={styles.key}>Email:</Text>
						<Text style={styles.value}>{buyerAgentResponse?.email}</Text>
					</View>
					<View style={styles.rowWrapper}>
						<Text style={styles.key}>Phone:</Text>
						<Text style={styles.value}>{buyerAgentResponse?.phone}</Text>
					</View>
				</View>
			) : (
				<View style={{}}>
					<Text style={{ ..._font.Medium, color: '#FFFFFF' }}>
						No Mortgage Broker added yet.
					</Text>
				</View>
			)}
			{buyerAgentResponse !== null ? (
				<ButtonPrimaryBig
					title={'Remove'}
					onPress={removeBroker}
					containerStyle={{ backgroundColor: colors.brown }}
				/>
			) : (
				<ButtonPrimaryBig
					title={'Add Broker'}
					onPress={removeBroker}
					containerStyle={{
						backgroundColor: colors.fair,
						marginVertical: RFValue(30),
					}}
				/>
			)}
		</LogoPage>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		marginVertical: RFValue(30),
	},

	removeBtn: {
		marginHorizontal: 30,
		marginTop: 30,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: colors.brown,
		height: 50,
		borderColor: 'white',
		borderWidth: 0.5,
		borderRadius: 10,
	},
	rowWrapper: { flex: 1, flexDirection: 'row', alignItems: 'flex-start' },
	key: {
		..._font.Small,
		fontSize: RFValue(14),
		color: '#CCC',
		flex: 0.15,
		marginRight: RFValue(5),
	},
	value: {
		..._font.Small,
		fontSize: RFValue(14),
		fontFamily: 'pop-medium',
		flex: 0.85,
	},
});

export default ViewMortgageBroker;
