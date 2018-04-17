# react-cli-generator
CLI generator of React components with no dependencies.

## Install
npm install react-cli-generator --save-dev

## How-to
1. Create configuration file `.react-cli-generator.json` in root directory of your project,
where you pass the `component` object with the parameters for it.
    #### Component options:
    **`pathToDirectory`** (string)  
    A path from the root directory of your project to an existing directory in which you want to create new components.
    
    **`style`** (string)  
    Write extenstion of your choosen style file (`css, sass, scss, less,` etc.) without dot, if you do not want to create style file, write empty string.
    
    **`styleCommon`** (string)  
    Write your general import for the style file, if you do not want to create a common import, write an empty string.
    
    **`test`** (bool)
    Agreement to create a test file for your component. Test files generates in `jest/enzyme` configuration with last version adapter `enzyme-adapter-react-16`.
    
    **`pathToTestDirectory`** (string)  
    A path from the root directory of your project to an existing test directory in which you want to create a test file for your new component.
    
    ### Configuration file .react-cli-generator.json example:
    ```json
    {
        "component": {
            "pathToDirectory": "./",
            "style": "scss",
            "styleCommon": "@import '../../../common/variable';\n",
            "test": true,
            "pathToTestDirectory": "tests/components"
        }
    }
    ```

2. Add command `react-cli-generator component` to your package scripts.
3. Run command `npm run *your_command_name* *component_name*`.

## License
MIT
