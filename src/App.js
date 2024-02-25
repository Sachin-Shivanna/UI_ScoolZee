import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { loginContext } from './components/context/Context'
import {breadcrumbsContext } from './components/context/Context'
import { BrowserRouter as Router } from 'react-router-dom';
import AppDrawer from './components/drawer/AppDrawer';
import AuthRouter from './components/routers/AuthRouter';

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [breadcrumbsList, setBreadcrumbsList] = React.useState([]);

  axios.interceptors.request.use(request => {
    const isLoggedIn = localStorage.getItem('userToken');
    const isApiUrl = request.url.startsWith(process.env.REACT_APP_SERVER);

    if (isLoggedIn && isApiUrl) {
      request.headers.common.Authorization = `Bearer ${localStorage.getItem('userToken')}`;
    }

    return request;
  });

  useEffect(() => {
    if (localStorage.getItem('userToken')) {
      setIsLoggedIn(true);
    }
  }, []);

  if (isLoggedIn) {
    return (
      <loginContext.Provider value={[isLoggedIn, setIsLoggedIn]}>
        <breadcrumbsContext.Provider value={[breadcrumbsList,setBreadcrumbsList]}>
        <Router>
          <div style={{ display: 'flex' }}>
            <AppDrawer />
          </div>
        </Router>
        </breadcrumbsContext.Provider>
      </loginContext.Provider>
    );
  }
  else {
    console.log('Not logged In');
    return (
      <loginContext.Provider value={[isLoggedIn, setIsLoggedIn]}>
        <Router>
          <AuthRouter />
        </Router>
      </loginContext.Provider>
    )
  }
}

export default App;
