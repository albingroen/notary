# Notary

A fast, desktop-first & Vim-friendly Markdown editor

## About

Notary is an attempt to build a markdown editor that focuses on simplicity, speed and the possibility to write content with Vim bindings.

### Local files

Notary doesn't have any sort of special format for documents. It simply reads from a `~/notes` folder and uses `.md` files for documents.

- Everything on your machine
- Local files and folder
- No telemetry collection

### Syncing

If you want to sync your documents, connect the `~/notes` folder with your source control manager of choice and handle your own syncing!

> **Note**
> Notary might add support for syncing through the app in the future.

## Architecture

- React.js
- TypeScript
- Codemirror
- Replit Vim plugin ([https://github.com/replit/codemirror-vim](https://github.com/replit/codemirror-vim))
- Tailwind CSS
- Tauri

## Shortcuts

- `Meta + N`: Create a new document
- `Meta + I`: Toggle document information
- `Meta + Y`: Preview document
- `Meta + P`: Search notes palette
- `Meta + Shift + F`: Search content across files

## Contributing

Notary is open for contributors! Please submit a issue beforehand to note what you want to add or fix with Notary. Then, simply fork the repository and create a pull request describing your changes.
