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

import { FloatButton } from 'antd';

import * as paths from '../../constants/paths';

const Main = () => {
    return (
        <main>
            <div className='mainContainer'>
                <Routes>

                    <Route path={paths.profilePath} element={<ProfileLayout />}>
                        <Route index element={<Profile />} />
                    </Route>

                    <Route path={paths.homePath} element={<Home />} />
                    <Route path={paths.signInPath} element={<SignIn />} />
                    <Route path={paths.signUpPath} element={<SignUp />} />
                    <Route path={paths.categoriesPath} element={<Categories />} />
                    <Route path={paths.subcategoriesPath} element={<Subcategories />} />
                    <Route path={paths.logoutPath} element={<Logout />} />
                    <Route path={paths.uploadPlacePath} element={<UploadPlace />} />
                    <Route path={paths.placesInSubcategoryPath} element={<PlacesInSubcategory />} />
                    <Route path={paths.placeDetailsPath} element={<PlaceDetails />} />

                    <Route path='*' element={<NoPathFound />} />
                </Routes>

                <FloatButton.BackTop />
            </div>
        </main>
    )
};

export default Main;