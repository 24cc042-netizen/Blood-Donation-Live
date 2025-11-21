import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Alert, ScrollView, Animated, Modal } from 'react-native';

// ============= TYPE DEFINITIONS =============

interface User {
  phone?: string;
  verified?: boolean;
  fullName?: string;
  bloodType?: string;
}

interface InventoryItem {
  id: number;
  bloodType: string;
  component: string;
  units: number;
}

interface BloodDrive {
  id: number;
  name: string;
  date: string;
  location: string;
}

interface BloodRequest {
  id: number;
  institution: string;
  bloodType: string;
  component: string;
  units: number;
  urgency: 'critical' | 'high' | 'medium';
}

// ============= STYLES & THEME =============

const createStyles = (isDark: boolean) => {
  const bgColor = isDark ? '#1a1a1a' : '#fff';
  const textColor = isDark ? '#f0f0f0' : '#1f2937';
  const cardBg = isDark ? '#2a2a2a' : '#f9fafb';
  const borderColor = isDark ? '#404040' : '#e5e7eb';
  const inputBg = isDark ? '#333' : '#fff';
  const labelColor = isDark ? '#b0b0b0' : '#6b7280';

  return StyleSheet.create({
    appContainer: { flex: 1, backgroundColor: bgColor },
    container: { flex: 1, padding: 16, backgroundColor: bgColor },
    safeContainer: { maxWidth: 800, width: '100%', marginHorizontal: 'auto', flex: 1 },
    scrollContent: { flexGrow: 1, paddingBottom: 40 },
    header: { fontSize: 28, fontWeight: 'bold', color: '#e11d48', marginBottom: 16, textAlign: 'center', letterSpacing: 0.5 },
    subheader: { fontSize: 18, fontWeight: '600', marginBottom: 12, color: textColor },
    label: { fontSize: 14, fontWeight: '600', color: labelColor, marginTop: 12, marginBottom: 6 },
    input: { borderWidth: 1, borderColor: borderColor, padding: 12, marginBottom: 12, borderRadius: 6, fontSize: 14, backgroundColor: inputBg, color: textColor },
    button: { backgroundColor: '#ef4444', padding: 14, borderRadius: 6, marginBottom: 12, justifyContent: 'center', alignItems: 'center' },
    buttonText: { color: '#fff', fontWeight: '600', fontSize: 14 },
    backButton: { paddingVertical: 8, marginBottom: 16 },
    backButtonText: { color: '#0066cc', fontSize: 14, fontWeight: '600' },
    card: { padding: 12, borderWidth: 1, borderColor: borderColor, borderRadius: 6, marginBottom: 12, backgroundColor: cardBg },
    cardTitle: { fontWeight: '700', fontSize: 16, marginBottom: 4, color: textColor },
    cardText: { fontSize: 14, color: labelColor, marginBottom: 4 },
    badge: { backgroundColor: '#fecaca', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, alignSelf: 'flex-start', marginTop: 4 },
    badgeText: { fontSize: 12, color: '#991b1b', fontWeight: '600' },
    tabContainer: { flexDirection: 'row', marginBottom: 16, borderBottomWidth: 2, borderBottomColor: borderColor },
    tab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
    tabActive: { borderBottomWidth: 2, borderBottomColor: '#ef4444' },
    tabText: { fontWeight: '600', fontSize: 14, color: labelColor },
    tabTextActive: { color: '#ef4444' },
    topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, marginBottom: 16, borderBottomWidth: 1, borderBottomColor: borderColor },
    topBarText: { fontSize: 16, fontWeight: '600', color: textColor },
    iconButton: { padding: 8 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
    modalContent: { backgroundColor: cardBg, borderRadius: 12, padding: 20, width: '90%', maxWidth: 450 },
    modalTitle: { fontSize: 20, fontWeight: '700', marginBottom: 16, color: textColor },
    settingItem: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: borderColor, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    settingLabel: { fontSize: 14, fontWeight: '600', color: textColor },
    dashboardCard: { padding: 16, borderRadius: 8, marginBottom: 12, backgroundColor: cardBg, borderWidth: 1, borderColor: borderColor },
    dashboardTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8, color: textColor },
    dashboardDesc: { fontSize: 13, color: labelColor, marginBottom: 10, lineHeight: 20 },
    roleGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 16 },
    roleCard: { width: '48%', padding: 14, borderRadius: 8, backgroundColor: cardBg, borderWidth: 2, borderColor: '#ef4444', marginBottom: 12, alignItems: 'center' },
    roleCardText: { fontSize: 12, fontWeight: '600', color: textColor, marginTop: 6, textAlign: 'center' },
    appInfoCard: { padding: 16, borderRadius: 8, backgroundColor: cardBg, borderWidth: 1, borderColor: borderColor, marginTop: 20, marginBottom: 20 },
    appInfoTitle: { fontSize: 16, fontWeight: '700', color: textColor, marginBottom: 12 },
    appInfoText: { fontSize: 13, color: labelColor, lineHeight: 20, marginBottom: 8 },
    confirmModal: { backgroundColor: cardBg, borderRadius: 12, padding: 20, width: '90%', maxWidth: 400 },
    confirmText: { fontSize: 14, color: textColor, marginBottom: 16, textAlign: 'center' },
    confirmButtons: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
    confirmBtn: { flex: 1, paddingVertical: 10, borderRadius: 6, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#e5e7eb' },
    confirmBtnCancel: { backgroundColor: 'transparent' },
    confirmBtnConfirm: { backgroundColor: '#ef4444' },
    toggle: { width: 50, height: 28, borderRadius: 14, justifyContent: 'center', paddingHorizontal: 2 },
  });
};

