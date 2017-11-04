import Jasmine from 'jasmine';
import JasmineConsoleReporter from 'jasmine-console-reporter';

const jasmine = new Jasmine();
jasmine.loadConfigFile('jasmine.json');
jasmine.env.clearReporters();
jasmine.addReporter(new JasmineConsoleReporter({
    colors: 1,
    cleanStack: 1,
    verbosity: 4,
    listStyle: 'indent',
    activity: false
}));
jasmine.execute();