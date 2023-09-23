import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Platform, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';
import { ClockIcon, HeartIcon, MapPinIcon, SunIcon } from 'react-native-heroicons/solid';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../theme';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const ios = Platform.OS == 'ios';
const topMargin = ios ? 10 : 0;

// Define the 'item' variable from the static JSON data
const item = {
  title: "Rosicrucian Egyptian Museum",
  image: require('C:\Users\Checkout\Pictures\a.png'),
  price: 120,
  longDescription: "Museum with displays on Egyptian burial practices, plus artifacts including jewelry & bronze tools.",
  duration: "2 hours",
  distance: "5 miles",
  weather: "Sunny",
};

export default function DestinationScreen(props) {
  const navigation = useNavigation();
  const [isFavourite, toggleFavourite] = useState(false);

  return (
    <View style={styles.container}>
      {/* Destination image */}
      <Image source={item.image} style={styles.image} />
      <StatusBar style="light" />

      {/* Back button */}
      <SafeAreaView style={styles.backButtonContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <ChevronLeftIcon size={wp(7)} strokeWidth={4} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => toggleFavourite(!isFavourite)}
          style={styles.favouriteButton}
        >
          <HeartIcon size={wp(7)} strokeWidth={4} color={isFavourite ? 'red' : 'white'} />
        </TouchableOpacity>
      </SafeAreaView>

      {/* Title & Description & Booking Button */}
      <View style={styles.detailsContainer}>
        <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{item?.title}</Text>
            <Text style={styles.price}>$ {item?.price}</Text>
          </View>
          <Text style={styles.description}>{item?.longDescription}</Text>
          <View style={styles.infoRow}>
            <InfoItem icon={<ClockIcon size={wp(7)} color="skyblue" />} label="Duration" value={item.duration} />
            <InfoItem icon={<MapPinIcon size={wp(7)} color="#f87171" />} label="Distance" value={item.distance} />
            <InfoItem icon={<SunIcon size={wp(7)} color="orange" />} label="Sunny" value={item.weather} />
          </View>
        </ScrollView>
        <TouchableOpacity style={styles.bookButton}>
          <Text style={styles.bookButtonText}>Book now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const InfoItem = ({ icon, label, value }) => (
  <View style={styles.infoItem}>
    {icon}
    <View style={styles.infoText}>
      <Text style={styles.infoValue}>{value}</Text>
      <Text style={styles.infoLabel}>{label}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  image: {
    width: wp(100),
    height: hp(55),
  },
  backButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    position: 'absolute',
    marginTop: topMargin,
    paddingHorizontal: wp(4),
  },
  backButton: {
    padding: wp(2),
    borderRadius: wp(8),
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  favouriteButton: {
    padding: wp(2),
    borderRadius: wp(8),
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  detailsContainer: {
    borderTopLeftRadius: wp(10),
    borderTopRightRadius: wp(10),
    backgroundColor: 'white',
    paddingHorizontal: wp(5),
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: -hp(14),
  },
  scrollView: {
    marginBottom: wp(15),
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: wp(7),
    fontWeight: 'bold',
    flex: 1,
    color: theme.text,
  },
  price: {
    fontSize: wp(7),
    color: theme.text,
    fontWeight: 'bold',
  },
  description: {
    fontSize: wp(3.7),
    color: theme.text,
    marginBottom: wp(2),
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    marginLeft: wp(2),
  },
  infoValue: {
    fontSize: wp(4.5),
    fontWeight: 'bold',
    color: theme.text,
  },
  infoLabel: {
    fontSize: wp(3.5),
    color: 'gray',
  },
  bookButton: {
    backgroundColor: theme.bg(0.8),
    height: wp(15),
    width: wp(50),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: wp(15) / 2,
    alignSelf: 'center',
    marginBottom: wp(6),
  },
  bookButtonText: {
    fontSize: wp(5.5),
    color: 'white',
    fontWeight: 'bold',
  },
});
