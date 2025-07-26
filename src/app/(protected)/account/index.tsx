import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Switch,
  Image,
  Platform,
  Modal,
  Pressable,
  FlatList,
} from 'react-native';
import FeatherIcon from '@expo/vector-icons/Feather';
import { useUser, useAuth } from '@clerk/clerk-expo';
import i18n from '@/i18n/config';
import { useTranslation } from 'react-i18next';
import { useActionSheet } from '@expo/react-native-action-sheet';
import * as Location from 'expo-location';
import * as Linking from 'expo-linking';
import * as StoreReview from 'expo-store-review';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import ScreenWrapper from '@/components/ScreenWrapper';
import { saveLanguageToMetadata } from '@/utils/languageStore';

export default function Account() {
  const [form, setForm] = useState({
    emailNotifications: true,
    pushNotifications: false,
  });

  const { user } = useUser();
  const { signOut } = useAuth();
  const { t } = useTranslation();
  const { showActionSheetWithOptions } = useActionSheet();
  const [locationLabel, setLocationLabel] = useState<string>(t('Turn on your location.') || 'Loading...');
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  


  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationLabel(t('permissionDenied') || 'Permission denied');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const [place] = await Location.reverseGeocodeAsync(loc.coords);
      const label = [place.city, place.region].filter(Boolean).join(', ') || place.country || '';
      setLocationLabel(label);
    })();
  }, []);

  const languageLabels: Record<string, string> = {
    en: 'English',
    cb: 'Cebuano',
    fi: 'Filipino',
  };

  const languages = ['en', 'cb', 'fi'];

  // const onPressLanguage = () => {
  //   const options = languages.map(code => languageLabels[code]);
  //   options.push(t('Cancel'));
  //   const cancelIndex = options.length - 1;

  //   showActionSheetWithOptions(
  //     { options, cancelButtonIndex: cancelIndex },
  //     async (buttonIndex) => {
  //       if (buttonIndex === undefined || buttonIndex === cancelIndex) return;

  //       const newLang = languages[buttonIndex];
  //       await i18n.changeLanguage(newLang);

  //       if (user?.id) {
  //         await saveLanguageToMetadata(newLang, user.id); // ✅ Save per-user

  //         try {
  //           const langKey = `lang_${user.id}`;
  //           await SecureStore.setItemAsync(langKey, newLang); // ✅ Save locally
  //         } catch (err) {
  //           console.error('Failed to save language to SecureStore:', err);
  //         }
  //       }
  //     }
  //   );
  // };
  const onPressLanguage = () => {
      setLanguageModalVisible(true);
    };

    const handleLanguageSelect = async (langCode: string) => {
      setLanguageModalVisible(false);
      await i18n.changeLanguage(langCode);

      if (user?.id) {
        await saveLanguageToMetadata(langCode, user.id);
        try {
          const langKey = `lang_${user.id}`;
          await SecureStore.setItemAsync(langKey, langCode);
        } catch (err) {
          console.error('Failed to save language to SecureStore:', err);
        }
      }
    };



  const defaultAvatar = 'https://i.pravatar.cc/150';
  const avatarUrl =
    !user?.imageUrl || user.imageUrl.includes('clerk.dev/static')
      ? defaultAvatar
      : user.imageUrl;

  const onPressContact = () => {
    const email = 'dime.neil03@gmail.com';
    const mailto = `mailto:${email}?subject=${encodeURIComponent('Support Request')}`;
    Linking.openURL(mailto).catch(err => console.error('Email client error', err));
  };

  const onPressReport = () => {
    const email = 'dime.neil03@gmail.com';
    const mailto = `mailto:${email}?subject=${encodeURIComponent('Bug Report')}`;
    Linking.openURL(mailto).catch(err => console.error('Email client error', err));
  };

  const onPressRate = async () => {
    if (await StoreReview.hasAction()) {
      StoreReview.requestReview();
    } else {
      const androidAppId = 'com.yourcompany.yourapp'; // Replace with your actual Android app ID
      const url = Platform.select({
        ios: `itms-apps://itunes.apple.com/app/idYOUR_APP_ID?action=write-review`,
        android: `market://details?id=${androidAppId}`,
      });
      if (url) Linking.openURL(url).catch(err => console.error('Cannot open store', err));
    }
  };

  const onPressTerms = () => {
    router.push('/terms');
  };

  const handlers: Record<string, () => void> = {
    contactUs: onPressContact,
    reportBug: onPressReport,
    rateApp: onPressRate,
    termsPrivacy: onPressTerms,
  };

  const resources = ['contactUs', 'reportBug', 'rateApp', 'termsPrivacy'];

  // Use i18n.language as the selected language
  const selectedLanguage = i18n.language;

  useEffect(() => {
    if (languageModalVisible && flatListRef.current) {
      const index = languages.indexOf(selectedLanguage);
      if (index !== -1) {
        setTimeout(() => {
          flatListRef.current?.scrollToIndex({ index, animated: true });
        }, 100);
      }
    }
  }, [languageModalVisible, selectedLanguage]);

  return (
    <ScreenWrapper>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f8f8' }}>
        <ScrollView contentContainerStyle={styles.content}>
          {/* Account Section */}
          <View style={[styles.section, { paddingTop: 30 }]}>
            <Text style={styles.sectionTitle}>{t('account')}</Text>
            <View style={styles.sectionBody}>
              {/* <TouchableOpacity onPress={() => {}} style={styles.profile}> */}
              <TouchableOpacity onPress={() => router.push('/account/update')} style={styles.profile}>
                <Image alt="Profile Avatar" source={{ uri: avatarUrl }} style={styles.profileAvatar} />
                <View style={styles.profileBody}>
                  <Text style={styles.profileName}>{user?.fullName}</Text>
                  <Text style={styles.profileHandle}>
                    {user?.emailAddresses?.[0]?.emailAddress || user?.username}
                  </Text>
                </View>
                <FeatherIcon color="#bcbcbc" name="chevron-right" size={22} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Preferences Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('preferences')}</Text>
            <View style={styles.sectionBody}>

              <View style={[styles.rowWrapper, styles.rowFirst]}>
                <TouchableOpacity onPress={onPressLanguage} style={styles.row}>
                  <Text style={styles.rowLabel}>{t('language')}</Text>
                  <View style={styles.rowSpacer} />
                  <Text style={styles.rowValue}>
                    {languageLabels[i18n.language] ?? languageLabels.en}
                  </Text>
                  <FeatherIcon name="chevron-right" color="#bcbcbc" size={19} />
                </TouchableOpacity>
              </View>

              <View style={styles.rowWrapper}>
                <TouchableOpacity onPress={() => {}} style={styles.row}>
                  <Text style={styles.rowLabel}>{t('location')}</Text>
                  <View style={styles.rowSpacer} />
                  <Text style={styles.rowValue}>{locationLabel}</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.rowWrapper}>
                <View style={styles.row}>
                  <Text style={styles.rowLabel}>{t('emailNotifications')}</Text>
                  <View style={styles.rowSpacer} />
                  <Switch
                    onValueChange={emailNotifications => setForm({ ...form, emailNotifications })}
                    style={{ transform: [{ scaleX: 0.95 }, { scaleY: 0.95 }] }}
                    value={form.emailNotifications}
                  />
                </View>
              </View>

              <View style={[styles.rowWrapper, styles.rowLast]}>
                <View style={styles.row}>
                  <Text style={styles.rowLabel}>{t('pushNotifications')}</Text>
                  <View style={styles.rowSpacer} />
                  <Switch
                    onValueChange={pushNotifications => setForm({ ...form, pushNotifications })}
                    style={{ transform: [{ scaleX: 0.95 }, { scaleY: 0.95 }] }}
                    value={form.pushNotifications}
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Resources Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('resources')}</Text>
            <View style={styles.sectionBody}>
              {resources.map((key, idx) => (
                <View
                  key={key}
                  style={[
                    styles.rowWrapper,
                    idx === 0 && styles.rowFirst,
                    idx === resources.length - 1 && styles.rowLast,
                  ]}
                >
                  <TouchableOpacity onPress={handlers[key]} style={styles.row}>
                    <Text style={styles.rowLabel}>{t(key)}</Text>
                    <View style={styles.rowSpacer} />
                    <FeatherIcon color="#bcbcbc" name="chevron-right" size={19} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>

          {/* Logout */}
          <View style={styles.section}>
            <View style={styles.sectionBody}>
              <View
                style={[
                  styles.rowWrapper,
                  styles.rowFirst,
                  styles.rowLast,
                  { alignItems: 'center' },
                ]}
              >
                <TouchableOpacity onPress={() => signOut()} style={styles.row}>
                  <Text style={[styles.rowLabel, styles.rowLabelLogout]}>
                    {t('logout')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Footer */}
          <Text style={styles.contentFooter}>
            {t('version', { version: '2.24 #50491' })}
          </Text>
        </ScrollView>

       <Modal
        animationType="fade"
        transparent={true}
        visible={languageModalVisible}
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <View style={modalStyles.overlay}>
          <View style={modalStyles.modalContent}>
            <Text style={modalStyles.modalTitle}>{t('language')}</Text>

            <FlatList
              data={languages}
              keyExtractor={(item) => item}
              ref={flatListRef}
              showsVerticalScrollIndicator={false}
              initialScrollIndex={languages.indexOf(selectedLanguage)}
              getItemLayout={(data, index) => ({
                length: 48,
                offset: 48 * index,
                index,
              })}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => handleLanguageSelect(item)}
                  style={[
                    modalStyles.languageOption,
                    item === selectedLanguage && modalStyles.activeLanguageOption,
                  ]}
                >
                  <Text
                    style={[
                      modalStyles.languageText,
                      item === selectedLanguage && modalStyles.activeLanguageText,
                    ]}
                  >
                    {languageLabels[item]}
                  </Text>
                </Pressable>
              )}
            />

            <Pressable
              onPress={() => setLanguageModalVisible(false)}
              style={modalStyles.cancelButton}
            >
              <Text style={modalStyles.cancelText}>{t('Cancel')}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>


      </SafeAreaView>
    </ScreenWrapper>
  );
}


