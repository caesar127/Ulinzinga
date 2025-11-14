/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      spacing: {
        '18': '4.5rem',
      },
      keyframes: {
        float0: {
          "0%, 100%": { transform: "rotate(-5deg) translateY(0px)" },
          "50%": { transform: "rotate(-5deg) translateY(-6px)" },
        },
        float1: {
          "0%, 100%": { transform: "rotate(0deg) translateY(0px)" },
          "50%": { transform: "rotate(0deg) translateY(-6px)" },
        },
        float2: {
          "0%, 100%": { transform: "rotate(5deg) translateY(0px)" },
          "50%": { transform: "rotate(5deg) translateY(-6px)" },
        },
        float3: {
          "0%, 100%": { transform: "rotate(-2deg) translateY(0px)" },
          "50%": { transform: "rotate(-2deg) translateY(-6px)" },
        },
        float4: {
          "0%, 100%": { transform: "rotate(-7deg) translateY(0px)" },
          "50%": { transform: "rotate(-7deg) translateY(-6px)" },
        },
      },

      animation: {
        float0: "float0 4s ease-in-out infinite",
        float1: "float1 5s ease-in-out infinite",
        float2: "float2 6s ease-in-out infinite",
        float3: "float3 4s ease-in-out infinite",
        float4: "float4 5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
