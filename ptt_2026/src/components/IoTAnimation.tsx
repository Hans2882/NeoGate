import React from "react";
import styles from "@/styles/landingpage.module.css";

export default function IoTAnimation() {
  return (
    <div className={styles.iotAnimation} aria-hidden>
      <svg
        viewBox="0 0 520 220"
        xmlns="http://www.w3.org/2000/svg"
        className={styles.visualSvg}
      >
        {/* Train */}
        <g className={styles.iotNode} transform="translate(20,120)">
          <rect
            x="0"
            y="10"
            width="120"
            height="48"
            rx="8"
            fill="#092033"
            stroke="#6dd6ff"
            strokeWidth="1"
          />
          <circle cx="24" cy="66" r="6" fill="#6dd6ff" />
          <circle cx="96" cy="66" r="6" fill="#6dd6ff" />
        </g>

        {/* Sensor */}
        <g
          className={`${styles.iotNode} ${styles.iotFloat}`}
          transform="translate(200,60)"
        >
          <circle
            cx="0"
            cy="0"
            r="22"
            fill="#041826"
            stroke="#6fe8c9"
            strokeWidth="2"
          />
          <circle cx="0" cy="0" r="8" fill="#7fdcff" />
        </g>

        {/* ESP32 */}
        <g
          className={`${styles.iotNode} ${styles.iotPulse}`}
          transform="translate(340,120)"
        >
          <rect
            x="-28"
            y="-20"
            width="56"
            height="40"
            rx="6"
            fill="#081826"
            stroke="#ffd36f"
            strokeWidth="1.5"
          />
          <rect
            x="-12"
            y="-6"
            width="24"
            height="12"
            rx="2"
            fill="#7fdcff"
            opacity="0.12"
          />
        </g>

        {/* Cloud / API */}
        <g className={styles.iotNode} transform="translate(420,48)">
          <path
            d="M-24 12a20 16 0 0 1 40 0h8a12 8 0 0 1 0 16H-32a12 8 0 0 1 0-16z"
            fill="#0b2030"
            stroke="#6dd6ff"
            strokeWidth="1"
          />
        </g>

        {/* Dashboard */}
        <g className={styles.iotNode} transform="translate(460,150)">
          <rect
            x="-28"
            y="-20"
            width="56"
            height="40"
            rx="4"
            fill="#081826"
            stroke="#cdd6ff"
            strokeWidth="1"
          />
          <rect
            x="-18"
            y="-8"
            width="36"
            height="16"
            rx="2"
            fill="#6dd6ff"
            opacity="0.08"
          />
        </g>

        {/* Arrows / Links */}
        <g
          className={styles.iotLinks}
          stroke="#7fdcff"
          strokeWidth="2"
          fill="none"
        >
          <path
            className={styles.iotArrow}
            d="M140 144 C170 140, 190 110, 200 92"
          />
          <path
            className={styles.iotArrow}
            d="M230 92 C270 80, 310 110, 332 122"
          />
          <path
            className={styles.iotArrow}
            d="M372 110 C392 130, 420 140, 452 138"
          />
          <path
            className={styles.iotArrow}
            d="M440 66 C440 90, 450 120, 458 138"
            strokeDasharray="6 4"
          />
        </g>
      </svg>
    </div>
  );
}
