import { defineEventHandler } from 'h3';
import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
export default defineEventHandler(async () => {
  const basicPath = path.resolve('assets/basic');
  
  // JSON ファイルをすべて読み込む
  const files = fs.readdirSync(basicPath).filter(file => file.endsWith('.json'));
  const jsfiles = fs.readdirSync(basicPath).filter(file => file.endsWith('.js'));
  
  // JSON ファイルのデータを読み込む
  const data = await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(basicPath, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      return { [file.replace('.json', '')]: JSON.parse(content) };
    })
  );

  // JavaScript ファイルのデータを動的にインポート（キャッシュ回避）
  const jsdata = await Promise.all(
    jsfiles.map(async (file) => {
      const filePath = path.join(basicPath, file);
      const fileUrl = pathToFileURL(filePath).href; // ファイルのURLを取得

      try {
        // キャッシュを回避するために import() にランダムなクエリを追加
        const module = await import(`${fileUrl}?update=${Date.now()}`);
        return module.default || module; // `default` エクスポートがある場合
      } catch (e) {
        console.error(`Error importing ${file}:`, e);
        return null;
      }
    })
  );

  // null を除外してオブジェクトとしてまとめる
  return Object.assign({}, ...data, ...jsdata.filter(Boolean));
});
