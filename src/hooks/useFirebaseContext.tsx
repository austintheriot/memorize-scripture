import React, { createContext, useContext } from 'react';

//Firebase Config
import { firebaseConfig } from 'app/config';
import * as firebase from 'firebase/app';
import 'firebase/analytics';

export const app = firebase.initializeApp(firebaseConfig);
export const analytics = firebase.analytics(app);
export type Analytics = typeof analytics;
export const FirebaseContext = createContext({
  app,
  analytics,
});

export const FirebaseProvider = ({ children }: { children: any }) => {
  return (
    <FirebaseContext.Provider value={{
      app,
      analytics,
    }}>{children}</FirebaseContext.Provider>
  );
};

export const useFirebaseContext = () => {
  return useContext(FirebaseContext);
};
