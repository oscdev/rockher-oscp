# OSCP Wholesale

## Description

Custom Pricing allows you to define wholesale discounts for Collections, Products, Products Variants and Customer Groups.

## Requirements

The Node app template comes with the following out-of-the-box functionality:

- You must have installed Node.js 14.17.0 or higher.
- You must have installed Shopify CLI version 3.45.1 or higher
- You must have ngrok installed to run the App on the local system
- Shopify-specific tooling:
  - AppBridge
  - Polaris
  - Webhooks
  - Rest API
  - GraphQL API
  - Theme App Extensions

## Tech Stack

This template combines a number of third party open-source tools:

- [Express](https://expressjs.com/) builds the backend.
- [Vite](https://vitejs.dev/) builds the [React](https://reactjs.org/) frontend.
- [React Router](https://reactrouter.com/) is used for routing. We wrap this with file-based routing.
- [React Query](https://react-query.tanstack.com/) queries the Admin API.

The following Shopify tools complement these third-party tools to ease app development:

- [Shopify API library](https://github.com/Shopify/shopify-node-api) adds OAuth to the Express backend. This lets users install the app and grant scope permissions.
- [App Bridge React](https://shopify.dev/apps/tools/app-bridge/getting-started/using-react) adds authentication to API requests in the frontend and renders components outside of the App’s iFrame.
- [Polaris React](https://polaris.shopify.com/) is a powerful design system and component library that helps developers build high quality, consistent experiences for Shopify merchants.
- [Custom hooks](https://github.com/Shopify/shopify-frontend-template-react/tree/main/hooks) make authenticated requests to the Admin API.
- [File-based routing](https://github.com/Shopify/shopify-frontend-template-react/blob/main/Routes.jsx) makes creating new pages easier.

## Documentation Links

*fly.io installation*:-

https://docs.google.com/document/d/1-52rmSq5JJygbVhq9QavZj470qaW9gGkyXBygIBqAhA/edit

*App Document*:-

https://docs.google.com/document/d/1dY7zuB6XK-c5rX96fyvc1fNVNgZyvoUH00OOYVFPRhk/edit

*V2 Json Schema*:-

https://docs.google.com/document/d/1SBvqw5n-hbj9oIHv5nUqlyO44YWemGEAaigpuNiSPj4/edit


## Installation

*Installation on Development*: 

Clone the Project
    Inside the project root directory install npm modules.
    Command:- npm i
    Run command:- npm i
    In web and frontend directory as well.
    To run the App 
    run command:- npm run dev in project root directory.
    It will ask to select the organization on which Shopify Partner Account is associated.
    Select a store to do development.
    Select an App or Create a new App to test the code. It will save the API details at that time only.

## Deployment

*Deployment for Production*: Fly Server (Deprecated)

    Clone the project
    Install flyctl on the system.
    Command on Linux:- curl -L https://fly.io/install.sh | sh
    Command on Windows:- powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
    Refer to document:- https://docs.google.com/document/d/1AOg8XuZvbMq9-KhSabYBhyE6borS3stzjVgzGYXMb6Q/edit

## Login to fly 
    Run command in the project root directory to deploy an App.
    SHOPIFY_API_KEY=*************************** - -remote only


## How To Connect Database Through Proxy
## To connect MYSQL server port to local machine using fly proxy
    Run Command:- flyctl proxy 3306 -a cpw2mysql

## To connect MYSQL server at localhost:3306 with the username and password
    Run Command:- mysql -h 127.0.0.1 -u osc -P 3306 -p

*Deployment for Production on E2E Server*

    Set environment variables on server.
    export SHOPIFY_API_KEY=*******
    export SCOPES=******
    export HOST=*********
    export SHOPIFY_API_SECRET=************
    export PORT=****

    To create build
    Run Command:- npm run build on frontend directory.

    Run Command:- pm2 start npm --name "****" -- run serve.
                  Serve command will run through processs manager.
    
    To kill pm2 service
    Run Command:- Pm2 kill -p 0

    To Check pm2 status
    Run Command:- pm2 status

    To check pm2 logs
    Run Commands:- pm2 logs

    