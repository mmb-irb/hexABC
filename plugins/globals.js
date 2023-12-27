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
            thumbnail: (id) => `https://mdposit-dev.mddbr.eu/api/rest/current/projects/${id}/files/screenshot.jpg`,
            projects: {
              analyses: [
                { id: 'rmsd', name: 'RMSd'},
                { id: 'dist-perres-mean', name: 'Distance per residue mean'},
                { id: 'dist-perres-stdv', name: 'Distance per residue standard deviation'},
                { id: 'rmsd-pairwise-interface', name: 'RMSd pairwise interface'},
                { id: 'dist-perres', name: 'Distance per residue'},
                { id: 'energies', name: 'Energies'},
                { id: 'hbonds', name: 'Hydrogen bonds'},
                { id: 'rmsd-pairwise', name: 'RMSd pairwise'},
                { id: 'fluctuation', name: 'Fluctuation'},
                { id: 'tmscores', name: 'Time scores'},
                { id: 'rgyr', name: 'Radius of gyration'},
                { id: 'rmsds', name: 'RMSds'},
                { id: 'pockets', name: 'Pockets'},
                { id: 'interactions', name: 'Interactions'},
                { id: 'pca', name: 'PCA'},
                { id: 'rmsd-perres', name: 'RMSd per residue'},
                { id: 'sasa', name: 'Solvent accessible surface area'},
              ]
            }
        }
      }
    }
})