// App.js
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import {
  Provider as PaperProvider,
  Button,
  TextInput,
  Title,
  Avatar,
  Switch,
  useTheme,
} from 'react-native-paper';

import * as ImagePicker from 'expo-image-picker';
import * as Localization from 'expo-localization';
import * as Notifications from 'expo-notifications';

import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import i18n from 'i18n-js';

import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  onSnapshot,
  query,
  addDoc,
  doc,
  getDoc,
  where,
} from 'firebase/firestore';
import {
  getAuth,
  signInWithPhoneNumber,
  onAuthStateChanged,
  signOut,
  PhoneAuthProvider,
  signInWithCredential,
  RecaptchaVerifier,
  updateProfile,
} from 'firebase/auth';

// ----- Replace these with your actual config & keys -----
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
};
const IMGUR_CLIENT_ID = 'bf9161f8d311d46';
// --------------------------------------------------------

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

i18n.fallbacks = true;
i18n.translations = {
  en: {
    welcome: 'Welcome',
    loginPhone: 'Login with Phone',
    enterPhone: 'Enter phone number (+countrycode number)',
    sendOTP: 'Send OTP',
    enterOTP: 'Enter OTP',
    verifyOTP: 'Verify OTP',
    logout: 'Logout',
    selectSeats: 'Select Your Seats',
    bookedSeats: 'Booked Seats',
    selectedSeats: 'Selected Seats',
    bookNow: 'Book Now',
    busList: 'Bus List',
    adminPanel: 'Admin Panel',
    addBus: 'Add Bus',
    busName: 'Bus Name',
    busImage: 'Bus Image',
    uploadImage: 'Upload Image',
    takePhoto: 'Take Photo',
    profile: 'Profile',
    editProfile: 'Edit Profile',
    saveProfile: 'Save Profile',
    darkMode: 'Dark Mode',
    language: 'Language',
    english: 'English',
    nepali: 'Nepali',
    hindi: 'Hindi',
    maithili: 'Maithili',
    seatsAvailable: 'Seats Available',
    seat: 'Seat',
    seatSelected: 'Seat selected',
    seatBooked: 'Seat booked',
    loading: 'Loading...',
  },
  np: {
    welcome: 'स्वागत छ',
    loginPhone: 'फोनबाट लगइन गर्नुहोस्',
    enterPhone: 'फोन नम्बर प्रविष्ट गर्नुहोस् (+देशको कोड सहित)',
    sendOTP: 'OTP पठाउनुहोस्',
    enterOTP: 'OTP प्रविष्ट गर्नुहोस्',
    verifyOTP: 'OTP प्रमाणित गर्नुहोस्',
    logout: 'लगआउट',
    selectSeats: 'आफ्नो सिट चयन गर्नुहोस्',
    bookedSeats: 'बुक गरिएको सिटहरू',
    selectedSeats: 'चयन गरिएको सिटहरू',
    bookNow: 'बुक गर्नुहोस्',
    busList: 'बस सूची',
    adminPanel: 'प्रशासक प्यानल',
    addBus: 'बस थप्नुहोस्',
    busName: 'बस नाम',
    busImage: 'बस तस्वीर',
    uploadImage: 'छवि अपलोड गर्नुहोस्',
    takePhoto: 'फोटो खिच्नुहोस्',
    profile: 'प्रोफाइल',
    editProfile: 'प्रोफाइल सम्पादन गर्नुहोस्',
    saveProfile: 'प्रोफाइल बचत गर्नुहोस्',
    darkMode: 'डार्क मोड',
    language: 'भाषा',
    english: 'अंग्रेजी',
    nepali: 'नेपाली',
    hindi: 'हिन्दी',
    maithili: 'मैथिली',
    seatsAvailable: 'उपलब्ध सिटहरू',
    seat: 'सिट',
    seatSelected: 'सिट चयन गरियो',
    seatBooked: 'सिट बुक गरियो',
    loading: 'लोड हुँदैछ...',
  },
  hi: {
    welcome: 'स्वागत है',
    loginPhone: 'फोन से लॉगिन करें',
    enterPhone: 'फोन नंबर दर्ज करें (+देश कोड सहित)',
    sendOTP: 'OTP भेजें',
    enterOTP: 'OTP दर्ज करें',
    verifyOTP: 'OTP सत्यापित करें',
    logout: 'लॉगआउट',
    selectSeats: 'अपनी सीट चुनें',
    bookedSeats: 'बुक की गई सीटें',
    selectedSeats: 'चयनित सीटें',
    bookNow: 'बुक करें',
    busList: 'बस सूची',
    adminPanel: 'एडमिन पैनल',
    addBus: 'बस जोड़ें',
    busName: 'बस का नाम',
    busImage: 'बस छवि',
    uploadImage: 'इमेज अपलोड करें',
    takePhoto: 'फोटो लें',
    profile: 'प्रोफ़ाइल',
    editProfile: 'प्रोफ़ाइल संपादित करें',
    saveProfile: 'प्रोफ़ाइल सहेजें',
    darkMode: 'डार्क मोड',
    language: 'भाषा',
    english: 'अंग्रेज़ी',
    nepali: 'नेपाली',
    hindi: 'हिंदी',
    maithili: 'मैथिली',
    seatsAvailable: 'उपलब्ध सीटें',
    seat: 'सीट',
    seatSelected: 'सीट चुनी गई',
    seatBooked: 'सीट बुक की गई',
    loading: 'लोड हो रहा है...',
  },
  mai: {
    welcome: 'स्वागत अछि',
    loginPhone: 'फोन स लॉगिन करू',
    enterPhone: 'फोन नंबर दर्ज करू (+देश कोड सहित)',
    sendOTP: 'OTP पठाउ',
    enterOTP: 'OTP दर्ज करू',
    verifyOTP: 'OTP सत्यापित करू',
    logout: 'लॉगआउट',
    selectSeats: 'अपन सीट चुनू',
    bookedSeats: 'बुक कयल सीट',
    selectedSeats: 'चुनल सीट',
    bookNow: 'बुक करू',
    busList: 'बस सूची',
    adminPanel: 'एडमिन पैनल',
    addBus: 'बस जोड़ू',
    busName: 'बस के नाम',
    busImage: 'बस छवि',
    uploadImage: 'छवि अपलोड करू',
    takePhoto: 'फोटो लिय',
    profile: 'प्रोफ़ाइल',
    editProfile: 'प्रोफ़ाइल संपादित करू',
    saveProfile: 'प्रोफ़ाइल सहेजू',
    darkMode: 'डार्क मोड',
    language: 'भाषा',
    english: 'अंग्रेज़ी',
    nepali: 'नेपाली',
    hindi: 'हिंदी',
    maithili: 'मैथिली',
    seatsAvailable: 'उपलब्ध सीट',
    seat: 'सीट',
    seatSelected: 'सीट चुनल',
    seatBooked: 'सीट बुक्ड',
    loading: 'लोड भ रहल अछि...',
  },
};

