/**
 * This icon should be sync with https://maskbook.com/img/MB--CircleCanvas--WhiteOverBlue.svg
 */
import React from 'react'
const svg = (
    <svg viewBox="0 0 600 600">
        <g fillRule="evenodd">
            <circle cx="300" cy="300" r="300" fill="#1C68F3" />
            <path
                d="m480 200h-360v-44c0-19.882 16.118-36 36-36h288c19.882 0 36 16.118 36 36v44zm0 30v100h-60-231-21.912c13.661 60.677 67.878 106 132.68 106 53.575 0 99.914-30.978 122.08-76h58.144v84c0 19.882-16.118 36-36 36h-288c-19.882 0-36-16.118-36-36v-214h360zm-267.78 130l175.11 5e-6c-19.092 27.914-51.184 46.232-87.555 46.232s-68.463-18.318-87.555-46.232zm-44.65-58h30.687c3.3742-10.445 13.178-18 24.746-18s21.372 7.5549 24.746 18h30.687c-3.8818-27.138-27.221-48-55.433-48s-51.551 20.862-55.433 48zm154 0h30.687c3.3742-10.445 13.178-18 24.746-18s21.372 7.5549 24.746 18h30.687c-3.8818-27.138-27.221-48-55.433-48s-51.551 20.862-55.433 48z"
                fill="#fff"
            />
        </g>
    </svg>
)
import { SvgIcon, SvgIconProps } from '@material-ui/core'
export function MaskbookIcon(props: SvgIconProps) {
    return <SvgIcon {...props}>{svg}</SvgIcon>
}
