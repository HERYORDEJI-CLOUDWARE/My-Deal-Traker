import React, { useState } from 'react';
import {
	Text,
	View,
	TouchableOpacity,
	TextInput,
	StyleSheet,
	Pressable,
	ScrollView,
} from 'react-native';

import { RFValue } from 'react-native-responsive-fontsize';
import * as DocumentPicker from 'expo-document-picker';

import ButtonPrimaryBig from './ButtonPrimaryBig';
import Modal from 'react-native-modal';
import _font from '../styles/fontStyles';
import colors from '../constants/colors';
import { Textarea, Toast, Fab } from 'native-base';
import { fileUploadCategory } from './../utils/misc';

interface Props {
	fileCategory: [];
	onAddFile: (e: string, file: []) => void;
	toggleAddFileModal: (e: boolean) => void;
}

export default function AddFile(props: Props) {
	const [text, setText] = useState('');
	const [file, setFile] = useState({});
	const [isUploading, setIsUploading] = useState(false);
	const [myUploads, setMyUploads] = useState([]);
	const [validFile, setValidFile] = useState(false);
	const [showCategory, setShowCategory] = useState(false);
	const [fileCategory, setFileCategory] = useState(undefined);
	const [fileValidModal, setFileValidModal] = useState({ visible: false });

	const validateDocument = (fileName) => {
		if (
			fileName.substr(-3) === 'png' ||
			fileName.substr(-3) === 'jpg' ||
			fileName.substr(-3) === 'jpeg' ||
			(fileName.substr(-3) === 'pdf') === true
		) {
			setValidFile(true);
			setFileValidModal({ visible: false });
		} else {
			setValidFile(false);
			setFileValidModal({ visible: true });
			setFile({});
		}
	};

	const toggleCategoryModal = (status) => setShowCategory(status);

	const onSelectCategory = (category) => {
		setFileCategory(category);
		toggleCategoryModal(false);
	};

	const renderFileValidModal = () => (
		<Modal
			swipeDirection={'down'}
			isVisible={fileValidModal.visible}
			onBackButtonPress={() => setFileValidModal({ visible: false })}
		>
			<View
				style={{
					// flex: 1,
					backgroundColor: '#fff',
					justifyContent: 'center',
					width: '100%',
					padding: RFValue(20),
				}}
			>
				<Text style={styles.fileValidModalText}>Wrong file format</Text>
				<Text style={styles.fileValidModalText}>
					Accepted formats are PNG, JPG, JPEG, PDF
				</Text>
				<Pressable
					onPress={() => {
						setFileValidModal({ visible: false });
						setFile({});
					}}
					style={{
						padding: RFValue(10),
						alignItems: 'flex-end',
						paddingBottom: RFValue(0),
					}}
				>
					<Text>Okay</Text>
				</Pressable>
			</View>
		</Modal>
	);

	const renderCategoryModal = () => (
		<Modal
			isVisible={showCategory}
			// swipeDirection={'left' || 'right'}
			animationIn={'slideInUp'}
			animationOut={'slideOutDown'}
			onBackButtonPress={() => toggleCategoryModal(false)}
			style={{ padding: 0 }}
		>
			<ScrollView
				showsVerticalScrollIndicator={false}
				bounces={false}
				style={{ flex: 1 }}
				contentContainerStyle={{
					backgroundColor: '#fff',
					justifyContent: 'center',
					width: '100%',
					paddingTop: RFValue(20),
				}}
			>
				{fileUploadCategory.map((file, index) => (
					<Pressable
						key={index.toString()}
						onPress={() => onSelectCategory(file.title)}
						style={{
							marginHorizontal: RFValue(10),
							marginBottom: RFValue(20),
							padding: RFValue(10),
							borderWidth: RFValue(1),
							borderBottomColor: '#EEE',
						}}
					>
						<Text style={{ ..._font.Medium }}>{file.title}</Text>
					</Pressable>
				))}
			</ScrollView>
		</Modal>
	);

	const newUploadFile = async () => {
		if (validFile === false) {
			setFileValidShow({ visible: true });
			// setTimeout(() => {
			// 	setFileValidShow({ visible: false });
			// }, 2000);
		} else {
			const newAdd = [{ document_name: text, documentInfo: file }];
			setMyUploads([...myUploads, ...newAdd]);
			setText('');
			setFile(null);
		}
		// console.log(myUploads);}
	};
	const onUpload = async () => {
		const data = await DocumentPicker.getDocumentAsync();
		validateDocument(data.name);
		if (data.type === 'success') {
			setFile(data);
		}
	};

	return (
		<View style={{ flex: 1 }}>
			<View style={{}}>
				<>
					<Text
						style={{
							..._font.Medium,
							fontSize: RFValue(16),
							color: colors.white,
							// paddingBottom: RFValue(10),
						}}
					>
						Category (Required)
					</Text>
					<Pressable
						style={{
							...styles.textInputWrapper,
							marginTop: RFValue(0),
							marginBottom: RFValue(20),
						}}
						onPress={() => toggleCategoryModal(true)}
					>
						<TextInput
							value={fileCategory}
							placeholder={'Select category'}
							// onChangeText={(text) => setText(text)}
							placeholderTextColor={colors.fair}
							style={styles.textInput}
							editable={false}
						/>
					</Pressable>
				</>

				<>
					<Text
						style={{
							..._font.Medium,
							fontSize: RFValue(16),
							color: colors.white,
							// paddingBottom: RFValue(10),
						}}
					>
						Document
					</Text>
					<View
						style={
							{
								// ...styles.textInputWrapper,
								// marginTop: RFValue(0),
								// marginBottom: RFValue(20),
							}
						}
					>
						{/*<TextInput*/}
						{/*	value={file?.name}*/}
						{/*	placeholder={}*/}
						{/*	// onChangeText={(text) => setText(text)}*/}
						{/*	placeholderTextColor={}*/}
						{/*	*/}
						{/*	editable={false}*/}
						{/*/>*/}
						<Pressable
							onPress={onUpload}
							style={{
								...styles.textInput,
								justifyContent: 'center',
								paddingLeft: RFValue(10),
								marginBottom: RFValue(20),
							}}
						>
							<Text
								style={{
									..._font.Medium,
									color: file?.name ? colors.black : colors.fair,
									// color: colors.white,
								}}
							>
								{file?.name ?? 'Select file'}
							</Text>
						</Pressable>
					</View>
				</>

				{/*<ButtonSecondaryBig*/}
				{/*	title={'Select file'}*/}
				{/*	onPress={onUpload}*/}
				{/*/>*/}
			</View>
			<View>
				<Text
					style={{
						..._font.Medium,
						fontSize: RFValue(16),
						color: colors.white,
						// paddingBottom: RFValue(10),
					}}
				>
					Comment
				</Text>

				<View
					style={
						{
							// ...styles.textInputWrapper,
						}
					}
				>
					<Textarea
						value={text}
						placeholder={'Comment'}
						onChangeText={(text) => setText(text)}
						placeholderTextColor={colors.fair}
						style={{ ...styles.textArea, flex: 0 }}
					/>
				</View>
			</View>

			<TouchableOpacity
				disabled={file.name ? false : true}
				style={[styles.btn, { marginTop: RFValue(20), alignSelf: 'stretch' }]}
				onPress={() => props.onAddFile(text, file)}
			>
				<Text
					style={{
						..._font.Medium,
						color: colors.lightBrown,
						opacity: file.name ? 1 : 0.5,
					}}
				>
					Add File
				</Text>
			</TouchableOpacity>

			<TouchableOpacity
				disabled={file ? false : true}
				style={[
					styles.btn,
					{
						marginTop: RFValue(20),
						alignSelf: 'stretch',
						backgroundColor: colors.lightBrown,
					},
				]}
				onPress={() => props.toggleAddFileModal(false)}
			>
				<Text
					style={{
						..._font.Medium,
						color: colors.black,
						opacity: file ? 1 : 0.5,
					}}
				>
					Cancel
				</Text>
			</TouchableOpacity>
			{renderCategoryModal()}
			{renderFileValidModal()}
		</View>
	);
}

const styles = StyleSheet.create({
	btn: {
		alignSelf: 'center',
		backgroundColor: colors.white,
		alignItems: 'center',
		justifyContent: 'center',
		height: RFValue(50),
		borderRadius: RFValue(10),
	},
	textInputWrapper: {
		backgroundColor: colors.white,
		justifyContent: 'center',
		height: RFValue(50),
		borderRadius: RFValue(10),
		marginTop: RFValue(20),
		paddingHorizontal: RFValue(10),
	},
	textInput: {
		..._font.Medium,
		backgroundColor: colors.white,
		height: RFValue(50),
		borderRadius: RFValue(10),
	},
	textArea: {
		..._font.Medium,
		backgroundColor: colors.white,
		height: RFValue(100),
		borderRadius: RFValue(10),
	},
	emptyListWrapper: { alignItems: 'center', marginVertical: RFValue(10) },
	emptyListText: { ..._font.Medium, color: colors.white },
	fileValidModalText: { ..._font.Medium, color: colors.brown },
});