// Small reusable Back + Help row used on many pages
function BackHelpRow({ onBack, onHelp }: { onBack?: () => void; onHelp?: () => void }) {
  const styles = createStyles(false);
  return (
    <View style={{ width: '100%', maxWidth: 460, paddingHorizontal: 20, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <TouchableOpacity onPress={() => { if (onBack) onBack(); }} accessibilityLabel="Back">
        <Text style={{ color: '#0066cc', fontSize: 14, fontWeight: '600' }}>◀ Back</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { if (onHelp) onHelp(); else Alert.alert('Help', 'Contact support at support@example.com'); }} accessibilityLabel="Need Help">
        <Text style={{ color: '#0066cc', fontSize: 14, fontWeight: '600' }}>❔ (Need Help)</Text>
      </TouchableOpacity>
    </View>
  );
}

// Small footer help button placed under option lists
function HelpFooter({ onHelp }: { onHelp?: () => void }) {
  return (
    <View style={{ width: '100%', paddingHorizontal: 20, paddingVertical: 10, alignItems: 'center' }}>
      <TouchableOpacity onPress={() => { if (onHelp) onHelp(); else Alert.alert('Help', 'Need help? Contact support@example.com'); }} accessibilityLabel="Footer Need Help">
        <Text style={{ color: '#0066cc', fontSize: 13, fontWeight: '600' }}>❔ (Need Help)</Text>
      </TouchableOpacity>
    </View>
  );
}

// ============= MOCK DATA =============

const mockInventory = [
  { id: 1, bloodType: 'O-', component: 'Whole Blood', units: 12, institution: 'City General Hospital', phone: '+1 555-0100' },
  { id: 2, bloodType: 'O-', component: 'Platelets', units: 8, institution: 'Red Cross Blood Bank', phone: '+1 555-0200' },
  { id: 3, bloodType: 'A+', component: 'Plasma', units: 5, institution: 'Central Blood Lab', phone: '+1 555-0300' },
  { id: 4, bloodType: 'B+', component: 'Whole Blood', units: 15, institution: 'Emergency Care Hospital', phone: '+1 555-0400' },
];

const mockDrives = [
  { id: 1, name: 'Summer Blood Drive 2025', date: '2025-12-15', location: 'Downtown Community Center' },
  { id: 2, name: 'Holiday Donation Event', date: '2025-12-20', location: 'Central Hospital' },
];

const mockRequests = [
  { id: 1, institution: 'City General Hospital', bloodType: 'O-', component: 'Whole Blood', units: 5, urgency: 'critical' },
  { id: 2, institution: 'Emergency Care Hospital', bloodType: 'AB+', component: 'Plasma', units: 3, urgency: 'high' },
];

// ============= AUTH SCREENS =============

function LoginScreen({ onLogin }: { onLogin: (credentials: User) => void }) {

  // Animated input component for floating label + focus/border animations
  const AnimatedInput = ({
    label,
    value,
    onChangeText,
    keyboardType,
    secureTextEntry,
    placeholder,
  }: {
    label: string;
    value: string;
    onChangeText: (t: string) => void;
    keyboardType?: any;
    secureTextEntry?: boolean;
    placeholder?: string;
  }) => {
    const isFocused = useRef(new Animated.Value(value ? 1 : 0)).current;
    const shake = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.timing(isFocused, { toValue: value ? 1 : 0, duration: 250, useNativeDriver: false }).start();
    }, [value, isFocused]);

    const onFocus = () => Animated.timing(isFocused, { toValue: 1, duration: 250, useNativeDriver: false }).start();
    const onBlur = () => {
      if (!value) Animated.timing(isFocused, { toValue: 0, duration: 250, useNativeDriver: false }).start();
    };

    const labelTop = isFocused.interpolate({ inputRange: [0, 1], outputRange: [18, -8] });
    const labelSize = isFocused.interpolate({ inputRange: [0, 1], outputRange: [16, 12] });
    const borderColor = isFocused.interpolate({ inputRange: [0, 1], outputRange: ['#d1d5db', '#ef4444'] });

    const triggerError = () => {
      Animated.sequence([
        Animated.timing(shake, { toValue: 8, duration: 60, useNativeDriver: true }),
        Animated.timing(shake, { toValue: -8, duration: 60, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 4, duration: 40, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 0, duration: 40, useNativeDriver: true }),
      ]).start();
    };
    return (
      <Animated.View style={{ transform: [{ translateX: shake }], marginBottom: 16, width: '100%', position: 'relative' }}>
        <Animated.Text style={{ position: 'absolute', left: 14, top: labelTop, fontSize: labelSize, color: '#999', zIndex: 10, backgroundColor: '#fff', paddingHorizontal: 6 }}>
          {label}
        </Animated.Text>
        <Animated.View style={[{ borderWidth: 1.5, borderRadius: 8, overflow: 'hidden', paddingTop: 8, backgroundColor: '#fff' }, { borderColor }] as any}>
          <TextInput
            value={value}
            onChangeText={onChangeText}
            onFocus={onFocus}
            onBlur={onBlur}
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry}
            placeholder={placeholder}
            placeholderTextColor="#ddd"
            blurOnSubmit={false}
            returnKeyType="done"
            onSubmitEditing={() => {}}
            style={[styles.input, { paddingVertical: 12, paddingHorizontal: 14, marginBottom: 0, borderWidth: 0, backgroundColor: 'transparent' } as any]}
          />
        </Animated.View>
      </Animated.View>
    );
  };
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [countryModalVisible, setCountryModalVisible] = useState(false);
  const [countryDropdownVisible, setCountryDropdownVisible] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [selectedDialCode, setSelectedDialCode] = useState('+1');
  const [phoneError, setPhoneError] = useState('');
  const phoneShake = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const otpSlideAnim = useRef(new Animated.Value(50)).current;

  const countryCodes = [
    { name: 'United States', dial: '+1' },
    { name: 'Canada', dial: '+1' },
    { name: 'United Kingdom', dial: '+44' },
    { name: 'India', dial: '+91' },
    { name: 'Australia', dial: '+61' },
    { name: 'Germany', dial: '+49' },
    { name: 'France', dial: '+33' },
    { name: 'Spain', dial: '+34' },
    { name: 'Italy', dial: '+39' },
    { name: 'Netherlands', dial: '+31' },
    { name: 'Brazil', dial: '+55' },
    { name: 'Mexico', dial: '+52' },
    { name: 'Japan', dial: '+81' },
    { name: 'South Korea', dial: '+82' },
    { name: 'China', dial: '+86' },
    { name: 'Russia', dial: '+7' },
    { name: 'South Africa', dial: '+27' },
    { name: 'New Zealand', dial: '+64' },
    { name: 'Sweden', dial: '+46' },
    { name: 'Norway', dial: '+47' },
    { name: 'Denmark', dial: '+45' },
    { name: 'Finland', dial: '+358' },
    { name: 'Belgium', dial: '+32' },
    { name: 'Switzerland', dial: '+41' },
    { name: 'Austria', dial: '+43' },
    { name: 'Ireland', dial: '+353' },
    { name: 'Poland', dial: '+48' },
    { name: 'Portugal', dial: '+351' },
    { name: 'Greece', dial: '+30' },
    { name: 'Turkey', dial: '+90' },
    { name: 'Saudi Arabia', dial: '+966' },
    { name: 'UAE', dial: '+971' },
    { name: 'Nigeria', dial: '+234' },
    { name: 'Egypt', dial: '+20' },
    { name: 'Argentina', dial: '+54' },
    { name: 'Chile', dial: '+56' },
    { name: 'Colombia', dial: '+57' },
    { name: 'Philippines', dial: '+63' },
    { name: 'Thailand', dial: '+66' },
    { name: 'Vietnam', dial: '+84' },
    { name: 'Indonesia', dial: '+62' },
    { name: 'Pakistan', dial: '+92' },
    { name: 'Bangladesh', dial: '+880' },
  ];

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, [fadeAnim]);

  useEffect(() => {
    if (otpSent) {
      Animated.parallel([
        Animated.timing(otpSlideAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]).start();
    } else {
      otpSlideAnim.setValue(50);
    }
  }, [otpSent, otpSlideAnim]);

  const styles = createStyles(false);

  const sendOTP = () => {
    // Normalize phone by removing spaces, dashes, parentheses
    const normalized = (phone || '').replace(/[\s()-]/g, '');
    const simple = normalized.replace(/^00/, '+');
    const final = simple.startsWith('+') ? simple : `${selectedDialCode}${simple.replace(/^\+/, '')}`;

    // Basic E.164-ish validation: + followed by 6-15 digits
    if (!/^[+]?[0-9]{6,15}$/.test(final.replace(/\+/g, '+'))) {
      setPhoneError('Enter a valid phone number including country code');
      Animated.sequence([
        Animated.timing(phoneShake, { toValue: 8, duration: 80, useNativeDriver: true }),
        Animated.timing(phoneShake, { toValue: -8, duration: 80, useNativeDriver: true }),
        Animated.timing(phoneShake, { toValue: 4, duration: 60, useNativeDriver: true }),
        Animated.timing(phoneShake, { toValue: 0, duration: 60, useNativeDriver: true }),
      ]).start();
      return;
    }
    setPhoneError('');
    setOtpSent(true);
    // small animation to acknowledge
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0.9, duration: 150, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
    Alert.alert('OTP Sent', `Verification code sent to ${phone}`);
  };

  const confirmOTP = async () => {
    if (!otp || otp.length < 4) {
      Alert.alert('Error', 'Please enter a valid OTP');
      return;
    }
    setSubmitting(true);
    // subtle submit animation
    Animated.timing(fadeAnim, { toValue: 0.6, duration: 300, useNativeDriver: true }).start();
    setTimeout(() => {
      setSubmitting(false);
      onLogin({ phone, verified: true });
    }, 700);
  };

  const contentTranslate = fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] });

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim, flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 20 }]}>
      <Animated.View style={{ width: '100%', maxWidth: 460, paddingHorizontal: 20, transform: [{ translateY: contentTranslate }] }}>
        <BackHelpRow onHelp={() => Alert.alert('Help', 'Need help signing in? Contact support@example.com')} />
        <Text style={[styles.header, { marginBottom: 8 }]}>🩸 BloodConnect</Text>
        <Text style={{ fontSize: 15, color: '#6b7280', marginBottom: 32, textAlign: 'center', lineHeight: 20 }}>Sign in to donate & save lives</Text>

        {!otpSent ? (
            <Animated.View style={{ opacity: fadeAnim, width: '100%' }}>
            <View style={{ marginBottom: 16, width: '100%' }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#6b7280', marginBottom: 8 }}>Phone Number</Text>
              <View style={{ borderWidth: 1.5, borderColor: '#e5e7eb', borderRadius: 8, overflow: 'hidden', backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', position: 'relative' }}>
                <TouchableOpacity
                  onPress={() => setCountryDropdownVisible(prev => !prev)}
                  onLongPress={() => setCountryModalVisible(true)}
                  style={{ paddingVertical: 10, paddingHorizontal: 12, borderRightWidth: 1, borderRightColor: '#f3f4f6', backgroundColor: '#fff' }}
                >
                  <Text style={{ fontSize: 14, color: '#111' }}>{selectedDialCode}</Text>
                </TouchableOpacity>
                <TextInput
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  placeholder="Enter the number"
                  placeholderTextColor="#5a5959ff"
                  style={{ flex: 1, paddingVertical: 12, paddingHorizontal: 14, marginBottom: 0, fontSize: 14, color: '#111', backgroundColor: 'transparent' } as any}
                  blurOnSubmit={false}
                  returnKeyType="done"
                  autoCorrect={false}
                  autoCapitalize="none"
                  importantForAutofill="no"
                  textContentType="telephoneNumber"
                  onSubmitEditing={() => { /* explicit - don't auto-send */ }}
                />
              </View>
              {countryDropdownVisible && (
                <View style={{ borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, backgroundColor: '#fff', marginTop: 8, maxHeight: 220, zIndex: 50, elevation: 6 }}>
                  <View style={{ padding: 8, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' }}>
                    <TextInput
                      value={countrySearch}
                      onChangeText={setCountrySearch}
                      placeholder="Search country or code"
                      placeholderTextColor="#999"
                      style={{ padding: 8, borderRadius: 6, backgroundColor: '#f9fafb', fontSize: 13 } as any}
                    />
                  </View>
                  <FlatList
                    data={countryCodes.filter(c => c.name.toLowerCase().includes(countrySearch.toLowerCase()) || c.dial.includes(countrySearch))}
                    keyExtractor={(item) => item.dial}
                    style={{ maxHeight: 180 }}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={{ paddingVertical: 10, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' }}
                        onPress={() => {
                          setSelectedDialCode(item.dial);
                          setPhone(item.dial + ' ');
                          setCountryDropdownVisible(false);
                          setCountrySearch('');
                        }}
                      >
                        <Text>{item.name} {item.dial}</Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              )}
            </View>
            <TouchableOpacity style={[styles.button, submitting && { opacity: 0.7 }]} onPress={sendOTP} disabled={submitting}>
              <Text style={styles.buttonText}>{submitting ? 'Sending...' : 'Send OTP'}</Text>
            </TouchableOpacity>
            <HelpFooter onHelp={() => Alert.alert('Help', 'Need help signing in? Contact support@example.com')} />
          </Animated.View>
        ) : (
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: otpSlideAnim }], width: '100%' }}>
            <Text style={[styles.header, { fontSize: 18, marginBottom: 4, marginTop: 8 }]}>Verify OTP</Text>
            <Text style={{ fontSize: 13, color: '#999', marginBottom: 24, textAlign: 'center' }}>Enter the 6-digit code sent to {phone}</Text>
            <View style={{ marginBottom: 16, width: '100%' }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#6b7280', marginBottom: 8 }}>Enter OTP</Text>
              <View style={{ borderWidth: 1.5, borderColor: '#e5e7eb', borderRadius: 8, overflow: 'hidden', backgroundColor: '#fff' }}>
                <TextInput
                  value={otp}
                  onChangeText={setOtp}
                  keyboardType="number-pad"
                  placeholder="Enter the code"
                  placeholderTextColor="#5a5959ff"
                  style={[styles.input, { marginBottom: 0, borderWidth: 0, backgroundColor: 'transparent' } as any]}
                  blurOnSubmit={false}
                  returnKeyType="done"
                  onSubmitEditing={() => { /* explicit - don't auto-verify */ }}
                />
              </View>
            </View>
            <TouchableOpacity style={[styles.button, submitting && { opacity: 0.7 }]} onPress={confirmOTP} disabled={submitting}>
              <Text style={styles.buttonText}>{submitting ? 'Verifying...' : 'Verify OTP'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setOtpSent(false)} style={{ marginTop: 16 }}>
              <Text style={{ color: '#0066cc', textAlign: 'center', fontSize: 13, fontWeight: '600' }}>← Change phone number</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </Animated.View>

      {countryModalVisible && (
        <Modal transparent visible={countryModalVisible} animationType="slide" onRequestClose={() => setCountryModalVisible(false)}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <View style={{ width: '92%', maxHeight: 480, backgroundColor: '#fff', borderRadius: 10, padding: 12 }}>
              <Text style={{ fontWeight: '700', fontSize: 16, marginBottom: 8 }}>Select Country Code</Text>
              <FlatList
                data={countryCodes}
                keyExtractor={(item) => item.dial}
                style={{ maxHeight: 380 }}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={{ paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' }}
                    onPress={() => {
                      setSelectedDialCode(item.dial);
                      setPhone(item.dial + ' ');
                      setCountryModalVisible(false);
                    }}
                  >
                    <Text>{item.name} {item.dial}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity onPress={() => setCountryModalVisible(false)} style={{ marginTop: 8, alignItems: 'flex-end' }}>
                <Text style={{ color: '#0066cc', fontWeight: '600' }}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </Animated.View>
  );
}

function ProfileScreen({ onProfileComplete, onBack }: { onProfileComplete: (profile: { fullName: string; bloodType: string }) => void; onBack?: () => void }) {
  const styles = createStyles(false);

  // Animated input for Profile (floating label) — improved: focus-driven and stable
  const AnimatedInput = ({
    label,
    value,
    onChangeText,
    placeholder,
  }: {
    label: string;
    value: string;
    onChangeText: (t: string) => void;
    placeholder?: string;
  }) => {
    const isFocusedAnim = useRef(new Animated.Value(value ? 1 : 0)).current;
    const [focused, setFocused] = useState<boolean>(!!value);
    const shake = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      const toValue = focused || !!value ? 1 : 0;
      Animated.timing(isFocusedAnim, { toValue, duration: 220, useNativeDriver: false }).start();
    }, [focused, value, isFocusedAnim]);

    const handleFocus = () => setFocused(true);
    const handleBlur = () => {
      if (!value) setFocused(false);
    };

    const labelTop = isFocusedAnim.interpolate({ inputRange: [0, 1], outputRange: [20, -8] });
    const labelSize = isFocusedAnim.interpolate({ inputRange: [0, 1], outputRange: [16, 12] });
    const borderColor = isFocusedAnim.interpolate({ inputRange: [0, 1], outputRange: ['#d1d5db', '#ef4444'] });
    const focusScale = isFocusedAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.01] });

    const triggerError = () => {
      Animated.sequence([
        Animated.timing(shake, { toValue: 8, duration: 60, useNativeDriver: true }),
        Animated.timing(shake, { toValue: -8, duration: 60, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 4, duration: 40, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 0, duration: 40, useNativeDriver: true }),
      ]).start();
    };

    return (
      <Animated.View style={{ transform: [{ translateX: shake }, { scale: focusScale }], marginBottom: 16, width: '100%', position: 'relative', minHeight: 80 }}>
        <Animated.Text style={{ position: 'absolute', left: 14, top: labelTop, fontSize: labelSize, color: '#666', zIndex: 12, backgroundColor: '#fff', paddingHorizontal: 6 }}>
          {label}
        </Animated.Text>
        <Animated.View style={[{ borderWidth: 1.5, borderRadius: 8, overflow: 'hidden', paddingTop: 6, backgroundColor: '#fff' }, { borderColor }] as any}>
          <View style={{ minHeight: 56, justifyContent: 'center' }}>
            <TextInput
              value={value}
              onChangeText={onChangeText}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder={placeholder}
              placeholderTextColor="#999"
              blurOnSubmit={false}
              returnKeyType="done"
              onSubmitEditing={() => { /* explicit submit handling */ }}
              style={{ fontSize: 14, paddingTop: 2, paddingBottom: 12, paddingHorizontal: 14, marginBottom: 0, color: '#111', backgroundColor: 'transparent', height: 44 } as any}
              autoCapitalize="words"
              autoCorrect={false}
              textContentType="name"
            />
          </View>
        </Animated.View>
      </Animated.View>
    );
  };

  const [fullName, setFullName] = useState('');
  const [bloodType, setBloodType] = useState('O+');
  const [submitting, setSubmitting] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, [fadeAnim]);

  const handleComplete = () => {
    if (!fullName || fullName.trim().length < 2) {
      Alert.alert('Validation', 'Please enter your full name (at least 2 characters)');
      return;
    }
    setSubmitting(true);
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0.7, duration: 200, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
    setTimeout(() => {
      setSubmitting(false);
      onProfileComplete({ fullName: fullName.trim(), bloodType });
    }, 600);
  };

  const contentTranslate = fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [18, 0] });

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim, flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 20 }]}>
      <BackHelpRow onBack={onBack} onHelp={() => Alert.alert('Help', 'Need help completing profile? Contact support@example.com')} />
      <Animated.View style={{ width: '100%', maxWidth: 460, paddingHorizontal: 20, transform: [{ translateY: contentTranslate }] }}>
        <Text style={[styles.header, { marginBottom: 8 }]}>Complete Profile</Text>
        <Text style={{ fontSize: 14, color: '#6b7280', marginBottom: 28, textAlign: 'center' }}>Enter your details to continue</Text>

        <AnimatedInput label="Full Name" value={fullName} onChangeText={setFullName} placeholder="John Doe" />
        <AnimatedInput label="Blood Type" value={bloodType} onChangeText={setBloodType} placeholder="O+, A-, B+, etc." />

        <TouchableOpacity style={[styles.button, submitting && { opacity: 0.7 }]} onPress={handleComplete} disabled={submitting}>
          <Text style={styles.buttonText}>{submitting ? 'Saving...' : 'Continue'}</Text>
        </TouchableOpacity>
        <HelpFooter onHelp={() => Alert.alert('Help', 'Need help with profile completion? Contact support@example.com')} />
      </Animated.View>
    </Animated.View>
  );
}

