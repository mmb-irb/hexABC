<template>
    <v-container>

      <h1>REST API documentation</h1>

      <v-breadcrumbs :items="breadcrumbs">
        <template v-slot:divider>
          <v-icon icon="mdi-circle-small"></v-icon>
        </template>
      </v-breadcrumbs>

      <v-card rounded="sm">
        <div class="swagger" id="swagger"></div>

        <v-btn
          prepend-icon="mdi-tray-arrow-down"
          color="red-accent-4"
          class="mb-5 ms-5"
          @click="downloadSwagger" 
          >
              Download swagger.json file
        </v-btn>

      </v-card>

    </v-container>
  </template>
  
  <script setup>
  const config = useRuntimeConfig()

  useHead({
    title: `REST API` 
  })

  const breadcrumbs =  [
    {
      title: 'About',
      disabled: false,
      to: '/',
    },
    {
      title: 'REST API',
      disabled: true
    }
  ]

  import SwaggerUI from 'swagger-ui'
  import 'swagger-ui/dist/swagger-ui.css'

  onMounted(async () => {

    const pjson = await import('../package.json')
    const spec = JSON.parse(JSON.stringify(await import('@/assets/settings/swagger.json')))

    spec.host = config.public.apiHost
    spec.info.version = pjson.version
    
    SwaggerUI({
        spec: spec,
        dom_id: '#swagger'
    })
  })

  const downloadSwagger = async() => {
    const swagger = await import('@/assets/settings/swagger.json')
    const blob = new Blob([JSON.stringify(swagger, null, 2)], {type : 'application/json'});

    var url = window.URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'swagger.json';
    document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
    a.click();    
    a.remove();
  }

  </script>
  
  <style>
      hgroup.main { min-height: auto!important;}
      .swagger-ui .info a { color: #f36a5a; }
      .swagger-ui .info a:hover { color: #f33c28; }
      .swagger-ui .info .title { color:#555; font-size: 30px; }
      .swagger-ui .info { margin: 20px 0 0; }
      .swagger-ui .info .title small { background: #f36a5a; }
      .swagger-ui .model-box-control:focus, .swagger-ui .models-control:focus, .swagger-ui .opblock-summary-control:focus { outline:none; }
      .swagger-ui .opblock.opblock-get .opblock-summary-method { background: #f8b5ab; }
      .swagger-ui .opblock.opblock-get { background: rgb(243 106 90 / 5%); border-color: rgb(243 106 90); }
      .swagger-ui .opblock.opblock-get .opblock-summary { border-color: #f36a5a; }
      .swagger-ui .btn.execute { background-color: #f36a5a; border-color: #f36a5a; }
      .swagger-ui table.model tr.property-row.required td:first-child { padding-top: .5rem!important; }
      .swagger-ui .prop-type { color: #f36a5a; margin-top: 0.5rem; }
      .swagger-ui .prop-format { margin-top: 0.5rem; }
      .swagger-ui .model .prop { display: flex; }
      .swagger-ui .markdown p { margin: .5rem .5rem; }
      .swagger-ui table.model tr.description td { padding-top: .5rem!important; width: auto!important;}
      .swagger-ui table.model tr.description td .markdown p { margin: 0!important;}
  
  </style>