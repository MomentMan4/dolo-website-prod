/** @type {import('prettier').Config} */
module.exports = {
  semi: false,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "es5",
  useTabs: false,
  printWidth: 100,
  bracketSpacing: true,
  arrowParens: "avoid",
  endOfLine: "lf",
  plugins: ["prettier-plugin-tailwindcss"],
}