// ============= SETTINGS MODAL =============

function SettingsModal({ visible, isDark, onToggleDarkMode, onClose }: { visible: boolean; isDark: boolean; onToggleDarkMode: () => void; onClose: () => void }) {
  const [showDarkModeConfirm, setShowDarkModeConfirm] = useState(false);
  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start();
    } else {
      Animated.timing(slideAnim, { toValue: 300, duration: 300, useNativeDriver: true }).start();
    }
  }, [visible, slideAnim]);

  const styles = createStyles(isDark);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <Animated.View style={[styles.modalContent, { transform: [{ translateY: slideAnim }] }]}>
          <Text style={styles.modalTitle}>⚙️ Settings</Text>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Dark Mode</Text>
            <TouchableOpacity
              style={[styles.toggle, { backgroundColor: isDark ? '#ef4444' : '#d1d5db' }]}
              onPress={() => setShowDarkModeConfirm(true)}
            >
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: '#fff',
                  marginLeft: isDark ? 23 : 0,
                }}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Notifications</Text>
            <TouchableOpacity style={[styles.toggle, { backgroundColor: '#4ade80' }]}>
              <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#fff', marginLeft: 23 }} />
            </TouchableOpacity>
          </View>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>App Version</Text>
            <Text style={{ fontSize: 12, color: '#999' }}>v1.0.0</Text>
          </View>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Privacy Policy</Text>
            <TouchableOpacity onPress={() => Alert.alert('Privacy', 'View full privacy policy online')}>
              <Text style={{ color: '#0066cc', fontWeight: '600' }}>View</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>

          {showDarkModeConfirm && (
            <Modal transparent animationType="fade" visible={true}>
              <View style={styles.modalOverlay}>
                <View style={styles.confirmModal}>
                  <Text style={styles.modalTitle}>Confirm Dark Mode</Text>
                  <Text style={styles.confirmText}>
                    Switch to {isDark ? 'Light' : 'Dark'} mode? This will change the entire app theme.
                  </Text>
                  <View style={styles.confirmButtons}>
                    <TouchableOpacity
                      style={[styles.confirmBtn, styles.confirmBtnCancel]}
                      onPress={() => setShowDarkModeConfirm(false)}
                    >
                      <Text style={{ color: isDark ? '#f0f0f0' : '#1f2937', fontWeight: '600' }}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.confirmBtn, styles.confirmBtnConfirm]}
                      onPress={() => {
                        onToggleDarkMode();
                        setShowDarkModeConfirm(false);
                      }}
                    >
                      <Text style={styles.buttonText}>Confirm</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}

