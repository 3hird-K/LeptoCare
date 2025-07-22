import React, { useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Switch,
  Image,
} from 'react-native';
import FeatherIcon from '@expo/vector-icons/Feather';
import { useUser, useAuth } from '@clerk/clerk-expo';
import i18n from '@/i18n/config'; // Ensure i18n is initialized
import { useTranslation } from 'react-i18next';
import { useActionSheet } from '@expo/react-native-action-sheet';

export default function Settings() {
  const [form, setForm] = useState({
    emailNotifications: true,
    pushNotifications: false,
  });

  const { user } = useUser();
  const { signOut } = useAuth();
  const { t } = useTranslation();
  const { showActionSheetWithOptions } = useActionSheet();

  const languageLabels: Record<string, string> = {
    en: 'English',
    cb: 'Cebuano',
    fi: 'Filipino',
  };
  const languages = ['en', 'cb', 'fi'];

  const onPressLanguage = () => {
  const options = languages.map(code => languageLabels[code]);
  options.push(t('Cancel'));
  const cancelIndex = options.length - 1;

  showActionSheetWithOptions(
    { options, cancelButtonIndex: cancelIndex },
    (buttonIndex) => {
      if (buttonIndex === undefined || buttonIndex === cancelIndex) return;
      const newLang = languages[buttonIndex];
      i18n.changeLanguage(newLang);
    }
  );
};

  const defaultAvatar = 'https://i.pravatar.cc/150';
  const avatarUrl =
    !user?.imageUrl || user.imageUrl.includes('clerk.dev/static')
      ? defaultAvatar
      : user.imageUrl;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f8f8' }}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Account Section */}
        <View style={[styles.section, { paddingTop: 10 }]}>
          <Text style={styles.sectionTitle}>{t('account')}</Text>
          <View style={styles.sectionBody}>
            <TouchableOpacity onPress={() => { /* handle profile tap */ }} style={styles.profile}>
              <Image
                alt="Profile Avatar"
                source={{ uri: avatarUrl }}
                style={styles.profileAvatar}
              />
              <View style={styles.profileBody}>
                <Text style={styles.profileName}>{user?.fullName}</Text>
                <Text style={styles.profileHandle}>
                  {user?.emailAddresses?.[0]?.emailAddress}
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
                <Text style={styles.rowValue}>Los Angeles, CA</Text>
                <FeatherIcon color="#bcbcbc" name="chevron-right" size={19} />
              </TouchableOpacity>
            </View>

            <View style={styles.rowWrapper}>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>{t('emailNotifications')}</Text>
                <View style={styles.rowSpacer} />
                <Switch
                  onValueChange={emailNotifications =>
                    setForm({ ...form, emailNotifications })
                  }
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
                  onValueChange={pushNotifications =>
                    setForm({ ...form, pushNotifications })
                  }
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
            {['contactUs', 'reportBug', 'rateApp', 'termsPrivacy'].map((key, idx, arr) => (
              <View
                key={key}
                style={[
                  styles.rowWrapper,
                  idx === 0 && styles.rowFirst,
                  idx === arr.length - 1 && styles.rowLast,
                ]}
              >
                <TouchableOpacity onPress={() => {}} style={styles.row}>
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
    </SafeAreaView>
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
});