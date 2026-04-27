// tRPC client - stub for local development
// In production, this connects to the tRPC server

import { createTRPCReact } from "@trpc/react-query"

export const trpc = createTRPCReact<any>()

// Mock trpc for when server is not available
export const mockTrpc = {
  assessment: {
    list: { useQuery: () => ({ data: [], isLoading: false }) },
    create: { useMutation: () => ({ mutateAsync: async () => ({}), isPending: false }) },
    delete: { useMutation: () => ({ mutateAsync: async () => ({}), isPending: false }) },
  },
  pilot: {
    create: { useMutation: () => ({ mutateAsync: async () => ({}), isPending: false }) },
    list: { useQuery: () => ({ data: [], isLoading: false }) },
  },
  research: {
    list: { useQuery: () => ({ data: [], isLoading: false }) },
  },
}
