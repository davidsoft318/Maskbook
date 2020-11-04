import React, { useCallback, useState } from 'react'
import {
    makeStyles,
    Theme,
    createStyles,
    Typography,
    DialogContent,
    DialogActions,
    Button,
    CircularProgress,
    Link,
} from '@material-ui/core'
import WarningIcon from '@material-ui/icons/Warning'
import DoneIcon from '@material-ui/icons/Done'
import { useStylesExtends } from '../../components/custom-ui-helper'
import { useI18N } from '../../utils/i18n-next-ui'
import { useChainId } from '../hooks/useChainState'
import { TransactionState, TransactionStateType } from '../hooks/useTransactionState'
import { resolveTransactionLinkOnEtherscan } from '../pipes'
import { InjectedDialog } from '../../components/shared/InjectedDialog'
import { useRemoteControlledDialog } from '../../utils/hooks/useRemoteControlledDialog'
import { WalletMessageCenter } from '../../plugins/Wallet/messages'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        icon: {
            fontSize: 64,
            width: 64,
            height: 64,
        },
        link: {
            marginTop: theme.spacing(0.5),
        },
        primary: {
            fontSize: 18,
            marginTop: theme.spacing(4),
        },
        secondary: {
            fontSize: 14,
        },
    }),
)

interface TransactionDialogUIProps extends withClasses<never> {}

function TransactionDialogUI(props: TransactionDialogUIProps) {
    const { t } = useI18N()
    const classes = useStylesExtends(useStyles(), props)

    const chainId = useChainId()

    //#region remote controlled dialog
    const [state, setState] = useState<TransactionState | null>(null)
    const [shareLink, setShareLink] = useState('')
    const [summary, setSummary] = useState('')
    const [open, setOpen] = useRemoteControlledDialog(WalletMessageCenter, 'transactionDialogUpdated', (ev) => {
        if (ev.open) {
            setState(ev.state)
            setSummary(ev.summary ?? '')
            setShareLink(ev.shareLink ?? '')
        } else {
            setSummary('')
            setShareLink('')
        }
    })
    const onShare = useCallback(() => {
        if (shareLink) window.open(shareLink, '_blank', 'noopener noreferrer')
        onClose()
    }, [shareLink])
    const onClose = useCallback(() => {
        setOpen({
            open: false,
        })
    }, [state])
    //#endregion

    if (!state) return null
    return (
        <>
            <InjectedDialog open={open} onExit={onClose} title="Transaction">
                <DialogContent>
                    {state.type === TransactionStateType.WAIT_FOR_CONFIRMING ? (
                        <>
                            <CircularProgress size={64} color="primary" />
                            <Typography className={classes.primary} color="textPrimary" variant="subtitle1">
                                {t('plugin_wallet_transaction_wait_for_confirmation')}
                            </Typography>
                            <Typography className={classes.secondary} color="textSecondary">
                                {summary}
                            </Typography>
                        </>
                    ) : null}
                    {state.type === TransactionStateType.HASH ? (
                        <>
                            <DoneIcon className={classes.icon} />
                            <Typography className={classes.primary} color="textPrimary">
                                {t('plugin_wallet_transaction_submitted')}
                            </Typography>
                            <Typography>
                                <Link
                                    className={classes.link}
                                    href={resolveTransactionLinkOnEtherscan(chainId, state.hash)}
                                    target="_blank"
                                    rel="noopener noreferrer">
                                    {t('plugin_wallet_view_on_etherscan')}
                                </Link>
                            </Typography>
                        </>
                    ) : null}
                    {state.type === TransactionStateType.CONFIRMED ? (
                        <>
                            <DoneIcon className={classes.icon} />
                            <Typography className={classes.primary} color="textPrimary">
                                {t('plugin_wallet_transaction_confirmed')}
                            </Typography>
                            <Typography>
                                <Link
                                    className={classes.link}
                                    href={resolveTransactionLinkOnEtherscan(chainId, state.receipt.transactionHash)}
                                    target="_blank"
                                    rel="noopener noreferrer">
                                    {t('plugin_wallet_view_on_etherscan')}
                                </Link>
                            </Typography>
                        </>
                    ) : null}
                    {state.type === TransactionStateType.FAILED ? (
                        <>
                            <WarningIcon className={classes.icon} />
                            <Typography className={classes.primary} color="textPrimary">
                                {state.error.message.includes('User denied transaction signature.')
                                    ? t('plugin_wallet_transaction_rejected')
                                    : state.error.message}
                            </Typography>
                        </>
                    ) : null}
                </DialogContent>
                {state.type !== TransactionStateType.UNKNOWN &&
                state.type !== TransactionStateType.WAIT_FOR_CONFIRMING ? (
                    <DialogActions>
                        <Button
                            color="primary"
                            size="large"
                            variant="contained"
                            fullWidth
                            onClick={state.type === TransactionStateType.FAILED || !shareLink ? onClose : onShare}>
                            {state.type === TransactionStateType.FAILED || !shareLink ? t('dismiss') : t('share')}
                        </Button>
                    </DialogActions>
                ) : null}
            </InjectedDialog>
        </>
    )
}

export interface TransactionDialogProps extends TransactionDialogUIProps {}

export function TransactionDialog(props: TransactionDialogProps) {
    return <TransactionDialogUI {...props} />
}