// ============= MAIN DASHBOARD =============

function MainDashboard({ user, isDark, onLogout, onSelectRole, onToggleDarkMode }: { user: User | null; isDark: boolean; onLogout: () => void; onSelectRole: (role: string) => void; onToggleDarkMode: () => void }) {
  const [showSettings, setShowSettings] = useState(false);
  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }).start();
  }, [slideAnim]);

  const styles = createStyles(isDark);

  return (
    <>
      <View style={styles.container}>
        <BackHelpRow onBack={onLogout} onHelp={() => Alert.alert('Help', 'Need help with the dashboard? Contact support@example.com')} />
        {/* Top Bar */}
        <View style={styles.topBar}>
          <Text style={styles.topBarText}>👋 Welcome, {user?.fullName || 'User'}</Text>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity style={styles.iconButton} onPress={() => setShowSettings(true)}>
              <Text style={{ fontSize: 20 }}>⚙️</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={onLogout}>
              <Text style={{ fontSize: 20 }}>🚪</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Animated.View style={[styles.safeContainer, { transform: [{ translateY: slideAnim }], alignItems: 'center' }]}>
            <Text style={styles.header}>🩸 BloodConnect Hub</Text>
            <Text style={{ fontSize: 14, color: '#999', marginBottom: 24, textAlign: 'center' }}>Your blood donation & management platform</Text>

            {/* Role Selection Grid */}
            <Text style={styles.subheader}>Select Your Role</Text>
            <View style={styles.roleGrid}>
              <TouchableOpacity style={styles.roleCard} onPress={() => onSelectRole('donor')}>
                <Text style={{ fontSize: 28 }}>🩸</Text>
                <Text style={styles.roleCardText}>Blood Donor</Text>
                <Text style={{ fontSize: 11, color: '#999', marginTop: 4 }}>Find blood near you</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.roleCard} onPress={() => onSelectRole('hospital')}>
                <Text style={{ fontSize: 28 }}>🏥</Text>
                <Text style={styles.roleCardText}>Hospital</Text>
                <Text style={{ fontSize: 11, color: '#999', marginTop: 4 }}>Manage inventory</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.roleCard} onPress={() => onSelectRole('bank')}>
                <Text style={{ fontSize: 28 }}>🩹</Text>
                <Text style={styles.roleCardText}>Blood Bank</Text>
                <Text style={{ fontSize: 11, color: '#999', marginTop: 4 }}>Manage stock</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.roleCard} onPress={() => onSelectRole('lab')}>
                <Text style={{ fontSize: 28 }}>🔬</Text>
                <Text style={styles.roleCardText}>Blood Lab</Text>
                <Text style={{ fontSize: 11, color: '#999', marginTop: 4 }}>Lab inventory</Text>
              </TouchableOpacity>
            </View>

            <HelpFooter onHelp={() => Alert.alert('Help', 'Need help selecting a role? Contact support@example.com')} />

            {/* Quick Stats */}
            <Text style={styles.subheader}>Quick Stats</Text>
            <View style={styles.dashboardCard}>
              <Text style={styles.dashboardTitle}>💉 Blood Inventory</Text>
              <Text style={styles.dashboardDesc}>4 institutions nearby with available blood units. Real-time updates on stock levels across the network.</Text>
              <TouchableOpacity style={styles.button} onPress={() => onSelectRole('donor')}>
                <Text style={styles.buttonText}>View Availability</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.dashboardCard}>
              <Text style={styles.dashboardTitle}>📍 Blood Drives</Text>
              <Text style={styles.dashboardDesc}>2 upcoming blood drives scheduled this month. Contribute and save lives in your community.</Text>
              <TouchableOpacity style={styles.button} onPress={() => onSelectRole('bank')}>
                <Text style={styles.buttonText}>View Drives</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.dashboardCard}>
              <Text style={styles.dashboardTitle}>🚨 Urgent Requests</Text>
              <Text style={styles.dashboardDesc}>2 urgent blood requests from hospitals. Help patients in critical need of blood transfusions.</Text>
              <TouchableOpacity style={styles.button} onPress={() => onSelectRole('hospital')}>
                <Text style={styles.buttonText}>View Requests</Text>
              </TouchableOpacity>
            </View>

            {/* App Info */}
            <View style={styles.appInfoCard}>
              <Text style={styles.appInfoTitle}>ℹ️ About BloodConnect</Text>
              <Text style={styles.appInfoText}>
                BloodConnect is a real-time blood donation network connecting patients, hospitals, blood banks, and labs. Our mission is to make blood and platelet donations accessible to everyone who needs them.
              </Text>
              <Text style={styles.appInfoText}>
                <Text style={{ fontWeight: '700' }}>🎯 Features:</Text>
              </Text>
              <Text style={styles.appInfoText}>
                • Real-time blood availability search{'\n'}
                • Hospital inventory management{'\n'}
                • Blood drive scheduling and tracking{'\n'}
                • Urgent request notifications{'\n'}
                • Multi-role dashboard support
              </Text>
              <Text style={styles.appInfoText}>
                <Text style={{ fontWeight: '700' }}>📱 Version:</Text> 1.0.0
              </Text>
              <Text style={styles.appInfoText}>
                <Text style={{ fontWeight: '700' }}>💡 Theme:</Text> {isDark ? 'Dark Mode' : 'Light Mode'}
              </Text>
            </View>
          </Animated.View>
        </ScrollView>
      </View>

      <SettingsModal
        visible={showSettings}
        isDark={isDark}
        onToggleDarkMode={onToggleDarkMode}
        onClose={() => setShowSettings(false)}
      />
    </>
  );
}

