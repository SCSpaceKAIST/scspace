// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  //reactStrictMode: false, // React Strict Mode 비활성화

  // 웹팩 설정 최적화
  webpack: (config, { dev, isServer }) => {
    // 캐시 최적화 - 큰 문자열 문제 해결
    if (dev) {
      config.cache = {
        type: "filesystem",
        cacheDirectory: ".next/cache/webpack",
        buildDependencies: {
          config: [__filename],
        },
        // 큰 문자열 최적화 - 직렬화 방식 변경
        compression: "gzip",
        maxAge: 5184000000, // 60 days
        // 큰 문자열을 Buffer로 처리하여 성능 개선
        store: "pack",
        version: "1.0.0",
      };

      // 웹팩 캐시 직렬화 최적화
      config.optimization = {
        ...config.optimization,
        // 모듈 연결 최적화
        moduleIds: "deterministic",
        chunkIds: "deterministic",
        // 분할 최적화
        splitChunks: {
          chunks: "all",
          cacheGroups: {
            default: false,
            vendors: false,
            // Chakra UI 라이브러리 분리
            chakra: {
              name: "vendors-chakra",
              test: /[\\/]node_modules[\\/]@chakra-ui[\\/]/,
              chunks: "all",
              priority: 20,
              maxSize: 200000, // 200KB
            },
            // React 관련 라이브러리 분리
            react: {
              name: "vendors-react",
              test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
              chunks: "all",
              priority: 20,
              maxSize: 200000,
            },
            // 기타 큰 라이브러리들 분리
            vendor: {
              name: "vendors",
              test: /[\\/]node_modules[\\/]/,
              chunks: "all",
              priority: 10,
              maxSize: 200000, // 200KB로 제한하여 큰 문자열 방지
              minSize: 20000,
            },
            // 공통 코드 분리
            common: {
              name: "common",
              minChunks: 2,
              chunks: "all",
              priority: 5,
              maxSize: 200000,
            },
          },
        },
      };
    }

    // 파일 로더 최적화
    config.module = {
      ...config.module,
      rules: [
        ...config.module.rules,
        {
          test: /\.svg$/,
          use: ["@svgr/webpack"],
        },
      ],
    };

    return config;
  },

  // 실험적 기능 활성화 (turbo 설정 수정)
  experimental: {
    // 웹팩 빌드 워커 사용
    webpackBuildWorker: true,
  },

  // 터보팩 설정 (최신 구문)
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },

  // 이미지 최적화
  images: {
    domains: ["localhost"],
    formats: ["image/webp", "image/avif"],
  },

  // 컴파일러 최적화
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // 성능 최적화
  onDemandEntries: {
    // 개발 중 페이지 메모리 유지 시간 (ms)
    maxInactiveAge: 25 * 1000,
    // 동시에 유지할 페이지 수
    pagesBufferLength: 2,
  },
};

export default nextConfig;
