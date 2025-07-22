import React from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import CustomBtn from "@/components/CustomBtn";
import i18n from '@/i18n/config'; // Ensure i18n is initialized
import { useTranslation } from 'react-i18next';
import { router } from "expo-router";
import ScreenWrapper from "@/components/ScreenWrapper";



export default function HomeScreen() {

  const { t } = useTranslation();

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <Text style={styles.header}>
        LeptoCare
      </Text>
      <Text style={styles.subtitle}>
        {t('guide')} 
      </Text>

      {/* Awareness Card */}
      <View style={[styles.card, { backgroundColor: "#bcdfffff" }]}>
        <Text style={[styles.tag, { backgroundColor: "#D0F0E0", color: "#1C7860" }]}>
          {t('reading')}
        </Text>
        <Text style={styles.cardTitle}>{t('awareness')}</Text>
        <Text style={styles.cardSubtitle}>{t('learn')}</Text>
        <Image
          source={require("@assets/icons/ribbon.png")}
          style={styles.icon}
          resizeMode="contain"
        />
        <CustomBtn text={t('review')} onPress={() => {router.push('_awareness/awareness')}} />
      </View>

      {/* Prevention Card */}
      <View style={[styles.card, { backgroundColor: "#ffc7c7ff" }]}>
        <Text style={[styles.tag, { backgroundColor: "#F9DADA", color: "#D43C3C" }]}>
          {t('reading')}
        </Text>
        <Text style={styles.cardTitle}>{t('prevention')}</Text>
        <Text style={styles.cardSubtitle}>{t('preventionMethod')}</Text>
        <Image
          source={require("@assets/icons/shield.png")}
          style={styles.icon}
          resizeMode="contain"
        />
        <CustomBtn text={t('review')} onPress={() => {}} />
      </View>
    </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 32,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    width: "100%",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,

    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,

    // Elevation for Android
    elevation: 5,
  },
  tag: {
    fontSize: 12,
    fontWeight: "600",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  icon: {
    width: 60,
    height: 60,
    alignSelf: "flex-end",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
    marginTop: -5,
    textAlign: "center",
  },
});
