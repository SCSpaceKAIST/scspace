import { ArticleTypeEnum } from "@scspace-depot/enums/article.enum";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface IArticleTypeStore {
    type: ArticleTypeEnum;
    update: (type: ArticleTypeEnum) => void;
}

export const useArticleTypeStore = create(
    persist<IArticleTypeStore>((set) => ({
        type: ArticleTypeEnum.NOTICE,
        update: (type) => set({ type }),
    }), {
        name: "article-type-store",
        storage: createJSONStorage(() => sessionStorage),
    })
)