export default defineEventHandler(async (event) => { 

  // get runtime config
	const config = useRuntimeConfig()

	// get project id
	const { id } = event.context.params

  // handle query params (GET)
  let { from, to } = getQuery(event);

  let type = 'rng'
  if(!from || !to) {
    type = 'all'
    from = 1
    to = 500000
  }

  from = Math.max(1, from); // Ensure that 'from' is at least 1
  to = Math.min(500000, to); // Ensure that 'to' is at most 500000

  const factor = type === 'all' ? 1000 : 1

  // get pdb topology structure
  const urit = `${config.public.externalApi}v1/projects/${id}/topology`

  const resptop = await $fetch(urit)
              .catch((error) => {
                  setResponseStatus(event, error.status)
                  return { message: error.message }
              });
  // get nucleotides
  const nucls = resptop.residue_names.filter(item => /^(DA|DG|DC|DT)/.test(item));

  // divide nucleotides in two strands
  const half = Math.ceil(nucls.length / 2);
  const format = (item, index) => `${index + 1}${item.replace(/[^ACGT]/g, '')}`;
  const strand1 = nucls.slice(0, half).map(format);
  const strand2 = nucls.slice(half).map((item, index) => format(item, index + half));
  // create base pairs array (strand1 + strand2 reverse order)
  const bps = strand1.map((item, index) => item + strand2[strand2.length - 1 - index]);

	// get hbonds data
	const uri = `${config.public.externalApi}v1/projects/${id}/files/NAhbonds.bin?parse&frames=${from}:${to}:${factor}`
  const error = 0

  let respdata;
  try {
      respdata = await $fetch(uri);
  } catch (error) {
      setResponseStatus(event, error.status);
      return { message: error.message }
  }

  // convert blob to text
  const rtext = await respdata.text()

  // split rtext into array of numbers
  const rtextArray = Array.from(rtext);
  // group rtextArray into 20 arrays
  const groupedItems = Array.from({length: bps.length}, () => []);
  // loop through rtextArray and push each number into groupedItems
  for (let i = 0; i < rtextArray.length; i++) groupedItems[i % 20].push(Number(rtextArray[i]));

  // create an array of objects with bp and hbonds
  const hbonds = []
  bps.forEach((item, index) => {
    hbonds.push({
      bp: item,
      hbonds: groupedItems[index]
    })
  });

  return {
    frames: Number(to) - Number(from) + 1,
    factor: factor,
    hbonds: hbonds.reverse()
  }

});