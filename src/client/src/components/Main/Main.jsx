import { Route, Routes } from 'react-router-dom';

import Home from '../Home/Home';
import Categories from '../Categories/Categories';
import Subcategories from '../Subcategories/Subcategories';
import NoPathFound from '../NoPathFound/NoPathFound';
import PlacesInSubcategory from '../PlacesInSubcategory/PlacesInSubcategory';
import MyPlaces from '../MyPlaces/MyPlaces';
import Notifications from '../Notifications/Notifications';

// Account
import Profile from '../Account/Profile/Profile';
import Logout from '../Account/Logout/Logout';
import SignIn from '../Account/SignIn/SignIn';
import SignUp from '../Account/SignUp/SignUp';
import ChangeUsername from '../Account/ChangeUsername/ChangeUsername';
import ChangePassword from '../Account/ChangePassword/ChangePassword';
import ChangeEmail from '../Account/ChangeEmail/ChangeEmail';
import ForgotPassword from '../Account/ForgotPassword/ForgotPassword';
import ResetPassword from '../Account/ResetPassword/ResetPassword';

// Place
import EditPlace from '../Place/EditPlace/EditPlace';
import UploadPlace from '../Place/UploadPlace/UploadPlace';
import PlaceDetails from '../Place/PlaceDetails/PlaceDetails';

import ScrollToTop from '../ScrollToTop/ScrollToTop';

import { FloatButton } from 'antd';

import * as paths from '../../constants/paths';

const Main = () => {
    return (
        <main>

            <div className='mainContainer'>

                <ScrollToTop />

                <Routes>

                    <Route path={paths.profilePath} element={<Profile />} />
                    <Route path={paths.changeUsernamePath} element={<ChangeUsername />} />
                    <Route path={paths.changePasswordPath} element={<ChangePassword />} />
                    <Route path={paths.changeEmailPath} element={<ChangeEmail />} />

                    <Route path={paths.homePath} element={<Home />} />
                    <Route path={paths.signInPath} element={<SignIn />} />
                    <Route path={paths.signUpPath} element={<SignUp />} />
                    <Route path={paths.categoriesPath} element={<Categories />} />
                    <Route path={paths.subcategoriesPath} element={<Subcategories />} />
                    <Route path={paths.logoutPath} element={<Logout />} />
                    <Route path={paths.uploadPlacePath} element={<UploadPlace />} />
                    <Route path={paths.placesInSubcategoryPath} element={<PlacesInSubcategory />} />
                    <Route path={paths.placeDetailsPath} element={<PlaceDetails />} />
                    <Route path={paths.notificationsPath} element={<Notifications />} />
                    <Route path={paths.placeEditPath} element={<EditPlace />} />

                    <Route path={paths.forgotPasswordPath} element={<ForgotPassword />} />
                    <Route path={paths.resetPasswordPath} element={<ResetPassword />} />

                    <Route path={paths.myPlacesPath} element={<MyPlaces />} />

                    <Route path='*' element={<NoPathFound />} />

                </Routes>

                <FloatButton.BackTop />

            </div>

        </main>
    )
};

export default Main;