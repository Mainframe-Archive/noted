[![CircleCI](https://circleci.com/gh/MainframeHQ/noted.svg?style=svg)](https://circleci.com/gh/MainframeHQ/noted)
# noted
Noted is a simple dApp for composing and organizing text notes in MainframeOS

## Build/run instructions

- Inside the `js-mainframe` project, at the `/packages/sdk` directory, run `npm link`.
- Run the mainframe launcher program with `npm run dev` and follow the setup instructions.
- Inside the root of this project, run `npm link @mainframe/sdk`.
- Build the project with `npm run build`.
- The first time this project is run, create a new application and add the `/build` directory as the content path.