const styles = StyleSheet.create({
  /** Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
  },
  headerAction: {
    width: 40,
    height: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: '600',
    color: '#000',
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    textAlign: 'center',
  },
  /** Content */
  content: {
    paddingHorizontal: 16,
  },
  contentFooter: {
    marginTop: 24,
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
    color: '#a69f9f',
  },
  /** Section */
  section: {
    paddingVertical: 12,
  },
  sectionTitle: {
    margin: 8,
    marginLeft: 12,
    fontSize: 13,
    letterSpacing: 0.33,
    fontWeight: '500',
    color: '#a69f9f',
    textTransform: 'uppercase',
  },
  sectionBody: {
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  /** Profile */
  profile: {
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 9999,
    marginRight: 12,
  },
  profileBody: {
    marginRight: 'auto',
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#292929',
  },
  profileHandle: {
    marginTop: 2,
    fontSize: 16,
    fontWeight: '400',
    color: '#858585',
  },
  /** Row */
  row: {
    height: 44,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingRight: 12,
  },
  rowWrapper: {
    paddingLeft: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#f0f0f0',
  },
  rowFirst: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  rowLabel: {
    fontSize: 16,
    letterSpacing: 0.24,
    color: '#000',
  },
  rowSpacer: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  rowValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ababab',
    marginRight: 4,
  },
  rowLast: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  rowLabelLogout: {
    width: '100%',
    textAlign: 'center',
    fontWeight: '600',
    color: '#dc2626',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '80%',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  languageOption: {
    paddingVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  languageText: {
    fontSize: 16,
    color: '#4353Fd',
  },
  cancelButton: {
    marginTop: 16,
  },
  cancelText: {
    fontSize: 16,
    color: '#dc2626',
  },
});

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  languageOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderRadius: 8,
  },
  languageText: {
    fontSize: 16,
    color: '#333',
  },
  activeLanguageOption: {
    backgroundColor: '#4353FD',
  },
  activeLanguageText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelButton: {
    marginTop: 16,
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  cancelText: {
    color: '#4353FD',
    fontSize: 16,
  },
});
