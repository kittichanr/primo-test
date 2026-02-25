# primo-test

## encrypt-decrypt-project

setup project 
  - use node version 24
  - `yarn install` for install package
  - `yarn start:dev` for run project
  - `yarn test` for run unit test
  - `http://localhost:3000/api` go to swagger api document and you can test api for encrypt/decrypt data
  
    ```
    POST /get-encrypt-data
    BODY {
        payload: "string | required | 0 - 2000 characters"
    }
    ```

    ```
    POST /get-decrypt-data
    BODY {
        data1: "string | required",
        data2: "string | required"
    }
    ```