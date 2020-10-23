import React, { useRef } from 'react'
import type { Stat } from '../../types'
import { makeStyles, Theme, createStyles, CircularProgress, Typography } from '@material-ui/core'
import { useDimension, Dimension } from '../../graphs/useDimension'
import { usePriceLineChart } from '../../graphs/usePriceLineChart'
import { useI18N } from '../../../../utils/i18n-next-ui'

const DEFAULT_DIMENSION: Dimension = {
    top: 32,
    right: 16,
    bottom: 32,
    left: 16,
    width: 410,
    height: 200,
}

const useStyles = makeStyles((theme: Theme) => {
    return createStyles({
        root: {
            position: 'relative',
            cursor: ({ stats, cmcCurrencyURL }: PriceChartProps) =>
                stats.length && cmcCurrencyURL ? 'pointer' : 'default',
        },
        svg: {},
        progress: {
            bottom: theme.spacing(1),
            right: theme.spacing(1),
            position: 'absolute',
        },
        placeholder: {
            paddingTop: theme.spacing(10),
            borderStyle: 'none',
        },
    })
})

export interface PriceChartProps {
    stats: Stat[]
    cmcCurrencyURL?: string
    loading?: boolean
    width?: number
    height?: number
    children?: React.ReactNode
}

export function PriceChart(props: PriceChartProps) {
    const { t } = useI18N()
    const classes = useStyles(props)
    const svgRef = useRef<SVGSVGElement>(null)

    useDimension(svgRef, DEFAULT_DIMENSION)
    usePriceLineChart(
        svgRef,
        props.stats.map(([date, price]) => ({
            date: new Date(date),
            value: price,
        })),
        DEFAULT_DIMENSION,
        'x-trader-price-line-chart',
    )
    return (
        <div
            className={classes.root}
            style={{ width: DEFAULT_DIMENSION.width, height: DEFAULT_DIMENSION.height }}
            onClick={() => {
                props.stats.length &&
                    props.cmcCurrencyURL &&
                    window.open(props.cmcCurrencyURL, '_blank', 'noopener noreferrer')
            }}>
            {props.loading ? <CircularProgress className={classes.progress} color="primary" size={15} /> : null}
            {props.stats.length ? (
                <>
                    {props.children}
                    <svg
                        className={classes.svg}
                        ref={svgRef}
                        width={DEFAULT_DIMENSION.width}
                        height={DEFAULT_DIMENSION.height}
                    />
                </>
            ) : (
                <Typography className={classes.placeholder} align="center" color="textSecondary">
                    {t('plugin_trader_no_data')}
                </Typography>
            )}
        </div>
    )
}
