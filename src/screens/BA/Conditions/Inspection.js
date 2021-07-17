import { Toast } from 'native-base';
import React, { useContext, useState } from 'react';
import { Text, StyleSheet, View, ActivityIndicator } from 'react-native';
import colors from '../../../constants/colors';
import { displayError, fetchAuthToken } from '../../../utils/misc';
import appApi from '../../../api/appApi';
import { Context as UserContext } from '../../../context/UserContext';
import _font from '../../../styles/fontStyles';
import { RFValue } from 'react-native-responsive-fontsize';
import ButtonPrimaryBig from '../../../components/ButtonPrimaryBig';

const Inspection = ({ transaction, property }) => {
	const {
		state: { user },
	} = useContext(UserContext);
	const [date, setDate] = useState(new Date());

	const [show, setShow] = useState(false);

	const [isLoading, setIsLoading] = useState(false);
	const [ordering, setOrdering] = useState(false);

	const [checkOrdered, setCheckOrdered] = useState(undefined);

	const [orderMessage, setOrderMessage] = useState(undefined);

	const itemsArr = [];

	const checkIfOrdered = async () => {
		try {
			const token = await fetchAuthToken();
			const data = new FormData();
			data.append('transaction_id', transaction.transaction_id);
			const response = await appApi.post(
				`/get_inspection_order_by_transaction.php??`,
				data,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);
			return response.data.response.data;
		} catch (error) {
			displayError(error);
			setOrdering(false);
		}
	};

	const orderInspection = async () => {
		try {
			setOrdering(true);
			const token = await fetchAuthToken();
			const data = new FormData();
			data.append('seller_agent_id', property.listing_agent_id);
			data.append('buyer_agent_id', transaction.buyer_agent_id);
			data.append('transaction_id', transaction.transaction_id);
			const response = await appApi.post(`/order_inspection.php`, data, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			if (response.data.response.status == 200) {
				Toast.show({
					type: 'success',
					text: response.data.response.message,
				});
				setOrderMessage(response.data.response.message);
			} else {
				Toast.show({
					type: 'warning',
					text: response.data.response.message,
				});
				setOrderMessage(response.data.response.message);
			}
			setOrdering(false);
		} catch (error) {
			displayError(error);
			setOrdering(false);
		}
	};

	React.useEffect(() => {
		setIsLoading(true);
		checkIfOrdered().then((res) => {
			setCheckOrdered(res);
			setIsLoading(false);
		});
		// setOrderMessage(response.data.response.message);
	}, []);

	return (
		<View style={{ paddingHorizontal: 20 }}>
			<View>
				<Text style={styles.title}>Inspection</Text>
			</View>
			{isLoading ? (
				<ActivityIndicator size='large' color={colors.white} />
			) : (
				<>
					{orderMessage && (
						<View>
							<Text style={styles.text}>{orderMessage}</Text>
						</View>
					)}
					<View style={{ marginTop: 30 }} />
					{checkOrdered ? (
						<View>
							<Text style={styles.text}>
								You have already ordered inspection for this property
							</Text>
						</View>
					) : (
						<ButtonPrimaryBig
							title={ordering ? 'Loading...' : 'Order Inspection'}
							disabled={ordering}
							onPress={orderInspection}
							containerStyle={{ backgroundColor: colors.white }}
							titleStyle={{ color: '#000' }}
						/>
					)}
				</>
			)}
		</View>
	);
};

export default Inspection;

const styles = StyleSheet.create({
	label: {
		color: colors.white,
	},
	moreBtn: {
		backgroundColor: colors.white,
		alignSelf: 'flex-start',
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 20,
		marginVertical: 10,
		paddingVertical: 5,
		borderRadius: 10,
	},
	item: { marginBottom: 0 },
	title: { ..._font.H5, color: colors.white, marginBottom: RFValue(20) },
	text: { ..._font.Medium, color: colors.white },
	subtext: { ..._font.Medium, fontSize: RFValue(13) },
	textInputTitle: {
		..._font.Medium,
		color: colors.black,
		fontSize: RFValue(13),
		marginTop: RFValue(10),
	},
	containerStyle: {
		height: RFValue(50),

		backgroundColor: '#FFFFFF',
		margin: 0,
		padding: 0,
	},

	textInput: {
		..._font.Medium,
		backgroundColor: '#FFFFFF',
		height: RFValue(50),
		padding: 0,
		margin: 0,
		borderWidth: 0,
		justifyContent: 'center',
		flex: 1,
		paddingHorizontal: RFValue(10),
	},
});
