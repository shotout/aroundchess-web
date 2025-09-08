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
  const {
    sessionId,
    alreadyFetch,
    setAlreadyFetch,
    alreadyFetchProfile,
    setAlreadyFetchProfile,
  } = useProfileStore();
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
    setTokenData,
  } = useProfileStore();
  useEffect(() => {
    if (sessionId.length > 0 && alreadyFetch == false) {
      setAlreadyFetch(true);
      if (alreadyFetchProfile == false) {
        setAlreadyFetchProfile(true);
        getProfile({}).then((response) => {
          if (response.data != null) {
            const data = response.data;
            setProfile(data);
            setUsername(data.username);
          }
        });
      }
      getAllMembershipPackage({}).then((response) => {
        if (response.data != null) {
          const data = response.data;
          setAllMembershipPackages(data);
        }
      });
      getActiveMembership({}).then((response) => {
        if (response.data != null) {
          const data = response.data;
          setIsMember(data.membershipPackage.type != "FREE");
          setActiveMembership(data);
        }
      });
      getTokenBalance({}).then((response) => {
        if (response.data != null) {
          const data = response.data;
          setToken(data);
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
