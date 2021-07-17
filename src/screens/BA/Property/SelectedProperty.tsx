import { useFocusEffect } from '@react-navigation/native';
import { Toast } from 'native-base';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import appApi from '../../../api/appApi';
import BuyAgentFooter from '../../../components/BAFooter';
import colors from '../../../constants/colors';
import { Context as UserContext } from '../../../context/UserContext';
import { displayError, fetchAuthToken } from '../../../utils/misc';

const SelectedProperty = ({ route, navigation }) => {
	const { property } = route.params;

	const {
		state: { user },
	} = useContext(UserContext);

	const [transactionStarted, setTransactionStarted] = useState(false);
	const [theTransaction, setTheTransaction] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	useFocusEffect(
		useCallback(() => {
			fetchTransaction();
		}, []),
	);

	const fetchTransaction = async () => {
		try {
			const token = await fetchAuthToken();
			const data = new FormData();
			data.append('buyer_agent_id', user.unique_id);
			data.append('property_transaction_id', property.transaction_id);
			const response = await appApi.post(
				`/fetch_transaction_with_id.php`,
				data,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);
			if (response.data.response.status == 200) {
				setTheTransaction(response.data.response.data[0]);
				setTransactionStarted(true);
			} else {
				// Toast.show({
				//   type: "warning",
				//   text: response.data.response.message,
				// });
			}
			setIsLoading(false);
		} catch (error) {
			displayError(error);
		}
	};

	// if(!theTransaction){
	//   return (
	//     <View>
	//       <ActivityIndicator size="large" color={colors.white} />
	//     </View>
	//   )
	// }

	console.log(property, '///');

	return (
		<>
			<BuyAgentFooter
				property={property}
				transaction={theTransaction}
				isLoading={isLoading}
				transactionStarted={transactionStarted}
				fetchTransaction={fetchTransaction}
				navigation={navigation}
			/>
		</>
	);
};

export default SelectedProperty;
