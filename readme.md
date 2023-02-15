# n
Commands:
   b: ng build
   c: cost-of-modules --no-install --include-dev
   d: depcheck --ignores @types/*
   g: npm ls -g --depth=0 && yarn global list
  gc: git cherry-pick commit-hash
   l: (c/s) yarn link package
  ul: (c/s) yarn unlink package
   p: Display scripts from package.json
   s: (1/2/3) ng serve --port=port --public-host=localhost:port --disable-host-check
   t: ng test --include=**\folder-name\*.spec.ts
   t: (i) ng test --include=**\file-name.spec.ts
   v: ng version && yarn -v
gadd: yarn global add package-name
  gr: yarn global remove package-name
yadd: yarn add package-name -D
  yr: yarn remove package-name
  ya: yarn audit
  yo: yarn outdated
  ys: yarn start
