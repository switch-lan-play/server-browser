import React, { useState } from 'react'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import Collapse from '@material-ui/core/Collapse'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import PeopleIcon from '@material-ui/icons/People'
import { ServerList as ServerListJson, ServerDescription } from 'server-list'
import { ServerProvider } from './ServerProvider'
import { useSubServerInfoSubscription } from 'generated/graphql'
import { useResult, usePing } from 'hooks'

const ServerDetail: React.FC<{ description: ServerDescription }> = () => {
  return <>
    <List disablePadding>
      <ListItem button>
        <ListItemText primary="Starred" />
      </ListItem>
    </List>
  </>
}


const ServerItem: React.FC<{ description: ServerDescription }> = ({ description }) => {
  const { server } = description
  const ping = usePing({ server })
  const [ open, setOpen ] = useState(false)
  const result = useSubServerInfoSubscription({
    shouldResubscribe: true
  })
  const { error, loading } = result
  const info = useResult(result, ({ serverInfo: { version, online, idle } }) => {
    return <>
      {version} <PeopleIcon fontSize='small'/> {online-idle}/{idle} {ping?.ping}ms
    </>
  })
  const expand = useResult(result, ({ serverInfo: { online, idle } }) => {
    return <>
      {open ? <ExpandLess /> : <ExpandMore />}
    </>
  })
  return <>
    <ListItem button onClick={() => setOpen(v => !v)}>
      <ListItemText primary={server} secondary={!error && !loading && info} />
      <ListItemSecondaryAction>
        { expand }
      </ListItemSecondaryAction>
    </ListItem>
    <Collapse in={open} timeout="auto" unmountOnExit>
      <ServerDetail description={description} />
    </Collapse>
  </>
}

type ServerListProps = {
}

export const ServerList: React.FC<ServerListProps> = () => {
  return <>
    <List>
      { ServerListJson.map(i => <ServerProvider key={i.server} server={i.server}>
        <ServerItem description={i} />
      </ServerProvider>) }
    </List>
  </>
}
