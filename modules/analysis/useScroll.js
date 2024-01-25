export default function useScroll() {

	const scrolling = (container, stickyDiv) => { 
		if(document.querySelector(container).getBoundingClientRect().y <= 65) {
			document.querySelector(container).style.position = 'sticky'
			document.querySelector(container).style.top = '65px'
			document.querySelector(container).classList.add('elevation-3')
			document.querySelector(stickyDiv).style.display = 'block'
		} else {
			document.querySelector(container).style.position = 'relative'
			document.querySelector(container).style.top = 'inherit'
			document.querySelector(container).classList.remove('elevation-3')
			document.querySelector(stickyDiv).style.display = 'none'
		}
	}

	const ctrlSticky = (sticky, container, stickyDisDiv, stickyEnDiv) => {
		if(sticky === false) {
      document.querySelector(container).style.position = 'relative'
      document.querySelector(container).style.top = 'inherit'
      document.querySelector(container).classList.remove('elevation-3')
      document.querySelector(stickyDisDiv).style.display = 'none'
      document.querySelector(stickyEnDiv).style.display = 'block'
    } else {        
      document.querySelector(stickyEnDiv).style.display = 'none'
      if(document.querySelector(container).getBoundingClientRect().y <= 65) {
        document.querySelector(container).style.position = 'sticky'
        document.querySelector(container).style.top = '65px'
        document.querySelector(container).classList.add('elevation-3')
        document.querySelector(stickyDisDiv).style.display = 'block'
      }
    }
	}

	return {
		scrolling,
		ctrlSticky
	}

}