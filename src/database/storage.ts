import dayjs, { Dayjs } from "dayjs"

const klastMetadataUpdateDate = "lastMetadataUpdateDate"
const klastModifiedDate = "lastModifiedDate"
const ksuppressWarningDate = "suppressWarningDate"

class LocalStorgeHelper {

  setLastMetdataUpdate(date?: string) {
    window.localStorage.setItem(klastMetadataUpdateDate, date ?? dayjs().toISOString())
  }
  setLastModifiedDate(date: string) {
    window.localStorage.setItem(klastModifiedDate, date)
  }

  getLastModifiedDate(): string | null {
    let modifiedDate = window.localStorage.getItem(klastModifiedDate)
    if(modifiedDate) {
      return dayjs(modifiedDate).format("DD-MM-YYYY").toString()
    }
    return null
  }

  setSupressWarningDate() {
    window.localStorage.setItem(ksuppressWarningDate, dayjs().add(1, "d").toISOString())
  }

  shouldShowUpdateAlert(): boolean {
    let suppressWarningDateString = window.localStorage.getItem(ksuppressWarningDate)
    let suppressWarningDate = dayjs(suppressWarningDateString) 
    if(suppressWarningDate && suppressWarningDate.isAfter(dayjs())) {
      return true
    }

    let metadataDateString = window.localStorage.getItem(klastMetadataUpdateDate)
    let lastModifiedDateString = window.localStorage.getItem(klastModifiedDate)

    let metadataDate = dayjs(metadataDateString)
    let lastModifiedDate = dayjs(lastModifiedDateString)

    if(metadataDate && lastModifiedDate) {
      return metadataDate.isBefore(lastModifiedDate)
    }
    return false
  }
}

export const localStorgeHelper = new LocalStorgeHelper();