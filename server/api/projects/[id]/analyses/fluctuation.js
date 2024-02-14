// this end point gives the list of projects paginated
export default defineEventHandler(async (event) => { 

	// get runtime config
	const config = useRuntimeConfig()

	// get project id
	const { id } = event.context.params

	// get rmsds data
	const uri = `${config.public.externalApi}v1/projects/${id}/analyses/fluctuation`
	const response = await $fetch(uri)
							.catch((error) => {
									setResponseStatus(event, error.status)
									return { message: error.message }
							});

  // get pdb topology structure
  const urit = `${config.public.externalApi}v1/projects/${id}/topology`

  const r2 = await $fetch(urit)
              .catch((error) => {
                  setResponseStatus(event, error.status)
                  return { message: error.message }
              });

  // discarding null fluctuation values
  const fluctValues = response.y.rmsf.data.filter(item => item !== null)

  // get atoms and residues (only elements with fluctuation values)
  const atoms = r2.atom_names.slice(0, fluctValues.length)
  const atom_res = r2.atom_residue_indices.slice(0, fluctValues.length)
  const atom_elements = r2.atom_elements.slice(0, fluctValues.length)
  const res_names = r2.residue_names

  // get atoms and residues names
  const atoms_residues = atom_res.map((item, index) => {
    return {
      atom: atom_elements[index],
      label: `${atoms[index]} (${item + 1}${res_names[item].replace(/[^ACGT]/g, '')})`
    }
  })

	return {
    average: Number((response.y.rmsf.average*10).toFixed(2)),
    stdev: Number((response.y.rmsf.stddev*10).toFixed(2)),
    atoms: atoms_residues,
		fluctuation: fluctValues.map(item => Number(item*10)),
	}

 });