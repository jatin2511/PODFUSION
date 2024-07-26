import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { store,persistor } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react'; 
import { Provider } from 'react-redux';

import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
       <GoogleOAuthProvider clientId="65487570054-kqfu1i9ed9h7rver0irp4qj1ncq8ffs0.apps.googleusercontent.com">
      <Provider store={store}>
      <PersistGate persistor={persistor}>
          <App />
        </PersistGate>
      </Provider>
    </GoogleOAuthProvider>
    </React.StrictMode>
   
  
);