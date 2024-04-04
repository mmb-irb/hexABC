import { Vector3 } from 'three'

// navigation for settings module
export default function common() {

  const ions = ['LI', 'NA', 'K', 'CL', 'MG', 'MN', 'ZN']
  const hBondsAtoms = [
    { id: 'C', atoms: ['H41', 'N3', 'O2'] },
    { id: 'G', atoms: ['O6', 'H1', 'H21'] },
    { id: 'T', atoms: ['O2', 'H3', 'O4'] },
    { id: 'A', atoms: ['H2', 'N1', 'H61'] }
  ]

  const interpolateColor = (value, minValue, maxValue) => {
    const red = 255;
    const green = 255 - Math.round(255 * (value - minValue) / (maxValue - minValue));
    const blue = 51;
    return `#${red.toString(16).padStart(2, '0')}${green.toString(16).padStart(2, '0')}${blue.toString(16).padStart(2, '0')}`;
  }

  const calculateDistance = (position1, position2) => {
    return Math.sqrt(
      Math.pow(position1[0] - position2[0], 2) +
      Math.pow(position1[1] - position2[1], 2) +
      Math.pow(position1[2] - position2[2], 2)
    );
  }

  const calculateDistance2 = function (atom1, atom2) {
    const outer = new Vector3(atom1[0], atom1[1], atom1[2])
    const inner = new Vector3(atom2[0], atom2[1], atom2[2])
    return parseFloat(outer.distanceTo(inner).toFixed(2))
  }

  const findClosestAtom = (structureComponent, position) => {
    let closestAtom = null;
    var closestDistance = Number.MAX_VALUE;

    var pos = position.toArray();

    // Iterate through all atoms in the structure
    structureComponent.structure.eachAtom((atom) => {
      if(ions.indexOf(atom.element) === -1) {
        var atomPosition = atom.positionToArray();
        var d = calculateDistance(atomPosition, pos);

        // Check if the current atom is closer than the previously closest atom
        if (d < closestDistance) {
          closestDistance = d;
          //closestAtom = atom.positionToArray()
          closestAtom = atom.index
        }
      }
    });

    return closestAtom;
  }

  const calculateDistances = (structureComponent, nucs) => {
    let bonds = {}
    nucs.forEach((nuc, i) => {
      bonds[nuc.rname] = []
    })
    structureComponent.structure.eachAtom((atom) => {
      // Check if the residue number of the current atom is in the list of residues (nucs)
      const residue = nucs.some(obj => (obj.rnum === atom.resno));
      if(residue) {
        // Get the name of the nucleotide
        var nuc = nucs.filter((item) => item.rnum === atom.resno)[0].rname
        // Check if the atom is a hydrogen bond atom
        if(hBondsAtoms.filter((item) => item.id === nuc)[0].atoms.includes(atom.atomname)) {
          var atomPosition = atom.positionToArray();
          //console.log(atom.atomname)
          bonds[nuc].push({
            name: atom.atomname,
            pos: atomPosition
          })
        }
      }
    })

    const keys = Object.keys(bonds);
    const distances = [];

    for (let index = 0; index < bonds[keys[0]].length; index++) {
      const atom1 = bonds[keys[0]][index];
      const atom2 = bonds[keys[1]][index];
      const distance = calculateDistance2(atom1.pos, atom2.pos);
      distances.push({
        a1: `${nucs[0].rnum}.${atom1.name}`, 
        a2: `${nucs[1].rnum}.${atom2.name}`, 
        d: distance
      });
    }

    return distances;

  }

  return {
    interpolateColor,
    findClosestAtom,
    calculateDistances
  }
}