// ============= DONOR SCREEN =============

function DonorScreen({ isDark, onLogout }: { isDark: boolean; onLogout: () => void }) {
  const [searchBloodType, setSearchBloodType] = useState('O-');
  const [searchComponent, setSearchComponent] = useState('All');
  const [results, setResults] = useState(mockInventory);

  const search = () => {
    const filtered = mockInventory.filter(
      item => item.bloodType === searchBloodType && (searchComponent === 'All' || item.component === searchComponent)
    );
    setResults(filtered);
  };

  const styles = createStyles(isDark);

  return (
    <ScrollView style={styles.container}>
      <BackHelpRow onBack={onLogout} onHelp={() => Alert.alert('Help', 'Need help? Contact support@example.com')} />
      <View style={[styles.safeContainer, { alignItems: 'center' }]}>

        <Text style={styles.header}>🔍 Find Blood & Platelets</Text>

        <Text style={styles.label}>Blood Type</Text>
        <TextInput
          style={styles.input}
          placeholder="O-, A+, B-, etc."
          value={searchBloodType}
          onChangeText={setSearchBloodType}
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Component</Text>
        <TextInput
          style={styles.input}
          placeholder="All, Whole Blood, Platelets, Plasma"
          value={searchComponent}
          onChangeText={setSearchComponent}
          placeholderTextColor="#999"
        />

        <TouchableOpacity style={styles.button} onPress={search}>
          <Text style={styles.buttonText}>🔍 Search</Text>
        </TouchableOpacity>

        <Text style={styles.subheader}>Search Results ({results.length})</Text>
        {results.length === 0 ? (
          <Text style={{ color: '#999' }}>No inventory found</Text>
        ) : (
          <FlatList
            scrollEnabled={false}
            data={results}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>{item.institution}</Text>
                <Text style={styles.cardText}>{item.bloodType} • {item.component} • {item.units} units</Text>
                <TouchableOpacity style={styles.button} onPress={() => Alert.alert('Contact', `Call ${item.phone}`)}>
                  <Text style={styles.buttonText}>📞 Contact</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        )}

        <Text style={styles.subheader}>Blood Drives</Text>
        <FlatList
          scrollEnabled={false}
          data={mockDrives}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardText}>📅 {item.date} | 📍 {item.location}</Text>
            </View>
          )}
        />
        <HelpFooter onHelp={() => Alert.alert('Help', 'Need help using search? Contact support@example.com')} />
      </View>
    </ScrollView>
  );
}

