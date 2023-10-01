import path from 'path';
import multer from 'multer';

function createStorage(destinationPath: string) {
  return multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, destinationPath);
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });
}

const guildStorage = createStorage('public/tmp/uploads/guilds');
const editorStorageImage = createStorage('public/tmp/uploads/news');

export const uploadGuildLogo = multer({ storage: guildStorage }).single('logo');
export const uploadEditorImages = multer({ storage: editorStorageImage }).array(
  'image',
);
