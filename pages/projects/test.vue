<template>
    <v-container>
  
      <h1>TITLE</h1>
  
      <v-breadcrumbs :items="breadcrumbs">
        <template v-slot:divider>
          <v-icon icon="mdi-circle-small"></v-icon>
        </template>
      </v-breadcrumbs>
  
      <v-row> 
      <v-col cols="12">
        <v-card rounded="sm" class="elevation-2 pa-4 h-100" >

          <template v-slot:title>
            <v-icon size="small" icon="mdi-poll"></v-icon> &nbsp;ANALYSES FOR TITLE
          </template>

          <template v-slot:text>

            <p>Select the desired <strong>nucleotides</strong> (single or grouped) in order to view the different <strong>analyses</strong>. <strong>Nucleotides</strong> can be selected individually, by base step, by <strong>base pair</strong>, by <strong>base pair step</strong>, by <strong>tetramers</strong> and by <strong>hexamers</strong>.</p>

            <v-sheet
              color="grey-lighten-4"
              class="pa-10 project-sheet"
              id="container-strands"
            >
              <v-row class="project-row" justify="center">
                <div 
                  class="number" 
                  v-for="(item, index) in strand1"
                  :key="index"
                  :value="index"
                  > {{ index + 1 }} </div>
              </v-row>
              <v-row class="pb-1 pt-2 px-4 project-row" justify="space-around">
                <div class="end"> {{ ends1[0] }} </div>
                <div class="d-flex">
                  <div 
                  class="nucleotide" 
                  v-for="(item, index) in strand1"
                  :key="index"
                  :value="index"
                  :id="`nucl-${index}-strand1`"
                  > {{ item }} </div>
                </div>
                <div class="end"> {{ ends1[1] }} </div>
              </v-row>
              <v-row class="pt-1 pb-2 px-4 project-row" justify="space-around">
                <div class="end"> {{ ends2[0] }} </div>
                <div class="d-flex">
                  <div 
                  class="nucleotide" 
                  v-for="(item, index) in strand2"
                  :key="index"
                  :value="index"
                  :id="`nucl-${strand2.length*2 - index}-strand2`"
                  > {{ item }} </div>
                </div>
                <div class="end"> {{ ends2[1] }} </div>
              </v-row>
              <v-row class="project-row" justify="center">
                <div 
                  class="number" 
                  v-for="(item, index) in strand2"
                  :key="index"
                  :value="index"
                  > {{ strand2.length*2 - index }} </div>
              </v-row>
            </v-sheet>

          </template>
        </v-card>
      </v-col>
    </v-row>

  
    </v-container>
  </template>
  
  <script setup>

    import DragSelect from 'dragselect'

    useHead({
      title: 'TITLE',
      link: [
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@200;500&display=swap' }
      ]
    })
  
    const breadcrumbs =  [
      {
        title: 'About',
        disabled: false,
        to: '/',
      },
      {
        title: 'Projects',
        disabled: true
      },
      {
        title: 'TITLE',
        disabled: true
      }
    ]

    /* HARDCODED WHILE NOT HAVING REST API */
    const strand1 = [...'GATACATACATAATACAAAC']
    const strand2 = [...'CTATGTATGTATTATGTTTG']

    const ends1 = ['5\'', '3\'']
    const ends2 = ['3\'', '5\'']

    
    onMounted(async () => {
      const ds = new DragSelect({
        selectables: document.getElementsByClassName("nucleotide"),
        area: document.getElementById("container-strands"),
        draggability: false,
        //multiSelectKeys: ['Shift']
      });

      ds.subscribe("DS:end", ({items}) => {
        //console.log(items);
        items.forEach(item => {
          console.log(item.id);
          // GENERATE HERE ALL THE LOGIC FOR THE ANALYSIS
        });
      });

    })
  
  </script>
  
  <style scoped>
    .nucleotide {
      font-family: 'Roboto Mono', monospace;
      font-size: 2rem;
      font-weight: 500;
      padding: .75rem 0.35rem;
      margin: 0 0.15rem;
      color: var(--palette-6);
      user-select: none; 
    }
    .ds-selected {
      background-color: var(--light-text);
      color: var(--palette-4);
    }
    .number {
      font-family: monospace;
      font-size: .75rem;
      width: 2.22rem;
      text-align: center;
      color: var(--palette-2);
      user-select: none; 
      line-height: .2rem;
    }
    .end {
      font-family: 'Roboto Mono', monospace;
      font-size: 1.5rem;
      font-weight: 200;
      color: var(--strand-end);
      user-select: none; 
      padding: .75rem 0;
    }
    .project-sheet{ overflow: hidden;}

    @media only screen and (max-width: 1280px) {
      .nucleotide { /*padding: 0 0.35rem;*/ padding: .5rem 0.25rem; }
      .number { width: 2rem; }
      .end { padding: .5rem 0; }
      .project-sheet{ overflow-x: auto;}
      .project-row { min-width: 740px; }
    }
  </style>