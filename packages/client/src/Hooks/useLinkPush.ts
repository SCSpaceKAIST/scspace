import { useRouter } from "next/navigation";

export const useLinkPush = () => {
  // 라우터로 가져오는게 귀찮아서 하나로 만든 커스텀 훅

  const router = useRouter();

  const linkPush = (link: string) => {
    router.push(link);
  };

  return { router, linkPush };
};
