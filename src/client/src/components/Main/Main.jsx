import { Route, Routes } from 'react-router-dom';

import Home from '../Home/Home';
import SignIn from '../SignIn/SignIn';
import SignUp from '../SignUp/SignUp';
import Categories from '../Categories/Categories';
import Profile from '../Profile/Profile';

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
            </Routes>
        </main>
    )
};

export default Main;