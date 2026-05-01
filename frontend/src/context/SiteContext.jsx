/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const SiteContext = createContext();

export function SiteProvider({ children }) {
    const [siteContent, setContent] = useState(null);

    useEffect(() => {
        axios.get('/api/public/content')
            .then(res => setContent(res.data))
            .catch(err => console.error("CMS load failed", err));
    }, []);

    return (
        <SiteContext.Provider value={{ siteContent }}>
            {children}
        </SiteContext.Provider>
    );
}
