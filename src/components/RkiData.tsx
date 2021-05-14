import { useNetInfo } from '@react-native-community/netinfo';
import { formatRelative } from 'date-fns';
import { de } from 'date-fns/locale';
import React, { useContext, useEffect } from 'react';
import {
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import { QueryObserverResult, RefetchOptions } from 'react-query';
import { ColorSchemeContext } from '../App';
import { useStyle } from '../lib/styles';
import { CovidCountyData, CovidData } from '../types/CovidData';
import RkiDataLoader from './RkiDataLoader';

interface RkiDataProps {
  data: CovidCountyData;
  error: Error | null;
  isError: boolean;
  isLoading: boolean;
  toggleView: () => void;
  isFetching: boolean;
  refetch: (
    options?: RefetchOptions,
  ) => Promise<QueryObserverResult<CovidData, Error>>;
  canSwitch: boolean;
  status: 'error' | 'idle' | 'loading' | 'success';
  setCanLoadAgain: React.Dispatch<React.SetStateAction<boolean>>;
  countyLocation: string | null;
  locationLoading: boolean;
}

const RkiData = ({
  data,
  error: _error,
  isError,
  isLoading,
  toggleView,
  isFetching,
  refetch,
  canSwitch,
  status,
  setCanLoadAgain,
  countyLocation,
  locationLoading: _locationLoading,
}: RkiDataProps) => {
  const { colorScheme } = useContext(ColorSchemeContext);
  const { colors, styles } = useStyle(colorScheme);

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
        }}>
        <RkiDataLoader {...colors.loader} />
      </View>
    );
  }

  if (isError) {
    return (
      <View
        style={[
          {
            alignItems: 'center',
            justifyContent: 'center',
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

  return (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.bg,
      }}>
      <Text style={styles.text}>Something went wrong</Text>
    </ScrollView>
  );
};

export default RkiData;
