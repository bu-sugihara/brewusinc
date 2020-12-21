class Const {
  get SP_BREAKPOINT() {
    return 750
  }
  get IS_SP() {
    return (window.innerWidth || document.documentElement.clientWidth || 0) < this.SP_BREAKPOINT
  }
  get HEADER_NAV_LIST() {
    return [
      { id: 'intro', label: 'Home', href: '/' },
      { id: 'services', label: 'Services', href: '/#services' },
      { id: 'developer', label: 'Developer', href: '/#developer' },
      { id: 'company', label: 'Company', href: '/company' },
      { id: 'contact', label: 'Contact', href: '/#contact' },
    ]
  }

  get FOOTER_NAV_LIST() {
    return []
  }

  get IS_IE() {
    
  }
}

module.exports = new Const()
