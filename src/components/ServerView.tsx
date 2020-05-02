import React from 'react'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import { useServer } from './ServerProvider'

type ServerViewProps = {
}

export const ServerView: React.FC<ServerViewProps> = () => {
  const server = useServer()

  return <>
    <Card>
      <CardContent>
        <Typography color='textPrimary'>
          {server.server}
        </Typography>
      </CardContent>
    </Card>
  </>
}
