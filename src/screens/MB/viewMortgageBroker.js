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

const ViewMortgageBroker = ({ route, navigation }) => {
	const { buyerAgentResponse } = route.params;
	const {
		state: { user },
	} = useContext(UserContext);

	const removeBroker = async () => {
		const token = await fetchAuthToken();
		const data = new FormData();

		data.append('transaction_id', buyerAgentResponse.current.transaction_id);
		data.append('property_id', buyerAgentResponse.current.property_id);
		data.append('buyer_agent_id', buyerAgentResponse.current.buyer_agent_id);
		data.append('phone_email', buyerAgentResponse.current.email);

		console.log(token);

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
				console.log(res.data);
				Toast.show({
					type: 'success',
					text: 'Deleted',
				});
				navigation.goBack();
			})
			.catch((err) => {
				console.log(err);
				Toast.show({
					type: 'danger',
					text: err,
				});
			});
	};

	return (
		<LogoPage navigation={navigation}>
			<View style={styles.container}>
				<View style={{ marginHorizontal: 30 }}>
					<Text style={{ color: 'black', fontSize: 20, fontWeight: 'bold' }}>
						Mortgage Broker Details
					</Text>
				</View>
				<View style={{ marginHorizontal: 30, flexDirection: 'row' }}>
					<Text
						style={{
							marginTop: 20,
							color: colors.white,
							fontSize: 17,
							fontWeight: 'bold',
						}}
					>
						Name :{' '}
					</Text>
					<Text
						style={{
							marginTop: 20,
							color: colors.white,
							fontSize: 17,
							fontWeight: 'bold',
						}}
					>
						{' '}
						{buyerAgentResponse.current.first_name}{' '}
						{buyerAgentResponse.last_name}
					</Text>
				</View>
				<View style={{ marginHorizontal: 30, flexDirection: 'row' }}>
					<Text
						style={{
							marginTop: 20,
							color: colors.white,
							fontSize: 17,
							fontWeight: 'bold',
						}}
					>
						Email :{' '}
					</Text>
					<Text
						style={{
							marginTop: 20,
							color: colors.white,
							fontSize: 17,
							fontWeight: 'bold',
						}}
					>
						{' '}
						{buyerAgentResponse.current.email}
					</Text>
					{/* {console.log("buyerAgentResponse", buyerAgentResponse.current)} */}
				</View>
				<View style={{ marginHorizontal: 30, flexDirection: 'row' }}>
					<Text
						style={{
							marginTop: 20,
							color: colors.white,
							fontSize: 17,
							fontWeight: 'bold',
						}}
					>
						Phone :{' '}
					</Text>
					<Text
						style={{
							marginTop: 20,
							color: colors.white,
							fontSize: 17,
							fontWeight: 'bold',
						}}
					>
						{' '}
						{buyerAgentResponse.current.phone}
					</Text>
				</View>
				<TouchableOpacity style={styles.removeBtn} onPress={removeBroker}>
					<Text
						style={{ fontSize: 22, fontWeight: 'bold', color: colors.white }}
					>
						Remove
					</Text>
				</TouchableOpacity>
			</View>
		</LogoPage>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.lightBrown,
		justifyContent: 'center',
		borderRadius: 2,
		borderColor: 'grey',
		borderWidth: 0.5,
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
});

export default ViewMortgageBroker;
