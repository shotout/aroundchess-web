import { useProfileStore } from "@/app/store/profile";
import { usePgnStore } from "@/app/store/zustandStore";
import { useApiClient } from "@/functions/api-client";
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
};

export const useProfileFetch = () => {
  const { sessionId, alreadyFetch, setAlreadyFetch } = useProfileStore();
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    if (!sessionId) return;
    setIsSignedIn(true);
  }, [sessionId]);

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
    setToken,
    setTokenPackage,
    setActiveMembership,
    setAllMembershipPackages,
    setProfile,
    setPuzzleLog,
    setIsMember,
  } = useProfileStore();
  useEffect(() => {
    console.log("check hitted", alreadyFetch, sessionId);
    if (sessionId.length > 0 && alreadyFetch == false) {
      setAlreadyFetch(true);
      getProfile({}).then((response) => {
        if (response.data != null) {
          const data = response.data;
          setProfile(data);
          setUsername(data.username);
        }
      });
      getTokenBalance({}).then((response) => {
        if (response.data != null) {
          const data = response.data;
          setToken(data);
        }
      });
      getTokenPackage({}).then((response) => {
        if (response.data != null) {
          const data = response.data;
          setTokenPackage(data);
        }
      });
      getActiveMembership({}).then((response) => {
        if (response.data != null) {
          const data = response.data;
          setIsMember(data.membershipPackage.type != "FREE");
          setActiveMembership(data);
        }
      });
      getAllMembershipPackage({}).then((response) => {
        if (response.data != null) {
          const data = response.data;
          setAllMembershipPackages(data);
        }
      });
      getPuzzle().then((res) => {
        const logs = res.data;
        setPuzzleLog(logs);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, callFetch]);
  return { callFetch, setCallFetch };
};
