import { Route, Routes } from 'react-router-dom';

import Home from '../Home/Home';
import SignIn from '../SignIn/SignIn';
import SignUp from '../SignUp/SignUp';
import Categories from '../Categories/Categories';
import Profile from '../Profile/Profile';
import Subcategories from '../Subcategories/Subcategories';
import NoPathFound from '../NoPathFound/NoPathFound';
import Logout from '../Logout/Logout';
import UploadPlace from '../UploadPlace/UploadPlace';
import PlacesInSubcategory from '../PlacesInSubcategory/PlacesInSubcategory';
import PlaceDetails from '../PlaceDetails/PlaceDetails';
import ProfileLayout from '../ProfileLayout/ProfileLayout';
import ChangeUsername from '../ChangeUsername/ChangeUsername';
import ChangePassword from '../ChangePassword/ChangePassword';
import ChangeEmail from '../ChangeEmail/ChangeEmail';
import ForgotPassword from '../ForgotPassword/ForgotPassword';
import ResetPassword from '../ResetPassword/ResetPassword';
import MyPlaces from '../MyPlaces/MyPlaces';
import Notifications from '../Notifications/Notifications';
import EditPlace from '../EditPlace/EditPlace';

import ScrollToTop from '../ScrollToTop/ScrollToTop';

import { FloatButton } from 'antd';

import * as paths from '../../constants/paths';

const Main = () => {
    return (
        <main>

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

        </main>
    )
};

export default Main;