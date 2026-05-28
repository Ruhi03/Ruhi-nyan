import { $ } from 'bun';

export async function download(url: string): Promise<string> {
    console.log('yt-dlp를 이용한 다운로드 시작:', url);

    try {
        // 1. 먼저 yt-dlp를 이용해 비디오 제목(Title)을 안전하게 가져옵니다.
        // --get-title 옵션은 다운로드를 안 하고 제목만 텍스트로 뽑아줍니다.
        const rawTitle = await $`yt-dlp --get-title ${url}`.text();

        // 파일명으로 쓸 수 없는 특수문자 거르기 (정규식 제거)
        const videoTitle = rawTitle
            .trim()
            .replace(/<|>|:|"|\/|\\|\||\?|\*|^COM[0-9]$|^LPT[0-9]$|^CON$|^PRN$|^AUX$|^NUL$/gm, "-");

        console.log(`추출된 영상 제목: ${videoTitle}`);

        // 2. yt-dlp 명령어로 최고 음질 오디오만 webm 형태로 다운로드합니다.
        // -f bestaudio: 최고 음질 오디오 선택
        // -o: 저장할 파일명 포맷 지정
        await $`yt-dlp -f bestaudio -o "./${videoTitle}.%(ext)s" ${url}`;

        console.log('yt-dlp 오디오 다운로드 완료!');

        // 다음 프로세스(인코딩)를 위해 영상 제목을 반환합니다.
        return videoTitle;

    } catch (err) {
        console.error('yt-dlp 작동 중 에러 발생:', err);
        throw err;
    }
}