// Setup localization default
i18n.locale = Localization.locale || 'en';

// Navigation stack
const Stack = createNativeStackNavigator();

// Seat layout config
const seatRows = [
  { label: 'A', count: 18 },
  { label: 'B', count: 18 },
  { label: 'S', count: 5 },
];

function generateSeatMatrix() {
  const matrix = [];
  seatRows.forEach(({ label, count }) => {
    let seatsInThisRow = [];
    for (let i = 1; i <= count; i++) {
      seatsInThisRow.push(`${label}${i}`);
    }
    for (let i = 0; i < seatsInThisRow.length; i += 4) {
      matrix.push(seatsInThisRow.slice(i, i + 4));
    }
  });
  return matrix;
}

const seatMatrix = generateSeatMatrix();

// Helper function to upload image to Imgur
async function uploadImageToImgur(base64) {
  try {
    const response = await fetch('https://api.imgur.com/3/image', {
      method: 'POST',
      headers: {
        Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
        Accept: 'application/json',
      },
      body: base64,
    });
    const data = await response.json();
    if (data.success) return data.data.link;
    else throw new Error('Imgur upload failed');
  } catch (e) {
    throw e;
  }
}

// Main App component
export default function App() {
  const [user, setUser] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmResult, setConfirmResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [profileEditing, setProfileEditing] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [themeDark, setThemeDark] = useState(false);
  const [language, setLanguage] = useState(i18n.locale.slice(0, 2)); // en, np, hi, mai

  const recaptchaVerifier = useRef(null);

  // Localization update helper
  const setAppLanguage = (lang) => {
    i18n.locale = lang;
    setLanguage(lang);
  };

  // Firebase Auth state observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        // Fetch user profile photo & name from firestore or update state
        setProfileName(u.displayName || '');
        setProfilePhoto(u.photoURL || null);
        // Listen to bookings for this user
        listenUserBookings(u.uid);
      } else {
        setUser(null);
        setSelectedBus(null);
        setBookedSeats([]);
        setSelectedSeats([]);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch buses realtime
  useEffect(() => {
    const q = collection(db, 'bus');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let list = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setBuses(list);
    });
    return () => unsubscribe();
  }, []);

  // Listen booked seats for selected bus realtime
  useEffect(() => {
    if (!selectedBus) {
      setBookedSeats([]);
      return;
    }
    const bookingsQuery = query(
      collection(db, 'bookings'),
      where('busId', '==', selectedBus.id)
    );
    const unsubscribe = onSnapshot(bookingsQuery, (snapshot) => {
      let booked = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.seats && data.seats.length > 0) booked = booked.concat(data.seats);
      });
      setBookedSeats(booked);
      // Deselect any selected seat that is booked now
      setSelectedSeats((prev) => prev.filter((s) => !booked.includes(s)));
    });
    return () => unsubscribe();
  }, [selectedBus]);

  // Listen bookings for user (optional, for history)
  const listenUserBookings = (uid) => {
    // Add your own logic here for booking history
  };

  // Handle phone auth (OTP)
  const sendOTP = async () => {
    if (!phoneNumber.startsWith('+')) {
      Alert.alert('Error', 'Please enter phone number with country code starting +');
      return;
    }
    setLoading(true);
    try {
      if (!recaptchaVerifier.current) {
        recaptchaVerifier.current = new RecaptchaVerifier(
          'recaptcha-container',
          {
            size: 'invisible',
          },
          auth
        );
      }
      const confirmation = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        recaptchaVerifier.current
      );
      setConfirmResult(confirmation);
      Alert.alert('OTP sent', 'Please check your phone for the OTP');
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!otp || otp.length < 6) {
      Alert.alert('Error', 'Please enter a valid OTP');
      return;
    }
    setLoading(true);
    try {
      await confirmResult.confirm(otp);
      setConfirmResult(null);
      setOtp('');
    } catch (err) {
      Alert.alert('Error', 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    signOut(auth);
  };

  // Handle seat toggle
  const toggleSeat = (seat) => {
    if (bookedSeats.includes(seat)) return; // disable booked seat
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  // Book selected seats (no payment)
  const bookSeats = async () => {
    if (!selectedBus) {
      Alert.alert('Select Bus', 'Please select a bus first');
      return;
    }
    if (selectedSeats.length === 0) {
      Alert.alert('Select Seats', 'Please select at least one seat');
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, 'bookings'), {
        busId: selectedBus.id,
        userId: user.uid,
        seats: selectedSeats,
        bookedAt: new Date(),
      });
      Alert.alert('Success', 'Your seats have been booked!');
      setSelectedSeats([]);
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  // Pick profile image (camera or library)
  const pickImage = async (fromCamera = false) => {
    try {
      let permissionResult;
      if (fromCamera) {
        permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      } else {
        permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      }
      if (!permissionResult.granted) {
        Alert.alert('Permission Denied', 'Permission is required to access images.');
        return;
      }

      const result = fromCamera
        ? await ImagePicker.launchCameraAsync({ base64: true, quality: 0.5 })
        : await ImagePicker.launchImageLibraryAsync({ base64: true, quality: 0.5 });

      if (!result.cancelled) {
        // Upload image base64 to Imgur
        const base64Data = result.base64;
        const imgurResponse = await fetch('https://api.imgur.com/3/image', {
          method: 'POST',
          headers: {
            Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
            Accept: 'application/json',
          },
          body: base64Data,
        });
        const json = await imgurResponse.json();
        if (json.success) {
          setProfilePhoto(json.data.link);
          // Update Firebase Auth profile photo
          await updateProfile(user, {
            photoURL: json.data.link,
          });
        } else {
          Alert.alert('Upload Failed', 'Failed to upload image to Imgur');
        }
      }
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  // Save profile changes
  const saveProfile = async () => {
    try {
      await updateProfile(user, { displayName: profileName, photoURL: profilePhoto });
      setProfileEditing(false);
      Alert.alert('Profile Saved', 'Your profile has been updated.');
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  // Theme toggle
  const toggleTheme = () => setThemeDark(!themeDark);

  // Change language
  const changeLanguage = (lang) => setAppLanguage(lang);

  // UI Components for OTP Login
  if (!user) {
    return (
      <PaperProvider theme={themeDark ? DarkTheme : DefaultTheme}>
        <View style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
       <Title style={{ textAlign: 'center' }}>{i18n.t('loginPhone')}</Title>
        <TextInput
            label={i18n.t('enterPhone')}
            mode="outlined"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            style={{ marginVertical: 10 }}
          />
          {!confirmResult ? (
            <Button mode="contained" onPress={sendOTP} loading={loading} disabled={loading}>
              {i18n.t('sendOTP')}
            </Button>
          ) : (
            <>
              <TextInput
                label={i18n.t('enterOTP')}
                mode="outlined"
                keyboardType="number-pad"
                value={otp}
                onChangeText={setOtp}
                style={{ marginVertical: 10 }}
              />
              <Button mode="contained" onPress={verifyOTP} loading={loading} disabled={loading}>
                {i18n.t('verifyOTP')}
              </Button>
              <Button
                onPress={() => {
                  setConfirmResult(null);
                  setOtp('');
                }}
                style={{ marginTop: 10 }}
              >
                Cancel
              </Button>
            </>
          )}
          <View id="recaptcha-container" />
        </View>
      </PaperProvider>
    );
  }

  // Logged in: Main App Navigator
  return (
    <PaperProvider theme={themeDark ? DarkTheme : DefaultTheme}>
      <NavigationContainer theme={themeDark ? DarkTheme : DefaultTheme}>
        <Stack.Navigator initialRouteName="BusList" screenOptions={{ headerShown: true }}>
          <Stack.Screen name="BusList" options={{ title: i18n.t('busList') }}>
            {(props) => (
              <BusListScreen
                {...props}
                buses={buses}
                onSelectBus={setSelectedBus}
                selectedBus={selectedBus}
                bookedSeats={bookedSeats}
                onLogout={logout}
                user={user}
                themeDark={themeDark}
                toggleTheme={toggleTheme}
                language={language}
                changeLanguage={changeLanguage}
              />
            )}
          </Stack.Screen>

          <Stack.Screen name="SeatSelection" options={{ title: i18n.t('selectSeats') }}>
            {(props) => (
              <SeatSelectionScreen
                {...props}
                bookedSeats={bookedSeats}
                selectedSeats={selectedSeats}
                toggleSeat={toggleSeat}
                bookSeats={bookSeats}
                loading={loading}
                selectedBus={selectedBus}
              />
            )}
          </Stack.Screen>

          <Stack.Screen name="Profile" options={{ title: i18n.t('profile') }}>
            {(props) => (
              <ProfileScreen
                {...props}
                user={user}
                profileName={profileName}
                setProfileName={setProfileName}
                profilePhoto={profilePhoto}
                pickImage={pickImage}
                profileEditing={profileEditing}
                setProfileEditing={setProfileEditing}
                saveProfile={saveProfile}
              />
            )}
          </Stack.Screen>

          <Stack.Screen name="AdminPanel" options={{ title: i18n.t('adminPanel') }}>
            {(props) => (
              <AdminPanelScreen {...props} user={user} />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

// BusListScreen
function BusListScreen({
  buses,
  onSelectBus,
  selectedBus,
  bookedSeats,
  onLogout,
  user,
  themeDark,
  toggleTheme,
  language,
  changeLanguage,
  navigation,
}) {
  const theme = useTheme();

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <View style={{ marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
        <Button onPress={() => navigation.navigate('Profile')}>{i18n.t('profile')}</Button>
        <Button onPress={onLogout}>{i18n.t('logout')}</Button>
      </View>

      <View style={{ marginVertical: 10 }}>
        <Text>{i18n.t('darkMode')}</Text>
        <Switch value={themeDark} onValueChange={toggleTheme} />
      </View>

      <View style={{ marginVertical: 10 }}>
        <Text>{i18n.t('language')}</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 5 }}>
          {['en', 'np', 'hi', 'mai'].map((lang) => (
            <Button
              key={lang}
              mode={language === lang ? 'contained' : 'outlined'}
              onPress={() => changeLanguage(lang)}
            >
              {i18n.t(lang === 'en' ? 'english' : lang === 'np' ? 'nepali' : lang === 'hi' ? 'hindi' : 'maithili')}
            </Button>
          ))}
        </View>
      </View>

      <Title>{i18n.t('busList')}</Title>

      {buses.length === 0 ? (
        <ActivityIndicator />
      ) : (
        buses.map((bus) => (
          <TouchableOpacity
            key={bus.id}
            style={{
              padding: 15,
              marginVertical: 5,
              borderWidth: 1,
              borderColor: bus.id === selectedBus?.id ? theme.colors.primary : '#ccc',
              borderRadius: 5,
              backgroundColor: bus.id === selectedBus?.id ? theme.colors.primary + '22' : 'transparent',
            }}
            onPress={() => onSelectBus(bus)}
          >
            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{bus.name}</Text>
            <Text>{i18n.t('seatsAvailable')}: {bus.totalSeats || 41}</Text>
          </TouchableOpacity>
        ))
      )}

      {selectedBus && (
        <Button
          mode="contained"
          onPress={() => navigation.navigate('SeatSelection')}
          style={{ marginTop: 20 }}
        >
          {i18n.t('selectSeats')}
        </Button>
      )}

      {user && user.email === 'admin@example.com' && ( // crude admin check, replace as needed
        <Button mode="outlined" onPress={() => navigation.navigate('AdminPanel')} style={{ marginTop: 10 }}>
          {i18n.t('adminPanel')}
        </Button>
      )}
    </ScrollView>
  );
}

// SeatSelectionScreen
function SeatSelectionScreen({
  bookedSeats,
  selectedSeats,
  toggleSeat,
  bookSeats,
  loading,
  selectedBus,
}) {
  const theme = useTheme();

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Title>{selectedBus?.name}</Title>
      <Text style={{ marginBottom: 10 }}>{i18n.t('bookedSeats')}: {bookedSeats.length}</Text>

      {seatMatrix.map((row, i) => (
        <View
          key={i}
          style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 5 }}
        >
          {row.map((seat) => {
            const isBooked = bookedSeats.includes(seat);
            const isSelected = selectedSeats.includes(seat);

            return (
              <TouchableOpacity
                key={seat}
                onPress={() => toggleSeat(seat)}
                disabled={isBooked}
                style={{
                  margin: 3,
                  padding: 10,
                  backgroundColor: isBooked
                    ? '#ccc'
                    : isSelected
                    ? theme.colors.primary
                    : '#eee',
                  borderRadius: 4,
                  minWidth: 40,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: isBooked ? '#666' : isSelected ? '#fff' : '#000' }}>
                  {seat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}

      <Text style={{ marginTop: 15 }}>
        {i18n.t('selectedSeats')}: {selectedSeats.join(', ') || 'None'}
      </Text>

      <Button
        mode="contained"
        onPress={bookSeats}
        disabled={selectedSeats.length === 0 || loading}
        loading={loading}
        style={{ marginTop: 20 }}
      >
        {i18n.t('bookNow')}
      </Button>
    </ScrollView>
  );
}

// ProfileScreen
function ProfileScreen({
  user,
  profileName,
  setProfileName,
  profilePhoto,
  pickImage,
  profileEditing,
  setProfileEditing,
  saveProfile,
}) {
  return (
    <ScrollView contentContainerStyle={{ padding: 16, alignItems: 'center' }}>
      <Title>{user.displayName || 'User Profile'}</Title>

      <Avatar.Image
        size={120}
        source={
          profilePhoto
            ? { uri: profilePhoto }
            : require('./assets/profile-placeholder.png')
        }
        style={{ marginVertical: 20 }}
      />

      {profileEditing ? (
        <>
          <Button mode="outlined" onPress={() => pickImage(true)} style={{ marginBottom: 10 }}>
            Take Photo
          </Button>
          <Button mode="outlined" onPress={() => pickImage(false)} style={{ marginBottom: 20 }}>
            Upload Photo
          </Button>

          <TextInput
            label="Name"
            mode="outlined"
            value={profileName}
            onChangeText={setProfileName}
            style={{ width: '100%', marginBottom: 20 }}
          />

          <Button mode="contained" onPress={saveProfile}>
            Save Profile
          </Button>
          <Button onPress={() => setProfileEditing(false)} style={{ marginTop: 10 }}>
            Cancel
          </Button>
        </>
      ) : (
        <Button mode="contained" onPress={() => setProfileEditing(true)}>
          Edit Profile
        </Button>
      )}
    </ScrollView>
  );
}

// AdminPanelScreen (simplified)
function AdminPanelScreen({ user }) {
  const [busName, setBusName] = useState('');
  const [busImage, setBusImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const addBus = async () => {
    if (!busName) {
      Alert.alert('Error', 'Please enter bus name');
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, 'bus'), {
        name: busName,
        image: busImage || null,
        totalSeats: 41, // fixed for simplicity
      });
      Alert.alert('Success', 'Bus added');
      setBusName('');
      setBusImage(null);
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  // Image upload functions can be added here similar to profile

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Title>Add Bus</Title>
      <TextInput
        label="Bus Name"
        mode="outlined"
        value={busName}
        onChangeText={setBusName}
        style={{ marginVertical: 10 }}
      />
      {/* Add buttons to upload image if desired */}
      <Button mode="contained" onPress={addBus} loading={loading} disabled={loading}>
        Add Bus
      </Button>
    </ScrollView>
  );
}
