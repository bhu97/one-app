import { useMatomo } from '@datapunt/matomo-tracker-react'

export const useTracking = () => {
  const { trackPageView } = useMatomo()

  const trackViewFile = (fileName: string, country: string, path: string) => {
    try {
      trackPageView({
        href: `view-file-desktop/${fileName} (${country})`
      })
    } catch (error) {}
  }

  const trackContentPage = (name: string, country: string, path: string)  => {
    try {
      trackPageView({
        href: `content-page-desktop/${country}/${name}/${path}`
      })
    } catch (error) {}
  }

  const trackFavorite = (name: string, country: string, path: string)  => {
    try {
      trackPageView({
        href: `favorite-file-desktop/${country}/${name}/${path}`
      })
    } catch (error) {}
  }

  const trackStart = (country: string) => {
    try {
      trackPageView({
        href: `app-start-desktop/${country}/`
      })
    } catch (error) {}
  }

  const trackViewFileByCountry = (country: string, path: string) => {
    try {
      trackPageView({
        href: `view-file-by-country-desktop/${country ?? "none"}/${path}`
      })
    } catch (error) {}
  }

  const trackSendFiles = (fileNames: string[], country?: string) => {
    try {
      trackPageView({
        href: `send-files-desktop/${country ?? "none"}/${fileNames.join()}`
      })
    } catch (error) {}
  }

  const trackCountryChange = (country: string) => {
    try {
      trackPageView({
        href: `country-change-desktop/${country}/`
      })
    } catch (error) {}
  }

  //currently there is no download
  // const trackDownload = (name: string, country: string, path:string) => {
  //   try {
  //     trackPageView({
  //       documentTitle: name,
  //       href: `view-file/${name} (${country})`
  //     })
  //   } catch (error) {}
  // }

  return {
    trackViewFile,
    trackContentPage,
    trackStart,
    trackViewFileByCountry,
    trackSendFiles,
    trackCountryChange,
    trackFavorite
  }
}
