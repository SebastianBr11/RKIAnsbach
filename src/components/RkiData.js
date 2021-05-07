import { useNetInfo } from '@react-native-community/netinfo';
import { formatRelative } from 'date-fns';
import { de } from 'date-fns/locale';
import React, { useContext, useEffect } from 'react';
import {
  RefreshControl,
  ScrollView,
  StatusBar,
  Switch,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import { ColorSchemeContext } from '../App';
import { useStyle } from '../lib/styles';

const RkiData = ({
  data,
  error,
  isError,
  isLoading,
  toggleView,
  isFetching,
  refetch,
  canSwitch,
  status,
  setCanLoadAgain,
  countyLocation,
  locationLoading,
}) => {
  const { colorScheme, toggleColorScheme } = useContext(ColorSchemeContext);
  const { isDark, colors, fontFamily, styles } = useStyle(colorScheme);

  const netInfo = useNetInfo();

  useEffect(() => {
    if (isError && netInfo.isInternetReachable) {
      refetch();
    }
  }, [isError, refetch, netInfo, countyLocation]);

  if (isLoading || status === 'idle') {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.bg,
          color: colors.text2,
        }}>
        <Text style={[styles.text]}>Loading...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View
        style={[
          styles.bg,
          {
            alignItems: 'center',
            justifyContent: 'center',
            color: colors.text2,
          },
        ]}>
        <Text style={[styles.text]}>Oops, there was an error</Text>
        <TouchableOpacity
          onPress={() => {
            if (netInfo.isInternetReachable) {
              refetch();
            } else {
              ToastAndroid.show(
                'Please make sure you are connected to the internet and try again.',
                ToastAndroid.LONG,
              );
            }
          }}
          style={[styles.button, { marginTop: 20 }]}>
          <Text style={styles.buttonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (data) {
    return (
      <View style={[styles.container]}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={isFetching}
              onRefresh={() => {
                setCanLoadAgain(true);
                refetch();
              }}
            />
          }
          contentContainerStyle={styles.scrollView}>
          <Text style={[styles.text, { fontSize: 13 }]}>Dark Mode: </Text>
          <Switch
            style={styles.switch}
            trackColor={{ false: colors.text, true: colors.text }}
            thumbColor="#EF4444"
            value={isDark()}
            onValueChange={toggleColorScheme}
          />
          <Text
            style={[
              styles.header,
              { flex: 1, marginTop: StatusBar.currentHeight },
            ]}>
            Hi, this is the RKI App for Your City
          </Text>
          <View style={[{ flex: 2, justifyContent: 'center' }]}>
            <Text style={styles.text}>{data.county}</Text>
            <Text style={styles.text}>
              Inzidenz{' '}
              <Text style={styles.boldText}>
                {data.weekIncidence.toFixed(2)}
              </Text>
            </Text>
            <Text style={styles.text}>{data.cases} Fälle</Text>
            <Text style={styles.dateText}>
              Zuletzt aktualisiert:{' '}
              {formatRelative(data.lastUpdated, new Date(), {
                locale: de,
              })}{' '}
              Uhr
            </Text>
          </View>
          <View
            style={{ flex: 1, justifyContent: 'flex-end', marginBottom: 50 }}>
            <TouchableOpacity
              disabled={!canSwitch}
              onPress={toggleView}
              style={[styles.button, { opacity: !canSwitch ? 0.2 : 1 }]}>
              <Text style={styles.buttonText}>Switch Numbers</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  // console.log('data rkidata: ', data);

  console.log('status', status, 'data', data);

  return (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.bg,
        color: colors.text2,
      }}>
      <Text style={styles.text}>Something went wrong</Text>
    </ScrollView>
  );
};

export default RkiData;
