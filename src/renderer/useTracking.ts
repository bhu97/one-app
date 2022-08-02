import { useMatomo } from '@datapunt/matomo-tracker-react';

export const useTracking = () => {
  const { trackPageView, trackEvent } = useMatomo();
const HREF = 'http://com.freseniusnetcare.oneappdesktop/'
  const trackViewFile = (fileName: string, country: string, path: string) => {
    console.log('trackViewFile', country, fileName);
    try {
      trackPageView({
        href: `${HREF}view-file/${fileName} (${country})`,
      });
      trackPageView({
        href: `${HREF}view-file-desktop/${fileName} (${country})`,
      });
    } catch (error) {
      // console.log('ErrortrackViewFile', error);
    }
  };

  const trackContentPage = (name: string, country: string, path: string) => {
    console.log('trackContentPage', country);
    try {
      trackPageView({
        href: `${HREF}content-page/${country}/${name}/${path}`,
      });
      trackPageView({
        href: `${HREF}content-page-desktop/${country}/${name}/${path}`,
      });
    } catch (error) {
      // console.log('ErrorContentPage', error);
    }
  };

  const trackFavorite = (name: string, country: string, path: string) => {
    console.log('trackFavorite', country);
    try {
      trackPageView({
        href: `${HREF}favorite-file/${country}/${name}/${path}`,
      });
      trackPageView({
        href: `${HREF}favorite-file-desktop/${country}/${name}/${path}`,
      });
    } catch (error) {
      // console.log('ErrortrackFavorite', error);
    }
  };

  const trackStart = (country: string) => {
    console.log('trackStart', country);

    try {
      trackPageView({
        href: `${HREF}app-start/${country}/`,
      });
      trackPageView({
        href: `${HREF}app-start-desktop/${country}/`,
      });

    } catch (error) {
      // console.log('ErrortrackStart', error);
    }
  };

  const trackViewFileByCountry = (country: string, path: string) => {
    console.log('trackViewFileByCountry', country);
    try {
      trackPageView({
        href: `${HREF}view-file-by-country/${country ?? 'none'}/${path}`,
      });
      trackPageView({
        href: `${HREF}view-file-by-country-desktop/${country ?? 'none'}/${path}`,
      });
    } catch (error) {
      // console.log('ErrortrackViewFileByCountry', error);
    }
  };

  const trackSendFiles = (fileNames: string[], country?: string) => {
    console.log('trackSendFiles', country, fileNames);
    try {
      trackPageView({
        href: `${HREF}send-files/${country ?? 'none'}/${fileNames.join()}`,
      });
      trackPageView({
        href: `${HREF}send-files-desktop/${country ?? 'none'}/${fileNames.join()}`,
      });
    } catch (error) {
      // console.log('ErrortrackSendFiles', error);
    }
  };

  const trackCountryChange = (country: string) => {
    console.log('trackCountryChange', country);
    try {
      trackPageView({
        href: `${HREF}country-change/country-change-desktop/${country}/`,
      });
      trackPageView({
        href: `${HREF}country-change-desktop/${country}/`,
      });
    } catch (error) {
      // console.log('ErrortrackCountryChange', error);
    }
  };

  //currently there is no download
  // const trackDownload = (name: string, country: string, path:string) => {
  //   try {
  //     trackPageView({
  //       documentTitle: name,
  //       href: `view-file/${name} (${country})`
  //     })
  //   } catch (error) {}
  // }

  // const trackExample = () => {
  //   // console.log('trackExanple HREF=', href);
  //   try {
  //     // trackPageView({
  //     //   href: `test data example  - A`,
  //     // });
  //     const href =
  //     trackPageView({
  //       href: `http://piwik.freseniusmedicalcare.com/`,
  //     }
  //     );
  //     trackEvent({ category: 'check', action: 'click-event' })
  //   } catch (error) {
  //     // console.log('ErrortrackFavorite', error);
  //   }
  // }

  return {
    trackViewFile,
    trackContentPage,
    trackStart,
    trackViewFileByCountry,
    trackSendFiles,
    trackCountryChange,
    trackFavorite,
    // trackExample,
  };
};
