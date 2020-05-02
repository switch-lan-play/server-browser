import React from 'react'
import { ServerProvider } from '../components/ServerProvider'
import { ServerView } from '../components/ServerView'

type IndexProps = {
}

export const Index: React.FC<IndexProps> = () => {
  return <>
    <ServerProvider server='localhost:11451'>
      <ServerView></ServerView>
    </ServerProvider>
  </>
}
