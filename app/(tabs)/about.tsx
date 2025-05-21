import React from 'react';
import { ScrollView, StyleSheet, View, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Typography } from '../../components/Typography';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { useTheme } from '../../constants/Theme';
import { useTranslation } from 'react-i18next';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Ionicons, Feather, MaterialIcons, FontAwesome } from '@expo/vector-icons';

export default function AboutScreen() {
  const { colors, spacing } = useTheme();
  const router = useRouter();
  const { t } = useTranslation();

  const openLink = (url: string) => {
    Linking.openURL(url);
  };

  const shareApp = () => {
    if (navigator.share) {
      navigator.share({
        title: t('app.title'),
        text: 'Track your daily creatine intake with this helpful app',
        url: 'https://creatinetracker.app'
      });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />          
          </TouchableOpacity>
          <Typography variant="h2" align="center">{t('about.title')}</Typography>
        </View>

        <Animated.View entering={FadeInDown.delay(100).duration(500)}>
          <Card style={styles.card}>
            <Typography variant="h3">{t('about.whatIsCreatine.title')}</Typography>
            <Typography
              variant="body1"
              color={colors.textSecondary}
              style={styles.paragraph}
            >
              {t('about.whatIsCreatine.paragraph1')}
            </Typography>

            <Typography
              variant="body1"
              color={colors.textSecondary}
              style={styles.paragraph}
            >
              {t('about.whatIsCreatine.paragraph2')}
            </Typography>
          </Card>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <Card style={styles.card}>
            <Typography variant="h3">{t('about.howToUse.title')}</Typography>
            <View style={styles.howToItem}>
              <Typography
                variant="subtitle2"
                color={colors.primary}
              >
                {t('about.howToUse.step1Title')}
              </Typography>
              <Typography
                variant="body2"
                color={colors.textSecondary}
              >
                {t('about.howToUse.step1Desc')}
              </Typography>
            </View>

            <View style={styles.howToItem}>
              <Typography
                variant="subtitle2"
                color={colors.primary}
              >
                {t('about.howToUse.step2Title')}
              </Typography>
              <Typography
                variant="body2"
                color={colors.textSecondary}
              >
                {t('about.howToUse.step2Desc')}
              </Typography>
            </View>

            <View style={styles.howToItem}>
              <Typography
                variant="subtitle2"
                color={colors.primary}
              >
                {t('about.howToUse.step3Title')}
              </Typography>
              <Typography
                variant="body2"
                color={colors.textSecondary}
              >
                {t('about.howToUse.step3Desc')}
              </Typography>
            </View>
          </Card>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(500)}>
          <Card style={styles.card}>
            <Typography variant="h3">{t('about.dosage.title')}</Typography>
            <Typography
              variant="body1"
              color={colors.textSecondary}
              style={styles.paragraph}
            >
              {t('about.dosage.paragraph')}
            </Typography>

            <Typography
              variant="body1"
              color={colors.textSecondary}
              style={[styles.paragraph, styles.disclaimer]}
            >
              {t('about.dosage.disclaimer')}
            </Typography>
          </Card>
        </Animated.View>

        <View style={styles.buttonsContainer}>
          <Button
            variant="outlined"
            startIcon={<Feather name="share-2" size={20} color={colors.primary} />}
            onPress={shareApp}
            style={styles.actionButton}
          >
            {t('about.actions.shareApp')}
          </Button>

          <Button
            variant="contained"
            startIcon={<FontAwesome name="coffee" size={20} color={colors.colors.white} />}
            onPress={() => openLink('https://www.buymeacoffee.com/sonoldev')}
            style={styles.actionButton}
          >
            {t('about.actions.supportUs')}
          </Button>
        </View>

        <TouchableOpacity
          style={styles.externalLink}
          onPress={() => openLink('https://examine.com/supplements/creatine/')}
        >
          <Feather name="external-link" size={16} color={colors.primary} style={styles.linkIcon} />          
          <Typography
            variant="body2"
            color={colors.primary}
          >
            {t('about.actions.learnMore')}
          </Typography>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Typography
            variant="caption"
            color={colors.textSecondary}
            align="center"
          >
            {t('about.footer.version')}
          </Typography>
          <View style={styles.madeWith}>
            <Typography
              variant="caption"
              color={colors.textSecondary}
              align="center"
              style={styles.madeWithText}
            >
              {t('about.footer.madeWith')}
            </Typography>
            <Feather name="heart" size={12} color={colors.accent} />            
            <Typography
              variant="caption"
              color={colors.textSecondary}
              align="center"
              style={styles.madeWithText}
            >
              {t('about.footer.by')}
            </Typography>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    padding: 8,
  },
  card: {
    marginBottom: 16,
    padding: 16,
  },
  paragraph: {
    marginTop: 12,
  },
  howToItem: {
    marginTop: 12,
  },
  disclaimer: {
    fontStyle: 'italic',
    marginTop: 16,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 24,
  },
  actionButton: {
    marginHorizontal: 8,
  },
  externalLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  linkIcon: {
    marginRight: 6,
  },
  footer: {
    marginTop: 'auto',
    marginBottom: 16,
  },
  madeWith: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  madeWithText: {
    marginHorizontal: 4,
  },
});