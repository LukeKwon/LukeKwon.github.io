# Kinesiology Notes

생체역학, 재활, 움직임에 관한 연구 기록을 모으는 개인 블로그다. Astro로 정적 사이트를 생성하고 GitHub Pages로 배포한다.

## 로컬 미리보기

Node.js 24 이상을 기준으로 한다.

```sh
npm ci
npm run dev
```

터미널에 표시한 로컬 주소에서 사이트를 확인한다. 배포용 파일은 `npm run build`로 생성한다.

## 글의 원본과 발행본

옵시디언에서 원본을 작성하고 Obsidian Sync로 기기 간 동기화한다. 발행할 글만 이 프로젝트의 `src/content/posts/`에 복사한다. 본문 수정은 옵시디언 원본에 반영한 뒤 다시 복사하는 방식으로 관리한다.

새 글은 `src/content/posts/writing-template.md`의 사본으로 작성한다. 파일 이름은 영문 소문자와 하이픈으로 정한다. 예를 들어 `gait-analysis.md`는 `posts/gait-analysis/` 주소를 사용한다. 폴더를 옮기거나 파일 이름을 바꾸면 글 주소도 바뀐다.

속성은 제목 `title`, 요약 `description`, 날짜 `date`, 카테고리 `category`, 태그 `tags`, 공개 여부 `draft`로 구성한다. 카테고리는 `감각-운동`, `스페셜포커스`, `부상-질환` 중 하나다. `draft`의 기본값은 `true`다. `draft: false`인 글만 빌드에 포함한다.

`draft`는 사이트 빌드의 공개 여부만 제어한다. 공개 GitHub 저장소에 커밋한 원고는 초안이어도 저장소에서 읽을 수 있다. 개인 초안은 옵시디언 보관함에 두고 공개할 원고만 저장소에 복사한다.

## 이미지와 Markdown

이미지는 `public/images/posts/글이름/`에 둔다. Markdown에서 같은 이름의 상대 경로를 사용하는 방법은 다음과 같다.

```md
![그림 설명](../../images/posts/gait-analysis/figure-1.png)
```

상대 경로는 `posts/글이름/` 주소를 기준으로 한다. 프로젝트 이름을 포함한 GitHub Pages 하위 경로에서도 사용할 수 있다. 외부 링크는 완전한 HTTPS 주소로 적는다.

옵시디언의 위키 링크 `[[문서]]`와 임베드 `![[그림.png]]`는 발행 전에 일반 Markdown 링크와 이미지 문법으로 바꾼다. 본문의 2단계, 3단계 제목으로 목차를 만든다. 수식은 `$...$`와 `$$...$$`로 작성한다. 참고문헌은 글 끝의 `## 참고문헌`에 정리한다.

## 기존 네이버 글

현재 화면의 기존 글 9개는 네이버에서 확인한 제목, 날짜, 원문 링크다. 본문을 이전한 글은 아니다. `src/data/legacy.ts`에 목록이 있다. 본문을 이전한 뒤에는 같은 글의 원문 링크 항목을 목록에서 제거하고, Markdown 속성 `originalUrl`에 기존 주소를 기록한다.

## GitHub Pages

현재 GitHub 원격 저장소는 연결하지 않았다. GitHub 계정의 인증을 확인한 뒤 새 저장소에 이 프로젝트를 올린다. Pages의 게시 소스는 GitHub Actions로 설정한다. `.github/workflows/deploy.yml`이 `main` 브랜치의 변경을 빌드하고 배포한다.

GitHub Actions 환경에서는 저장소 이름에 맞춰 `site`와 `base`를 자동으로 설정한다. 사용자 홈페이지 저장소인 `사용자명.github.io`는 루트 경로를, 그 밖의 저장소는 저장소 이름에 해당하는 하위 경로를 사용한다. 별도 도메인을 쓰는 경우 환경변수 `SITE_URL`, `BASE_PATH`로 재설정한다.

구글드라이브 안에서는 Git을 사용하지 않는다. `brand/`에는 제공받은 원본 이미지가 있고, 사이트에서는 `public/images/`의 복사본을 사용한다.
