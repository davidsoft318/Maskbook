import React from 'react'
import { makeStyles, createStyles, Typography } from '@material-ui/core'

interface PluginWrapperProps {
    pluginName: string
    children?: JSX.Element | string
}

const useStyles = makeStyles(theme =>
    createStyles({
        card: {
            border: `1px solid ${theme.palette.divider}`,
        },
        header: {
            backgroundColor: '#F5F5F5',
            display: 'flex',
            alignItems: 'center',
            padding: theme.spacing(1, 2),
            borderBottom: `1px solid ${theme.palette.divider}`,
        },
        title: {
            display: 'flex',
            flexDirection: 'column',
            paddingLeft: theme.spacing(1),
        },
        icon: {
            width: '3em',
            height: '3em',
        },
        body: {
            margin: theme.spacing(2),
        },
    }),
)

export default function StructuredPluginWrapper(props: PluginWrapperProps) {
    const classes = useStyles()
    const { pluginName, children } = props
    return (
        <div className={classes.card}>
            <div className={classes.header}>
                <img
                    src={`data:image/svg+xml,%3Csvg width='36' height='36' viewBox='0 0 36 36' fill='none' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Crect width='36' height='36' rx='4' fill='url(%23pattern0)'/%3E%3Cdefs%3E%3Cpattern id='pattern0' patternContentUnits='objectBoundingBox' width='1' height='1'%3E%3Cuse xlink:href='%23image0' transform='scale(0.00195312)'/%3E%3C/pattern%3E%3Cimage id='image0' width='512' height='512' xlink:href='data:image/png;base64,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'/%3E%3C/defs%3E%3C/svg%3E%0A`}
                    className={classes.icon}
                />
                <div className={classes.title}>
                    <Typography variant="overline">Maskbook Plugin</Typography>
                    <Typography variant="h6">{pluginName}</Typography>
                </div>
            </div>
            <div className={classes.body}>{children}</div>
        </div>
    )
}