// ============= HOSPITAL SCREEN =============

function HospitalScreen({ isDark, onLogout }: { isDark: boolean; onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState('inventory');
  const [inventory, setInventory] = useState([
    { id: 1, bloodType: 'O+', component: 'Whole Blood', units: 25 },
    { id: 2, bloodType: 'O-', component: 'Platelets', units: 10 },
  ]);
  const [newBloodType, setNewBloodType] = useState('');
  const [newComponent, setNewComponent] = useState('');
  const [newUnits, setNewUnits] = useState('');

  const addInventory = () => {
    if (!newBloodType || !newComponent || !newUnits) {
      Alert.alert('Error', 'Fill all fields');
      return;
    }
    setInventory([...inventory, { id: Date.now(), bloodType: newBloodType, component: newComponent, units: parseInt(newUnits) || 0 }]);
    setNewBloodType('');
    setNewComponent('');
    setNewUnits('');
    Alert.alert('Success', 'Added to inventory');
  };

  const removeItem = (id: number) => {
    setInventory(inventory.filter(i => i.id !== id));
  };

  const styles = createStyles(isDark);

  return (
    <ScrollView style={styles.container}>
      <BackHelpRow onBack={onLogout} onHelp={() => Alert.alert('Help', 'Need help? Contact support@example.com')} />
      <View style={[styles.safeContainer, { alignItems: 'center' }]}>

        <Text style={styles.header}>🏥 Hospital Dashboard</Text>

        <View style={styles.tabContainer}>
          <TouchableOpacity style={[styles.tab, activeTab === 'inventory' && styles.tabActive]} onPress={() => setActiveTab('inventory')}>
            <Text style={[styles.tabText, activeTab === 'inventory' && styles.tabTextActive]}>Inventory</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tab, activeTab === 'requests' && styles.tabActive]} onPress={() => setActiveTab('requests')}>
            <Text style={[styles.tabText, activeTab === 'requests' && styles.tabTextActive]}>Requests</Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'inventory' && (
          <>
            <Text style={styles.subheader}>Add Inventory</Text>
            <Text style={styles.label}>Blood Type</Text>
            <TextInput style={styles.input} placeholder="O+" value={newBloodType} onChangeText={setNewBloodType} placeholderTextColor="#999" />
            <Text style={styles.label}>Component</Text>
            <TextInput style={styles.input} placeholder="Whole Blood" value={newComponent} onChangeText={setNewComponent} placeholderTextColor="#999" />
            <Text style={styles.label}>Units</Text>
            <TextInput style={styles.input} placeholder="10" value={newUnits} onChangeText={setNewUnits} keyboardType="number-pad" placeholderTextColor="#999" />
            <TouchableOpacity style={styles.button} onPress={addInventory}>
              <Text style={styles.buttonText}>+ Add Item</Text>
            </TouchableOpacity>

            <Text style={styles.subheader}>Current Stock</Text>
            <FlatList
              scrollEnabled={false}
              data={inventory}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>{item.bloodType} • {item.component}</Text>
                  <Text style={styles.cardText}>{item.units} units</Text>
                  <TouchableOpacity onPress={() => removeItem(item.id)}>
                    <Text style={{ color: '#dc2626', fontSize: 12, marginTop: 8 }}>Remove</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
            <HelpFooter onHelp={() => Alert.alert('Help', 'Need help managing inventory? Contact support@example.com')} />
          </>
        )}
        <HelpFooter onHelp={() => Alert.alert('Help', 'Need help with blood bank options? Contact support@example.com')} />

        {activeTab === 'requests' && (
          <>
            <Text style={styles.subheader}>Post Urgent Request</Text>
            <TouchableOpacity style={styles.button} onPress={() => Alert.alert('Success', 'Urgent request posted!')}>
              <Text style={styles.buttonText}>📢 Post Request</Text>
            </TouchableOpacity>

            <Text style={styles.subheader}>Open Requests</Text>
            <FlatList
              scrollEnabled={false}
              data={mockRequests}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>{item.bloodType} {item.component}</Text>
                  <Text style={styles.cardText}>Need: {item.units} units</Text>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.urgency.toUpperCase()}</Text>
                  </View>
                </View>
              )}
            />
          </>
        )}
      </View>
    </ScrollView>
  );
}

