import React, { Suspense } from 'react'
import { Route } from 'react-router-dom'
import AssessmentDetails from '../../pages/assessments/assessmentDetails/AssessmentDetails';
//import Registration from '../../registration/Registration'
import Loading from '../loading/Loading';

const Login = React.lazy(() => import('../../authentication/login/Login'));
const PublicHome = React.lazy(() => import('../../pages/PublicHome'));
const Registration = React.lazy(() => import('../../registration/Registration'));
const SubscriptionFailure = React.lazy(() => import('../../registration/subscription/SubscriptionFailure'));
const SubscriptionSuccess = React.lazy(() => import('../../registration/subscription/SubscriptionSuccess'));

const AuthRouter = () => {
    console.log('Its Login');
    return (
        <div>
            <Suspense fallback={<span><Loading/></span>}>
                <Route exact path={["/", "/login"]}>
                    <Login />
                </Route>
                <Route exact path="/home">
                    <PublicHome />
                </Route>
                <Route exact path="/registration">
                    <Registration/>
                </Route>
                <Route exact path="/registration/success">
                    <SubscriptionSuccess />
                </Route>
                <Route exact path="/registration/failure">
                    <SubscriptionFailure />
                </Route>
            </Suspense>
        </div>
    )
}

export default AuthRouter