import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

export default <Partial<Config>>{
  theme: {
    extend: {
      colors: {
        keppel: {
          "50": "#f1fcfa",
          "100": "#cff8f1",
          "200": "#9ff0e3",
          "300": "#67e1d3",
          "400": "#38c9bd",
          "500": "#20b6ac",
          "600": "#168b86",
          "700": "#166f6c",
          "800": "#165958",
          "900": "#174a49",
          "950": "#072b2c",
        },
      },
    },
  },
};
