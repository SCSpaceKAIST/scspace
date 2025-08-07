/** @type {import('next').NextConfig} */
const nextConfig = {
  // Turbopack 안정화 버전 사용
  turbopack: {},

  // 개발 서버 안정성을 위한 기본 설정
  reactStrictMode: true,

  // 성능 최적화 (안전한 수준)
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // 이미지 최적화
  images: {
    formats: ["image/webp", "image/avif"],
  },

  // 개발 환경에서만 적용되는 안전한 웹팩 최적화
  ...(process.env.NODE_ENV === "development" && {
    webpack: (config, { dev, isServer }) => {
      if (dev && !isServer) {
        // 개발 환경에서만 메모리 캐시 사용 (파일시스템 캐시보다 안전)
        config.cache = {
          type: "memory",
        };

        // 개발 시 번들 분석 최적화
        config.optimization = {
          ...config.optimization,
          moduleIds: "named",
          chunkIds: "named",
        };
      }
      return config;
    },
  }),
};

export default nextConfig;
