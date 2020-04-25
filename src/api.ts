import { ImageAnnotatorClient } from '@google-cloud/vision/build/src';
import { getAudioMetaData, audioToFlac } from './util';
import { SpeechClient } from '@google-cloud/speech/build/src';

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

  const transcripts = [];
  for (const result of response.results) {
    if (result.alternatives && result.alternatives.length > 0) {
      const transcript = result.alternatives[0].transcript;
      if (transcript) {
        transcripts.push(result.alternatives[0].transcript);
      }
    }
  }
  const transcription = transcripts.join('\n');

  if (transcription !== '') {
    return transcription;
  } else {
    return null;
  }
};
