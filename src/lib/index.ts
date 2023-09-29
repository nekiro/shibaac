import { XMLParser } from 'fast-xml-parser';

export const timestampToDate = (timestamp: number) => {
  return new Date(timestamp * 1000).toLocaleTimeString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });
};

export const secondsToTime = (seconds: number) => {
  const days = Math.floor(seconds / (24 * 60 * 60));
  seconds -= days * (24 * 60 * 60);
  const hours = Math.floor(seconds / (60 * 60));
  seconds -= hours * (60 * 60);
  const minutes = Math.floor(seconds / 60);
  seconds -= minutes * 60;

  return `${
    0 < days ? days + ' day, ' : ''
  }${hours}h, ${minutes}m and ${seconds}s`;
};

export function formatDate(dateString: Date) {
  const date = new Date(dateString);

  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');

  return `${day}/${month}/${year} ${hour}:${minute}`;
}

export const parseXml = (document: string) => {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '',
  });

  return parser.parse(document);
};

export const formatNumberWithCommas = (x: number): string =>
  x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export const vocationIdToName = [
  'None', // 0
  'Sorcerer',
  'Druid',
  'Paladin',
  'Knight',
  'Master Sorcerer',
  'Elder Druid',
  'Royal Paladin',
  'Elite Knight',
];

export const groupToName = [
  'None', // 0
  'Player', // 1
  'Tutor',
  'Senior Tutor',
  'Gamemaster',
  'Community Manager',
  'God',
];

export const RankGuild = [
  'None',
  'Leader', // 1
  'Vice-Leader', // 2
  'Member', // 3
];

export const Towns = [
  'None',
  'Rookgaard',
  'Verona',
  'Bluffgard',
  'Feldarin',
  'Nissey',
  'Woundhill Bay',
  'Salazart',
  'Tasandira',
  'Niflheim',
  'Gray Beach',
];

export const getOutfitImageUrl = (player: any) => {
  const baseOutfitURL =
    'https://outfit-images.ots.me/idleOutfits1092/outfit.php';
  return `${baseOutfitURL}?id=${player.looktype}&addons=${player.lookaddons}&head=${player.lookhead}&body=${player.lookbody}&legs=${player.lookmountlegs}&feet=${player.lookmountfeet}&mount=0&direction=3`;
};

export const getItemImageUrl = (itemid: string) => {
  const baseItemURL = `https://item-images.ots.me/latest_otbr/${itemid}.png`;

  return baseItemURL;
};
