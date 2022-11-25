import axios from 'axios';
import JSZip from 'jszip';

const CATEGORIZER_URL = 'http://127.0.0.1:8080/http://127.0.0.1:7777';
const apiKey = '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';
const IMAGE_URL =
  'http://127.0.0.1:8080/https://stable-diffusion.webaverse.com/image';
const SPRITESHEET_URL = 'http://127.0.0.1:8080/http://216.153.52.56:7777';

export const getBiomeType = async prompt => {
  const resp = await axios.get(CATEGORIZER_URL, {
    params: {
      prompt: prompt,
    },
  });

  return resp.data.result;
};

export const getBiomeInfo = async inputPrompt => {
  const prompt = `#Find the theme of the biome
Clown Forest: Clown
Crystal Cave: Crystal
Unicorn Forest: Unicorn
Dead Forest: Dead
Ice Forest: Ice
The Enchanted Forest: Enchanted
Hellish Dungeon: Hellish
Dungeon from another World: Another World/Strange
Into the Void: Voice
The Lost City: Ancient
The Volcano: Volcano
The Ice Palace: Ice
The Crystal Cave: Crystal
The Forbbiden City: Dark
The Maze: Old
The Magical Forest: Magical
The Dragon’s Lair: Dragonic
The Pirate’s Cove: Pirate's
The Haunted House: Haunted
The Alchemist’s Lab: Alchemist's
The Fairytale Forest: Fairytale
The Dark Forest: Dark
Forbidden Forest: Dark
Mystic Forest: Mystic
Wizard’s Tower: Magic
The Temple of Doom: Very Dark
The Tomb: Medieval
Cave: Cave
Haunted Forest: Haunted
Winter Wonderland: Winter, Magic
Castle: Castle
${inputPrompt}:`;

  const resp = await axios.post(
    'http://127.0.0.1:8080/http://127.0.0.1:7777/completion',
    {
      prompt: prompt,
    },
  );

  return resp.data.result;
};

export const generateImageCache = async prompt => {
  const resp = await axios.get('http://127.0.0.1:8080/http://127.0.0.1:7778', {
    params: {
      imgType: prompt,
    },
    responseType: 'blob',
  });
  //check if blob is zip and unzip it
  const blob = resp.data;
  const blobType = blob.type;
  if (blobType === 'application/x-zip-compressed') {
    const zip = new JSZip();
    const zipFile = await zip.loadAsync(blob);
    //get the blobs from the zip
    const blobs = [];
    for (const filename in zipFile.files) {
      const file = zipFile.files[filename];
      const blob = await file.async('blob');
      blobs.push(URL.createObjectURL(blob));
    }

    return blobs;
  }

  return URL.createObjectURL(blob);
};

export const generateImage = async prompt => {
  const params = {
    s: prompt + ' 2d top down game invisible background',
    height: 32,
    width: 32,
  };
  const resp = await axios.get(IMAGE_URL, {
    query: params,
    params: params,
    responseType: 'blob',
  });

  //check if blob is zip and unzip it
  const blob = resp.data;
  const blobType = blob.type;
  if (blobType === 'application/zip') {
    const zip = new JSZip();
    const zipFile = await zip.loadAsync(blob);
    //get the blobs from the zip
    const blobs = [];
    for (const filename in zipFile.files) {
      const file = zipFile.files[filename];
      const blob = await file.async('blob');
      blobs.push(URL.createObjectURL(blob));
    }

    return blobs;
  }

  return URL.createObjectURL(resp.data);
};

export const generateSpritesheet = async prompt => {
  const params = {
    s: prompt + ' 2d top down game invisible background',
    height: 32,
    width: 32,
  };
  const resp = await axios.get(IMAGE_URL, {
    query: params,
    params: params,
    responseType: 'blob',
  });

  //check if blob is zip and unzip it
  const blob = resp.data;
  const blobType = blob.type;
  if (blobType === 'application/zip') {
    const zip = new JSZip();
    const zipFile = await zip.loadAsync(blob);
    //get the blobs from the zip
    const blobs = [];
    for (const filename in zipFile.files) {
      const file = zipFile.files[filename];
      const blob = await file.async('blob');
      blobs.push(URL.createObjectURL(blob));
    }

    return blobs;
  }

  return URL.createObjectURL(resp.data);
};
