// this end point gives the list of projects paginated
export default defineEventHandler(async (event) => { 

  const ctype = {
    xtc: "application/xtc",
    trr: "application/trr",
    mdcrd: "text/mdcrd"
  }

  // get runtime config
  const config = useRuntimeConfig()

  // get project id
  const { id } = event.context.params

  // handle query params (GET)
  let { format, frames } = getQuery(event);

  // TODO: if format is not 'xtc' or 'trr' or 'mdcrd, return error
  // TODO: if frames has not one of the formats of original REST API, return error
  // TODO: in swagger, check frames with the same regex
  // TODO: in swagger, add frames examples as in the original REST API

  if(!format) format = 'xtc';
  if(!frames) frames = 1;

  // get pdb structure in PDB format
  const uri = `${config.public.externalApi}v1/projects/${id}/trajectory?format=${format}&frames=${frames}`

  const response = await $fetch(uri)
              .catch((error) => {
                  setResponseStatus(event, error.status)
                  return { message: error.message }
              });

  setResponseHeaders(event, {
      "Content-Disposition": `attachment; filename=${id}.${format}`,
      "Content-Type": `${ctype[format]}; charset=latin1`,
  });

  return response
  
});