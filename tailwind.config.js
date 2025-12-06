// /** @type {import('tailwindcss').Config} */
// export const content = ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"];
// export const theme = {
//   extend: {},
// };
// export const plugins = [];
// /** @type {import('tailwindcss').Config} */
// export default {
//   content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
//   theme: {
//     extend: {
//       colors: {
//         brand: {
//           50: "#eef2ff",
//           100: "#e0e7ff",
//           200: "#c7d2fe",
//           300: "#a5b4fc",
//           400: "#818cf8",
//           500: "#6366f1", // primary
//           600: "#4f46e5",
//           700: "#4338ca",
//           800: "#3730a3",
//           900: "#312e81",
//         },
//       },
//       boxShadow: {
//         card: "0 1px 2px rgba(0,0,0,.04), 0 6px 20px rgba(0,0,0,.06)",
//       },
//       borderRadius: {
//         xl: "14px",
//       },
//     },
//   },
//   plugins: [],
// };
// tailwind.config.js
// /** @type {import('tailwindcss').Config} */
// export default {
//   content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
//   theme: { extend: {} },
//   plugins: [],
// };
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#edf2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1", // primary
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
        },
      },
      boxShadow: {
        card: "0 8px 24px rgba(0,0,0,.08)",
      },
      borderRadius: {
        xl: "14px",
      },
    },
  },
  plugins: [],
};
