import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "tertiary-container":"#792d26","surface-variant":"#e7e2d8","surface-tint":"#306576",
        "tertiary":"#5b1712","on-secondary-container":"#774a01","surface-container-high":"#ece8de",
        "surface-dim":"#dedad0","surface-container":"#f2ede3","secondary-fixed-dim":"#fabb6c",
        "primary-fixed":"#b6ebfe","tertiary-fixed-dim":"#ffb4aa","on-tertiary-fixed-variant":"#7a2e27",
        "error-container":"#ffdad6","tertiary-fixed":"#ffdad5","on-tertiary-fixed":"#3f0303",
        "surface":"#fef9ef","on-tertiary-container":"#ff988b","secondary":"#83540c","error":"#ba1a1a",
        "inverse-surface":"#32302a","surface-bright":"#fef9ef","primary-container":"#0f4c5c",
        "inverse-on-surface":"#f5f0e6","on-tertiary":"#ffffff","secondary-container":"#fdbd6f",
        "on-surface-variant":"#40484b","outline-variant":"#c0c8cb","on-secondary-fixed-variant":"#653e00",
        "on-primary":"#ffffff","on-error":"#ffffff","on-error-container":"#93000a",
        "primary-fixed-dim":"#9acee1","on-primary-fixed":"#001f28","outline":"#70787c",
        "on-primary-fixed-variant":"#114d5d","on-secondary-fixed":"#2a1700","on-secondary":"#ffffff",
        "background":"#fef9ef","on-surface":"#1d1c16","primary":"#003441",
        "on-primary-container":"#87bbce","secondary-fixed":"#ffddb8","surface-container-low":"#f8f3e9",
        "inverse-primary":"#9acee1","surface-container-highest":"#e7e2d8","on-background":"#1d1c16",
        "surface-container-lowest":"#ffffff"
      },
      borderRadius: { "DEFAULT":"1rem","lg":"2rem","xl":"3rem","full":"9999px" },
      spacing: { "lg":"40px","xl":"64px","base":"8px","sm":"12px","container-max":"1200px","xs":"4px","md":"24px" },
      fontFamily: {
        "arabic-display":["Amiri"],"label-caps":["Nunito Sans"],"body-lg":["Nunito Sans"],
        "headline-md":["Literata"],"body-md":["Nunito Sans"],"display-lg":["Literata"]
      },
      fontSize: {
        "label-caps":["12px",{lineHeight:"16px",letterSpacing:"0.05em",fontWeight:"600"}],
        "body-lg":["16px",{lineHeight:"24px"}],"body-md":["14px",{lineHeight:"20px"}],
        "headline-md":["32px",{lineHeight:"40px",fontWeight:"600"}],
        "display-lg":["48px",{lineHeight:"56px",fontWeight:"700"}]
      }
    }
  }
};
export default config;
