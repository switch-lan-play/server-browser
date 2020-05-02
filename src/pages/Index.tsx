import React from 'react'
import { ServerList } from 'components/ServerList'

type IndexProps = {
}

export const Index: React.FC<IndexProps> = () => {
  return <>
    <ServerList />
  </>
}
