import React from 'react';
import LogoPage from '../../../../components/LogoPage';
import PropertyTab from '../../../BA/Property/PropertyTab';

const BuyerPropertyDetails = ({ route, navigation }) => {
	const { property, transaction } = route.params;
	return (
		<LogoPage dontShow={true} containerStyle={{ paddingTop: 0 }}>
			<PropertyTab
				property={property}
				transaction={transaction}
				isLoading={false}
				hideBtn={true}
			/>
		</LogoPage>
	);
};

export default BuyerPropertyDetails;
