import { Route, Routes } from 'react-router-dom';

import Home from '../Home/Home';
import Categories from '../Categories/Categories';
import Subcategories from '../Subcategories/Subcategories';
import NoPathFound from '../NoPathFound/NoPathFound';
import PlacesInSubcategory from '../Place/PlacesInSubcategory/PlacesInSubcategory';
import Notifications from '../Notifications/Notifications';

import MyPlaces from '../Place/MyPlaces';
import MyReviews from '../Review/MyReviews/MyReviews';
import ReviewEdit from '../Review/ReviewEdit/ReviewEdit';

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

import FavPlaces from '../Place/FavPlaces/FavPlaces';

import PlaceSearch from '../Place/PlaceSearch/PlaceSearch';

import ScrollToTop from '../ScrollToTop/ScrollToTop';

import { FloatButton } from 'antd';

import MyFollowing from '../MyFollowing/MyFollowing';

import * as paths from '../../constants/paths';

import UserFollowingPlaces from '../Place/UserFollowingPlaces';

import Settings from '../Account/Settings/Settings';

import Leaderboard from '../Leaderboard/Leaderboard';

import GoogleAuthRedirect from '../GoogleAuthRedirect';

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

                    <Route path="/auth/google/callback" element={<GoogleAuthRedirect />} />

                    <Route path={paths.homePath} element={<Home />} />
                    <Route path={paths.signInPath} element={<SignIn />} />
                    <Route path={paths.signUpPath} element={<SignUp />} />
                    <Route path={paths.categoriesPath} element={<Categories />} />
                    <Route path={paths.subcategoriesPath} element={<Subcategories />} />
                    <Route path={paths.logoutPath} element={<Logout />} />
                    <Route path={paths.uploadPlacePath} element={<UploadPlace />} />
                    <Route path={paths.placesInSubcategoryPath} element={<PlacesInSubcategory />} />
                    <Route path={paths.placeDetailsPath} element={<PlaceDetails isForAdmin={false} />} />
                    <Route path={paths.notificationsPath} element={<Notifications />} />
                    <Route path={paths.placeEditPath} element={<EditPlace />} />

                    <Route path={paths.favPlacesPath} element={<FavPlaces />}></Route>

                    <Route path={paths.forgotPasswordPath} element={<ForgotPassword />} />
                    <Route path={paths.resetPasswordPath} element={<ResetPassword />} />

                    <Route path={paths.accountSettingsPath} element={<Settings />} />

                    <Route path={paths.leaderboardPath} element={< Leaderboard />} />

                    <Route path='/search' element={<PlaceSearch />} />

                    <Route path={paths.myPlacesPath} element={<MyPlaces />} />
                    <Route path={paths.myReviewsPath} element={<MyReviews />} />

                    <Route path={paths.reviewEditPath} element={<ReviewEdit />} />

                    <Route path={paths.myFollowingPath} element={<MyFollowing />} />

                    <Route path={paths.userPlaces} element={<UserFollowingPlaces />} />

                    <Route path='*' element={<NoPathFound />} />

                </Routes>

                <FloatButton.BackTop className="custom-backtop" />

            </div>

        </main>
    )
};

export default Main;