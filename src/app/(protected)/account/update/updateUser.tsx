import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import Modal from 'react-native-modal';
import ScreenWrapper from '@/components/ScreenWrapper';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileEditScreen() {
  const { user } = useUser();
  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setUsername(user.username || '');
      setImageUri(user.imageUrl || null);
    }
  }, [user]);

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  const pickFromLibrary = async () => {
    closeModal();
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];
      setImageUri(asset.uri);
      const imageFile = {
        uri: asset.uri,
        name: 'profile.jpg',
        type: 'image/jpeg',
      } as unknown as File;
      setNewImageFile(imageFile);
    }
  };

  const takePhoto = async () => {
    closeModal();
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];
      setImageUri(asset.uri);
      const imageFile = {
        uri: asset.uri,
        name: 'profile.jpg',
        type: 'image/jpeg',
      } as unknown as File;
      setNewImageFile(imageFile);
    }
  };
  

    const handleUpdate = async () => {
      setUsernameError('');
      setFirstNameError('');
      setLastNameError('');

      let hasError = false;

      if (firstName.trim() === '') {
        setFirstNameError('First name is required.');
        hasError = true;
      }

      if (lastName.trim() === '') {
        setLastNameError('Last name is required.');
        hasError = true;
      }

      if (hasError) return;
      
      try {
        const updates: any = {};

        if (firstName !== user?.firstName) updates.firstName = firstName;
        if (lastName !== user?.lastName) updates.lastName = lastName;
        if (username !== user?.username) updates.username = username;

        if (Object.keys(updates).length > 0) {
          await user?.update(updates);
        }

        if (newImageFile) {
          await user?.setProfileImage({ file: newImageFile });
        }

        Alert.alert('Success', 'Your profile has been updated.');
        router.back();
      } catch (error: any) {
        if (
          error.errors &&
          Array.isArray(error.errors) &&
          error.errors[0]?.code === 'form_identifier_exists'
        ) {
          setUsernameError('This username is already taken.');
        } else {
          Alert.alert('Error', 'Something went wrong. Please try again.');
        }
      }
    };


  const { t } = useTranslation();
 
  return (
    <ScreenWrapper>
       <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <ScrollView contentContainerStyle={styles.container}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color="#4353FD" />
          </TouchableOpacity>

          <TouchableOpacity onPress={openModal}>
            {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
            <Text style={styles.editPhotoText}>{t('uploadPic')}</Text>
          </TouchableOpacity>

          <Text style={styles.label}>{t("uName")}</Text>
          <TextInput
            value={username}
            onChangeText={(text) => {
              setUsername(text);
              setUsernameError(''); // Clear error while typing
            }}
            style={[
              styles.input,
              usernameError ? { borderColor: 'red', borderWidth: 1 } : {},
            ]}
            placeholder="Enter username"
            placeholderTextColor="#888"
          />
          {usernameError !== '' && (
            <Text style={styles.errorText}>{usernameError}</Text>
          )}

          <Text style={styles.label}>{t('fName')}</Text>
          <TextInput
            value={firstName}
            onChangeText={setFirstName}
            style={styles.input}
            placeholder="Enter first name"
            placeholderTextColor="#888"
          />

          {firstNameError !== '' && (
            <Text style={styles.errorText}>{firstNameError}</Text>
          )}


          <Text style={styles.label}>{t("lName")}</Text>
          <TextInput
            value={lastName}
            onChangeText={setLastName}
            style={styles.input}
            placeholder="Enter last name"
            placeholderTextColor="#888"
          />
          {lastNameError !== '' && (
            <Text style={styles.errorText}>{lastNameError}</Text>
          )}


          <TouchableOpacity style={styles.button} onPress={handleUpdate}>
            <Text style={styles.buttonText}>{t('save')}</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Bottom Sheet Modal */}
        <Modal
          isVisible={isModalVisible}
          onBackdropPress={closeModal}
          style={styles.modal}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit profile picture</Text>
            <TouchableOpacity onPress={takePhoto}>
              <Text style={styles.modalOption}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={pickFromLibrary}>
              <Text style={styles.modalOption}>Photo Library</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={closeModal}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </SafeAreaView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 30,
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  image: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignSelf: 'center',
    marginBottom: 10,
    marginTop: 50
  },
  editPhotoText: {
    textAlign: 'center',
    color: '#4353FD',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 30,
  },
  label: {
    color: '#333',
    fontSize: 14,
    marginBottom: 6,
    marginLeft: 2,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: '#000',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4353FD',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    color: '#000',
  },
  modalOption: {
    fontSize: 16,
    color: '#4353FD',
    paddingVertical: 12,
  },
  modalCancel: {
    fontSize: 16,
    color: '#999',
    paddingVertical: 12,
    marginTop: 10,
  },
  errorText: {
  color: 'red',
  marginTop: -16,
  marginBottom: 16,
  marginLeft: 4,
  fontSize: 12,
},
backButton: {
  position: 'absolute',
  top: 10,
  left: 20,
  zIndex: 10,
  padding: 10,
},


});
