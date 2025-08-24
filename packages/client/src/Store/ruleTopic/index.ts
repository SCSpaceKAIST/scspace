import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface ITopicStore {
    topic: string | null;
    update: (topic: string) => void;
}

export const useRuleTopicStore = create(
    persist<ITopicStore>((set) => ({
        topic: null,
        update: (topic) => set({ topic }),
    }), {
        name: "rule-topic-store",
        storage: createJSONStorage(() => sessionStorage),
    })
);