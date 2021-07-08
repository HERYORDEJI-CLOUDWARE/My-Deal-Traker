import React from 'react';
import LogoPage from '../../../../../components/LogoPage';
import Conditions from '../../../../BA/Conditions/Conditions';

const BuyerConditions = ({ route, navigation }) => {
	const { transaction, property } = route.params;
	return (
		<LogoPage dontShow={true}>
			<Conditions
				transaction={transaction}
				property={property}
				notAgent={false}
			/>
		</LogoPage>
	);
};

export default BuyerConditions;
