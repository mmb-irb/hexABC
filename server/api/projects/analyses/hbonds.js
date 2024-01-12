import { readFile } from 'fs/promises';

export default defineEventHandler(async (event) => { 
    // Get the path to the JSON file
    const filePath = process.env.MOCK_HBONDS_PATH;

    let resp = {}

    // Read the JSON file
    await (async () => {
      try {
        // Use the readFile function from fs/promises
        const data = await readFile(filePath, 'utf8');
    
        // Parse the JSON data
        resp = JSON.parse(data);
    
      } catch (error) {
        console.error(`Error: ${error.message}`);
      }
    })();

    let hbonds = []
    Object.keys(resp).forEach(key => {
        hbonds.push({
          bp: key,
          hbonds: resp[key]
        })
    });

    hbonds = hbonds.reverse()

    return {
        hbonds: hbonds
    }
});