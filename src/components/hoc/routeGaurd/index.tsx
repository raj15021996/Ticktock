"use client";
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  PRIVATE_PATH,
  PUBLIC_PATH,
  ROUTES_PATH,
  storageKeys,
} from "@/utils/constant";
import Cookies from "js-cookie";

export const RouterGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();

  const [authorized, setAuthorized] = useState<boolean>(false);

  const accessToken = Cookies.get(storageKeys.accessToken);

  const isAuthenticated = accessToken;

  useEffect(() => {
    authCheck(pathname);
  }, [pathname]);

  function authCheck(url: string) {
    const isPublicPath = Object.values(PUBLIC_PATH).includes(url);

    const isPrivatePath = Object.values(PRIVATE_PATH).includes(url);

    if (pathname === ROUTES_PATH.HOME) {
      if (isAuthenticated) {
        router.replace(ROUTES_PATH.DASHBOARD);
      } else {
        router.replace(ROUTES_PATH.LOGIN);
      }

      return;
    }

    if (!isAuthenticated && isPrivatePath) {
      router.push(ROUTES_PATH.LOGIN);
      return false;
    }

    if (isAuthenticated && isPublicPath) {
      router.push(ROUTES_PATH.DASHBOARD);
      return false;
    }

    setAuthorized(true);
  }

  return authorized ? children : <></>;
};
