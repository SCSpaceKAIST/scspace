import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface ITopicStore {
    rule: string | null;
    update: (rule: string) => void;
}

export const useRuleTopicStore = create(
    persist<ITopicStore>((set) => ({
        rule: null,
        update: (rule) => set({ rule }),
    }), {
        name: "rule-topic-store",
        storage: createJSONStorage(() => sessionStorage),
    })
);