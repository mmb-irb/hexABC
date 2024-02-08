import { readFile } from 'fs/promises';

export default defineEventHandler(async (event) => { 

    // get project id
    const { id, type } = event.context.params

    // Get the path to the JSON file (PROVISIONAL)
    let filePath = (type === 'rise') ? process.env.MOCK_RISE_PATH : process.env.MOCK_ROLL_PATH;

    // handle query params (GET)
    let { bp } = getQuery(event);

    if(!bp) return { rise: [] }

    let resp = []

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

    // TODO: CATCH ERROR IN CASE PROJECT ID IS NOT FOUND

    /*let hbonds = []
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

    hbonds = hbonds.reverse()*/

    return {
      [type]: resp
    }
});