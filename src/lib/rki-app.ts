import { CovidCountyData, CovidData } from './../types/CovidData.d';
import { RKI_COUNTY_DATA_URL, RKI_HISTORY_DATA_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NetInfoState, useNetInfo } from '@react-native-community/netinfo';
import { differenceInHours } from 'date-fns';
import { useEffect, useRef, useState } from 'react';
import { useQuery, UseQueryResult } from 'react-query';
import {
  getDayDifference,
  addDaysToDate,
  parseDate,
  useLocalStorage,
} from './util';
import { FormattedHistoryData, HistoryData } from '../types/HistoryData';

const COVID_FULL_DATA = '@covid_Full_Data';
const COVID_HISTORY_DATA = '@history_Full_Data';

const fetchFullHistoryData = async ({
  queryKey: [_queryKey, isInternetReachable, getItem, setItem, agsList],
}: {
  queryKey: [
    string,
    boolean,
    () => Promise<string | null>,
    (arg0: string) => Promise<void>,
    string[],
  ];
}) => {
  const fullHistoryData = await getItem();
  // console.log('fuull', fullHistoryData);

  let historyDataObject = {};
  let hasData = false;

  try {
    const lastUpdated = parseDate(
      JSON.parse(fullHistoryData || '').meta.lastUpdate,
    );

    // First fetches data from local storage
    if (fullHistoryData) {
      console.log('does have history data');
      hasData = true;
      historyDataObject = JSON.parse(fullHistoryData);
    }

    // If the user can fetch data and data is older than 24 hours, fetches the new data
    if (
      isInternetReachable &&
      differenceInHours(lastUpdated, new Date()) <= -48
    ) {
      hasData = false;
    }
  } catch (e) {}

  if (!hasData) {
    const url = formatHistoryUrl(agsList);
    console.log("doesn't have history data", url);
    historyDataObject = await fetch(url).then(res => res.json());
    await setItem(JSON.stringify(historyDataObject));
  }

  return historyDataObject as HistoryData;
};

const fetchFullCovidData = async ({
  queryKey: [_queryKey, isInternetReachable, getItem],
}: {
  queryKey: [string, boolean, () => Promise<string | null>];
}) => {
  const covidFullData = await getItem();
  let covidDataObject = {};
  let hasData = false;

  try {
    const lastUpdated = parseDate(
      JSON.parse(covidFullData || '').features[0].attributes.last_update,
    );

    // First fetches data from local storage
    if (covidFullData) {
      console.log('does have covid data');
      hasData = true;
      covidDataObject = JSON.parse(covidFullData);
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
    console.log("doesn't have covid data");
    covidDataObject = await fetch(RKI_COUNTY_DATA_URL).then(res => res.json());
    await AsyncStorage.setItem(
      COVID_FULL_DATA,
      JSON.stringify(covidDataObject),
    );
  }

  return covidDataObject as CovidData;
};

const getCountyDataFromData = (data: CovidData, county: string) => {
  console.log('hi from function');
  return data.features
    ?.filter(({ attributes }) => {
      // console.log('county: ', county.replace(/ *\([^)]*\) */g, ''));
      // console.log(attributes.county.includes('Aisch'));
      return (
        attributes.county.includes(county.replace(/ *\([^)]*\) */g, '')) ||
        attributes.county.includes(county.split(' ')[0])
      );
    })
    .map(({ attributes }) => ({ ...attributes }))
    .map(district => ({
      lastUpdated: parseDate(district.last_update),
      ags: district.RS,
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
    }));
};

