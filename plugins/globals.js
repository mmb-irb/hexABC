export default defineNuxtPlugin(() => {
    return {
      provide: {
        globals: {
          shortName: 'hexABC',
          partners: [
            { name: 'IRB Barcelona', url: 'https://www.irbbarcelona.org/', img: 'irb.png', line: 0, people: [ 'Modesto Orozco', 'Juan Pablo Arcón', 'Federica Battistini', 'Adam Hospital', 'Genís Bayarri' ] },
            { name: 'University of Utah', url: 'https://www.utah.edu/', img: 'utah.png', line: 0, people: [ 'Thomas Cheatham', 'Rodrigo Galindo' ] },
            { name: 'EPFL Lausanne', url: 'https://www.epfl.ch/en/', img: 'epfl-logo.svg', line: 0, people: [ 'John Maddocks' ] },
            { name: 'Kaunas University of Technology ', url: 'https://en.ktu.edu/', img: 'ktu.png', line: 0, people: [ 'Daiva Petkevičiūtė-Gerlach' ] },
            { name: 'Gdańsk University of Technology', url: 'https://pg.edu.pl/en', img: 'gdansk.png', line: 0, people: [ 'Jacek Czub' ] },
            { name: 'Jülich Supercomputing Center', url: 'https://www.fz-juelich.de/ias/jsc/EN/Home/home_node.html', img: 'julich.jpeg', line: 0, people: [ 'Paolo Carloni' ] },
            { name: 'Louisiana Tech University', url: 'https://www.latech.edu/', img: 'lousiana.png', line: 0, people: [ 'Thomas Bishop' ] },
            { name: 'University of Cambridge', url: 'https://www.cam.ac.uk/', img: 'cambridge.png', line: 1, people: [ 'Rosana Collepardo' ] },
            { name: 'University of Florida', url: 'https://www.ufl.edu/', img: 'florida.jpeg', line: 1, people: [ 'Alberto Pérez' ] },
            { name: 'University of Leeds', url: 'https://www.leeds.ac.uk/', img: 'leeds.jpeg', line: 1, people: [ 'Sarah Harris' ] },
            { name: 'University of Nottingham', url: 'https://www.nottingham.ac.uk/', img: 'nottingham.jpeg', line: 1, people: [ 'Charles Laughton' ] },
            { name: 'University of the Republic of Uruguay', url: 'https://udelar.edu.uy/portal/', img: 'uruguay.png', line: 1, people: [ 'Pablo Dans', 'Gabriela da Rosa' ] },
            { name: 'University of York', url: 'https://www.york.ac.uk/', img: 'york.png', line: 1, people: [ 'Agnes Noy' ] },
            { name: 'University Paris Saclay', url: 'https://www.universite-paris-saclay.fr/en', img: 'paris.png', line: 1, people: [ 'Marco Pasi' ] },
          ],
          rowsPerPage: [ 5, 10, 25, 50 ],
          thumbnail: (api, id) => `${api}/current/projects/${id}/files/screenshot.jpg`,
          projects: {
            analyses: [
              { id: 'section', name: 'Helical Parameters', icon: null, section: null },
              { id: 'curves-average', name: 'Average Results', icon: 'mdi-chart-bell-curve', section: 'hps' },
              { id: 'curves-time', name: 'Results by Time', icon: 'mdi-timer-outline', section: 'hps' },
              { id: 'section', name: 'Interactions', icon: null, section: null },
              { id: 'hbonds', name: 'Hydrogen bonds', icon: 'mdi-format-line-weight mdi-rotate-90', section: 'interactions' },
              { id: 'dist-res-average', name: 'Distance per residue', icon: 'mdi-arrow-expand-horizontal', section: 'interactions' },
              { id: 'section', name: 'Quality Control', icon: null, section: null },
              { id: 'first-rmsd', name: 'RMSd', icon: 'mdi-waveform', section: 'qc' },
              { id: 'rmsd-residue', name: 'RMSd per residue', icon: 'mdi-chart-areaspline', section: 'qc' },
              { id: 'rmsd-pairwise', name: 'RMSd pairwise', icon: 'mdi-data-matrix', section: 'qc' },
              { id: 'rgyr', name: 'Radius of gyration', icon: 'mdi-axis-y-rotate-clockwise', section: 'qc' },
              { id: 'fluctuation', name: 'Fluctuation', icon: 'mdi-sine-wave', section: 'qc' },
              { id: 'pca', name: 'Principal Component Analysis', icon: 'mdi-chart-bar', section: 'qc'},
              { id: 'sasa', name: 'Solvent Accessible Surface Area', icon: 'mdi-peanut-outline mdi-rotate-90', section: 'qc' }
            ]
          },
          trajectories: {
            defaultStep: 10000,
            defaultTimeout: 200,
          }
        }
      }
    }
})