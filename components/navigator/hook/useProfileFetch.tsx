import { usePricingOffer } from "@/app/store/pricingOffer";
import { useProfileStore } from "@/app/store/profile";
import { usePgnStore } from "@/app/store/zustandStore";
import { useApiClient } from "@/functions/api-client";
import { usePathname } from "next/navigation";
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
    profile,
    setToken,
    setTokenPackage,
    setActiveMembership,
    setAllMembershipPackages,
    setProfile,
    setPuzzleLog,
    setIsMember,
    setIsMemberMonthly,
    setTokenData,
  } = useProfileStore();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const { setOpenOffer } = usePricingOffer();
  const pathname = usePathname()
  useEffect(() => {
    if (!sessionId) return;
    setIsSignedIn(true);
  }, [sessionId]);

  const [callFetch, setCallFetch] = useState<string>("");
  const [callingNumber, setCallingNumber] = useState<number>(0);
  const { setUsername, everShowOffer, setEverShowOffer, isFromGameHistory } = usePgnStore();
  const {
    getTokenBalance,
    getProfile,
    getActiveMembership,
    getAllMembershipPackage,
    getPuzzle,
    getTokenPackage,
  } = useApiClient();
  useEffect(() => {
    let profileData = profile;
    if (sessionId.length > 0 && alreadyFetch == false) {
      setAlreadyFetch(true);
      setCallingNumber((i) => i + 1);
      // if (alreadyFetchProfile == false) {
      setAlreadyFetchProfile(true);
      getProfile({}).then((response) => {
        if (response.data != null) {
          const data = response.data;
          setProfile(data);
          setUsername(data.username);
          profileData = data;
        }
      });

      // }

      getTokenBalance({}).then((response) => {
        if (response.data != null) {
          const data = response.data;
          setToken(data);
          // console.log("profileData",callingNumber, profileData);
          if (
            data.balance == 0 &&
            profileData.discountInfo.hasActiveDiscount &&
            profileData?.discountInfo?.startDate &&
            !everShowOffer && !isFromGameHistory
          ) {
            setOpenOffer(true);
            setEverShowOffer(true);
          }
        }
      });
      getAllMembershipPackage({}).then((response) => {
        if (response.data != null) {
          const data = response.data;
          setAllMembershipPackages(data);
        }
      });
      getActiveMembership({}).then((response) => {
        if (response.data != null) {
          const data = response.data;
          setIsMember(data.membershipPackage.type == "YEARLY");
          setIsMemberMonthly(data.membershipPackage.type == "MONTHLY");
          setActiveMembership(data);
        }
      });

      // getPuzzle().then((res) => {
      //   const logs = res.data;
      //   setPuzzleLog(logs);
      // });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, callFetch]);
  return { callFetch, setCallFetch };
};
