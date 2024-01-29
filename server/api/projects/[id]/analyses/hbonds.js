import { readFile } from 'fs/promises';

export default defineEventHandler(async (event) => { 
    // Get the path to the JSON file (PROVISIONAL)
    let filePath 

    // handle query params (GET)
    let { from, to } = getQuery(event);

    let type = 'rng'
    if(!from || !to) type = 'all'
      
    if(type === 'all') filePath = process.env.MOCK_ALL_HBONDS_PATH;
    else filePath = process.env.MOCK_RNG_HBONDS_PATH;

    let resp = {}

    // Read the JSON file (PROVISIONAL)
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
    let frames = 0
    const factor = type === 'all' ? 1000 : 1
    Object.keys(resp).forEach(key => {
        frames = resp[key].length
        hbonds.push({
          bp: key,
          // In a future, try with lttb algorithm???
          // downsampling
          hbonds: type === 'all' ? resp[key].filter((_, i) => i % factor === 0) : resp[key]
        })
    });

    hbonds = hbonds.reverse()

    return {
      frames: frames,
      factor: factor,
      hbonds: hbonds  
    }
});