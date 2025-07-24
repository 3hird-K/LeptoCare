import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import ScreenWrapper from '@/components/ScreenWrapper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from '@clerk/clerk-expo';
import { useTranslation } from 'react-i18next';

export default function PreventionScreen() {
  const router = useRouter();
  const { user } = useUser();
  const { t } = useTranslation();

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('prevention')}</Text>
        </View>

        {/* Content */}
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={[styles.sectionHeader, {marginTop: -8}]}>{t('preventionGuide')}</Text>

          <View style={styles.card}>
            <ImageBackground
                source={require('@assets/gloves.png')}
                style={styles.cardBackground}
                imageStyle={{ opacity: 0.4 }} // Optional: make image faint
                >
                <Text style={styles.paragraph}>
                <Text style={styles.danger}>{t('p1')}</Text> {t('p2')}
                </Text>
                <Text style={styles.paragraph}>
                {t('p3')} <Text style={styles.bold}>{t('p4')}</Text>
                </Text>
            </ImageBackground>
            
          </View>
          <View style={styles.card}>
            <Text style={styles.paragraph}>
              <Text style={styles.danger}>{t('p5')}</Text>{t('p6')}
            </Text>
            <Text style={styles.paragraph}>
              <Text style={styles.bold}>{t('p7')}</Text>{t('p8')}
            </Text>
            <Text style={styles.paragraph}>
              {t('p9')}<Text style={styles.bold}>{t('p10')}</Text>{t('p11')}
            </Text>
            <Text style={styles.paragraph}>
              <Text style={styles.bold}>{t('p12')}</Text>{t('p13')}
            </Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.paragraph}>
              <Text style={styles.danger}>{t('p14')}</Text>{t('p15')}
            </Text>
          </View>

         <View style={styles.card}>
            <ImageBackground
                source={require('@assets/hygiene.png')}
                style={styles.cardBackground}
                imageStyle={{ opacity: 0.6 }} 
                >
                <Text style={styles.paragraph}>
                    <Text style={styles.danger}>{t('p16')}</Text> {t('p17')}
                </Text>
                <Text style={styles.paragraph}>
                    {t('p18')}<Text style={styles.bold}>{t('p19')}</Text>{t('p20')}
                </Text>
            </ImageBackground>
        </View>
          <View style={styles.card}>
            <Text style={styles.paragraph}>
              <Text style={styles.danger}>{t('p21')}</Text>{t('p22')}
            </Text>
            <Text style={styles.paragraph}>
              {t('p23')}<Text style={styles.bold}>{t('p24')}</Text>
            </Text>
            <Text style={styles.paragraph}>
              {t('p25')}<Text style={styles.bold}>{t('p26')}</Text>{t('p27')}
            </Text>
            <Text style={styles.paragraph}>
              {t('p28')}<Text style={styles.bold}>{t('p29')}</Text>{t('p30')}
            </Text>
            <Text style={styles.paragraph}>
              <Text style={styles.bold}>{t('p31')}</Text>{t('p32')}
            </Text>
            <Text style={styles.paragraph}>
             {t('p33')}<Text style={styles.bold}>{t('p34')}</Text>{t('p35')}
            </Text>
          </View>

          <Text style={styles.sectionHeader}>{t('treatment')}</Text>

          <View style={styles.card}>
            <Text style={styles.paragraph}>
              {t('p36')}<Text style={styles.bold}>{t('p37')}</Text>{t('p38')}
            </Text>
            <Text style={styles.paragraph}>
              {t('p39')}<Text style={styles.bold}>{t('p40')}</Text>.
            </Text>
            <Text style={styles.paragraph}>
             {t('p41')}
            </Text>
            <Image
                source={require('@assets/checkup.png')} 
                style={{ width: '100%', height: 200, marginTop: 12 }}
                resizeMode="contain"
            />
          </View>

          <View style={styles.readButtonWrapper}>
            <TouchableOpacity
              style={styles.readButton}
              onPress={async () => {
                if (user) {
                  const key = `prevention_read_${user.id}`;
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
    backgroundColor: '#E95555',
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
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    paddingRight: 10,
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
  danger: {
    color: '#e74c3c',
    fontWeight: 'bold',
  },
  highlight: {
    color: '#e67e22',
    fontWeight: 'bold',
  },
  sectionHeader: {
    backgroundColor: '#E95555',
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    // paddingVertical: 8,
    // paddingHorizontal: 14,
    padding: 15,
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
    padding: 30,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  readButtonWrapper: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 40,
  },
  readButton: {
    backgroundColor: '#E95555',
    // paddingVertical: 12,
    // paddingHorizontal: 20,
    padding: 15,
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
  cardBackground: {
  borderRadius: 10,
  overflow: 'hidden',
  backgroundColor: '#fff', // fallback color
},

});