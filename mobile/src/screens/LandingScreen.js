import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../utils/theme';

const { width, height } = Dimensions.get('window');

const LandingScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const features = [
    {
      icon: '📡',
      title: 'RFID Technology',
      description: 'Advanced RFID-based attendance tracking with real-time processing',
    },
    {
      icon: '⚡',
      title: 'Real-time Sync',
      description: 'Instant synchronization across all devices and platforms',
    },
    {
      icon: '📊',
      title: 'Analytics Dashboard',
      description: 'Comprehensive reports and analytics for attendance management',
    },
    {
      icon: '🔒',
      title: 'Secure System',
      description: 'Enterprise-grade security with role-based access control',
    },
  ];

  const handleGetStarted = () => {
    navigation.navigate('Login');
  };

  const FeatureCard = ({ feature, index }) => {
    const cardFadeAnim = useRef(new Animated.Value(0)).current;
    const cardSlideAnim = useRef(new Animated.Value(30)).current;

    useEffect(() => {
      Animated.sequence([
        Animated.delay(200 * index),
        Animated.parallel([
          Animated.timing(cardFadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(cardSlideAnim, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }, []);

    return (
      <Animated.View
        style={[
          styles.featureCard,
          {
            opacity: cardFadeAnim,
            transform: [{ translateY: cardSlideAnim }],
          },
        ]}
      >
        <View style={styles.featureIcon}>
          <Text style={styles.featureEmoji}>{feature.icon}</Text>
        </View>
        <Text style={styles.featureTitle}>{feature.title}</Text>
        <Text style={styles.featureDescription}>{feature.description}</Text>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Section */}
        <Animated.View
          style={[
            styles.heroSection,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim },
              ],
            },
          ]}
        >
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>ATTENDEE</Text>
              <View style={styles.logoDot} />
            </View>
            <View style={styles.rfidVisual}>
              <View style={styles.rfidCard}>
                <View style={styles.rfidChip} />
                <View style={styles.rfidWaves}>
                  <View style={[styles.rfidWave, styles.rfidWave1]} />
                  <View style={[styles.rfidWave, styles.rfidWave2]} />
                  <View style={[styles.rfidWave, styles.rfidWave3]} />
                </View>
              </View>
            </View>
          </View>
          
          <Text style={styles.heroTitle}>
            Smart Attendance{'\n'}Management System
          </Text>
          
          <Text style={styles.heroSubtitle}>
            Revolutionary RFID-based attendance tracking with real-time analytics 
            and comprehensive reporting capabilities.
          </Text>

          <TouchableOpacity 
            style={styles.ctaButton}
            onPress={handleGetStarted}
            activeOpacity={0.8}
          >
            <Text style={styles.ctaButtonText}>Get Started</Text>
            <Text style={styles.ctaButtonArrow}>→</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Key Features</Text>
          <View style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} index={index} />
            ))}
          </View>
        </View>

        {/* System Overview */}
        <View style={styles.overviewSection}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          
          <View style={styles.stepContainer}>
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>RFID Card Scan</Text>
                <Text style={styles.stepDescription}>
                  Users tap their RFID cards on the terminal for instant recognition
                </Text>
              </View>
            </View>

            <View style={styles.stepConnector} />

            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Real-time Processing</Text>
                <Text style={styles.stepDescription}>
                  Attendance data is processed and synchronized across all devices
                </Text>
              </View>
            </View>

            <View style={styles.stepConnector} />

            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Analytics & Reports</Text>
                <Text style={styles.stepDescription}>
                  Generate comprehensive reports and analytics for better insights
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2024 Attendee. Built with precision and care.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xl,
  },
  heroSection: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing['2xl'],
    paddingBottom: theme.spacing['3xl'],
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: theme.spacing.xl,
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: theme.fontSize['3xl'],
    fontWeight: '800',
    color: theme.colors.black,
    letterSpacing: -1,
  },
  logoDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.black,
    marginLeft: theme.spacing.xs,
  },
  heroTitle: {
    fontSize: theme.fontSize['4xl'],
    fontWeight: '700',
    color: theme.colors.black,
    textAlign: 'center',
    lineHeight: theme.fontSize['4xl'] * 1.2,
    marginBottom: theme.spacing.lg,
  },
  heroSubtitle: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.gray[600],
    textAlign: 'center',
    lineHeight: theme.fontSize.lg * 1.5,
    marginBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.md,
  },
  ctaButton: {
    backgroundColor: theme.colors.black,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  ctaButtonText: {
    color: theme.colors.white,
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    marginRight: theme.spacing.sm,
  },
  ctaButtonArrow: {
    color: theme.colors.white,
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
  },
  featuresSection: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing['3xl'],
  },
  sectionTitle: {
    fontSize: theme.fontSize['2xl'],
    fontWeight: '700',
    color: theme.colors.black,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  featuresGrid: {
    gap: theme.spacing.lg,
  },
  featureCard: {
    backgroundColor: theme.colors.gray[50],
    padding: theme.spacing.lg,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.gray[200],
  },
  featureIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    elevation: 2,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  featureEmoji: {
    fontSize: 24,
  },
  featureTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.black,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[600],
    textAlign: 'center',
    lineHeight: theme.fontSize.sm * 1.4,
  },
  overviewSection: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing['3xl'],
  },
  stepContainer: {
    paddingTop: theme.spacing.lg,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: theme.spacing.md,
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.black,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  stepNumberText: {
    color: theme.colors.white,
    fontSize: theme.fontSize.lg,
    fontWeight: '700',
  },
  stepContent: {
    flex: 1,
    paddingTop: theme.spacing.xs,
  },
  stepTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.black,
    marginBottom: theme.spacing.xs,
  },
  stepDescription: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[600],
    lineHeight: theme.fontSize.sm * 1.4,
  },
  stepConnector: {
    width: 2,
    height: theme.spacing.xl,
    backgroundColor: theme.colors.gray[300],
    marginLeft: theme.spacing.md + 19,
    marginVertical: theme.spacing.md,
  },
  footer: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray[200],
    alignItems: 'center',
  },
  footerText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[500],
    textAlign: 'center',
  },
});

export default LandingScreen;
