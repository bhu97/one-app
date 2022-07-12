import { useMatomo } from '@datapunt/matomo-tracker-react'

export const useTracking = () => {
  const { trackPageView } = useMatomo()

  const trackViewFile = (fileName: string, country: string, path: string) => {
    console.log("trackViewFile", country,fileName);
    try {
      trackPageView({
        href: `view-file/${fileName} (${country})`

      })
      trackPageView({
        href: `view-file-desktop/${fileName} (${country})`
      })
    } catch (error) {}
  }

  const trackContentPage = (name: string, country: string, path: string)  => {
    console.log("trackContentPage", country);
    try {
      trackPageView({
        href: `content-page/${country}/${name}/${path}`

      })
      trackPageView({
        href: `content-page-desktop/${country}/${name}/${path}`
      })
    } catch (error) {}
  }

  const trackFavorite = (name: string, country: string, path: string)  => {
    console.log("trackFavorite", country);
    try {
      trackPageView({
        href: `favorite-file/${country}/${name}/${path}`

      })
      trackPageView({
        href: `favorite-file-desktop/${country}/${name}/${path}`
      })
    } catch (error) {}
  }

  const trackStart = (country: string) => {
    console.log("trackStart", country);
    try {
      trackPageView({
        href: `app-start/${country}/`

      })
      trackPageView({
        href: `app-start-desktop/${country}/`
      })
    } catch (error) {}
  }

  const trackViewFileByCountry = (country: string, path: string) => {
    console.log("trackViewFileByCountry", country);
    try {
      trackPageView({
        href: `view-file-by-country/${country ?? "none"}/${path}`

      })
      trackPageView({
        href: `view-file-by-country-desktop/${country ?? "none"}/${path}`
      })
    } catch (error) {}
  }

  const trackSendFiles = (fileNames: string[], country?: string) => {
    console.log("trackSendFiles", country, fileNames);
    try {
      trackPageView({
        href: `send-files/${country ?? "none"}/${fileNames.join()}`

      })
      trackPageView({
        href: `send-files-desktop/${country ?? "none"}/${fileNames.join()}`
      })
    } catch (error) {}
  }

  const trackCountryChange = (country: string) => {
    console.log("trackCountryChange", country);
    try {
      trackPageView({
        href: `country-change/country-change-desktop/${country}/`

      })
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
