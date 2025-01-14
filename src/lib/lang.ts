const de: langOptions = {
  swipeable: {
    pullFurther: 'Weiter ziehen 👉',
    switchColorMode: 'Farbenmodus ändern',
  },
  homeScreen: {
    default:
      'Stellen Sie sicher, dass Sie mit dem Internet verbunden sind und sich gerade in Deutschland befinden, dann erneut versuchen',
  },
  historyScreen: {
    showDatePicker: 'Datum auswählen',
  },
  rkiData: {
    error: {
      error: 'Ups, es gab nen Fehler',
      toast:
        'Bitte stellen Sie sicher, dass sie mit dem Internet verbunden sind, dann erneut versuchen',
      button: 'Erneut versuchen',
    },
    main: {
      header: 'Hi, das ist die RKI App für deine Stadt',
      incidence: 'Inzidenz',
      cases: 'Fälle',
      lastUpdated: 'Zuletzt aktualisiert:',
      clock: '',
      button: 'Region ändern',
    },
    default: 'Etwas ging schief',
  },
}

const en: langOptions = {
  swipeable: {
    pullFurther: 'Pull further 👉',
    switchColorMode: 'Switch Color Mode',
  },
  homeScreen: {
    default:
      "Make sure you're connected to the internet and you're currently in Germany, then try again",
  },
  historyScreen: {
    showDatePicker: 'Show Date Picker',
  },
  rkiData: {
    error: {
      error: 'Oops, there was an error',
      toast: 'Please make sure you are connected to the internet and try again',
      button: 'Try Again',
    },
    main: {
      header: 'Hi, this is the RKI App for Your City',
      incidence: 'Incidence',
      cases: 'Cases',
      lastUpdated: 'Last updated:',
      clock: 'Uhr',
      button: 'Switch Region',
    },
    default: 'Something went wrong',
  },
}

interface langOptions {
  swipeable: {
    pullFurther: string
    switchColorMode: string
  }
  homeScreen: {
    default: string
  }
  historyScreen: {
    showDatePicker: string
  }
  rkiData: {
    error: {
      error: string
      toast: string
      button: string
    }
    main: {
      header: string
      incidence: string
      cases: string
      lastUpdated: string
      clock: string
      button: string
    }
    default: string
  }
}

interface lang {
  de: typeof en
  en: langOptions
}

export default {
  de,
  en,
} as lang
