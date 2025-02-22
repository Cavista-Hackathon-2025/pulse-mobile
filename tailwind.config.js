/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./App.{js,jsx,ts,tsx}",
        "./app/**/*.{js,jsx,ts,tsx}",
        "./components/**/*.{js,jsx,ts,tsx}",
    ],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            fontFamily: {
                inter: ["Inter", "sans-serif"],
                robotoMono: ["RobotoMono", "sans-serif"],
                rubik: ["Rubik", "sans-serif"],
                rubikSemiBold: ["RubikSemiBold", "sans-serif"],
                rubikMedium: ["RubikMedium", "sans-serif"],
            },
        },
    },
    plugins: [nativewind],
};

