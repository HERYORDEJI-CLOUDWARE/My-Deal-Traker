import { Card, Container, Fab, Toast } from 'native-base';
import React, { useCallback } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import {
	Alert,
	FlatList,
	Pressable,
	StyleSheet,
	TouchableOpacity,
	View,
	Text,
} from 'react-native';
import appApi from '../../../api/appApi';
import ListEmptyComponent from '../../../components/ListEmptyComponent';
import colors from '../../../constants/colors';
import { displayError, fetchAuthToken } from '../../../utils/misc';
import moment from 'moment';
import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native';
import { useContext } from 'react';
import { Context } from '../../../context/UserContext';
import ReactNativeModal from 'react-native-modal';
import { Input } from 'react-native-elements';
import { ScrollView } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import _font from '../../../styles/fontStyles';
import { FAB, Switch } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';
// import AddRepair from './AddRepair';

const Repairs = ({ transaction, notAgent, setView }) => {
	const [repairs, setRepairs] = useState([]);

	const [isLoading, setIsLoading] = useState(true);

	const [isAddingNote, setIsAddingNote] = useState(false);

	const {
		state: { user },
	} = useContext(Context);

	// useFocusEffect(
	// 	useCallback(() => {
	// 		fetchRepairs();
	// 	}, []),
	// );
	//
	useEffect(() => {
		fetchRepairs();
	}, []);

	const [itemToUpdate, setItemToUpdate] = useState();
	const [isUpdating, setIsUpdating] = useState(false);

	const fetchRepairs = async () => {
		try {
			const token = await fetchAuthToken();
			const response = await appApi.get(
				`/fetch_transaction_repair.php?transaction_id=${transaction.transaction_id}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);
			if (response.data.response.status == 200) {
				setRepairs(response.data.response.data);
				setIsLoading(false);
			} else {
				Toast.show({
					type: 'warning',
					text: response.data.response.message,
				});
				setIsLoading(false);
			}
		} catch (error) {
			displayError(error);
		}
	};

	const ListEmpty = (
		<React.Fragment>
			{/* <ListEmptyComponent title='Nothing here' info='Check back later' /> */}
			<Text
				style={{
					..._font.Medium,
					color: colors.white,
					// paddingVertical: RFValue(10),
				}}
				onPress={() => setView('inspection')}
			>
				No repairs have been added
			</Text>
		</React.Fragment>
	);

	const onMarkDone = async (item) => {
		try {
			Alert.alert('Confirm', 'Are you sure you want to confirm this repair?', [
				{
					text: 'Yes',
					onPress: () => markDone(item),
				},
				{
					text: 'NO',
				},
			]);
		} catch (error) {}
	};

	const markDone = async (item) => {
		try {
			setIsUpdating(true);
			setItemToUpdate(item.id);
			const token = await fetchAuthToken();
			const data = new FormData();
			data.append('user_id', user.unique_id);
			data.append('transaction_id', item.transaction_id);
			data.append('repair_id', item.repair_id);
			const response = await appApi.post(`/mark_repair_as_done.php`, data, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			if (response.data.response.status == 200) {
				fetchRepairs();
				Toast.show({
					type: 'success',
					text: response.data.response.message,
				});
			} else {
				fetchRepairs();
				Toast.show({
					type: 'warning',
					text: response.data.response.message,
				});
			}
			setIsUpdating(false);
		} catch (error) {
			displayError(error);
			setIsUpdating(false);
		}
	};

	const [showAddRepair, setShowAddRepair] = useState(false);

	const toggleShowAddRepair = (status) => setShowAddRepair(status);

	const renderAddRepair = () => (
		<ReactNativeModal
			isVisible={showAddRepair}
			onBackButtonPress={() => toggleShowAddRepair(false)}
		>
			{/* <AddRepair /> */}
		</ReactNativeModal>
	);

	console.log('..././', transaction);

	if (isLoading) {
		return (
			<Container style={{ backgroundColor: colors.bgBrown }}>
				<ActivityIndicator size={'large'} color={colors.white} />
			</Container>
		);
	}

	return (
		<View>
			{/* {renderAddRepair()} */}
			<View style={{ flex: 1, paddingBottom: RFValue(100) }}>
				<FlatList
					data={repairs}
					keyExtractor={(d, i) => i.toString()}
					ListEmptyComponent={ListEmpty}
					ListHeaderComponent={
						<View
							style={{
								marginVertical: RFValue(20),
								flexDirection: 'row',
								justifyContent: 'space-between',
								alignItems: 'center',
							}}
						>
							<Text style={{ ..._font.H5, color: colors.white }}>
								Repairs and Status
							</Text>
						</View>
					}
					renderItem={({ item }) => {
						return (
							<React.Fragment>
								<View style={{ marginHorizontal: 10 }}>
									<Card style={{ backgroundColor: 'rgba(255, 255, 255, 0.6)' }}>
										<View style={{ paddingHorizontal: 15, paddingVertical: 5 }}>
											{item.item ? (
												<View style={styles.rowWrapper}>
													<Text style={styles.key}>Item:</Text>
													<Text style={styles.value}>{item.item}</Text>
												</View>
											) : null}
											{item.recommended_repair ? (
												<View style={styles.rowWrapper}>
													<Text style={styles.key}>Recommended repair:</Text>
													<Text style={styles.value}>
														{item.recommended_repair}
													</Text>
												</View>
											) : null}
											<View style={styles.rowWrapper}>
												<Text style={styles.key}>Memo:</Text>
												<Text style={styles.value}>{item.memo}</Text>
											</View>

											<View style={styles.rowWrapper}>
												<Text style={styles.key}>Date added: </Text>
												<Text style={styles.value}>
													{moment(item.date_created).format('LT')}
												</Text>
											</View>
										</View>
										{item.status == '0' ? (
											<TouchableOpacity
												style={{
													backgroundColor: colors.brown,
													paddingHorizontal: RFValue(10),
													paddingVertical: RFValue(10),
												}}
												activeOpacity={1}
											>
												<Text style={styles.markBtns}>Not done</Text>
											</TouchableOpacity>
										) : item.status == '1' ? (
											<TouchableOpacity
												activeOpacity={1}
												style={{
													backgroundColor: colors.brown,
													paddingVertical: 10,
													paddingHorizontal: 20,
												}}
												disabled={notAgent}
												onPress={() => {
													onMarkDone(item);
												}}
											>
												<Text style={styles.markBtns}>
													{isUpdating && itemToUpdate == item.id
														? 'Loading...'
														: 'Confirm as done'}
												</Text>
											</TouchableOpacity>
										) : (
											<TouchableOpacity
												style={{
													backgroundColor: colors.brown,
													paddingVertical: 5,
													paddingHorizontal: 20,
												}}
												activeOpacity={1}
											>
												<Text
													style={{
														...styles.markBtns,
														backgroundColor: 'green',
														color: colors.white,
													}}
												>
													Done
												</Text>
											</TouchableOpacity>
										)}
									</Card>
								</View>
							</React.Fragment>
						);
					}}
				/>
			</View>
			{/* <FAB
				style={styles.fab}
				small
				icon='plus'
				onPress={() => console.log('Pressed')}
			/> */}
		</View>
	);
};

export default Repairs;

const styles = StyleSheet.create({
	markBtns: {
		..._font.Medium,
		color: colors.black,
		borderWidth: 0.5,
		alignSelf: 'flex-start',
		marginVertical: RFValue(5),
		paddingHorizontal: RFValue(15),
		paddingVertical: RFValue(5),
		backgroundColor: 'rgba(255, 255, 255, 0.6)',
		borderRadius: RFValue(5),
		borderColor: colors.white,
		fontSize: RFValue(12),
	},
	rowWrapper: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'flex-start',
		borderBottomWidth: RFValue(1),
		borderBottomColor: colors.lightBrown + '50',
	},
	key: {
		..._font.Small,
		fontSize: RFValue(12),
		color: colors.fairGrey,
		flex: 0.4,
		marginRight: RFValue(5),
	},
	value: {
		..._font.Small,
		fontSize: RFValue(12),
		fontFamily: 'pop-medium',
		flex: 0.6,
	},
	fab: {
		position: 'absolute',
		margin: RFValue(16),
		padding: RFValue(5),
		backgroundColor: colors.brown,
		right: 0,
		bottom: 0,
	},
});
