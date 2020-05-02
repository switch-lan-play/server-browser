import List from 'server-list/server-list.json'
import { ServerDescription as SD } from './types'

export type ServerDescription = SD
export const ServerList: ServerDescription[] = [...List, {
  server: 'localhost:12345'
}]
