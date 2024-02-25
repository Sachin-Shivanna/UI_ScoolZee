import React, { Suspense, useEffect } from 'react'
import { Route, Redirect } from 'react-router-dom'
import axios from 'axios';
import ProtectedRouts from './ProtectedRoutes';
import { useHistory } from 'react-router-dom';
import Loading from '../loading/Loading';
import { AccessDefinition } from '../../constants/AccessDefinition/AccessDefinition';

const Home = React.lazy(() => import('../../pages/home/Home'));
const Dashboard = React.lazy(() => import('../../pages/dashboard/Dashboard'));
const Accounts = React.lazy(() => import('../../pages/account/Accounts'));
const Setup = React.lazy(() => import('../../pages/setup/Setup'));
const NewUser = React.lazy(() => import('../../pages/users/newUser/NewUser'));
const Users = React.lazy(() => import('../../pages/users/Users'));
//const BillingDetails = React.lazy(() => import('../../pages/setup/institutionSetup/billingDetails/BillingDetails'));
const UserDetail = React.lazy(() => import('../../pages/users/userDetail/UserDetail'));
const NewClass = React.lazy(() => import('../../pages/setup/classesSetup/newClass/NewClass'));
const ClassTab = React.lazy(() => import('../../pages/setup/classesSetup/ClassTab'));
const ClassesSetup = React.lazy(() => import('../../pages/setup/classesSetup/ClassesSetup'));
const Events = React.lazy(() => import('../../pages/events/Events'));
const NewEvent = React.lazy(() => import('../../pages/events/newEvent/NewEvent'));
const EventDetailTab = React.lazy(() => import('../../pages/events/eventDetail/EventDetailTab'));
const NewFeeStructure = React.lazy(() => import('../../pages/setup/feesStructures/newFeeStructure/NewFeeStructure'));
const Assessments = React.lazy(() => import('../../pages/assessments/Assessments'));
const NewAssessment = React.lazy(() => import('../../pages/assessments/newAssessment/NewAssessment'));
const FeeStructureDetails = React.lazy(() => import('../../pages/setup/feesStructures/FeeStructureDetails'));
const AssessmentDetails = React.lazy(() => import('../../pages/assessments/assessmentDetails/AssessmentDetails'));


