import './App.css';

import Header from './components/Header/Header';
import Main from './components/Main/Main';
import Footer from './components/Footer/Footer';

import { AuthProvider } from './contexts/AuthContext';

const App = () => {
    return (
        <AuthProvider>
            <Header />
            <Main />
            <Footer />
        </AuthProvider>
    )
}

export default App;