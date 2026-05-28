import ffmpeg from 'fluent-ffmpeg';

export async function encode(videoTitle: string): Promise<void> {
    return new Promise((resolve, reject) => {
        console.log('인코딩 시작...');

        ffmpeg(`./${videoTitle}.webm`)
            .toFormat('mp3')
            .save(`./${videoTitle}.mp3`)
            .on('end', () => {
                console.log('인코딩 완료');
                resolve();
            })
            .on('error', (err: Error) => {
                console.error('인코딩 중 에러 발생:', err);
                reject(err);
            });
    });
}