// ============= BLOOD BANK SCREEN =============

function BloodBankScreen({ isDark, onLogout }: { isDark: boolean; onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState('inventory');
  const styles = createStyles(isDark);

  return (
    <ScrollView style={styles.container}>
      <BackHelpRow onBack={onLogout} onHelp={() => Alert.alert('Help', 'Need help? Contact support@example.com')} />
      <View style={[styles.safeContainer, { alignItems: 'center' }]}>

        <Text style={styles.header}>🩹 Blood Bank Dashboard</Text>

        <View style={styles.tabContainer}>
          <TouchableOpacity style={[styles.tab, activeTab === 'inventory' && styles.tabActive]} onPress={() => setActiveTab('inventory')}>
            <Text style={[styles.tabText, activeTab === 'inventory' && styles.tabTextActive]}>Inventory</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tab, activeTab === 'drives' && styles.tabActive]} onPress={() => setActiveTab('drives')}>
            <Text style={[styles.tabText, activeTab === 'drives' && styles.tabTextActive]}>Drives</Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'inventory' && (
          <>
            <Text style={styles.subheader}>Current Stock</Text>
            <FlatList
              scrollEnabled={false}
              data={[
                { id: 1, bloodType: 'O+', component: 'Whole Blood', units: 40 },
                { id: 2, bloodType: 'O-', component: 'Platelets', units: 25 },
              ]}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>{item.bloodType} • {item.component}</Text>
                  <Text style={styles.cardText}>{item.units} units</Text>
                </View>
              )}
            />
          </>
        )}

        {activeTab === 'drives' && (
          <>
            <Text style={styles.subheader}>Schedule Drive</Text>
            <TouchableOpacity style={styles.button} onPress={() => Alert.alert('Success', 'Blood drive scheduled!')}>
              <Text style={styles.buttonText}>+ Create Drive</Text>
            </TouchableOpacity>

            <Text style={styles.subheader}>Upcoming Drives</Text>
            <FlatList
              scrollEnabled={false}
              data={mockDrives}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>{item.name}</Text>
                  <Text style={styles.cardText}>📅 {item.date} | 📍 {item.location}</Text>
                </View>
              )}
            />
            <HelpFooter onHelp={() => Alert.alert('Help', 'Need help with drives? Contact support@example.com')} />
          </>
        )}
      </View>
    </ScrollView>
  );
}

