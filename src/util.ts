import ffmpeg from 'fluent-ffmpeg';
import { Duplex, Readable } from 'stream';

const bufferToStream = (buffer: Buffer): Readable => {
  const stream = new Duplex();
  stream.push(buffer);
  stream.push(null);
  return stream;
};

// 音声・動画の秒数、サンプリング周波数、チャンネル数を取得
export const getAudioMetaData = (
  audioBuffer: Buffer
): Promise<{ sampleRateHertz: number; audioChannelCount: number }> => {
  return new Promise((resolve, reject) => {
    const inStream = bufferToStream(audioBuffer);

    ffmpeg(inStream).ffprobe(0, (err, metaData) => {
      if (err) {
        reject(err);
        return;
      }

      const stream = metaData.streams.find(
        // eslint-disable-next-line @typescript-eslint/camelcase
        ({ sample_rate, channels }) => sample_rate && channels
      ) as { sample_rate: number; channels: number };

      if (stream) {
        resolve({
          sampleRateHertz: stream.sample_rate,
          audioChannelCount: stream.channels,
        });
      } else {
        reject(new Error('stream not found'));
      }
    });
  });
};

export const audioToFlac = async (audioBuffer: Buffer): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const inStream = bufferToStream(audioBuffer);

    const buffers: Buffer[] = [];
    ffmpeg(inStream)
      .inputOptions('-ac 16000')
      .audioCodec('flac')
      .format('flac')
      .pipe()
      .on('data', (chunk) => buffers.push(Buffer.from(chunk)))
      .on('error', reject)
      .on('end', () => resolve(Buffer.concat(buffers)));
  });
};
