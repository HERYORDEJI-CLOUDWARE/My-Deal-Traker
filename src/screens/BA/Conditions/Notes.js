import { Card, Container, Fab, Textarea, Toast } from 'native-base';
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
import AddRepair from './AddRepair';
import ButtonPrimaryBig from '../../../components/ButtonPrimaryBig';

const Notes = ({ transaction, notAgent, setView }) => {
	const [isLoading, setIsLoading] = useState(true);

	const [isAddingNote, setIsAddingNote] = useState(false);

	const {
		state: { user },
	} = useContext(Context);

	useFocusEffect(
		useCallback(() => {
			fetchNotes();
		}, []),
	);

	const [showAddNote, setShowAddNote] = useState(false);
	const [showNotes, setShowNotes] = useState(false);
	const [note, setNote] = useState('');
	const [transNotes, setTransNotes] = useState([]);

	const fetchNotes = async () => {
		try {
			const token = await fetchAuthToken();
			const response = await appApi.get(
				`/fetch_transaction_repairs_notes.php?transaction_id=${transaction.transaction_id}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);
			if (response.data.response.status == 200) {
				setTransNotes(response.data.response.data);
				setIsLoading(false);
			}
		} catch (error) {
			displayError(error);
			setIsLoading(false);
		}
	};

	const addNote = async () => {
		try {
			setIsAddingNote(true);
			const token = await fetchAuthToken();
			const data = new FormData();
			// data.append("repair_id");
			data.append('user_id', user.unique_id);
			data.append('note', note);
			data.append('transaction_id', transaction.transaction_id);
			const response = await appApi.post(`/add_repairs_note.php`, data, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			if (response.data.response.status == 200) {
				fetchNotes();
			}
			setIsAddingNote(false);
			setShowAddNote(false);
			setNote('');
		} catch (error) {
			setIsAddingNote(false);
			displayError(error);
		}
	};

	return (
		<View>
			<View
				style={{
					marginVertical: RFValue(20),
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
				}}
			>
				<Text style={{ ..._font.H5, color: colors.white }}>Notes</Text>
			</View>

			<View style={{ flex: 1, paddingBottom: RFValue(100) }}>
				{isLoading ? (
					<ActivityIndicator size={'large'} color={colors.white} />
				) : (
					<FlatList
						data={transNotes}
						keyExtractor={(d, i) => i.toString()}
						ListEmptyComponent={
							<View>
								<Text style={{ ..._font.Medium, color: colors.white }}>
									No notes available
								</Text>
							</View>
						}
						renderItem={({ item }) => (
							<View style={styles.noteItemWrapper}>
								<Text style={{ ..._font.Medium, fontSize: RFValue(14) }}>
									{item.note}
								</Text>
								<Text style={{ ..._font.Small, fontSize: RFValue(12) }}>
									{moment(item.date_created).format('ddd D MMMM, YYYY  hh:mmA')}
								</Text>
							</View>
						)}
					/>
				)}
				<ReactNativeModal
					isVisible={showAddNote}
					onBackdropPress={() => {
						setShowAddNote(false);
						setNote('');
					}}
					onBackButtonPress={() => {
						setShowAddNote(false);
						setNote('');
					}}
				>
					<View style={{ backgroundColor: colors.white, padding: RFValue(20) }}>
						<Text style={{ ..._font.Big, textAlign: 'center' }}>Add note</Text>
						<View
							style={{
								backgroundColor: colors.white,
								height: RFValue(100),
								marginVertical: RFValue(20),
								borderWidth: RFValue(0.5),
							}}
						>
							<Textarea
								placeholder='Write your note here...'
								value={note}
								onChangeText={setNote}
								style={{ height: RFValue(100), flex: 1 }}
								multiline={true}
							/>
						</View>

						<ButtonPrimaryBig
							title={isAddingNote ? 'Adding...' : 'Add'}
							onPress={addNote}
						/>
					</View>
				</ReactNativeModal>
			</View>
			<FAB
				style={styles.fab}
				small
				icon='plus'
				onPress={() => {
					setShowAddNote(true);
					setNote('');
				}}
			/>
		</View>
	);
};

export default Notes;

const styles = StyleSheet.create({
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
	noteItemWrapper: {
		flexDirection: 'column',
		flexWrap: 'wrap',
		marginVertical: RFValue(5),
		padding: RFValue(10),
		backgroundColor: colors.white,
		borderRadius: RFValue(5),
	},
});