const getHistoryDataFromData = (
  data: HistoryData,
  agsList: string[],
  populationList: number[],
): FormattedHistoryData => {
  const historyData: FormattedHistoryData =
    data.features
      ?.map(({ attributes }) => ({ ...attributes }))
      .map(district => ({
        cases: district.cases,
        ags: district.IdLandkreis,
        date: new Date(district.MeldeDatum),
        name: district.Landkreis,
        incidence: null,
      }))
      .reduce((acc, current, _index) => {
        if (!acc[current.ags]) {
          return {
            ...acc,
            [current.ags]: {
              name: current.name,
              ags: current.ags,
              history: [
                {
                  date: current.date,
                  incidence: current.incidence,
                  cases: current.cases,
                },
              ],
            },
          };
        }

        if (acc[current.ags].history.length > 0) {
          const nextDate = new Date(current.date);
          while (
            getDayDifference(
              nextDate,
              acc[current.ags].history[acc[current.ags].history.length - 1]
                .date,
            ) > 1
          ) {
            acc = {
              ...acc,
              [current.ags]: {
                ...acc[current.ags],
                history: acc[current.ags].history.concat({
                  date: addDaysToDate(
                    acc[current.ags].history[
                      acc[current.ags].history.length - 1
                    ].date,
                    1,
                  ),
                  incidence: null,
                  cases: 0,
                }),
              },
            };
          }
        }

        return {
          ...acc,
          [current.ags]: {
            ...acc[current.ags],
            history: acc[current.ags].history.concat({
              date: current.date,
              incidence: current.incidence,
              cases: current.cases,
            }),
          },
        };
      }, {} as FormattedHistoryData) || ({} as FormattedHistoryData);

  for (let i = 0; i < agsList.length; i++) {
    for (let j = 6; j < historyData[agsList[i]].history.length; j++) {
      let sum = 0;
      for (let dayOffset = j; dayOffset > j - 7; dayOffset--) {
        sum += historyData[agsList[i]].history[dayOffset].cases;
      }
      historyData[agsList[i]].history[j].incidence =
        (sum / populationList[i]) * 100000;
    }
  }

  console.log(historyData[agsList[1]].history[0]);
  console.log(populationList);
  return historyData;
};

const formatHistoryUrl = (agsList: string[]) => {
  const url = RKI_HISTORY_DATA_URL.replace('REPLACE_AGS', agsList.join(', '))
    .replace('REPLACE_DAYS', '2020-03-15')
    .replace("'", '')
    .replace("'", '');

  console.log('formatted url', url);

  return url;
};

export const useHistoryData = (agsList: string[], populationList: number[]) => {
  const { getItem, setItem } = useLocalStorage(COVID_HISTORY_DATA);
  const { isInternetReachable }: NetInfoState = useNetInfo();

  const {
    data,
    isSuccess,
    error,
    isError,
    isLoading,
    isFetching,
    status,
    refetch,
  }: UseQueryResult<HistoryData, Error> = useQuery(
    ['rki-history', isInternetReachable || false, getItem, setItem, agsList],
    fetchFullHistoryData,
    {
      enabled: agsList.length > 0,
    },
  );

  const [hasData, setHasData] = useState(false);

  const historyDataRef = useRef<FormattedHistoryData>(
    {} as FormattedHistoryData,
  );

  useEffect(() => {
    if (!data) {
      return;
    }

    if (isSuccess && !hasData) {
      historyDataRef.current = getHistoryDataFromData(
        data,
        agsList,
        populationList,
      );
      setHasData(true);
    }
  }, [isSuccess, data, hasData, agsList, populationList]);

  return {
    options: {
      isSuccess,
      error,
      isError,
      isLoading,
      isFetching,
      refetch,
      status,
    },
    historyData: historyDataRef.current,
  };
};

export const useCovidData = (county: string, inGermany: boolean) => {
  const { isInternetReachable }: NetInfoState = useNetInfo();
  const { getItem } = useLocalStorage(COVID_FULL_DATA);

  const {
    data,
    isSuccess,
    error,
    isError,
    isLoading,
    isFetching,
    status,
    refetch,
  }: UseQueryResult<CovidData, Error> = useQuery(
    ['rki-full', isInternetReachable || false, getItem],
    fetchFullCovidData,
    {
      enabled: !!county && inGermany,
    },
  );

  const [currentCounty, setCurrentCounty] = useState('');

  const countyDataRef = useRef<CovidCountyData[]>([]);

  useEffect(() => {
    if (!data) {
      return;
    }

    if (isSuccess && currentCounty !== county) {
      countyDataRef.current = getCountyDataFromData(data, county) || [];
      setCurrentCounty(county);
    }
  }, [isSuccess, county, data, currentCounty, inGermany]);

  return {
    options: {
      isSuccess,
      error,
      isError,
      isLoading,
      isFetching,
      refetch,
      status,
    },
    countyData: countyDataRef.current,
  };
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
