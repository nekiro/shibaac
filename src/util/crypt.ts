import crypto from 'crypto';
import { XMLParser } from 'fast-xml-parser';

export const sha1Encrypt = (input: string): string => {
  const hash = crypto.createHash('sha1');
  const data = hash.update(input, 'utf-8');
  return data.digest('hex');
};

export const parseXml = (document: string) => {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '',
  });

  return parser.parse(document);
};
