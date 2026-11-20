import { Buffer } from 'buffer';
import fs from 'fs/promises';

// operate with  base64url
// operate with image
// const bufferContentsBase64url = await fs.readFile('a.png');
// const base64url2 = bufferContentsBase64url.toString('base64url');
// fs.writeFile('image-base64url.txt', base64url2);

// operate with text file
// const bufferContentsBase64url = await fs.readFile('file.txt');
// const base64url1 = bufferContentsBase64url.toString('base64url');
// fs.writeFile('base64url.txt', base64url1);

// operate with large png

// const bufferContents4 = await fs.readFile('nature1.jpg');
// const nature = bufferContents4.toString('base64');

// fs.writeFile('nature.txt', nature);

// operate with video file

// const bufferContents4 = await fs.readFile('favicon/video-3.mp4');
// const c = bufferContents4.toString('base64');

// fs.writeFile('video.txt', c);

// operation on script file

// const bufferContents3 = await fs.readFile('script.js');
// const b = bufferContents3.toString('base64');

// fs.writeFile('script.txt', b);

// converting image in base64

// const bufferContents1 = await fs.readFile('favicon/favicon-16x16.png');
// const b = bufferContents1.toString('base64');

// atob()

// fs.writeFile('new-file1.txt', b);
// fs.writeFile(
//   'a.png',
//   'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAktJREFUOE+Nk01oE0EUx/9vN58tIoKKKKKgBETQ0g9KEquQioKIJ4XeRGtsL1bwWkREevPSXjQlQfAggh48iGgpEQ00SIjUgkhalYoookJJTJr9mNknO2ta09biwA7Mf9777bwvworFs7E2gAbASAC827umeRCyAKcoMjX9tws1Dvw5GsYijQJ0wfVYCf5zZoDTaOHLtDNfV2h3U851egqmw/9wbJKl7eT0Co5TLF/3AKXYOEDJ/3FWNgwYZSsd7i4kScXM9HqdZ6/JtWqChSk6iWfjt8AYbFh9+qZh4pUPpxM2Nm1gJS/8IjzM+nGsW2DXNkdpwnRgVe0UcSleAhBpAK6MhjHzMYRThxYxdMZU8tiDIB69DKE9InDzUk1p0nZgVKw54lLMBCjQAFzPBJEt+nH+pIWzJywl330SQOZxAIkOG9f6PagLMMu23QSomwAzMPNeR9c+CV33sFIChXc6DuyVIALCQcA2JOyqcAHLIQynQhgZMNYtxvDtEEYGDRgVG9KWc01JvDfhx46tjCNtYk3Ii2kfvnwn9PVaqC9YbjXHm8roPvXGnSB6uwR6DsomSO6NjsmCD1fPmRBV9+8Ok8adqxpJSOD+pB9vP+jYvsUr49cfhP17JPqO2pB1AWFIEDjdGi8ml1pZlvFM92k9jSlwk/mz7I3E5o0MdhhWVajsA5xrpcByK6vunIqGDV2MaX6tX/NpRJoXgSMZ0nLU55oRONNCgSF3Dlxh1dTV8h3tYLrI4AQxqXFm4nlmeq5pnGqNFt22X1q/AdOtFcyAcp0ZAAAAAElFTkSuQmCC', 'base64');

// by file reading
// const bufferContents2 = await fs.readFile('new-file1.txt');
// const c = bufferContents2.toString();

// fs.writeFile('b.png', c, 'base64')

// btoa()
// const a = await fs.readFile('file.txt', 'base64');

// console.log(a);

// fs.writeFile('new-file.txt', 'YWJjZA==', 'base64');

// other way
// btoa()
// const bufferContents = await fs.readFile('file.txt');
// const a = bufferContents.toString('base64');

// console.log(a);

// // atob()
// fs.writeFile('new-file.txt', a);
