import React, { useState, useContext } from 'react';
import { View, Text, SafeAreaView, StyleSheet } from 'react-native';
import { Toast } from 'native-base';
import colors from '../../constants/colors';
import CustomHeader from '../../components/CustomHeader';
import { TextInput } from 'react-native-gesture-handler';
import { TouchableOpacity } from 'react-native';
import { Context as UserContext } from '../../context/UserContext';
import { fetchAuthToken } from '../../utils/misc';
import appApi from '../../api/appApi';
import axios from 'axios';
import LogoPage from '../../components/LogoPage';

const addMortgageBroker = ({ route, navigation }) => {
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [phoneNumber, setPhoneNumber] = useState('');
	const [email, setEmail] = useState('');

	const { transaction, property } = route.params;
	const {
		state: { user },
	} = useContext(UserContext);

	const submitHandler = async () => {
		const data = new FormData();
		const token = await fetchAuthToken();
		transaction
			? console.log(transaction.transaction_id)
			: nulconsole.log('empty');

		data.append('transaction_id', transaction.transaction_id);
		data.append('property_id', property.transaction_id);
		data.append('buyer_agent_id', user.unique_id);
		data.append('first_name', firstName);
		data.append('last_name', lastName);
		data.append('phone', phoneNumber);
		data.append('email', email);

		// console.log(property.transaction_id)

		axios
			.post(
				'http://mydealtracker.staging.cloudware.ng/api/add_mortgage_broker.php',
				data,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			)
			.then((res) => {
				console.log(res.data.response.message);
				const response = res.data.response.message;
				if (response === 'This property already has a mortgage broker') {
					Toast.show({
						type: 'warning',
						text: response,
					});
					navigation.goBack();
				} else {
					Toast.show({
						type: 'success',
						text: 'Mortgage Broker succefully added',
					});
					navigation.goBack();
				}
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
			<SafeAreaView style={styles.container}>
				<View style={styles.formView}>
					<View style={{ marginBottom: 30 }}>
						<Text style={styles.inputText}>First Name</Text>
						<TextInput
							placeholder={"mortgage broker's first name"}
							style={styles.inputField}
							onChangeText={(text) => setFirstName(text)}
						/>
					</View>
					<View style={{ marginBottom: 30 }}>
						<Text style={styles.inputText}>Last Name</Text>
						<TextInput
							placeholder={"mortgage broker's last name"}
							style={styles.inputField}
							onChangeText={(text) => setLastName(text)}
						/>
					</View>
					<View style={{ marginBottom: 30 }}>
						<Text style={styles.inputText}>Cell Phone</Text>
						<TextInput
							placeholder={"mortgage broker's phone number"}
							style={styles.inputField}
							onChangeText={(text) => setPhoneNumber(text)}
						/>
					</View>
					<View style={{ marginBottom: 30 }}>
						<Text style={styles.inputText}>Email</Text>
						<TextInput
							placeholder={"mortgage broker's email"}
							style={styles.inputField}
							onChangeText={(text) => setEmail(text)}
						/>
					</View>
					<TouchableOpacity
						style={styles.continueButton}
						onPress={submitHandler}
					>
						<Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
							Send
						</Text>
					</TouchableOpacity>
					{/* <Text style={{color:'white', fontSize:20, fontWeight:'bold'}}>{}{user.unique_id}</Text> */}
				</View>
			</SafeAreaView>
		</LogoPage>
	);
};

export default addMortgageBroker;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.lightBrown,
	},
	formView: {
		marginHorizontal: 30,
		// marginTop:100
	},
	inputText: {
		fontSize: 20,
	},
	inputField: {
		backgroundColor: 'white',
		height: 60,
		borderRadius: 10,
		marginTop: 10,
		padding: 10,
		fontSize: 18,
	},
	continueButton: {
		backgroundColor: 'black',
		height: 60,
		borderRadius: 10,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
