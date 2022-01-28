const crypto = require('crypto');
import { XMLParser } from 'fast-xml-parser';

export function sha1Encrypt(input) {
  const hash = crypto.createHash('sha1');
  const data = hash.update(input, 'utf-8');
  return data.digest('hex');
}

export function parseXml(document) {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '',
  });

  return parser.parse(document);
}
