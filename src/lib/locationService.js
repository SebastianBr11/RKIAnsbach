import { HERE_REVERSE_GEOCODE_KEY, HERE_REVERSE_GEOCODE_URL } from '@env';
import { useEffect, useState } from 'react';
import {
  Alert,
  PermissionsAndroid,
  Platform,
  ToastAndroid,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

export const useLocation = () => {
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [county, setCounty] = useState(null);
  const [inGermany, setInGermany] = useState(false);
  const [canLoadAgain, setCanLoadAgain] = useState(true);

  const hasLocationPermission = async () => {
    // if (Platform.OS === 'ios') {
    //   const hasPermission = await this.hasLocationPermissionIOS();
    //   return hasPermission;
    // }

    if (Platform.OS === 'android' && Platform.Version < 23) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show(
        'Location permission denied by user.',
        ToastAndroid.LONG,
      );
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show(
        'Location permission revoked by user.',
        ToastAndroid.LONG,
      );
    }

    return false;
  };

  const getLocation = async () => {
    const hasLocationPerm = await hasLocationPermission();

    if (!hasLocationPerm) {
      setCounty('Ansbach');
      setInGermany(true);
      return;
    }

    setLoading(true);
  };

  useEffect(() => {
    if (loading && canLoadAgain) {
      Geolocation.getCurrentPosition(
        position => {
          console.log('position', position);
          setLoading(false);
          setLocation(position);
          setCanLoadAgain(false);
          console.log('got current position');
        },
        error => {
          setLoading(false);
          Alert.alert(`Code ${error.code}`, error.message);
          console.log('error: ', error);
        },
        {
          accuracy: {
            android: 'high',
            ios: 'best',
          },
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        },
      );
    }
  }, [loading, location, canLoadAgain]);

  useEffect(() => {
    if (location) {
      const { latitude: lat, longitude: lon } = location.coords;
      const url = `${HERE_REVERSE_GEOCODE_URL}?apiKey=${HERE_REVERSE_GEOCODE_KEY}&mode=retrieveAddresses&maxresults=1&prox=${lat},${lon},150`;
      fetch(url)
        .then(res => res.json())
        .then(data => {
          const {
            County,
            Country,
          } = data.Response.View[0].Result[0].Location.Address;
          // console.log('data: ', data);
          setInGermany(Country === 'DEU');
          return setCounty(County);
        });
      console.log('url:', url);
    }
  }, [location]);

  // console.log(
  //   'location: ',
  //   location,
  //   formatRelative(location.timestamp, new Date(), { locale: de }),
  // );

  console.log('location loading', loading);

  return [getLocation, county, location, inGermany, setCanLoadAgain, loading];
};
