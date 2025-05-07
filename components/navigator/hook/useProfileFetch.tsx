import { useConfirmLogin } from "@/app/store/confirmLogin";
import { useProfileStore } from "@/app/store/profile";
import { usePgnStore } from "@/app/store/zustandStore";
import { useApiClient } from "@/functions/api-client";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useEffect, useState } from "react";
export type AuthState = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
};
export type User = {
  id: string;
  name: string;
  email: string;
  // Add other user properties as needed
};

export const useProfileFetch = () => {
  const [token, setToken] = useLocalStorage<string>("token", "");

  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    if (!token) return;
    setIsSignedIn(true);
  }, [token]);

  const [callFetch, setCallFetch] = useState<string>("");
  const { setUsername } = usePgnStore();
  const {
    getTokenBalance,
    getProfile,
    getActiveMembership,
    getAllMembershipPackage,
    getPuzzle,
    getTokenPackage,
  } = useApiClient();
  const {
    setTokenPackage,
    setActiveMembership,
    setAllMembershipPackages,
    setProfile,
    setPuzzleLog,
    setIsMember,
  } = useProfileStore();
  useEffect(() => {
    if (token != null) {
      getProfile({}).then((response) => {
        let data = response.data;
        console.log("getProfile", data);
        setProfile(data);
        setUsername(data.username);
      });
      getTokenBalance({}).then((response) => {
        let data = response.data;
        console.log("getTokenBalance", data);
        setToken(data);
      });
      getTokenPackage({}).then((response) => {
        let data = response.data;
        console.log("getTokenPackage", data);
        setTokenPackage(data);
      });
      getActiveMembership({}).then((response) => {
        let data = response.data;
        console.log("getActiveMembership", data);
        setIsMember(data.membershipPackage.type != "FREE");
        setActiveMembership(data);
      });
      getAllMembershipPackage({}).then((response) => {
        let data = response.data;
        console.log("getAllMembershipPackage", data);
        setAllMembershipPackages(data);
      });
      getPuzzle().then((res) => {
        let logs = res.data;
        setPuzzleLog(logs);
        console.log("log puzzle", logs);
      });
    }
  }, [token, callFetch]);
  return { callFetch, setCallFetch };
};
