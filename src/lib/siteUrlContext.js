import { createContext, useContext } from 'react';

const SiteUrlContext = createContext('http://localhost:3000');

export function SiteUrlProvider({ siteUrl, children }) {
  return <SiteUrlContext.Provider value={siteUrl || 'http://localhost:3000'}>{children}</SiteUrlContext.Provider>;
}

export function useSiteUrl() {
  return useContext(SiteUrlContext);
}
