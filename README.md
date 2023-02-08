## Examples

- src/hooks/login/useLoginMethod.tsx  - Encapsulates all login methods
- src/pages/_app.tsx - Configure the environment for web3 login
- src/pages/components/Layout/Header.tsx - Login logic entry
- src/pages/components/LoginListView.tsx - Login method selection page
- src/pages/components/EmailModal.tsx - Mail login UI
- src/pages/api/auth/[...nextauth].ts  - Verify that the account is legitimate


## Features

- Easy login with web3 wallet
- Easy to login with google twitter email account
- After successful login using Google twitter email, an address will be issued


## Quick Start Guide

```bash
 pnpm install
 
 pnpm db:push
 
 pnpm dev
 
```
