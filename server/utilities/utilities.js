const fs = require('fs').promises; // Using fs.promises for async/await support

async function encodeFileToBase64(filePath) {
    try {
        // Read file asynchronously using the path from the uploaded file object
        const fileData = await fs.readFile(filePath);
        // Convert the binary data to a base64 encoded string
        return fileData.toString('base64');
    } catch (err) {
        console.error('Error reading file:', err);
        throw err; // Re-throw the error for caller handling
    }
}
function fileToGenerativePart(data, mimeType) {
    return {
      inlineData: {
        data: data,
        mimeType
      },
    };
  }

module.exports = {
    encodeFileToBase64,
    fileToGenerativePart
}