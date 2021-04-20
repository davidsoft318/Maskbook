import { useCallback, useState } from 'react'
import type { TransactionReceipt } from 'web3-core'
import { useAccount } from '../../../../web3/hooks/useAccount'
import { useChainId } from '../../../../web3/hooks/useBlockNumber'
import { TransactionState, TransactionStateType } from '../../../../web3/hooks/useTransactionState'
import { SwapResponse, TradeComputed, TradeStrategy } from '../../types'
import type { ExchangeProxy } from '@dimensiondev/contracts/types/ExchangeProxy'
import { SLIPPAGE_TOLERANCE_DEFAULT, TRADE_CONSTANTS } from '../../constants'
import { EthereumTokenType, TransactionEventType } from '../../../../web3/types'
import { useConstant } from '../../../../web3/hooks/useConstant'
import type { Tx } from '@dimensiondev/contracts/types/types'
import { addGasMargin } from '../../../../web3/helpers'
import { useTradeAmount } from './useTradeAmount'

export function useTradeCallback(
    trade: TradeComputed<SwapResponse> | null,
    exchangeProxyContract: ExchangeProxy | null,
    allowedSlippage = SLIPPAGE_TOLERANCE_DEFAULT,
) {
    const account = useAccount()
    const chainId = useChainId()
    const BALANCER_ETH_ADDRESS = useConstant(TRADE_CONSTANTS, 'BALANCER_ETH_ADDRESS')

    const [tradeState, setTradeState] = useState<TransactionState>({
        type: TransactionStateType.UNKNOWN,
    })
    const tradeAmount = useTradeAmount(trade, allowedSlippage)

    const tradeCallback = useCallback(async () => {
        if (!trade || !trade.inputToken || !trade.outputToken || !exchangeProxyContract) {
            setTradeState({
                type: TransactionStateType.UNKNOWN,
            })
            return
        }

        // pre-step: start waiting for provider to confirm tx
        setTradeState({
            type: TransactionStateType.WAIT_FOR_CONFIRMING,
        })

        const {
            swaps: [swaps],
        } = trade.trade_ as SwapResponse

        // cast the type to ignore the different type which was generated by typechain
        const swap_ = swaps as Parameters<ExchangeProxy['methods']['multihopBatchSwapExactIn']>[0]

        // balancer use a different address for Ether
        const inputTokenAddress =
            trade.inputToken.type === EthereumTokenType.Ether ? BALANCER_ETH_ADDRESS : trade.inputToken.address
        const outputTokenAddress =
            trade.outputToken.type === EthereumTokenType.Ether ? BALANCER_ETH_ADDRESS : trade.outputToken.address

        const tx =
            trade.strategy === TradeStrategy.ExactIn
                ? exchangeProxyContract.methods.multihopBatchSwapExactIn(
                      swap_,
                      inputTokenAddress,
                      outputTokenAddress,
                      trade.inputAmount.toFixed(),
                      tradeAmount.toFixed(),
                  )
                : exchangeProxyContract.methods.multihopBatchSwapExactOut(
                      swap_,
                      inputTokenAddress,
                      outputTokenAddress,
                      tradeAmount.toFixed(),
                  )

        const config: Tx = {
            from: account,
            to: exchangeProxyContract.options.address,
            value: '0',
        }

        // trade with ether
        if (trade.strategy === TradeStrategy.ExactIn && trade.inputToken.type === EthereumTokenType.Ether)
            config.value = trade.inputAmount.toFixed()
        else if (trade.strategy === TradeStrategy.ExactOut && trade.outputToken.type === EthereumTokenType.Ether)
            config.value = trade.outputAmount.toFixed()

        // step 1: estimate gas
        const estimatedGas = await tx.estimateGas(config).catch((error: Error) => {
            setTradeState({
                type: TransactionStateType.FAILED,
                error,
            })
            throw error
        })

        // step 2: blocking
        return new Promise<void>((resolve, reject) => {
            const promiEvent = tx.send({
                gas: addGasMargin(estimatedGas).toFixed(),
                ...config,
            })
            promiEvent.on(TransactionEventType.RECEIPT, (receipt: TransactionReceipt) => {
                setTradeState({
                    type: TransactionStateType.CONFIRMED,
                    no: 0,
                    receipt,
                })
            })
            promiEvent.on(TransactionEventType.CONFIRMATION, (no: number, receipt: TransactionReceipt) => {
                setTradeState({
                    type: TransactionStateType.CONFIRMED,
                    no,
                    receipt,
                })
                resolve()
            })
            promiEvent.on(TransactionEventType.ERROR, (error: Error) => {
                setTradeState({
                    type: TransactionStateType.FAILED,
                    error,
                })
                reject(error)
            })
        })
    }, [chainId, trade, tradeAmount, exchangeProxyContract, BALANCER_ETH_ADDRESS])

    const resetCallback = useCallback(() => {
        setTradeState({
            type: TransactionStateType.UNKNOWN,
        })
    }, [])

    return [tradeState, tradeCallback, resetCallback] as const
}
