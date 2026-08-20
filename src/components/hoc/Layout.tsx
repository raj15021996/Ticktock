"use client";

import { RouterGuard } from "./routeGaurd";
import { ToasterProvider } from 'react-toastella';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ToasterProvider>
      <RouterGuard>{children}</RouterGuard>
    </ToasterProvider>
  );
};

export default Layout;
