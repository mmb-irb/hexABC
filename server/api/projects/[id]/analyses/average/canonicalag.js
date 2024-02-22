import { readFile } from 'fs/promises';

// this end point gives the list of projects paginated
export default defineEventHandler(async (event) => { 

	// get project id
  const { id } = event.context.params

  // Get the path to the JSON file (PROVISIONAL)
  let filePath = process.env.MOCK_ALPHAGAMMA_PATH;

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

  // resort the data to have both strnads in the correct order
  const splitIndex = resp.findIndex(item => item.nucleotide === "-");
  const beforeDash = resp.slice(0, splitIndex);
  // reverse second strand
  const afterDash = resp.slice(splitIndex + 1).reverse();
  const sortedData = [...beforeDash, resp[splitIndex], ...afterDash];

  // mapping the nucleotide to the format expected by the front end
  const r = sortedData.map((item, index) => {
    const match = item.nucleotide.match(/[GTAC]/);

    return {
      nucleotide: match ? `${index < splitIndex + 1 ? index + 1 : index}${match[0]}` : "",
      labels: [ "alpha", "gamma" ],
      values: [
        item.nucleotide !== "-" ? item.alpha : null,
        item.nucleotide !== "-" ? item.gamma : null
      ]
    };
  });

	return {
    canonicalag: r
	}

 });