const AppRouter = () => {
  const history = useHistory();
  const currentUserProfile = JSON.parse(localStorage.getItem('userDetail'))?.profile?.name;
  const isSubscribed = JSON.parse(localStorage.getItem('activeSubscription'));

  return (
    <div>
      <Suspense fallback={<span><Loading /></span>}>
        {
          ( isSubscribed === false && currentUserProfile === 'Admin')
            ?
            (<Route exact path="/">
              <Redirect to={AccessDefinition.find(ra => ra.route === '/setup/billing-details')?.routAccess?.includes(currentUserProfile) ? '/setup/billing-details' : () => {
                localStorage.removeItem('userDetail');
                localStorage.removeItem('userToken');
                localStorage.removeItem('activeSubscription');
                localStorage.removeItem('subscribedProd');
                history.replace('/login');
                history.go(0);
              }} />
            </Route>)
            :
            (<Route exact path="/">
              <Redirect to={ JSON.parse(localStorage.getItem('accessDefination'))?.includes('/home') ?'/home' : '/dashboard'} /> 
            </Route>)
        }
        <ProtectedRouts
          exact
          path="/home"
          component={Home}
          auth={
            JSON.parse(localStorage.getItem('accessDefination'))?.includes('/home') ? true: false
          }
        />
        <ProtectedRouts
          exact
          path="/dashboard"
          component={Dashboard}
          auth={
            // (AccessDefinition.find(ra => ra.route === '/dashboard')?.routAccess?.includes(currentUserProfile) && isSubscribed) ? true : false
            (JSON.parse(localStorage.getItem('accessDefination'))?.includes('/dashboard') && isSubscribed) ? true : false
          }
        />
        <ProtectedRouts
          exact
          path="/classes"
          component={ClassesSetup}
          auth={
           // (AccessDefinition.find(ra => ra.route === '/classes')?.routAccess?.includes(currentUserProfile) && isSubscribed) ? true : false
           (JSON.parse(localStorage.getItem('accessDefination'))?.includes('/classes')  && isSubscribed) ? true : false
          }
        />
        <ProtectedRouts
          exact
          path="/accounts"
          component={Accounts}
          auth={
            //(AccessDefinition.find(ra => ra.route === '/accounts')?.routAccess?.includes(currentUserProfile) && isSubscribed) ? true: false
            (JSON.parse(localStorage.getItem('accessDefination'))?.includes('/accounts')  && isSubscribed) ? true: false
          }
        />
        <ProtectedRouts
          exact
          path="/assessments"
          component={Assessments}
          auth={
            // (AccessDefinition.find(ra => ra.route === '/assessments')?.routAccess?.includes(currentUserProfile) && isSubscribed) ? true : false
            (JSON.parse(localStorage.getItem('accessDefination'))?.includes('/assessments')  && isSubscribed) ? true : false
          }
        />
        <ProtectedRouts
          exact
          path="/assessments/add-assessment"
          component={NewAssessment}
          auth={
            //(AccessDefinition.find(ra => ra.route === '/assessments/add-assessment')?.routAccess?.includes(currentUserProfile) && isSubscribed) ? true : false
            (JSON.parse(localStorage.getItem('accessDefination'))?.includes('/assessments/add-assessment') && isSubscribed) ? true : false
          }
        />
        <ProtectedRouts
          exact
          path="/events"
          component={Events}
          auth={
            // (AccessDefinition.find(ra => ra.route === '/events')?.routAccess?.includes(currentUserProfile) && isSubscribed) ? true : false
            (JSON.parse(localStorage.getItem('accessDefination'))?.includes('/events') && isSubscribed) ? true : false
          }
        />
        <ProtectedRouts
          exact
          path="/events/event-detail/:id"
          component={EventDetailTab}
          auth={
            //(AccessDefinition.find(ra => ra.route === '/events/event-detail/:id')?.routAccess?.includes(currentUserProfile) && isSubscribed) ? true : false
            JSON.parse(localStorage.getItem('accessDefination'))?.includes('/events/event-detail/:id') ? true : false
          }
        />
        <ProtectedRouts
          exact
          path="/events/add-event"
          component={NewEvent}
          auth={
            //(AccessDefinition.find(ra => ra.route === '/events/add-event')?.routAccess?.includes(currentUserProfile) && isSubscribed) ? true : false
            (JSON.parse(localStorage.getItem('accessDefination'))?.includes('/events/add-event') && isSubscribed) ? true : false
          }
        />
        <ProtectedRouts
          exact
          path="/setup"
          component={Setup}
          auth={
            //(AccessDefinition.find(ra => ra.route === '/setup')?.routAccess?.includes(currentUserProfile) && isSubscribed) ? true : false
            (JSON.parse(localStorage.getItem('accessDefination'))?.includes('/setup') && isSubscribed) ? true : false
          }
        />
        {/* <ProtectedRouts
          exact
          path="/setup/billing-details"
          component={BillingDetails}
          auth={
            // AccessDefinition.find(ra => ra.route === '/setup/billing-details')?.routAccess?.includes(currentUserProfile)
            JSON.parse(localStorage.getItem('accessDefination'))?.includes('/setup/billing-details') 
          }
        /> */}
        <ProtectedRouts
          exact
          path="/users"
          component={Users}
          auth={
            //(AccessDefinition.find(ra => ra.route === '/users')?.routAccess?.includes(currentUserProfile) && isSubscribed) ? true : false
            (JSON.parse(localStorage.getItem('accessDefination'))?.includes('/users') && isSubscribed) ? true : false
          }
        />
        <ProtectedRouts
          exact
          path="/users/user-details/:id"
          component={UserDetail}
          auth={
            //(AccessDefinition.find(ra => ra.route === '/users/user-details/:id')?.routAccess?.includes(currentUserProfile) && isSubscribed) ? true : false
            (JSON.parse(localStorage.getItem('accessDefination'))?.includes('/users/user-details/:id') && isSubscribed) ? true : false
          }
        />
        <ProtectedRouts
          exact
          path="/users/add-user"
          component={NewUser}
          auth={
            //(AccessDefinition.find(ra => ra.route === '/users/add-user')?.routAccess?.includes(currentUserProfile) && isSubscribed) ? true : false
            (JSON.parse(localStorage.getItem('accessDefination'))?.includes('/users/add-user') && isSubscribed) ? true : false
          }
        />
        <ProtectedRouts
          exact
          path="/setup/add-class"
          component={NewClass}
          auth={
            //(AccessDefinition.find(ra => ra.route === '/setup/add-class')?.routAccess?.includes(currentUserProfile) && isSubscribed) ? true : false
            (JSON.parse(localStorage.getItem('accessDefination'))?.includes('/setup/add-class') && isSubscribed) ? true : false
          }
        />
        <ProtectedRouts
          exact
          path="/setup/add-fee"
          component={NewFeeStructure}
          auth={
            //(AccessDefinition.find(ra => ra.route === '/setup/add-fee')?.routAccess?.includes(currentUserProfile) && isSubscribed) ? true : false
            (JSON.parse(localStorage.getItem('accessDefination'))?.includes('/setup/add-fee') && isSubscribed) ? true : false
          }
        />
        <ProtectedRouts
          exact
          path="/setup/fee-details"
          component={FeeStructureDetails}
          auth={
            //(AccessDefinition.find(ra => ra.route === '/setup/fee-details')?.routAccess?.includes(currentUserProfile) && isSubscribed) ? true : false
            (JSON.parse(localStorage.getItem('accessDefination'))?.includes('/setup/fee-details') && isSubscribed) ? true : false
          }
        />
        <ProtectedRouts
          exact
          path="/section/search"
          component={ClassTab}
          auth={
            //(AccessDefinition.find(ra => ra.route === '/section/search')?.routAccess?.includes(currentUserProfile) && isSubscribed) ? true : false
            (JSON.parse(localStorage.getItem('accessDefination'))?.includes('/section/search') && isSubscribed) ? true : false
          }
        />
        <ProtectedRouts
          exact
          path="/assessments/assessment-detail/:id"
          component={AssessmentDetails}
          auth={
            //(AccessDefinition.find(ra => ra.route === '/section/search')?.routAccess?.includes(currentUserProfile) && isSubscribed) ? true : false
            (JSON.parse(localStorage.getItem('accessDefination'))?.includes('/assessments/assessment-detail/:id') && isSubscribed) ? true : false
          }
        />
      </Suspense>
    </div>
  )
}

export default AppRouter