// App.js - React Native with Native Features
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  SafeAreaView,
  Dimensions,
  useColorScheme,
  Platform,
  Vibration,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

const DemSkiesApp = () => {
  const systemColorScheme = useColorScheme();
  const [colorScheme, setColorScheme] = useState(systemColorScheme);
  const [cityInput, setCityInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [activeTab, setActiveTab] = useState('current');

  const API_KEY = "3e63ad04ae2a4cc8812173245261901";

  // Listen for system theme changes
  useEffect(() => {
    setColorScheme(systemColorScheme);
  }, [systemColorScheme]);

  // Theme colors
  const isDark = colorScheme === 'dark';
  const colors = {
    gradient: isDark 
      ? ['#0a1026', '#121a34', '#1d2742', '#333e5d', '#4e5b73', '#656d7a', '#9e613c', '#713125', '#361114', '#020203']
      : ['#1a2a4a', '#2a3a5a', '#3a4a6a', '#4a5a7a', '#5a6a8a', '#7a8a9a', '#aa7a5a', '#8a4a3a', '#5a2a2a', '#2a1a1a'],
    cardBg: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.25)',
    detailBg: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.3)',
    inputBg: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.4)',
    text: '#ffffff',
    textSecondary: 'rgba(255, 255, 255, 0.8)',
    placeholder: 'rgba(255, 255, 255, 0.7)',
  };

  // Haptic feedback wrapper
  const triggerHaptic = async (type = 'light') => {
    try {
      if (Platform.OS === 'ios') {
        switch (type) {
          case 'light':
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            break;
          case 'medium':
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            break;
          case 'heavy':
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            break;
          case 'success':
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            break;
          case 'error':
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            break;
          case 'warning':
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            break;
        }
      } else if (Platform.OS === 'android') {
        // Android vibration patterns
        switch (type) {
          case 'light':
            Vibration.vibrate(10);
            break;
          case 'medium':
            Vibration.vibrate(20);
            break;
          case 'heavy':
            Vibration.vibrate(50);
            break;
          case 'success':
            Vibration.vibrate([0, 10, 100, 10]);
            break;
          case 'error':
            Vibration.vibrate([0, 50, 50, 50]);
            break;
        }
      }
    } catch (error) {
      console.log('Haptic feedback not available');
    }
  };

  const getMoonPhase = (date) => {
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    const day = date.getDate();

    let yearCopy = year;
    if (month < 3) {
      yearCopy--;
      month += 12;
    }

    ++month;
    const c = 365.25 * yearCopy;
    const e = 30.6 * month;
    let jd = c + e + day - 694039.09;
    jd /= 29.5305882;
    let b = parseInt(jd);
    jd -= b;
    b = Math.round(jd * 8);

    if (b >= 8) b = 0;

    const phases = [
      { name: "New Moon", emoji: "🌑" },
      { name: "Waxing Crescent", emoji: "🌒" },
      { name: "First Quarter", emoji: "🌓" },
      { name: "Waxing Gibbous", emoji: "🌔" },
      { name: "Full Moon", emoji: "🌕" },
      { name: "Waning Gibbous", emoji: "🌖" },
      { name: "Last Quarter", emoji: "🌗" },
      { name: "Waning Crescent", emoji: "🌘" }
    ];

    return phases[b];
  };

  const getAstronomyEvents = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const events = [
      { type: 'Quadrantid Meteor Shower', date: new Date('2026-01-03'), description: 'Brief but intense meteor shower' },
      { type: 'Venus-Saturn Conjunction', date: new Date('2026-01-18'), description: 'Venus and Saturn appear very close in evening sky' },
      { type: 'Supermoon', date: new Date('2026-02-06'), description: 'Full moon at closest approach to Earth' },
      { type: 'Mars-Jupiter Conjunction', date: new Date('2026-02-13'), description: 'Mars and Jupiter align in pre-dawn sky' },
      { type: 'Mercury at Greatest Elongation', date: new Date('2026-02-21'), description: 'Best time to observe Mercury in evening sky' },
      { type: 'Supermoon', date: new Date('2026-03-08'), description: 'Full moon at closest approach to Earth' },
      { type: 'Venus-Jupiter Conjunction', date: new Date('2026-03-12'), description: 'Bright pairing of two brightest planets' },
      { type: 'Blue Moon', date: new Date('2026-03-31'), description: 'Second full moon in a calendar month' },
      { type: 'Supermoon', date: new Date('2026-04-06'), description: 'Full moon at closest approach to Earth' },
      { type: 'Lyrids Meteor Shower', date: new Date('2026-04-22'), description: 'Ancient meteor shower with occasional bright fireballs' },
      { type: 'Total Solar Eclipse', date: new Date('2026-08-12'), description: 'Visible from Arctic, Greenland, Iceland, Spain' },
      { type: 'Mars at Opposition', date: new Date('2026-08-28'), description: 'Mars at its closest approach to Earth' },
      { type: 'Perseids Meteor Shower', date: new Date('2026-08-12'), description: 'One of the best meteor showers of the year' },
    ];

    const filtered = events.filter((e) => e.date >= today);
    return filtered.sort((a, b) => a.date - b.date);
  };

  const fetchWeather = async (city) => {
    if (!city.trim()) {
      setError("Please enter a city name or ZIP code");
      triggerHaptic('error');
      return;
    }

    triggerHaptic('light');
    setError('');
    setWeatherData(null);
    setLoading(true);

    try {
      const input = city.trim();
      const zipRegex = /^\d{5}(-\d{4})?$/;
      const isZip = zipRegex.test(input);

      let weatherResponse;

      if (isZip) {
        const searchUrl = `https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${encodeURIComponent(input)}`;
        const searchResponse = await fetch(searchUrl);

        if (searchResponse.ok) {
          const searchResults = await searchResponse.json();
          if (searchResults && searchResults.length > 0) {
            let usLocation = searchResults.find(
              (r) => r.country === "United States" || r.country === "USA" || r.country === "United States of America"
            );
            const bestMatch = usLocation || searchResults[0];
            const weatherUrl = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${bestMatch.lat},${bestMatch.lon}&days=6&aqi=no&alerts=no`;
            weatherResponse = await fetch(weatherUrl);
          } else {
            throw new Error(`ZIP code "${input}" not found`);
          }
        } else {
          throw new Error("Unable to search for ZIP code");
        }
      } else {
        const weatherUrl = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${encodeURIComponent(input)}&days=6&aqi=no&alerts=no`;
        weatherResponse = await fetch(weatherUrl);
      }

      if (!weatherResponse.ok) {
        if (weatherResponse.status === 400) {
          throw new Error(`Location "${input}" not found`);
        }
        throw new Error("Unable to fetch weather data");
      }

      const data = await weatherResponse.json();
      const location = data.location;
      const current = data.current;
      const forecast = data.forecast.forecastday;

      const today = new Date();
      const moonPhase = getMoonPhase(today);
      const astronomyEvents = getAstronomyEvents();

      const forecastData = [];
      for (let i = 1; i < forecast.length && i <= 5; i++) {
        const day = forecast[i];
        const date = new Date(day.date);
        const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
        forecastData.push({
          day: dayName,
          high: Math.round(day.day.maxtemp_f),
          low: Math.round(day.day.mintemp_f),
          description: day.day.condition.text
        });
      }

      const todayForecast = forecast[0];

      setWeatherData({
        location: `${location.name}, ${location.region}, ${location.country}`,
        temp: Math.round(current.temp_f),
        tempC: Math.round(current.temp_c),
        feelsLike: Math.round(current.feelslike_f),
        humidity: current.humidity,
        description: current.condition.text,
        sunrise: todayForecast.astro.sunrise,
        sunset: todayForecast.astro.sunset,
        tempMax: Math.round(todayForecast.day.maxtemp_f),
        tempMin: Math.round(todayForecast.day.mintemp_f),
        forecast: forecastData,
        moonPhase: moonPhase,
        astronomyEvents: astronomyEvents
      });
      setActiveTab('current');
      triggerHaptic('success');
    } catch (err) {
      setError(err.message);
      triggerHaptic('error');
    } finally {
      setLoading(false);
    }
  };

  const handleTabPress = (tab) => {
    triggerHaptic('light');
    setActiveTab(tab);
  };

  const toggleTheme = () => {
    triggerHaptic('medium');
    setColorScheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.iconRow}>
        <Text style={styles.iconEmoji}>☁️</Text>
        <Text style={styles.iconEmoji}>⚡</Text>
        <Text style={styles.iconEmoji}>☀️</Text>
        <Text style={styles.iconEmoji}>🌙</Text>
        <Text style={styles.iconEmoji}>✨</Text>
      </View>
      <View style={styles.titleRow}>
        <Text style={[styles.title, { color: colors.text }]}>Dem Skies</Text>
        <TouchableOpacity 
          onPress={toggleTheme}
          style={styles.themeToggle}
          activeOpacity={0.7}
        >
          <Text style={styles.themeToggleText}>{isDark ? '☀️' : '🌙'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSearchBox = () => (
    <View style={styles.searchContainer}>
      <TextInput
        style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text }]}
        value={cityInput}
        onChangeText={setCityInput}
        placeholder="Enter city name or ZIP code..."
        placeholderTextColor={colors.placeholder}
        maxLength={100}
        returnKeyType="search"
        onSubmitEditing={() => fetchWeather(cityInput)}
      />
      <TouchableOpacity
        style={[
          styles.searchButton, 
          { backgroundColor: colors.inputBg },
          loading && styles.searchButtonDisabled
        ]}
        onPress={() => fetchWeather(cityInput)}
        disabled={loading}
        activeOpacity={0.7}
      >
        <Text style={[styles.searchButtonText, { color: colors.text }]}>Search</Text>
      </TouchableOpacity>
    </View>
  );

  const renderTabs = () => (
    <View style={[styles.tabContainer, { borderBottomColor: colors.textSecondary }]}>
      {['current', 'forecast', 'astronomy'].map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[
            styles.tab, 
            activeTab === tab && [styles.tabActive, { backgroundColor: colors.detailBg }]
          ]}
          onPress={() => handleTabPress(tab)}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.tabText,
            { color: activeTab === tab ? colors.text : colors.placeholder }
          ]}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderCurrentWeather = () => (
    <View style={styles.content}>
      <View style={styles.mainTemp}>
        <Text style={[styles.temperature, { color: colors.text }]}>
          {weatherData.temp}°F
        </Text>
        <Text style={[styles.description, { color: colors.text }]}>
          {weatherData.description}
        </Text>
        <Text style={[styles.tempC, { color: colors.textSecondary }]}>
          ({weatherData.tempC}°C)
        </Text>
      </View>

      <View style={styles.detailsGrid}>
        <View style={[styles.detailCard, { backgroundColor: colors.detailBg }]}>
          <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
            💧 Humidity
          </Text>
          <Text style={[styles.detailValue, { color: colors.text }]}>
            {weatherData.humidity}%
          </Text>
        </View>

        <View style={[styles.detailCard, { backgroundColor: colors.detailBg }]}>
          <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
            🌡️ Feels Like
          </Text>
          <Text style={[styles.detailValue, { color: colors.text }]}>
            {weatherData.feelsLike}°F
          </Text>
        </View>

        <View style={[styles.detailCard, { backgroundColor: colors.detailBg }]}>
          <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
            {weatherData.moonPhase.emoji} Moon
          </Text>
          <Text style={[styles.detailValueSmall, { color: colors.text }]}>
            {weatherData.moonPhase.name}
          </Text>
        </View>
      </View>

      <View style={styles.detailsRow}>
        <View style={[styles.detailCard, { backgroundColor: colors.detailBg }]}>
          <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
            🌅 Sunrise
          </Text>
          <Text style={[styles.detailValueMedium, { color: colors.text }]}>
            {weatherData.sunrise}
          </Text>
        </View>

        <View style={[styles.detailCard, { backgroundColor: colors.detailBg }]}>
          <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
            🌇 Sunset
          </Text>
          <Text style={[styles.detailValueMedium, { color: colors.text }]}>
            {weatherData.sunset}
          </Text>
        </View>
      </View>

      <View style={[styles.highLowCard, { backgroundColor: colors.detailBg }]}>
        <Text style={[styles.highLowText, { color: colors.text }]}>
          High: {weatherData.tempMax}°F
        </Text>
        <Text style={[styles.highLowText, { color: colors.text }]}>
          Low: {weatherData.tempMin}°F
        </Text>
      </View>
    </View>
  );

  const renderForecast = () => (
    <View style={styles.content}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        📅 5-Day Forecast
      </Text>
      {weatherData.forecast.map((day, idx) => (
        <TouchableOpacity
          key={idx}
          style={[styles.forecastCard, { backgroundColor: colors.detailBg }]}
          onPress={() => triggerHaptic('light')}
          activeOpacity={0.8}
        >
          <View>
            <Text style={[styles.forecastDay, { color: colors.text }]}>
              {day.day}
            </Text>
            <Text style={[styles.forecastDescription, { color: colors.textSecondary }]}>
              {day.description}
            </Text>
          </View>
          <View style={styles.forecastTemps}>
            <Text style={[styles.forecastHigh, { color: colors.text }]}>
              {day.high}°
            </Text>
            <Text style={[styles.forecastLow, { color: colors.textSecondary }]}>
              {day.low}°
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderAstronomy = () => (
    <View style={styles.content}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        🌟 Next 4 Astronomy Events
      </Text>
      {weatherData.astronomyEvents.slice(0, 4).map((event, idx) => (
        <TouchableOpacity
          key={idx}
          style={[styles.astronomyCard, { backgroundColor: colors.detailBg }]}
          onPress={() => triggerHaptic('light')}
          activeOpacity={0.8}
        >
          <Text style={[styles.astronomyTitle, { color: colors.text }]}>
            {event.type}
          </Text>
          <Text style={[styles.astronomyDate, { color: colors.textSecondary }]}>
            {event.date.toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric"
            })}
          </Text>
          <Text style={[styles.astronomyDescription, { color: colors.textSecondary }]}>
            {event.description}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <LinearGradient colors={colors.gradient} style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.card, { backgroundColor: colors.cardBg }]}>
            {renderHeader()}
            {renderSearchBox()}
            
            <Text style={[styles.hint, { color: colors.textSecondary }]}>
              Try: Milton FL, 34638, Tampa, London
            </Text>

            {loading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.text} />
                <Text style={[styles.loadingText, { color: colors.text }]}>
                  Loading weather data...
                </Text>
              </View>
            )}

            {error && !loading && (
              <View style={styles.errorContainer}>
                <Text style={[styles.errorText, { color: colors.text }]}>{error}</Text>
              </View>
            )}

            {!weatherData && !loading && !error && (
              <View style={styles.placeholderContainer}>
                <Text style={[styles.placeholderText, { color: colors.text }]}>
                  🔍 Enter a city name or ZIP code to see weather
                </Text>
              </View>
            )}

            {weatherData && !loading && (
              <View>
                <Text style={[styles.location, { color: colors.text }]}>
                  {weatherData.location}
                </Text>
                {renderTabs()}
                {activeTab === 'current' && renderCurrentWeather()}
                {activeTab === 'forecast' && renderForecast()}
                {activeTab === 'astronomy' && renderAstronomy()}
              </View>
            )}

            <Text style={[styles.footer, { color: colors.textSecondary }]}>
              Powered by WeatherAPI.com
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    borderRadius: 30,
    padding: 24,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  iconEmoji: {
    fontSize: 40,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  themeToggle: {
    position: 'absolute',
    right: 0,
    padding: 8,
  },
  themeToggleText: {
    fontSize: 28,
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    borderRadius: 15,
    padding: 16,
    fontSize: 16,
  },
  searchButton: {
    borderRadius: 15,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonDisabled: {
    opacity: 0.5,
  },
  searchButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  hint: {
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 20,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    marginTop: 16,
  },
  errorContainer: {
    backgroundColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 16,
  },
  errorText: {
    textAlign: 'center',
    fontSize: 16,
  },
  placeholderContainer: {
    padding: 40,
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 18,
    textAlign: 'center',
  },
  location: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#ffffff',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  content: {},
  mainTemp: {
    alignItems: 'center',
    marginBottom: 32,
  },
  temperature: {
    fontSize: 72,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 24,
    textTransform: 'capitalize',
    opacity: 0.9,
    marginTop: 8,
  },
  tempC: {
    fontSize: 16,
    marginTop: 8,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  detailsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  detailCard: {
    borderRadius: 15,
    padding: 16,
    flex: 1,
    minWidth: width < 400 ? '100%' : '30%',
  },
  detailLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  detailValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  detailValueSmall: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  detailValueMedium: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  highLowCard: {
    borderRadius: 15,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  highLowText: {
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  forecastCard: {
    borderRadius: 15,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forecastDay: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  forecastDescription: {
    fontSize: 14,
    marginTop: 4,
  },
  forecastTemps: {
    alignItems: 'flex-end',
  },
  forecastHigh: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  forecastLow: {
    fontSize: 16,
  },
  astronomyCard: {
    borderRadius: 15,
    padding: 16,
    marginBottom: 12,
  },
  astronomyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  astronomyDate: {
    fontSize: 14,
    marginBottom: 4,
  },
  astronomyDescription: {
    fontSize: 13,
  },
  footer: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 24,
  },
});

export default DemSkiesApp;