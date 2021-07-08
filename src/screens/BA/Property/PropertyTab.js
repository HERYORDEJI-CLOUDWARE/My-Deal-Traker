import { Text, Toast } from 'native-base';
import React from 'react';
import { useState } from 'react';
import { ActivityIndicator } from 'react-native';
import colors from '../../../constants/colors';
import { navigate } from '../../../nav/RootNav';
import InterestForm from './InterestForm';
import MakePropertyOffer from './MakePropertyOffer';
import Pr from './PropertyDetail';

const PropertyTab = ({
	property,
	transaction,
	isLoading,
	transactionStarted,
	setSelected,
	hideBtn,
	navigation,
}) => {
	const [currentStep, setCurrentStep] = useState(1);

	function _renderStepContent(step) {
		switch (step) {
			case 1:
				return (
					<Pr
						move={moveTo2}
						property={property}
						makeOffer={moveTo3}
						transactionStarted={transactionStarted}
						theTransaction={transaction}
						setSelected={setSelected}
						hideBtn={hideBtn}
					/>
				);
			case 2:
				return (
					<InterestForm
						move={moveTo3}
						back={moveTo1}
						property={property}
						navigation={navigation}
					/>
				);
			case 3:
				return (
					<MakePropertyOffer
						setSelected={setSelected}
						back={moveTo1}
						property={property}
						theTransaction={transaction}
					/>
				);
			default:
				return <Text>STEP 4</Text>;
		}
	}

	const moveTo1 = () => {
		setCurrentStep(1);
	};

	const moveTo2 = () => {
		setCurrentStep(2);
	};

	const moveTo3 = () => {
		// // console.log({property, theTransaction: transaction, setSelected})
		navigate('baMakeOffer', {
			property,
			theTransaction: transaction,
			setSelected,
		});
		// setCurrentStep(3);
	};

	if (isLoading) {
		return <ActivityIndicator size='large' color={colors.white} />;
	}

	return <>{_renderStepContent(currentStep)}</>;
};

export default PropertyTab;
