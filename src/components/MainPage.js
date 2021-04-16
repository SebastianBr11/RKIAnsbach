import { useNetInfo } from '@react-native-community/netinfo';
import React, { useContext, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { ColorSchemeContext } from '../App';
import { useLocation } from '../lib/locationService';
import { useCovidData } from '../lib/rki-app';
import { useStyle } from '../lib/styles';
import RkiData from './RkiData';

const MainPage = () => {
  const [getLocation, county, _, inGermany, setCanLoadAgain] = useLocation();
  const [options, countyData] = useCovidData(county || 'Ansbach', inGermany);
  const [isDark, colors, fontFamily, styles] = useStyle(
    useContext(ColorSchemeContext).colorScheme,
  );

  console.log('countyData: ', countyData);

  console.log('hi from mainpage', county);

  const netInfo = useNetInfo();

  useEffect(() => {
    if (netInfo.isInternetReachable) {
      (async () => {
        await getLocation();
      })();
    }
  }, [getLocation, netInfo, options.isFetching]);

  const [activeView, setActiveView] = useState('sk');

  const toggleData = () => {
    console.log('switching from', activeView);
    if (activeView === 'sk') {
      console.log('current', activeView);
      setActiveView('lk');
    } else {
      setActiveView('sk');
    }
  };

  if (activeView === 'lk') {
    return (
      <RkiData
        {...{
          data: countyData[1],
          canSwitch: countyData.length === 2,
          ...options,
        }}
        toggleData={toggleData}
        buttonText="Switch to SK Numbers"
        setCanLoadAgain={setCanLoadAgain}
      />
    );
  } else if (activeView === 'sk') {
    return (
      <RkiData
        {...{
          data: countyData[0],
          canSwitch: countyData.length === 2,
          ...options,
        }}
        toggleData={toggleData}
        buttonText="Switch to LK Numbers"
        setCanLoadAgain={setCanLoadAgain}
      />
    );
  }

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.bg,
        color: colors.text2,
      }}>
      <Text style={[styles.text, { fontSize: 30, paddingHorizontal: 20 }]}>
        Make sure you're connected to the internet and you're currently in
        Germany
      </Text>
    </View>
  );
};

export default MainPage;
