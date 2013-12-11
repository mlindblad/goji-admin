module.exports = function(config) {
    config.set({
        basePath : '../',

        files : [
            'app/components/angular/angular.js',
            'test/lib/angular-mocks/angular-mocks.js',
            'app/components/momentjs/moment.js',
            'app/components/highcharts.com/js/highcharts.src.js',
            'app/components/highcharts-ng/src/directives/highcharts-ng.js',
            'app/components/jquery/jquery.js',
            'app/components/underscore/underscore-min.js',
            'app/app.js',
            'app/config.js',
            'app/js/**/*.js',
            'test/mockData.js'
        ],

        exclude : [
            'app/components/angular/*.min.js'
        ],

        autoWatch : true,

        frameworks: ['jasmine'],

        browsers : ['Chrome'],

        plugins : [
            'karma-junit-reporter',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-coverage'
        ],

        junitReporter : {
            outputFile: 'test_out/unit.xml',
            suite: 'unit'
        },

        reporters: ["progress", "coverage"],

        preprocessors: {
            'app/js/**/!(*Spec).js': 'coverage'
        },

        coverageReporter: {
            type : 'lcov',
            dir : 'test_out/coverage/'
        }

    });

};