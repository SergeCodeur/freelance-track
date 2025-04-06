import { Client, Mission } from "@prisma/client";
import { create } from "zustand";

export type ClientWithMissions = Client & { missions: Mission[] };

interface ClientState {
  clients: ClientWithMissions[];
  loading: boolean;
  error: string | null;
  setClients: (clients: ClientWithMissions[]) => void;
  addClient: (client: ClientWithMissions) => void;
  updateClient: (client: ClientWithMissions) => void;
  removeClient: (clientId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchClients: () => Promise<void>; // Action to fetch clients
  addMissionToClient: (clientId: string, mission: Mission) => void;
}

export const useClientStore = create<ClientState>((set) => ({
  clients: [],
  loading: true,
  error: null,
  setClients: (clients) => set({ clients, loading: false, error: null }),
  addClient: (client) =>
    set((state) => ({ clients: [client, ...state.clients] })),
  updateClient: (updatedClient) =>
    set((state) => ({
      clients: state.clients.map((client) =>
        client.id === updatedClient.id ? updatedClient : client
      ),
    })),
  removeClient: (clientId) =>
    set((state) => ({
      clients: state.clients.filter((client) => client.id !== clientId),
    })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error, loading: false }),
  fetchClients: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/clients"); // Adjust API endpoint if needed
      if (!response.ok) {
        throw new Error("Failed to fetch clients");
      }
      const data: ClientWithMissions[] = await response.json();
      set({ clients: data, loading: false });
    } catch (err) {
      const error =
        err instanceof Error ? err.message : "An unknown error occurred";
      set({ error, loading: false });
      console.error("Failed to fetch clients:", error);
    }
  },
  addMissionToClient: (clientId, mission) =>
    set((state) => ({
      clients: state.clients.map((client) =>
        client.id === clientId
          ? {
              ...client,
              missions: [...(client.missions ?? []), mission],
            }
          : client
      ),
    })),
}));
