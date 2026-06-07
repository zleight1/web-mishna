export interface CatalogCrumb {
  id: string
  label: string
  to?: string
}

export function homePath() {
  return '/'
}

export function sederPath(order: string) {
  return `/#seder-${order}`
}

export function chapterPath(order: string, tractate: string, chapter: string | number) {
  return `/learn/${order}/${tractate}/${chapter}`
}

export function mishnahPath(
  order: string,
  tractate: string,
  chapter: string | number,
  mishnah: string | number,
) {
  return `/learn/${order}/${tractate}/${chapter}/${mishnah}`
}

export function sederLabelKey(order: string) {
  return `catalog.seder.${order}`
}

export function buildLessonBreadcrumbs(input: {
  homeLabel: string
  order: string
  tractate: string
  chapter: string
  mishnah?: string
  sederName: string
  chapterTitle: string
  mishnahLabel?: string
}): CatalogCrumb[] {
  const chapterTo = chapterPath(input.order, input.tractate, input.chapter)
  const crumbs: CatalogCrumb[] = [
    { id: 'home', label: input.homeLabel, to: homePath() },
    { id: 'seder', label: input.sederName, to: sederPath(input.order) },
    { id: 'chapter', label: input.chapterTitle, to: input.mishnah ? chapterTo : undefined },
  ]
  if (input.mishnah && input.mishnahLabel) {
    crumbs.push({ id: 'mishnah', label: input.mishnahLabel })
  }
  return crumbs
}
