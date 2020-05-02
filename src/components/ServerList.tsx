import React from 'react'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import { ServerList as ServerListJson } from 'server-list'

type ServerListProps = {
}

export const ServerList: React.FC<ServerListProps> = ({}) => {
  return <>
    <List>
      { ServerListJson.map(i => <ListItem button>

      </ListItem>) }
    </List>
  </>
}
