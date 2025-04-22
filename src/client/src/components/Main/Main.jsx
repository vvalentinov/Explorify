import { Route, Routes } from 'react-router-dom';

import Home from '../Home/Home';
import SignIn from '../SignIn/SignIn';
import SignUp from '../SignUp/SignUp';
import Categories from '../Categories/Categories';
import Profile from '../Profile/Profile';
import Subcategories from '../Subcategories/Subcategories';

import * as paths from '../../constants/paths';

const Main = () => {
    return (
        <main>
            <Routes>
                <Route path={paths.homePath} element={<Home />} />
                <Route path={paths.signInPath} element={<SignIn />} />
                <Route path={paths.signUpPath} element={<SignUp />} />
                <Route path={paths.categoriesPath} element={<Categories />} />
                <Route path={paths.profilePath} element={<Profile />} />
                <Route path={paths.subcategoriesPath} element={<Subcategories />} />
            </Routes>
        </main>
    )
};

export default Main;