import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/client';
import * as ApolloReactHooks from '@apollo/client';
export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type NodeInfo = {
   __typename?: 'NodeInfo';
  ip: Scalars['String'];
  nodeId: Scalars['Int'];
  isConnected: Scalars['Boolean'];
  playerName: Scalars['String'];
};

export type Query = {
   __typename?: 'Query';
  serverInfo: ServerInfo;
  trafficInfo: TrafficInfo;
  room: Array<RoomInfo>;
};


export type QueryTrafficInfoArgs = {
  token: Scalars['String'];
};

export type RoomInfo = {
   __typename?: 'RoomInfo';
  ip: Scalars['String'];
  contentId: Scalars['String'];
  hostPlayerName: Scalars['String'];
  sessionId: Scalars['String'];
  nodeCountMax: Scalars['Int'];
  nodeCount: Scalars['Int'];
  nodes: Array<NodeInfo>;
  advertiseDataLen: Scalars['Int'];
  advertiseData: Scalars['String'];
};

export type ServerInfo = {
   __typename?: 'ServerInfo';
  online: Scalars['Int'];
  idle: Scalars['Int'];
  version: Scalars['String'];
};

export type Subscription = {
   __typename?: 'Subscription';
  serverInfo: ServerInfo;
  trafficInfo: TrafficInfo;
};


export type SubscriptionTrafficInfoArgs = {
  token: Scalars['String'];
};

export type TrafficInfo = {
   __typename?: 'TrafficInfo';
  upload: Scalars['Int'];
  download: Scalars['Int'];
  uploadPacket: Scalars['Int'];
  downloadPacket: Scalars['Int'];
};

export type ServerInfoQueryVariables = {};


export type ServerInfoQuery = (
  { __typename?: 'Query' }
  & { serverInfo: (
    { __typename?: 'ServerInfo' }
    & Pick<ServerInfo, 'online' | 'idle' | 'version'>
  ) }
);


export const ServerInfoDocument = gql`
    query ServerInfo {
  serverInfo {
    online
    idle
    version
  }
}
    `;

/**
 * __useServerInfoQuery__
 *
 * To run a query within a React component, call `useServerInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useServerInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useServerInfoQuery({
 *   variables: {
 *   },
 * });
 */
export function useServerInfoQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ServerInfoQuery, ServerInfoQueryVariables>) {
        return ApolloReactHooks.useQuery<ServerInfoQuery, ServerInfoQueryVariables>(ServerInfoDocument, baseOptions);
      }
export function useServerInfoLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ServerInfoQuery, ServerInfoQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<ServerInfoQuery, ServerInfoQueryVariables>(ServerInfoDocument, baseOptions);
        }
export type ServerInfoQueryHookResult = ReturnType<typeof useServerInfoQuery>;
export type ServerInfoLazyQueryHookResult = ReturnType<typeof useServerInfoLazyQuery>;
export type ServerInfoQueryResult = ApolloReactCommon.QueryResult<ServerInfoQuery, ServerInfoQueryVariables>;