import { readFile } from 'fs/promises';

// this end point gives the list of projects paginated
export default defineEventHandler(async (event) => { 

	// get project id
  const { id } = event.context.params

  // Get the path to the JSON file (PROVISIONAL)
  let filePath = process.env.MOCK_BIBII_PATH;

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

  // mapping the nucleotide to the format expected by the front end
  const r = resp.map(item => {
    // Extracting the letter and number parts
    const match = item.nucleotide.match(/([CGTA])(\d+)'?-?(\d*)|^([ACGT]+)-?(\d*)$/);
  
    // Creating the modified object
    return {
      "nucleotide": match ? (match[3] || match[5]) + (match[1] || match[4]) : item.nucleotide,
      "BI": item.BI,
      "BII": item.BII
    };
  });

	return {
    bibiipopulation: r
	}

 });