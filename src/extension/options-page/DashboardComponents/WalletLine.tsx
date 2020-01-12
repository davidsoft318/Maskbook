import { FormControl, Typography, Theme, Divider } from '@material-ui/core'
import React from 'react'
import { makeStyles, createStyles } from '@material-ui/styles'
import classNames from 'classnames'
import { geti18nString } from '../../../utils/i18n'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        text: {},
        action: {},
        control: {
            textAlign: 'left',
            flex: 1,
            width: '100%',
            margin: theme.spacing(1, 0),
        },
        wrapper: {
            display: 'flex',
            alignItems: 'center',
        },
    }),
)

interface WalletLineProps {
    line1?: JSX.Element | string
    line2?: JSX.Element | string
    invert?: boolean
    action?: JSX.Element | string
}

// TODO: abstract common line
export default function WalletLine(props: WalletLineProps) {
    const classes = useStyles()
    const { line1, line2, invert, action } = props

    return (
        <>
            <div className={classes.wrapper}>
                <FormControl className={classes.control}>
                    <Typography variant={invert ? 'body1' : 'overline'}>{line1}</Typography>
                    <Typography
                        variant={invert ? 'caption' : 'body1'}
                        component="a"
                        className={classNames(classes.text)}>
                        {line2}
                    </Typography>
                </FormControl>
                {action}
            </div>
            <Divider />
        </>
    )
}
