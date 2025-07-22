import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import ScreenWrapper from '@/components/ScreenWrapper';

export default function AwarenessScreen() {
  return (
    <ScreenWrapper>
      <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Link style={styles.backText} href={'/'}>← Back</Link>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Awareness</Text>
        
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Leptospirosis</Text> is a disease caused by the bacterium called{' '}
          <Image
          source={require('@assets/leptocare.png')} // replace with your icon image
          style={styles.headerIcon}
          resizeMode="contain"
        />
          <Text style={styles.bold}>Leptospira</Text> which can be found in contaminated water or soil. You can get
          infected with Leptospira through abrasions or cuts in your skin, or through your eyes, nose or mouth.
        </Text>

        <Text style={styles.paragraph}>
          The bacteria that causes leptospirosis are <Text style={styles.bold}>spread through the urine</Text> (pee) of infected animals.
        </Text>

        <Text style={styles.paragraph}>
          The risk of leptospirosis increases after a hurricane or flood when people have contact with contaminated water or soil.
        </Text>

        <Text style={styles.sectionHeader}>HOW HUMANS ARE AFFECTED?</Text>

        <Text style={styles.paragraph}>
          Contact with <Text style={styles.highlight}>contaminated water or soil</Text> that contains urine of body fluids from infected animals,
          especially after hurricanes, flooding, or heavy rainfall.
        </Text>

        <Text style={styles.paragraph}>
          Directly touching the body fluids from an <Text style={styles.danger}>infected animal</Text>.
        </Text>

        <Text style={styles.paragraph}>
          Eating food or drinking water <Text style={styles.danger}>contaminated by the urine</Text> of an infected animal.
        </Text>
      </ScrollView>
    </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    backgroundColor: '#3EB4AC',
    paddingVertical: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  headerTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 22,
    flex: 1,
    textAlign: 'center',
    marginLeft: -30, // adjust for centering
  },
  headerIcon: {
    width: 40,
    height: 40,
  },
  content: {
    padding: 16,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 16,
  },
  bold: {
    fontWeight: 'bold',
  },
  sectionHeader: {
    backgroundColor: '#3EB4AC',
    paddingVertical: 6,
    paddingHorizontal: 12,
    color: '#fff',
    borderRadius: 10,
    fontWeight: 'bold',
    fontSize: 16,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  highlight: {
    color: 'red',
    fontWeight: 'bold',
  },
  danger: {
    color: '#d00000',
    fontWeight: 'bold',
  },
});
