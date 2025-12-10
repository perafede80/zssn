module.exports = {
  input: [
    'src/**/*.{js,jsx,ts,tsx}', // Scan these files for translation keys
    '!src/i18n/**', // Exclude translation files themselves
    '!**/node_modules/**', // Exclude node_modules
  ],
  output: './', // Output folder for translation files
  options: {
    debug: true,
    func: {
      list: ['t'], // Look for `t('key')` calls
      extensions: ['.js', '.jsx', '.ts', '.tsx'], // File extensions to scan
    },
    lngs: ['en', 'es'], // Supported languages
    defaultLng: 'en',
    ns: ['translation'], // Namespaces
    defaultNs: 'translation',
    defaultValue: '__STRING_NOT_TRANSLATED__', // Default value for missing keys
    resource: {
      loadPath: 'public/locales/{{lng}}/{{ns}}.json', // Path to translation files
      savePath: 'public/locales/{{lng}}/{{ns}}.json',
      jsonIndent: 2, // Indentation for JSON files
    },
    nsSeparator: false, // Disable namespace separator
    keySeparator: false, // Disable key separator
  },
};
