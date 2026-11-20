import {
  rename,
  copyFile,
  cp,
  unlink,
  rmdir,
  mkdir,
  rm,
  writeFile,
  appendFile,
  stat,
  readFile,
} from 'node:fs/promises';
import { watch } from 'node:fs';

// ======= watch method is used for watch the file execution ===

watch('file.txt', async (eventType) => {
  if (eventType === 'change') {
    console.log(await readFile('file.txt','utf-8'));
  }
});

// ===== state is used for status ===

// const stats = await stat('src');
// console.log(stats)

// ====== folder creation =====

// mkdir('hi');

// =============== file creation ============

// await writeFile('./example.txt', '');
// await appendFile('styles.css', '');

// console.log('File created.');

// ======== for delete a  folder/directory which have some file or folder ======

// rm('src', { recursive: true });

// ======== for delete a  empaty folder/directory ======

// rmdir('src');

// ======== for delete a file ======

// unlink('regex.png');

// ======= rename method is use to rename and move file and folder ====
// rename('app.js', 'script.js');
// rename('script.js', 'app.js');
// rename('src', 'test');

// ====== for Move file or directory =====
// try {
//   rename('app.js', 'C:\\Users\\user\\Desktop\\script.js');
//   console.log('file or folder was moved to given destination');
// } catch {
//   console.error('The file could not be Move');
// }

// ====== for copy directory =====
// try {
//   await cp('./src', 'C:\\Users\\user\\Desktop\\src', { recursive: true });
//   console.log('certificate.png was copied to regex.png');
// } catch {
//   console.error('The file could not be copied');
// }

// ====== for file copy =====
// try {
//   await copyFile('certificate.png', 'C:\\Users\\user\\Desktop\\regex.png');
//   console.log('certificate.png was copied to regex.png');
// } catch {
//   console.error('The file could not be copied');
// }

// await rename('certificate.png', 'regex.png');

// console.log('Renamed');
