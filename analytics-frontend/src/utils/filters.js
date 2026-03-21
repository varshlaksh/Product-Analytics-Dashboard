import Cookies from 'js-cookie'

const OPTS = { expires: 30 }

export const saveFilters = (filters) => {
  Cookies.set('f_start',  filters.startDate || '', OPTS)
  Cookies.set('f_end',    filters.endDate   || '', OPTS)
  Cookies.set('f_age',    filters.age       || '', OPTS)
  Cookies.set('f_gender', filters.gender    || '', OPTS)
}

export const loadFilters = () => ({
  startDate: Cookies.get('f_start')  || '',
  endDate:   Cookies.get('f_end')    || '',
  age:       Cookies.get('f_age')    || '',
  gender:    Cookies.get('f_gender') || '',
})
