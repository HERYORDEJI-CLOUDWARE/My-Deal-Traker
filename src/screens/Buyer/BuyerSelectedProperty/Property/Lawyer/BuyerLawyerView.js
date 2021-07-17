import React from 'react';
import LogoPage from '../../../../../components/LogoPage';
import BaLawyerView from '../../../../BA/Lawyer/BaLawyerView';

const BuyerLawyerView = ({ route, navigation }) => {
	const { transaction } = route.params;
	return (
		<>
			<BaLawyerView
				notAgent={true}
				route={{ params: { transaction } }}
				navigation={navigation}
				transaction={transaction}
			/>
		</>
	);
};

export default BuyerLawyerView;
