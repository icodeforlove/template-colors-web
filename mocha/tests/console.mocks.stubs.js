var Mocks = {

    obj: {
        a: 1,
        b: [1, 2, 3],
        c: 'string',
        d: undefined,
        e: null
    }

};

var Stubs = {

    obj: ["{%c\"a\":%c%c1%c,%c\"b\":%c[%c1%c,%c2%c,%c3%c],%c\"c\":%c%c\"string\"%c,%c\"e\":%c%cnull%c}", "color:#de4f2a;", "", "color: darkorange;", "", "color:#de4f2a;", "", "color: darkorange;", "", "color: darkorange;", "", "color: darkorange;", "", "color:#de4f2a;", "", "color: green;", "", "color:#de4f2a;", "", "color: magenta;", ""],
    objNoStyle: [JSON.stringify(Mocks.obj)],
    objNoStyleNoGroup: ['- ' + JSON.stringify(Mocks.obj)]

};
