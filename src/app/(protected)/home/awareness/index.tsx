// AwarenessScreen.tsx

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import ScreenWrapper from '@/components/ScreenWrapper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from '@clerk/clerk-expo';
import { useTranslation } from 'react-i18next';

export default function AwarenessScreen() {
  const router = useRouter();
  const {user} = useUser(); 
  const {t} = useTranslation();

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => {
              console.log('pressed');
              router.back();
            }}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('awareness')}</Text>
        </View>

        {/* Content */}
        <ScrollView contentContainerStyle={styles.content}>
          {/* Intro Section */}
          <Text style={[styles.sectionHeader, {marginTop: -8}]}>{t('a1')}</Text>
          <View style={styles.card}>
            <View style={styles.inlineRow}>
              <View style={styles.textBlock}>
                <Text style={styles.paragraph}>
                  <Text style={[styles.bold, {fontSize:16 }]}>{t('a2')}</Text> {t('a3')}{' '}
                  <Text style={styles.bold}>leptospira</Text>, {t('a4')}
                </Text>
              </View>
              <Image
                source={require('@assets/leptovirus.png')}
                style={styles.inlineImage}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.paragraph}>
              {t('a5')}<Text style={styles.bold}>{t('a6')}</Text> {t('a7')}
            </Text>

            <Text style={styles.paragraph}>
              {t('a8')}
            </Text>
          </View>

          {/* How Humans Are Affected Section */}
          <Text style={styles.sectionHeader}>{t('a9')}</Text>
          <View style={styles.card}>
            <Text style={styles.paragraph}>
              {t('a10')}<Text style={styles.highlight}>{t('a11')}</Text>{t('a12')}
            </Text>
            <Text style={styles.paragraph}>
              {t('a13')}<Text style={styles.danger}>{t('a14')}</Text>.
            </Text>
            <Text style={styles.paragraph}>
              {t('a15')} <Text style={styles.danger}>{t('a16')}</Text> {t('a17')}.
            </Text>
          </View>

          {/* Continuation Section */}
          <View style={styles.card}>
            <Text style={styles.paragraph}>
              {t('a18')}{' '}
              <Text style={styles.danger}>{t('a19')}</Text> {t('a20')}{' '}
              <Text style={styles.danger}>{t('a21')}</Text>. {t('a22')}{' '}
              <Text style={styles.danger}>{t('a23')}</Text>.
            </Text>

            <Text style={styles.paragraph}>
              {t('a24')}
            </Text>
          </View>

          {/* Symptoms Section */}
          <View style={styles.card}>
            <Text style={styles.symptomHeader}>{t('a25')}</Text>
            <Text style={styles.paragraph}>
              {t('a26')} <Text style={styles.danger}>{t('a27')}</Text> {t('a28')}
            </Text>

            <View style={styles.bulletContainer}>
              {[
                t('a29'), // Fever
                t('a30'),
                t('a31'),
                t('a32'),
                t('a33'),
                t('a34'),
                t('a35'),
                t('a36'),
                t('a37'),
                t('a38'),
              ].map((symptom, i) => (
                <Text key={i} style={styles.bulletItem}>• {symptom}</Text>
              ))}
            </View>
          </View>


          {/* Clinical Finding Section */}
          <Text style={styles.sectionHeader}>{t('a39')}</Text>
          <View style={styles.card}>
            <Text style={styles.paragraph}>
              {t('a40')} <Text style={styles.highlight}>{t('a41')}</Text> {t('a42')} <Text style={styles.highlight}>{t('a43')}</Text> {t('a44')}
            </Text>
            <Text style={styles.paragraph}>
              {t('a45')}
            </Text>
            <Text style={styles.bulletItem}>
              • <Text style={styles.bold}>{t('a46')}</Text> {t('a47')}
            </Text>
            <Text style={styles.bulletItem}>
              • <Text style={styles.bold}>{t('a48')}</Text> {t('a49')}
            </Text>
            <Text style={styles.paragraph}>
              {t('a50')} <Text style={styles.danger}>{t('a51')}</Text>.
            </Text>
            <Text style={styles.paragraph}>
              {t('a52')} <Text style={styles.danger}>{t('a53')}</Text>. {t('a54')} <Text style={styles.danger}>{t('a55')}</Text> {t('a56')}
            </Text>
          </View>

          {/* How Animals Are Affected Section */}
          <Text style={styles.sectionHeader}>{t('a57')}</Text>
          <View style={styles.card}>
            <Text style={styles.paragraph}>
              {t('a58')} <Text style={styles.bold}>{t('a59')}</Text>{t('a60')}
            </Text>
            <View style={styles.bulletContainer}>
              {[
                t('a61'),
                t('a62'),
                t('a63'),
                t('a64'),
              ].map((animal, i) => (
                <Text key={i} style={styles.bulletItem}>• {animal}</Text>
              ))}
            </View>
             <Text style={styles.paragraph}>
              {t('a65')} <Text style={styles.danger}>{t('a66')}</Text> {t('a67')}
            </Text>
            <Text style={styles.paragraph}>
              {t('a68')} <Text style={styles.bold}>{t('a69')}</Text> {t('a70')} <Text style={styles.danger}>{t('a71')}</Text>.
            </Text>
            <Text style={styles.paragraph}>
              {t('a72')}
            </Text>
            <Image
              source={require('@assets/consult.png')} 
              style={{ width: '100%', height: 140, marginTop: 12 }}
              resizeMode="contain"
            />
          </View>

          {/* Mark as Read Button */}
          <View style={styles.readButtonWrapper}>
            <TouchableOpacity
              style={styles.readButton}
              onPress={async () => {
                if (user) {
                  const key = `awareness_read_${user.id}`;
                  await AsyncStorage.setItem(key, 'true');
                  router.back();
                }
              }}
            >
              <Text style={styles.readButtonText}>{t('a73')}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4FAFA',
  },
  header: {
    backgroundColor: '#3EB4AC',
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 4,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    paddingRight: 10,
  },
  headerIcon: {
    width: 20,
    height: 20,
    marginHorizontal: 4,
  },
  content: {
    padding: 16,
  },
  paragraph: {
    fontSize: 15.5,
    lineHeight: 24,
    marginBottom: 14,
    color: '#333',
  },
  bold: {
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  sectionHeader: {
    backgroundColor: '#3EB4AC',
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginTop: 24,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  highlight: {
    color: '#e67e22',
    fontWeight: 'bold',
  },
  danger: {
    color: '#e74c3c',
    fontWeight: 'bold',
  },
  inlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },
  textBlock: {
    flex: 1,
    paddingRight: 10,
  },
  inlineImage: {
    width: 80,
    height: 80,
    borderRadius: 4,
  },
  symptomHeader: {
    backgroundColor: '#3EB4AC',
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  bulletContainer: {
    paddingLeft: 10,
    marginTop: 4,
  },
  bulletItem: {
    fontSize: 14.5,
    marginBottom: 6,
    color: '#333',
  },
  readButtonWrapper: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 40,
  },
  readButton: {
    backgroundColor: '#3EB4AC',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  readButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

});
