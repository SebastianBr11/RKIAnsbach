import { RKI_COUNTY_DATA_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNetInfo } from '@react-native-community/netinfo';
import { differenceInHours } from 'date-fns';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { parseDate } from './util';

const COVID_FULL_DATA = '@covid_Full_Data';

const fetchFullCovidData = async ({ queryKey: [_, isInternetReachable] }) => {
  let covidFullData;

  try {
    covidFullData = await AsyncStorage.getItem(COVID_FULL_DATA);

    let hasData = false;
    try {
      const lastUpdated = parseDate(
        JSON.parse(covidFullData).features[0].attributes.last_update,
      );

      // First fetches data from local storage
      if (covidFullData) {
        console.log('does have covid data');
        hasData = true;
        covidFullData = JSON.parse(covidFullData);
      }

      // If the user can fetch data and data is older than 24 hours, fetches the new data
      if (
        isInternetReachable &&
        differenceInHours(lastUpdated, new Date()) <= -24
      ) {
        hasData = false;
      }
    } catch (e) {}

    if (!hasData) {
      console.log(`doesn't have covid data`);
      covidFullData = await fetch(RKI_COUNTY_DATA_URL).then(res => res.json());
      await AsyncStorage.setItem(
        COVID_FULL_DATA,
        JSON.stringify(covidFullData),
      );
    }
  } catch (e) {
    console.error('fetchFullCovidData error', e);
  }

  return covidFullData;
};

export const useCovidData = (county, inGermany) => {
  const { isInternetReachable } = useNetInfo();

  const {
    data,
    isSuccess,
    error,
    isError,
    isLoading,
    toggleData,
    isFetching,
    status,
    refetch,
  } = useQuery(['rki-full', isInternetReachable], fetchFullCovidData, {
    enabled: !!county && inGermany,
  });

  const [countyData, setCountyData] = useState([]);

  useEffect(() => {
    if (isSuccess) {
      // console.log('hi');

      setCountyData(
        data.features
          .filter(({ attributes }) => {
            // console.log('county: ', county.replace(/ *\([^)]*\) */g, ''));
            // console.log(attributes.county.includes('Aisch'));
            return (
              attributes.county.includes(
                county.replace(/ *\([^)]*\) */g, ''),
              ) || attributes.county.includes(county.split(' ')[0])
            );
          })
          .map(({ attributes }) => ({ ...attributes }))
          .map(district => ({
            lastUpdated: parseDate(district.last_update),
            name: district.GEN,
            county: district.county,
            state: district.BL,
            population: district.EWZ,
            cases: district.cases,
            deaths: district.deaths,
            casesPerWeek: district.cases7_lk,
            deathsPerWeek: district.death7_lk,
            weekIncidence: (district.cases7_lk / district.EWZ) * 100000,
            casesPer100k: (district.cases / district.EWZ) * 100000,
          })),
      );
    }
  }, [isSuccess, county, data]);

  console.log(
    'status',
    status,
    'isSuccess',
    isSuccess,
    'data',
    countyData.length,
  );

  return [
    {
      isSuccess,
      error,
      isError,
      isLoading,
      toggleData,
      isFetching,
      refetch,
      status,
    },
    countyData,
  ];
};

// const cityAgs = ['09561', '09571'];

// const baseUrl = 'https://api.corona-zahlen.org/districts/';

// const fetchLkData = async ({ queryKey: [_, county] }) => {
//   console.log(county);
//   return await fetch(baseUrl + cityAgs[1])
//     .then(res => {
//       return res.json();
//     })
//     .then(data => {
//       return data.data[cityAgs[1]];
//     });
// };

// const fetchSkData = async ({ queryKey: [_, county] }) => {
//   console.log(county);
//   return await fetch(baseUrl + cityAgs[0])
//     .then(res => {
//       return res.json();
//     })
//     .then(data => {
//       return data.data[cityAgs[0]];
//     });
// };

// const {
//   data: lkData,
//   error: lkError,
//   isError: lkIsError,
//   isLoading: lkIsLoading,
//   dataUpdatedAt: lkDataUpdatedAt,
//   isFetching: lkIsFetching,
//   refetch: lkRefetch,
// } = useQuery(['rki-lk', county], fetchLkData, {
//   enabled: !!county && inGermany,
// });
// const {
//   data: skData,
//   error: skError,
//   isError: skIsError,
//   isLoading: skIsLoading,
//   dataUpdatedAt: skDataUpdatedAt,
//   isFetching: skIsFetching,
//   refetch: skRefetch,
// } = useQuery(['rki-sk', county], fetchSkData, {
//   enabled: !!county && inGermany,
// });
