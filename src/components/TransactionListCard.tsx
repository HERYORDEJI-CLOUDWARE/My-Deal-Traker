import React from 'react';
import {
	View,
	StyleSheet,
	Dimensions,
	Text,
	TouchableOpacity,
} from 'react-native';
import { Card } from 'react-native-elements';
import colors from '../constants/colors';

const { width } = Dimensions.get('window');

const TransactionListCard = ({
	navigation,
	view,
	listNo,
	status,
	city,
	dad,
	item,
	transId,
}) => {
	return (
		<TouchableOpacity
			onPress={() =>
				navigation.navigate(view || 'viewListing', { property: item })
			}
		>
			<Card containerStyle={styles.card}>
				<View style={styles.innerCircle} />
				<View style={styles.upperCircle} />
				<View style={{ overflow: 'hidden' }}>
					{listNo ? (
						<Text style={{ color: colors.fairGrey, fontSize: 18 }}>
							<Text style={{ color: colors.fairGrey }}>Listing Number : </Text>
							<Text>{listNo}</Text>
						</Text>
					) : null}

					{transId ? (
						<Text style={{ color: colors.fairGrey, fontSize: 18 }}>
							<Text style={{ color: colors.fairGrey }}>Transaction ID : </Text>
							<Text>{transId}</Text>
						</Text>
					) : null}

					<Text
						style={{
							color: colors.fairGrey,
							paddingVertical: 10,
							fontSize: 18,
						}}
					>
						Status: {status == '0' ? 'Inactive' : 'Active'}
					</Text>

					{city ? (
						<Text style={{ color: colors.fairGrey }}>
							<Text style={{ fontSize: 18 }}>City: </Text>
							<Text style={{ fontSize: 18 }}>{city}</Text>
						</Text>
					) : null}

					<Text style={{ color: colors.fairGrey, paddingVertical: 10 }}>
						<Text style={{ fontSize: 18 }}>Date Added: </Text>
						<Text style={{ fontSize: 18 }}>{dad}</Text>
					</Text>

					<TouchableOpacity
						onPress={() =>
							navigation.navigate(view || 'viewListing', { property: item })
						}
						style={{ borderBottomWidth: 0.5, alignSelf: 'flex-end' }}
					>
						<Text style={{ textAlign: 'right', color: colors.brown }}>
							See more details
						</Text>
					</TouchableOpacity>
				</View>
			</Card>
		</TouchableOpacity>
	);
};

export default TransactionListCard;

const styles = StyleSheet.create({
	card: {
		width: width * 0.8,
		alignSelf: 'center',
		paddingVertical: 25,
		paddingHorizontal: 20,
		marginBottom: 27,
		borderRadius: 8.66,
		overflow: 'hidden',
	},
	innerCircle: {
		width: 70,
		height: 70,
		backgroundColor: colors.white,
		position: 'absolute',
		bottom: -50,
		left: -50,
		borderRadius: 50,
		borderWidth: 2,
		borderColor: colors.brown,
		zIndex: -10000,
	},
	upperCircle: {
		width: 70,
		height: 70,
		backgroundColor: colors.white,
		position: 'absolute',
		top: -70,
		left: (width * 0.8) / 3,
		borderRadius: 50,
		borderWidth: 2,
		borderColor: colors.brown,
		zIndex: -10000,
	},
});
