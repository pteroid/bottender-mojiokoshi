import ffmpeg from 'fluent-ffmpeg';
import { Readable } from 'stream';

export const bufferToReadable = (buffer: Buffer): Readable => {
  const readable = new Readable();
  readable.push(buffer);
  readable.push(null);
  return readable;
};

export const toFlacStream = (stream: Readable): Readable =>
  ffmpeg(stream).audioCodec('flac').format('flac').pipe() as Readable;
