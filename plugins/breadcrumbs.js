export default defineNuxtPlugin(() => {
  return {
    provide: {
      breadcrumbs: {
        'first-level': (section) => [
          {
          title: 'About',
          disabled: false,
          to: '/',
          },
          {
            title: section,
            disabled: true
          }
        ],
        analysis: (subsection, pth, id, text, title) => [
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
            title: subsection,
            disabled: false,
            to: pth,
          },
          {
            title: 'Overview',
            disabled: false,
            to: `/projects/${id}/overview`,
          },
          {
            title: `${text} for ${title}`,
            disabled: true
          }
        ],
        overview: (subsection, pth, title) => [
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
            title: subsection,
            disabled: false,
            to: pth,
          },
          {
            title: `${title} overview`,
            disabled: true
          }
        ],
        search: (section) => [
          {
            title: 'About',
            disabled: false,
            to: '/',
          },
          {
            title: 'Search',
            disabled: true
          },
          {
            title: section,
            disabled: true
          }
        ],
      },
    }
  }
})