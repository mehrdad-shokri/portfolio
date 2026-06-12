import {useEffect} from 'react'

export const useFoucFix = (): void => {
  useEffect(() => {
    let ssrPageStyleSheetsEntries = Array.from(
      document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"][data-n-p]')
    ).map(element => ({element, href: element.getAttribute('href')}))

    ssrPageStyleSheetsEntries.forEach(({element}) => element.removeAttribute('data-n-p'))

    const fixedStyleHrefs: (string | null)[] = []

    const mutationHandler = (mutations: MutationRecord[]) => {
      const newStyleEntries = mutations
        .filter(({target}) => (target as HTMLElement).nodeName === 'STYLE' && (target as HTMLElement).hasAttribute('data-n-href'))
        .map(({target}) => ({element: target as HTMLElement, href: (target as HTMLElement).getAttribute('data-n-href')}))

      newStyleEntries.forEach(({element, href}) => {
        if (fixedStyleHrefs.includes(href)) {
          element.remove()
        } else {
          element.setAttribute('data-fouc-fix-n-href', href ?? '')
          element.removeAttribute('data-n-href')
          fixedStyleHrefs.push(href)
        }
      })

      ssrPageStyleSheetsEntries = ssrPageStyleSheetsEntries.reduce<typeof ssrPageStyleSheetsEntries>((entries, entry) => {
        if (fixedStyleHrefs.includes(entry.href)) {
          entry.element.remove()
        } else {
          entries.push(entry)
        }
        return entries
      }, [])
    }

    const observer = new MutationObserver(mutationHandler)
    observer.observe(document.head, {subtree: true, attributeFilter: ['media']})
    return () => observer.disconnect()
  }, [])
}
