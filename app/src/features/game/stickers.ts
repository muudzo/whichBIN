// Item stickers live in src/assets/stickers/<item-id>.svg.
// 11 are Microsoft Fluent Emoji (MIT, see LICENSE-fluentui-emoji.txt); 4 are our own
// (pizza box, plastic packaging, egg carton, frying oil), where an emoji would teach the wrong bin.
const stickerUrls = import.meta.glob<string>('../../assets/stickers/*.svg', {
  eager: true,
  query: '?url',
  import: 'default',
})

const byItemId = new Map(
  Object.entries(stickerUrls).map(([path, url]) => [path.split('/').at(-1)?.replace('.svg', '') ?? '', url]),
)

export function stickerFor(itemId: string): string | undefined {
  return byItemId.get(itemId)
}
