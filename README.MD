# Welcome
본 프로젝트는 학생문화공간위원회 8~9기의 학생문화공간위원회 사이트의 리팩토링 버전입니다.
https://github.com/newscspace/scspace 
### Shout out to 선배님들

# 개선점
- TypeScript type system 사용
- pnpm을 활용한 빠른 빌드
- Monorepo 구조를 통한 구조화
- NextJS + NestJS 프레임워크 사용을 통한 개발 규약 확립
- Drizzle ORM 활용
- 각종 개발 규약 확립

# Drizzle ORM DB Migration 방법 (for dev)

.env를 채운다. (root에)
Root 디렉토리에서

- pnpm run generate
- pnpm run migrate
  를 순차적으로 친다.

잘 안되면 mysql을 켰는지 확인한다.
