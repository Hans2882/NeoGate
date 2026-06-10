import React from "react";
import styles from "@/styles/landingpage.module.css";

export default function IoTAnimation() {
  return (
    <div className={styles.iotAnimation}>
      <svg
        viewBox="0 0 700 300"
        xmlns="http://www.w3.org/2000/svg"
        className={styles.visualSvg}
      >
        {/* Train */}
        <g className={styles.train}>
          <rect
            x="40"
            y="160"
            width="160"
            height="60"
            rx="10"
            fill="#092033"
            stroke="#6dd6ff"
            strokeWidth="2"
          />
          <circle cx="72" cy="232" r="8" fill="#6dd6ff" />
          <circle cx="168" cy="232" r="8" fill="#6dd6ff" />
        </g>

        {/* Signal */}
        <g className={styles.iotPulse}>
          <circle
            cx="260"
            cy="120"
            r="10"
            fill="#7fdcff"
          />
        </g>

        {/* ESP32 */}
        <g
          className={`${styles.iotNode} ${styles.iotPulse}`}
          transform="translate(420,150)"
        >
          <rect
            x="-36"
            y="-26"
            width="72"
            height="52"
            rx="8"
            fill="#081826"
            stroke="#ffd36f"
            strokeWidth="2"
          />
          <rect
            x="-16"
            y="-8"
            width="32"
            height="16"
            rx="3"
            fill="#7fdcff"
            opacity="0.2"
          />
        </g>

        {/* Cloud */}
        <g className={styles.iotNode} transform="translate(560,70)">
          <path
            d="M-30 16a24 18 0 0 1 48 0h10a14 10 0 0 1 0 20H-40a14 10 0 0 1 0-20z"
            fill="#0b2030"
            stroke="#6dd6ff"
            strokeWidth="2"
          />
        </g>

        {/* Dashboard */}
        <g className={styles.iotNode} transform="translate(600,180)">
          <rect
            x="-40"
            y="-28"
            width="80"
            height="56"
            rx="6"
            fill="#081826"
            stroke="#cdd6ff"
            strokeWidth="2"
          />
          <rect
            x="-24"
            y="-10"
            width="48"
            height="20"
            rx="2"
            fill="#6dd6ff"
            opacity="0.15"
          />
        </g>

        {/* Connection Lines */}
        <g
          className={styles.iotLinks}
          stroke="#7fdcff"
          strokeWidth="3"
          fill="none"
        >
          <path
            className={styles.iotArrow}
            d="M200 185 C230 180, 240 145, 250 125"
          />

          <path
            className={styles.iotArrow}
            d="M270 120 C320 110, 370 125, 390 145"
          />

          <path
            className={styles.iotArrow}
            d="M455 135 C500 120, 530 95, 545 82"
          />

          <path
            className={styles.iotArrow}
            d="M575 90 C585 120, 595 145, 600 160"
          />
        </g>

      </svg>
    </div>
  );
}