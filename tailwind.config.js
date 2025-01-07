/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        loginBg: "url('/src/assets/background_image/loginbg.png')",
      },
      colors: {
        lightBlue: "#F0F6FC",
        neutralDark: "#0B1927",
        neutralGray: "#868A8B",
        neutralLight: "#ACD0F0",
        neutralBlack: "#1A1A1A",
        primaryBlue: "#0E7DE1",
        highlight: "#F7F7F8",
        stateRed: "#EE5353",
        stateGreen: "#11AC84",
        stateOrange: "#FF9F44",
        lightGreen: "#E6F9EB",
        lightOrange: "#FFF3E6",
        lightRed: "#FFF0F0",
        aquablue: "#298DE5",
        borderRlight: "#E6E6E6",
        darkGray: "#7C7C7C",
      },
    },
  },
  // eslint-disable-next-line no-undef
  plugins: [require("daisyui")],
  daisyui: {
    // themes: false, // true: all themes | false: only light + dark | array: specific themes like this ["light", "dark", "cupcake"]
    darkTheme: "light", // name of one of the included themes for dark mode
    // base: true, // applies background color and foreground color for root element by default
    // styled: true, // include daisyUI colors and design decisions for all components
    // utils: true, // adds responsive and modifier utility classes
    // rtl: false, // rotate style direction from left-to-right to right-to-left. You also need to add dir="rtl" to your html tag and install `tailwindcss-flip` plugin for Tailwind CSS.
    // prefix: "", // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
    // logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
  },
};
