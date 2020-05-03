export interface GameInfo {
  name: string
  parseAdvertiseData?: ((data: ArrayBuffer) => Record<string, string>)
}
export const GameMap: Record<string, GameInfo | undefined> = {
  '01006F8002326000': {
    name: 'Animal Crossing: New Horizons',
    parseAdvertiseData (data) {
      const islandBin = data.slice(0x1c)
      return {
        Island: decodeUtf16(islandBin)
      }
    }
  }
}
export const parseAdvertiseData = (cid: string, data: ArrayBuffer) => {
  let outData: Record<string, string> = {}
  const game = GameMap[cid.toUpperCase()]
  if (game?.parseAdvertiseData) {
    outData = game.parseAdvertiseData(data)
  }

  return [outData, game] as const
}
const decodeUtf16 = (data: ArrayBuffer) => {
  const decoder = new TextDecoder('utf-16')
  const u16 = new Uint16Array(data)
  const cut = u16.findIndex(i => i === 0)
  return decoder.decode(data.slice(0, cut * 2))
}
