// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  appName: 'Human Resource For Health',

  apiUrl: 'http://localhost:8000/api/',
  fileUrl: 'http://localhost:8000/uploads/Employee/PersonalFile',
  imagePath: 'http://localhost:8000/uploads/Employee/PersonalImage/',
  trainingfileUrl:'http://localhost:8000/uploads/Employee/TrainingFile',
  staffAdvertisementfileUrl:'http://localhost:8000/uploads/staffAdvertisement',

  reverb: {
    key: 'wazohub',
    wsHost: 'localhost',
    wsPort: 8080,
    authEndpoint: 'http://localhost:8000/broadcasting/auth',
  },

};

