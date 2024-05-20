import * as fs from "fs";
import * as path from "path";

// Function to rename files based on their existing name
const renameFile = (filePath: string) => {
	const dir = path.dirname(filePath);
	const ext = path.extname(filePath);
	const baseName = path.basename(filePath, ext);
	if (baseName.startsWith(".")) {
		return;
	}
	const splitName = baseName.split("_");
	const newName = `${splitName[splitName.length - 1]}.mp3`;
	const newFilePath = path.join(dir, newName);

	fs.rename(filePath, newFilePath, (err) => {
		if (err) {
			console.error(`Error renaming file ${filePath}:`, err);
		} else {
			console.log(`Renamed: ${filePath} -> ${newFilePath}`);
		}
	});
};

// Function to recursively traverse the directory and rename files
const traverseDirectory = (dir: string) => {
	fs.readdir(dir, { withFileTypes: true }, (err, files) => {
		if (err) {
			console.error(`Error reading directory ${dir}:`, err);
			return;
		}

		files.forEach((file) => {
			const fullPath = path.join(dir, file.name);
			if (file.isDirectory()) {
				traverseDirectory(fullPath);
			} else if (file.isFile()) {
				renameFile(fullPath);
			}
		});
	});
};

// uncomment if accepting command line input for directory
// const startDir = process.argv[2] || ".";

const START_DIR = "./public/bible/byzantine/";

// Start the traversal
traverseDirectory(START_DIR);
