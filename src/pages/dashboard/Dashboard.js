import React,{useEffect, useState} from 'react'
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const Dashboard = () => {
  const history = useHistory();
  let unmounted = false;

  const [isPageLoading, setisPageLoading] = useState(false);
useEffect(() => {
  getTodayEvent();
},[])

const getTodayEvent = async() => {
  setisPageLoading(true);
    unmounted = false;
    const source = axios.CancelToken.source();
    await axios.get(`${process.env.REACT_APP_SERVER}/dashboard-home-event-info/event`,)
    .then((response) => {
      console.log(response.data);

    })
    .catch((error) => {
      if (!unmounted) {
        if (error.request.status === 403) {
          localStorage.removeItem('userDetail');
          localStorage.removeItem('userToken');
          localStorage.removeItem('activeSubscription');
          history.replace('/login');
          history.go(0);
        }
      }
    })
    .finally(() => {
      setisPageLoading(false);
      return function () {
        unmounted = true;
        source.cancel("Cancelling in cleanup");
      };
    });
}

  return (
    <div>Dashboard</div>
  )
}

export default Dashboard