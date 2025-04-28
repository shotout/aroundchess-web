import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";

const endpoint = process.env.BASE_URL;

interface TrainingTopic {
  id: string;
  title: string;
  level: string;
  category: string;
}

interface TrainingSchedule {
  date: string;
  weekDay: string;
  schedule: {
    openingTopics: TrainingTopic[];
    middlegameTopics: TrainingTopic[];
    endgameTopics: TrainingTopic[];
  };
}

export function useTrainingSchedule() {
  const { sessionId } = useAuth();
  const [schedule, setSchedule] = useState<TrainingSchedule | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSchedule = async () => {
    if (!sessionId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `${endpoint}/training-plan/today-schedule`,
        {
          headers: {
            Authorization: `Bearer ${sessionId}`,
          },
        }
      );

      setSchedule(response.data.data);
    } catch (err) {
      console.error("Error fetching training schedule:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch training schedule"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (sessionId) {
      fetchSchedule();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  return {
    schedule,
    isLoading,
    error,
    refetch: fetchSchedule,
  };
}
