import { Client, Mission } from "@prisma/client";
import { create } from "zustand";

export type MissionWithClient = Mission & { client: Client };

interface MissionState {
  missions: MissionWithClient[];
  loading: boolean;
  error: string | null;
  setMissions: (missions: MissionWithClient[]) => void;
  addMission: (mission: MissionWithClient) => void;
  updateMission: (mission: MissionWithClient) => void;
  removeMission: (missionId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchMissions: () => Promise<void>; // Action to fetch missions
}

export const useMissionStore = create<MissionState>((set) => ({
  missions: [],
  loading: true,
  error: null,
  setMissions: (missions) => set({ missions, loading: false, error: null }),
  addMission: (mission) =>
    set((state) => ({ missions: [mission, ...state.missions] })),
  updateMission: (updatedMission) =>
    set((state) => ({
      missions: state.missions.map((mission) =>
        mission.id === updatedMission.id ? updatedMission : mission
      ),
    })),
  removeMission: (missionId) =>
    set((state) => ({
      missions: state.missions.filter((mission) => mission.id !== missionId),
    })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error, loading: false }),
  fetchMissions: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/missions"); // Adjust API endpoint if needed
      if (!response.ok) {
        throw new Error("Failed to fetch missions");
      }
      const data: MissionWithClient[] = await response.json();
      set({ missions: data, loading: false });
    } catch (err) {
      const error =
        err instanceof Error ? err.message : "An unknown error occurred";
      set({ error, loading: false });
      console.error("Failed to fetch missions:", error);
    }
  },
}));
