var jam = {
    "packages": [
        {
            "name": "d3",
            "location": "jam/d3",
            "main": "d3.v2.js"
        },
        {
            "name": "jquery",
            "location": "jam/jquery",
            "main": "dist/jquery.js"
        }
    ],
    "version": "0.2.13",
    "shim": {
        "d3": {
            "exports": "d3"
        }
    }
};

if (typeof require !== "undefined" && require.config) {
    require.config({
    "packages": [
        {
            "name": "d3",
            "location": "jam/d3",
            "main": "d3.v2.js"
        },
        {
            "name": "jquery",
            "location": "jam/jquery",
            "main": "dist/jquery.js"
        }
    ],
    "shim": {
        "d3": {
            "exports": "d3"
        }
    }
});
}
else {
    var require = {
    "packages": [
        {
            "name": "d3",
            "location": "jam/d3",
            "main": "d3.v2.js"
        },
        {
            "name": "jquery",
            "location": "jam/jquery",
            "main": "dist/jquery.js"
        }
    ],
    "shim": {
        "d3": {
            "exports": "d3"
        }
    }
};
}

if (typeof exports !== "undefined" && typeof module !== "undefined") {
    module.exports = jam;
}