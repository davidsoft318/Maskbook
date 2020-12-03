import { SvgIconProps, SvgIcon } from '@material-ui/core'

const svg = (
    <svg viewBox="0 0 41 41">
        <g fillOpacity=".85" fillRule="evenodd" fill="currentColor">
            <path d="M35.124 24.5c-.715.452-1.557.508-2.197.147-.813-.459-1.26-1.534-1.26-3.029v-4.473c0-2.16-.854-3.697-2.282-4.112-2.42-.705-4.24 2.256-4.924 3.368l-4.268 6.92v-8.458c-.048-1.946-.68-3.11-1.88-3.461-.794-.232-1.982-.139-3.136 1.627L5.615 28.383A16.869 16.869 0 0 1 3.671 20.5c0-9.249 7.412-16.773 16.522-16.773S36.714 11.251 36.714 20.5c0 .016.004.03.005.045 0 .016-.003.03-.002.046.086 1.791-.494 3.216-1.593 3.91zm5.261-3.999V20.5v-.046l-.001-.046C40.333 9.144 31.296 0 20.192 0 9.059 0 0 9.196 0 20.5 0 31.803 9.059 41 20.193 41c5.109 0 9.985-1.942 13.728-5.467.744-.7.788-1.879.098-2.633a1.817 1.817 0 0 0-2.594-.1 16.331 16.331 0 0 1-11.232 4.473c-4.878 0-9.267-2.159-12.294-5.583l8.623-13.846v6.383c0 3.066 1.189 4.057 2.186 4.347.998.29 2.523.092 4.124-2.508l4.743-7.689c.152-.248.292-.462.42-.647v3.888c0 2.866 1.148 5.158 3.149 6.287 1.804 1.018 4.072.926 5.92-.24 2.24-1.415 3.447-4.022 3.321-7.164z" />
        </g>
    </svg>
)

export function CoinMarketCapIcon(props: SvgIconProps) {
    return <SvgIcon {...props}>{svg}</SvgIcon>
}
