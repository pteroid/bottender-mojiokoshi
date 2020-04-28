import { ImageAnnotatorClient } from '@google-cloud/vision/build/src';
import { getAudioMetaData, audioToFlac } from './util';
import { SpeechClient } from '@google-cloud/speech/build/src';
import { google } from '@google-cloud/speech/build/protos/protos';
import Alternative = google.cloud.speech.v1p1beta1.ISpeechRecognitionAlternative;

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
  const { sampleRateHertz, audioChannelCount } = await getAudioMetaData(
    audioBuffer
  );
  audioBuffer = await audioToFlac(audioBuffer);

  const client = new SpeechClient();

  const [response] = await client.recognize({
    config: {
      encoding: 'FLAC',
      model: 'default',
      sampleRateHertz,
      audioChannelCount,
      languageCode: 'ja-JP',
    },
    audio: { content: audioBuffer.toString('base64') },
  });

  if (!response || !response.results) {
    throw new Error('Cannot got speech api response');
  }

  const transcription = response.results
    .map(({ alternatives }) => alternatives)
    .filter(
      (alternatives): alternatives is Alternative[] => alternatives != null
    )
    .map((alternatives) => alternatives[0]?.transcript)
    .filter((transcript): transcript is string => transcript != null)
    .join('\n');

  return transcription || null;
};
