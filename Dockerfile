FROM oven/bun:alpine

# 1. 시스템 패키지 설치 (기존 apk add 부분에 curl 추가)
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    ffmpeg \
    libsodium-dev \
    opus-dev \
    curl

# 2. yt-dlp 공식 깃허브 릴리스에서 항상 최신 안정 버전을 직접 다운로드합니다.
RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp && \
    chmod a+rx /usr/local/bin/yt-dlp

# 3. 작업 디렉토리 설정
WORKDIR /bot

# 4. 의존성 파일 복사 및 Bun을 이용한 패키지 설치
# (Bun은 package.json만 있어도 작동하며, bun.lockb가 있다면 함께 복사해 주는 것이 좋습니다)
COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile

# 5. 나머지 소스 코드 복사 (index.ts, commands 폴더 등)
COPY . .