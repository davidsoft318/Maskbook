import { createMuiTheme } from '@material-ui/core'
import { ThemeOptions } from '@material-ui/core/styles/createMuiTheme'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import orange from '@material-ui/core/colors/orange'
import green from '@material-ui/core/colors/green'

function getFontFamily(monospace?: boolean) {
    // We want to look native.

    // Windows has no CJK sans monospace. Accomendate that.
    // We only use it for fingerprints anyway so CJK coverage aint a problem... yet.
    const monofont = navigator.platform.startsWith('Win') ? 'Consolas, monospace' : 'monospace'
    // https://caniuse.com/font-family-system-ui
    // Firefox does NOT support yet it in any form on Windows, but tests indicate that it agrees with Edge in using the UI font for sans-serif:
    // Microsoft YaHei on zh-Hans-CN.
    return !monospace ? '-apple-system, system-ui, sans-serif' : monofont
}

const baseTheme = (theme: 'dark' | 'light') =>
    ({
        palette: {
            primary: { main: '#2594ff' },
            secondary: { main: orange[800] },
            error: { main: '#f20500' },
            success: { main: green[800] },
            info: { main: '#2594ff' },
            type: theme,
        },
        typography: {
            fontFamily: getFontFamily(),
        },
        shape: { borderRadius: 4 },
        overrides: {
            MuiButton: {
                root: {
                    textTransform: 'none',
                },
            },
        },
    } as ThemeOptions)
// Theme
export const MaskbookLightTheme = createMuiTheme(baseTheme('light'))
export const MaskbookDarkTheme = createMuiTheme(baseTheme('dark'))

export const FixedWidthFonts = getFontFamily(true)

export const useColorProvider = makeStyles(theme =>
    createStyles({
        error: {
            color: theme.palette.error.main,
        },
        success: {
            // @ts-ignore
            color: theme.palette.success.main,
        },
        info: {
            // @ts-ignore
            color: theme.palette.info.main,
        },
    }),
)
