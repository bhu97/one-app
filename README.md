<h1 align="center">
  One App Desktop
  <br>
</h1>

[Project Page on Confluence](https://confluence.intra.fresenius.de/pages/viewpage.action?pageId=122279999)

## Description
The currently used ONE e-Detailing of FMC Marketing has been developed by an external 3rd Party supplier. 
The app has been used for many years and needs a lot of maintenance effort to keep the contents up to date. 
Therefore the App shall be replaced by a Sharepoint-based, native iPad App, which allows the Product Owners to 
update the content by themselve or by local editors.

After success of the iPad App, there was now a need for a desktop version that can run on windows with similar features.

## How to use
- Node 12+ LTS
- Typescript
- Platform target Windows 10+ (Works also on MacOS)

Start the app in the `dev` environment:

```bash
yarn start
```

## Packaging for Production

To package apps for the local platform:

```bash
yarn package
```

Or package for prod use with debug mode enabled (developer tools)
```bash
yarn cross-env DEBUG_PROD=true yarn build 
yarn cross-env DEBUG_PROD=true yarn package  
```  


## Docs
This project is built on to of electron boilerplate project on git.
Some documentation for debugging or extending is here:
[docs and guides here](https://electron-react-boilerplate.js.org/docs/installation)

---

## Release Notes

### 1.0.1
- added better handling for login and network
- fixed wrong subject in emails
- country selection in settings is sorted by name now
- Folder list in Home should scroll now correctly

### 1.0.0
- First release for testing with customer and UK users