// ============= BLOOD LAB SCREEN =============

function BloodLabScreen({ isDark, onLogout }: { isDark: boolean; onLogout: () => void }) {
  const styles = createStyles(isDark);

  return (
    <ScrollView style={styles.container}>
      <BackHelpRow onBack={onLogout} onHelp={() => Alert.alert('Help', 'Need help? Contact support@example.com')} />
      <View style={[styles.safeContainer, { alignItems: 'center' }]}>

        <Text style={styles.header}>🔬 Blood Lab Dashboard</Text>

        <Text style={styles.subheader}>Lab Inventory</Text>
        <FlatList
          scrollEnabled={false}
          data={[
            { id: 1, bloodType: 'O+', component: 'Whole Blood', units: 30 },
            { id: 2, bloodType: 'AB-', component: 'Plasma', units: 12 },
          ]}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{item.bloodType} • {item.component}</Text>
              <Text style={styles.cardText}>{item.units} units</Text>
            </View>
          )}
        />

        <Text style={styles.subheader}>Network Search</Text>
        <TouchableOpacity style={styles.button} onPress={() => Alert.alert('Search', 'Search blood from institutions')}>
          <Text style={styles.buttonText}>🔍 Search Network</Text>
        </TouchableOpacity>
        <HelpFooter onHelp={() => Alert.alert('Help', 'Need help with lab search? Contact support@example.com')} />
      </View>
    </ScrollView>
  );
}

// ============= MAIN APP =============

export default function App() {
  const [appState, setAppState] = useState<'login' | 'profile' | 'dashboard' | 'donor' | 'hospital' | 'bank' | 'lab'>('login');
  const [user, setUser] = useState<User | null>(null);
  const [isDark, setIsDark] = useState(false);

  const handleLogin = (credentials: User) => {
    setUser(credentials);
    setAppState('profile');
  };

  const handleProfileComplete = (profile: { fullName: string; bloodType: string }) => {
    setUser(prevUser => (prevUser ? { ...prevUser, ...profile } : profile));
    setAppState('dashboard');
  };

  const handleSelectRole = (role: string) => {
    setAppState(role as any);
  };

  const handleLogout = () => {
    setUser(null);
    setAppState('login');
  };

  const handleToggleDarkMode = () => {
    setIsDark(!isDark);
  };

  const styles = createStyles(isDark);

  return (
    <View style={styles.appContainer}>
      {appState === 'login' && <LoginScreen onLogin={handleLogin} />}
      {appState === 'profile' && <ProfileScreen onProfileComplete={handleProfileComplete} onBack={() => setAppState('login')} />}
      {appState === 'dashboard' && (
        <MainDashboard user={user} isDark={isDark} onLogout={handleLogout} onSelectRole={handleSelectRole} onToggleDarkMode={handleToggleDarkMode} />
      )}
      {appState === 'donor' && <DonorScreen isDark={isDark} onLogout={() => setAppState('dashboard')} />}
      {appState === 'hospital' && <HospitalScreen isDark={isDark} onLogout={() => setAppState('dashboard')} />}
      {appState === 'bank' && <BloodBankScreen isDark={isDark} onLogout={() => setAppState('dashboard')} />}
      {appState === 'lab' && <BloodLabScreen isDark={isDark} onLogout={() => setAppState('dashboard')} />}
    </View>
  );
}
