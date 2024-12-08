# Windows Downloads Organizer

**Project Status**: This project is in its **initial stage**. The tool is functional but may still be under development, and additional features or improvements are planned in the future.

A command-line tool for organizing files in your Windows Downloads folder by automatically sorting them into directories based on their file extensions. It helps keep your Downloads folder neat and categorized, making it easier to find your files.

## Features:

- Organizes files in the Downloads folder based on file extensions.
- Customizable file extension-to-folder mapping.

## Prerequisites

Node.js (v14 or higher) should be installed on your system.
Download and install Node.js from https://nodejs.org.

## Installation

```bash
npm install win-downloads-organizer --global
```

## Usage

Once installed, you can run the tool from the command line. By default, it will organize files in your Downloads folder.

### Basic Command

```pwsh
wdo --extensions "<.extension>:<folder>" [options]
wdo --extensions ".jpg:Images .mp3:Musics .pdf:Documents .zip:Documents .exe:Apps
```

---

## Options

The CLI tool offers several options to customize its behavior:

### `--source, -s <path>`

- **Description:** Specify a custom directory to organize (default is the Downloads folder).
- **Usage:**

```pwsh
wdo --source C:/Users/admin/Downloads --extensions ".jpg:Images"
```

### `--help, -h`

- **Description:** Shows help information and lists all available options
- **Usage:**

```bash
wdo --help
```

### `-v`

- **Description:** Displays current cli version
- **Usage**:

```bash
wdo -v
```
