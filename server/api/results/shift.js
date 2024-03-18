// this end point gives the list of projects paginated
export default defineEventHandler(async (event) => { 

	// get project id
  // const { id } = event.context.params

  // Function to generate a random integer between min and max (inclusive)
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  // Generate a 256x16 matrix with random values from 0 to 5
  const numRows = 16;
  const numColumns = 128;
  const totalCells = numRows * numColumns;
  const numZeros = Math.floor(totalCells * 0.8); // 60% of total cells
  const numOthers = totalCells - numZeros;
  
  // Create an array with the required number of zeros and other numbers
  const numbers = Array(numZeros).fill(0).concat(Array(numOthers).fill().map(() => getRandomInt(1, 5)));
  
  // Shuffle the array
  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  }
  
  // Fill the matrix with the shuffled numbers
  const matrix = [];
  for (let i = 0; i < numRows; i++) {
    const row = [];
    for (let j = 0; j < numColumns; j++) {
      row.push(numbers[i * numColumns + j]);
    }
    matrix.push(row);
  }

  const tetramers = ['AAAA', 'AAAC', 'AAAG', 'AAAT', 'AACA', 'AACC', 'AACG', 'AACT', 'AAGA', 'AAGC', 'AAGG', 'AAGT', 'AATA', 'AATC', 'AATG', 'AATT', 'ACAA', 'ACAC', 'ACAG', 'ACAT', 'ACCA', 'ACCC', 'ACCG', 'ACCT', 'ACGA', 'ACGC', 'ACGG', 'ACGT', 'ACTA', 'ACTC', 'ACTG', 'ACTT', 'AGAA', 'AGAC', 'AGAG', 'AGAT', 'AGCA', 'AGCC', 'AGCG', 'AGCT', 'AGGA', 'AGGC', 'AGGG', 'AGGT', 'AGTA', 'AGTC', 'AGTG', 'AGTT', 'ATAA', 'ATAC', 'ATAG', 'ATAT', 'ATCA', 'ATCC', 'ATCG', 'ATCT', 'ATGA', 'ATGC', 'ATGG', 'ATGT', 'ATTA', 'ATTC', 'ATTG', 'ATTT', 'CAAA', 'CAAC', 'CAAG', 'CAAT', 'CACA', 'CACC', 'CACG', 'CACT', 'CAGA', 'CAGC', 'CAGG', 'CAGT', 'CATA', 'CATC', 'CATG', 'CATT', 'CCAA', 'CCAC', 'CCAG', 'CCAT', 'CCCA', 'CCCC', 'CCCG', 'CCCT', 'CCGA', 'CCGC', 'CCGG', 'CCGT', 'CCTA', 'CCTC', 'CCTG', 'CCTT', 'CGAA', 'CGAC', 'CGAG', 'CGAT', 'CGCA', 'CGCC', 'CGCG', 'CGCT', 'CGGA', 'CGGC', 'CGGG', 'CGGT', 'CGTA', 'CGTC', 'CGTG', 'CGTT', 'CTAA', 'CTAC', 'CTAG', 'CTAT', 'CTCA', 'CTCC', 'CTCG', 'CTCT', 'CTGA', 'CTGC', 'CTGG', 'CTGT', 'CTTA', 'CTTC', 'CTTG', 'CTTT'];
  const hexamers = ['T....T', 'T....G', 'T....C', 'T....A', 'G....T', 'G....G', 'G....C', 'G....A', 'C....T', 'C....G', 'C....C', 'C....A', 'A....T', 'A....G', 'A....C', 'A....A'];

  return { 
    tetramers: tetramers,
    hexamers: hexamers,
    shift: matrix 
  }

 });