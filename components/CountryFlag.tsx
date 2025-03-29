"use client"
import { useEffect, useState } from "react";

export const CountryFlag = ({ countryCode }: { countryCode: string }) => {
  const [flagUrl, setFlagUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchFlag = async () => {
      try {
        const response = await fetch(`${countryCode}`);
        const data = await response.json();
        console.log("Data flag", data)
        setFlagUrl(data.flag);
      } catch (error) {
        console.error("Error fetching flag:", error);
      }
    };

    fetchFlag();
  }, [countryCode]);

  if (!flagUrl) return <p>Loading...</p>;

  return <img src={flagUrl} alt="Country Flag" width={100} height={60} />;
};
