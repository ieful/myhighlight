const {nextui} = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{html,js}",
        "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
        extend: {},
    },
    darkMode: "class",
    plugins: [
        nextui({
            themes: {
                dark: {
                    colors: {
                        primary: {
                            DEFAULT: "rgba(37,37,37,0.7)",
                            foreground: "#ebebeb", // 前景色（字体颜色）
                        },
                        focus: "#BEF264",
                    },
                },
            },
        }),
    ]
}