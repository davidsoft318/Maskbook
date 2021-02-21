import { Alert, Typography, Button, Skeleton, Box, createStyles } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import BigNumber from 'bignumber.js'
import { useCallback, useEffect } from 'react'
import { useStylesExtends } from '../../../components/custom-ui-helper'
import { usePostLink } from '../../../components/DataSource/usePostInfo'
import ActionButton from '../../../extension/options-page/DashboardComponents/ActionButton'
import { getActivatedUI } from '../../../social-network/ui'
import { useRemoteControlledDialog } from '../../../utils/hooks/useRemoteControlledDialog'
import { useShareLink } from '../../../utils/hooks/useShareLink'
import { TransactionStateType } from '../../../web3/hooks/useTransactionState'
import type { ERC20TokenDetailed } from '../../../web3/types'
import { EthereumMessages } from '../../Ethereum/messages'
import { formatBalance } from '../../Wallet/formatter'
import { useClaimCallback } from '../hooks/useClaimCallback'
import { useMaskITO_Packet } from '../hooks/useMaskITO_Packet'

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            borderRadius: 10,
            width: '100%',
            background: 'linear-gradient(90deg, #FE686F 0%, #F78CA0 100%);',
            marginTop: theme.spacing(2.5),
        },
        amount: {
            fontSize: 18,
            zIndex: 1,
            position: 'relative',
        },
        content: {
            display: 'flex',
            justifyContent: 'space-between',
            padding: theme.spacing(2.5),
        },
        ITOAlertContainer: {
            padding: theme.spacing(0, 2.5, 2.5, 2.5),
        },
        ITOAlert: {
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            color: '#fff',
        },
        button: {
            background: 'rgba(255, 255, 255, 0.2)',
        },
    }),
)

export interface ITO_CardProps extends withClasses<never> {
    token?: ERC20TokenDetailed
    onUpdateAmount: (amount: string) => void
}

export function ITO_Card(props: ITO_CardProps) {
    const { token, onUpdateAmount } = props

    const classes = useStylesExtends(useStyles(), props)
    const { value: packet, loading: packetLoading, error: packetError, retry: packetRetry } = useMaskITO_Packet()

    //#region calim
    const [claimState, claimCallback, resetClaimCallback] = useClaimCallback()
    const onClaimButtonClick = useCallback(() => {
        claimCallback()
    }, [claimCallback])
    //#endregion

    //#region transaction dialog
    const cashTag = getActivatedUI()?.networkIdentifier === 'twitter.com' ? '$' : ''
    const postLink = usePostLink()
    const shareLink = useShareLink(
        [
            `I just claimed ${cashTag}${token?.symbol} with ${formatBalance(
                new BigNumber(packet?.claimable ?? '0'),
                18,
                6,
            )}. Follow @realMaskbook (mask.io) to claim airdrop.`,
            '#mask_io',
            postLink,
        ].join('\n'),
    )

    // close the transaction dialog
    const [_, setTransactionDialogOpen] = useRemoteControlledDialog(
        EthereumMessages.events.transactionDialogUpdated,
        (ev) => {
            if (ev.open) return
            resetClaimCallback()
        },
    )

    // open the transaction dialog
    useEffect(() => {
        if (!packet) return
        if (claimState.type === TransactionStateType.UNKNOWN) return
        setTransactionDialogOpen({
            open: true,
            shareLink,
            state: claimState,
            summary: `Claiming ${formatBalance(new BigNumber(packet.claimable), 18, 6)} ${token?.symbol}.`,
        })
    }, [claimState /* update tx dialog only if state changed */])
    //#endregion

    //#region update parent amount
    useEffect(() => {
        if (!packet) return
        onUpdateAmount(packet.claimable)
    }, [packet, onUpdateAmount])
    //#endregion

    if (!token) return null

    if (packetLoading)
        return (
            <Box className={classes.root}>
                <Box>
                    <Skeleton
                        animation="wave"
                        variant="rectangular"
                        height={25}
                        width="80%"
                        style={{ marginBottom: 8 }}></Skeleton>
                    <Skeleton animation="wave" variant="rectangular" height={28} width="40%"></Skeleton>
                </Box>
            </Box>
        )

    if (packetError)
        return (
            <Box className={classes.root} display="flex" justifyContent="center">
                <Typography>{packetError.message}</Typography>
                <Button className={classes.button} onClick={() => packetRetry()}>
                    Retry
                </Button>
            </Box>
        )

    return (
        <Box className={classes.root}>
            <Box className={classes.content}>
                <Box display="flex" flexDirection="column" justifyContent="space-between">
                    <Typography>ITO locked:</Typography>
                    <Typography className={classes.amount}>
                        {packet && packet.claimable !== '0'
                            ? formatBalance(new BigNumber(packet.claimable), token.decimals, 6)
                            : '0.00'}
                    </Typography>
                </Box>
                <Box display="flex" alignItems="center">
                    <ActionButton
                        className={classes.button}
                        variant="contained"
                        disabled={packet && Number.parseInt(packet.unlockTime) > Math.round(Date.now() / 1000)}
                        onClick={onClaimButtonClick}>
                        Claim
                    </ActionButton>
                </Box>
            </Box>
            {packet ? (
                <Box className={classes.ITOAlertContainer}>
                    <Alert icon={false} className={classes.ITOAlert}>
                        ITO Mask unlock time is {new Date(Number.parseInt(packet.unlockTime) * 1000).toUTCString()}.
                    </Alert>
                </Box>
            ) : null}
        </Box>
    )
}
