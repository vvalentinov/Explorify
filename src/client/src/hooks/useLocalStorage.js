import { useState } from 'react';

export const useLocalStorage = (key, initialValue) => {

    const [state, setState] = useState(() => {
        const auth = localStorage.getItem(key);
        return auth ? JSON.parse(auth) : initialValue;
    });

    const setLocalStorageState = (value) => {
        setState(value);
        localStorage.setItem(key, JSON.stringify(value));
    };

    return [state, setLocalStorageState];
};