#!/usr/bin/env node

const Fs = require('fs');
const path = require('path');

const processPath = process.cwd();
const configFileName = '.react-cli-generator.json';

function SnakeCaseToPascalCase(stringSnake) {
    const stringPascal = stringSnake.replace(/(^\w)|(_)(\w)/gi, (match, p1, p2, p3, offset) => {
        const handledMatch = match.toUpperCase();
        if (!(offset === 0)) {
            return handledMatch[1];
        }

        return handledMatch;
    });

    return stringPascal;
}

function PickUpConfigFile() {
    if (!Fs.existsSync(`${processPath}/${configFileName}`)) {
        console.log('Please create configuration file \'.react-cli-generator.json\'');
        return false;
    }

    return JSON.parse(Fs.readFileSync(`${processPath}/${configFileName}`, 'utf8'));
}

class ComponentGenerator {
    constructor(config) {
        this.fileName = config.name;
        this.className = SnakeCaseToPascalCase(config.name);
        this.pathToComponentDirectory = `${processPath}/${config.pathToDirectory}/${this.fileName}`;
        this.style = config.style;
        this.styleCommon = config.styleCommon;
        this.pathToTestDirectory = config.test ? `${processPath}/${config.pathToTestDirectory}` : false;
    }

    jsxFileContent() {
        const { fileName } = this;
        const { className } = this;
        const { style } = this;

        const importScss = style ? `import './${style}/${fileName}.${style}';\n` : '';

        const string =
            'import React from \'react\';\n' +
            `${importScss}` +
            `\nfunction ${className}() {\n` +
            `    return (\n        <div>${className}</div>\n    );\n}\n\n` +
            `export default ${className};\n`;

        return string;
    }

    testFileContent() {
        const { fileName } = this;
        const { className } = this;
        const { pathToComponentDirectory } = this;
        const { pathToTestDirectory } = this;
        let relativePath = path.relative(`${pathToTestDirectory}`, `${pathToComponentDirectory}/${fileName}.jsx`);
        relativePath = relativePath.replace(/\\/g, '/');

        const string =
            'import React from \'react\';\n' +
            'import { shallow, configure } from \'enzyme\';\n' +
            'import Adapter from \'enzyme-adapter-react-16\';\n\n' +
            `import ${className} from '${relativePath}';\n\n` +
            'configure({ adapter: new Adapter() });\n\n' +
            `describe('${className}', () => {\n    const wrapper = shallow(<${className} />);\n});\n`;

        return string;
    }

    generateComponent() {
        const { fileName } = this;
        const { pathToComponentDirectory } = this;

        Fs.mkdirSync(`${pathToComponentDirectory}`);
        Fs.appendFileSync(`${pathToComponentDirectory}/${fileName}.jsx`, this.jsxFileContent());
    }

    generateStyle() {
        const { style } = this;

        if (style) {
            const { fileName } = this;
            const { styleCommon } = this;
            const { pathToComponentDirectory } = this;

            Fs.mkdirSync(`${pathToComponentDirectory}/${style}`);
            Fs.appendFileSync(`${pathToComponentDirectory}/${style}/${fileName}.${style}`, styleCommon);
        }
    }

    generateTest() {
        const { fileName } = this;
        const { pathToTestDirectory } = this;

        if (pathToTestDirectory && !Fs.existsSync(`${pathToTestDirectory}/${fileName}.test.js`)) {
            Fs.appendFileSync(`${pathToTestDirectory}/${fileName}.test.js`, this.testFileContent());
        }
    }
}

function Init() {
    const configuration = PickUpConfigFile();
    const { component } = configuration;

    if (component && process.argv[2] === 'component' && process.argv.length >= 4) {
        component.name = process.argv[3];
        const { pathToDirectory } = component;
        const newComponent = new ComponentGenerator(component);

        if (!Fs.existsSync(`${processPath}/${pathToDirectory}/${component.name}`)) {
            newComponent.generateComponent();
            newComponent.generateStyle();
            newComponent.generateTest();

            console.log(`SUCCESS: The "${component.name}" component was successfully generated`);
        } else {
            console.log(`ERROR: Component "${component.name}" is already exist`);
        }

        return;
    }

    console.log(`ERROR: It is impossible to generate things like "${process.argv[2]}", please generate "component" with name as second attribute`);
}

Init();
