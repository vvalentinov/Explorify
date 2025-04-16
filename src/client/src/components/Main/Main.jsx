import { Route, Routes } from 'react-router-dom';

import Home from '../Home/Home';
import SignIn from '../SignIn/SignIn';
import SignUp from '../SignUp/SignUp';

import * as paths from '../../constants/paths';

const Main = () => {
    return (
        <main>
            <Routes>
                <Route path={paths.homePath} element={<Home />} />
                <Route path={paths.signInPath} element={<SignIn />} />
                <Route path={paths.signUpPath} element={<SignUp />} />
            </Routes>
        </main>
    )
};

export default Main;