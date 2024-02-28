import { readFile } from 'fs/promises';

// this end point gives the list of projects paginated
export default defineEventHandler(async (event) => { 

	// get project id
  const { id, type } = event.context.params

  // Get the path to the JSON file (PROVISIONAL)
  //let filePath = process.env.MOCK_RISE_AVG_PATH;
	let filePath = (type === 'inclination') ? process.env.MOCK_INCL_AVG_PATH : process.env.MOCK_RISE_AVG_PATH;

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

	const getComplement = (str) => {
		const complementMap = { 'G': 'C', 'C': 'G', 'T': 'A', 'A': 'T' };
		return str.split('').map(char => complementMap[char]).reverse().join('');
	}

	const r = resp.map((item) => {
		return {
			label: item.label + getComplement(item.label),
			value: item.value,
			error: item.error
		}
	});

	return {
		[type]: r
	}

 });