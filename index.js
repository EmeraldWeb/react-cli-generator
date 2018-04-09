const Fs = require('fs');

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

class ComponentGenerator {
    constructor(passedfileName) {
        this.fileName = passedfileName;
        this.className = SnakeCaseToPascalCase(passedfileName);
        this.scssFileContent = '@import \'../../../common/variable\';\n';
    }

    jsxFileContent() {
        const { fileName } = this;
        const { className } = this;
        const string =
            'import React from \'react\';\n' +
            `import './scss/${fileName}.scss';\n\n` +
            `function ${className}() {\n` +
            `    return (\n        <div>${className}</div>\n    );\n}\n\n` +
            `export default ${className};\n`;

        return string;
    }

    testFileContent() {
        const { fileName } = this;
        const { className } = this;
        const string =
            'import React from \'react\';\n' +
            'import { shallow, configure } from \'enzyme\';\n' +
            'import Adapter from \'enzyme-adapter-react-16\';\n\n' +
            `import ${className} from '../../src/components/${fileName}/${fileName}.jsx';\n\n` +
            'configure({ adapter: new Adapter() });\n\n' +
            `describe('${className}', () => {\n    const wrapper = shallow(<${className} />);\n});\n`;

        return string;
    }

    generate() {
        const { fileName } = this;
        const { scssFileContent } = this;
        const pathToComponents = `${__dirname}/src/components`;

        Fs.mkdirSync(`${pathToComponents}/${fileName}`);
        Fs.appendFileSync(`${pathToComponents}/${fileName}/${fileName}.jsx`, this.jsxFileContent());

        Fs.mkdirSync(`${pathToComponents}/${fileName}/scss`);
        Fs.appendFileSync(`${pathToComponents}/${fileName}/scss/${fileName}.scss`, scssFileContent);

        Fs.appendFileSync(`${__dirname}/tests/components/${fileName}.test.js`, this.testFileContent());
    }
}

if (process.argv[2] === 'component' && process.argv.length >= 4) {
    const componentName = process.argv[3];

    if (!Fs.existsSync(`${__dirname}/src`)) {
        Fs.mkdirSync(`${__dirname}/src`);
        Fs.mkdirSync(`${__dirname}/src/components`);
    } else if (!Fs.existsSync(`${__dirname}/src/components`)) {
        Fs.mkdirSync(`${__dirname}/src/components`);
    }

    if (!Fs.existsSync(`${__dirname}/tests`)) {
        Fs.mkdirSync(`${__dirname}/tests`);
        Fs.mkdirSync(`${__dirname}/tests/components`);
    } else if (!Fs.existsSync(`${__dirname}/tests/components`)) {
        Fs.mkdirSync(`${__dirname}/tests/components`);
    }

    if (!Fs.existsSync(`${__dirname}/src/components/${componentName}`)) {
        const newComponent = new ComponentGenerator(componentName);
        newComponent.generate();
        console.log(`SUCCESS: The "${componentName}" component was successfully generated`);
    } else {
        console.log(`ERROR: Component "${componentName}" is already exist`);
    }
} else {
    console.log(`ERROR: It is impossible to generate things like "${process.argv[2]}", please generate "component" with name as second attribute`);
}
