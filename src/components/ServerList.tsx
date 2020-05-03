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
import { useSubServerInfoSubscription, useServerRoomQuery, RoomInfoFragment } from 'generated/graphql'
import { useResult, usePing } from 'hooks'
import { makeStyles } from '@material-ui/core/styles'
import {  parseAdvertiseData } from 'games'

function fromHex(hex: string) {
  const buf = hex.match(/[0-9a-fA-F]{2}/gi)
  if (!buf) {
    throw new Error('Wrong hex')
  }
  return new Uint8Array(buf.map((h) => parseInt(h, 16))).buffer
}

const useStyles = makeStyles((theme) => ({
  nested: {
    paddingLeft: theme.spacing(4),
  },
  nested2: {
    paddingLeft: theme.spacing(8),
  },
}))

const RoomInfo: React.FC<{ room: RoomInfoFragment }> = ({ room }) => {
  const classes = useStyles()
  const cid = room.contentId.toUpperCase()
  const [ roomAdvertise, gi ] = parseAdvertiseData(cid, fromHex(room.advertiseData))
  return <>
    <ListItem className={classes.nested}>
      <ListItemText
        primary={`${room.hostPlayerName} (${room.nodeCount}/${room.nodeCountMax})`}
        secondary={gi?.name ?? cid}
      />
    </ListItem>
    { Object.keys(roomAdvertise).map(key => {
      const value = roomAdvertise[key]
      return <ListItem key={key} className={classes.nested2}>
        <ListItemText primary={value} secondary={key} />
      </ListItem>
    }) }
    { room.nodes.map(node => {
      return <ListItem key={node.ip} className={classes.nested2}>
        <ListItemText primary={node.playerName} secondary={node.ip} />
      </ListItem>
    })}

  </>
}

const ServerDetail: React.FC<{ description: ServerDescription }> = () => {
  const classes = useStyles()
  const result = useServerRoomQuery({
    pollInterval: 10 * 1000
  })
  const info = useResult(result, ({ room: rooms }) => {
    return <>
      <List disablePadding>
          { rooms.length > 0 ?
            rooms.map(room => {
              return <RoomInfo key={room.ip} room={room} />
            }) : <ListItem className={classes.nested}>No room is opening</ListItem>
          }
      </List>
    </>
  })
  return <>
    { info }
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
    <Collapse in={open} timeout='auto' unmountOnExit>
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
