import React, { useMemo, createContext, useContext } from 'react'
import { ApolloClient, HttpLink, InMemoryCache, ApolloProvider } from '@apollo/client'

type ServerProviderProps = {
  server: string
}

const ServerCtx = createContext<ServerProviderProps>({
  server: ''
})

export const useServer = () => {
  return useContext(ServerCtx)
}

export const ServerProvider: React.FC<ServerProviderProps> = ({ children, ...props }) => {
  const { server } = props
  const client = useMemo(() => {
    return new ApolloClient({
      cache: new InMemoryCache(),
      link: new HttpLink({
        uri: `http://${server}`,
      })
    })
  }, [ server ])

  return <>
    <ServerCtx.Provider value={props}>
      <ApolloProvider client={client}>
        { children }
      </ApolloProvider>
    </ServerCtx.Provider>
  </>
}
