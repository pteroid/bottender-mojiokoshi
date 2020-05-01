import { ImageAnnotatorClient } from '@google-cloud/vision/build/src';
import { bufferToReadable, ToFlacStream } from './util';
import { SpeechClient } from '@google-cloud/speech/build/src';
import { google } from '@google-cloud/speech/build/protos/protos';
import IStreamingRecognitionResult = google.cloud.speech.v1p1beta1.IStreamingRecognitionResult;

const speechClient = new SpeechClient();

export const visionText = async (
  imageBuffer: Buffer
): Promise<string | null> => {
  const client = new ImageAnnotatorClient();

  const [result] = await client.textDetection({
    image: { content: imageBuffer },
  });
  return result.fullTextAnnotation?.text || null;
};

export const cloudSpeechToText = async (
  audioBuffer: Buffer
): Promise<string | null> => {
  const stream = bufferToReadable(audioBuffer);
  const flacStream = ToFlacStream(stream);

  const recognizeStream = speechClient.streamingRecognize({
    config: {
      encoding: 'FLAC',
      model: 'default',
      sampleRateHertz: 16000,
      languageCode: 'ja-JP',
    },
  });

  const transcripts: string[] = [];
  for await (const chunk of flacStream.pipe(recognizeStream)) {
    const results: IStreamingRecognitionResult[] = chunk.results;
    for (const result of results) {
      if (!result.alternatives) continue;
      const transcript = result.alternatives[0].transcript;
      if (!transcript) continue;
      transcripts.push(transcript);
    }
  }
  const transcription = transcripts.join('\n');

  return transcription || null;
};
