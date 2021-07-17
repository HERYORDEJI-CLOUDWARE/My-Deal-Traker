import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ListItem from '../../../../components/ListItem';
import colors from '../../../../constants/colors';
import SaPropertyInfo from '../../../SA/Property/views/PropertyTab/PropertyInfo';

const SLPropertyInfo = ({ navigation, route }) => {
	return (
		<>
			<SaPropertyInfo navigation={navigation} route={route} />
		</>
	);
};

export default SLPropertyInfo;
