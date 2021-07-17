import * as React from 'react';
import { fetchAuthToken } from '../../utils/misc';
import appApi from '../../api/appApi';
import {
	useFocusEffect,
	useRoute,
	useNavigation,
} from '@react-navigation/native';
import LogoPage from '../../components/LogoPage';
import { ActivityIndicator } from 'react-native';
import colors from '../../constants/colors';
import ViewMortgageBroker2 from './viewMortgageBroker2';
import AddMortgageBroker2 from './addMortgageBroker2';

interface Props {
	transaction: {};
	property: {};
}

export default function CheckMB(props: Props) {
	const route = useRoute();
	const navigation = useNavigation();

	const { transaction, property } = route.params;

	const [loading, setLoading] = React.useState(true);
	const [broker, setBroker] = React.useState(null);

	const getBroker = async () => {
		try {
			const token = await fetchAuthToken();
			return await appApi.get(
				`/get_property_mortgage_broker.php?transaction_id=${
					props.transaction?.transaction_id ?? transaction?.transaction_id
				}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);
		} catch (err) {
			console.log('API conection failed');
		}
	};

	useFocusEffect(
		React.useCallback(() => {
			setLoading(true);
			getBroker().then((res) => {
				setBroker(res.data.response.data);
				setLoading(false);
			});
		}, []),
	);

	if (loading) {
		return (
			<LogoPage>
				<ActivityIndicator size='large' color={colors.white} />
			</LogoPage>
		);
	}
	return (
		<LogoPage>
			{broker !== null ? (
				<ViewMortgageBroker2 buyerAgentResponse={broker} />
			) : (
				<AddMortgageBroker2
					transaction={props.transaction ?? transaction}
					property={props.property ?? property}
				/>
			)}
		</LogoPage>
	);
}
