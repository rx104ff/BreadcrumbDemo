const e = require("express");
const cors = require('cors');

const express = require("express");

let root = {
    type: "dir",
    children: {
        home: {
            type: "dir",
            children: {
                myname: {
                    type: "dir",
                    children: {
                        "filea.txt": {
                            type: "file",
                        },
                        "fileb.txt": {
                            type: "file",
                        },
                        projects: {
                            type: "dir",
                            children: {
                                mysupersecretproject: {
                                    type: "dir",
                                    children: {
                                        mysupersecretfile: {
                                            type: "file",
                                        },
                                    },
                                }
                            },
                        },
                    }
                },
            },
        }
    },
};

const PORT = process.env.PORT || 3003;

const app = express();

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

app.use(cors({
    origin: '*'
}));

app.get("/path/:my_path", (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    var myPath = req.params['my_path'].split('+');

    var currentRoot = root;

    myPath.forEach( element => {
        if (currentRoot["children"] != undefined && currentRoot["children"][element] != undefined) {
            currentRoot = currentRoot["children"][element];
        } else {
            res.status(404).send("Not exist");
            return;
        }
    });



    if (currentRoot["type"] == "dir") {
        let ret = {
            "type": "dir",
            "children": Object.keys(currentRoot["children"])
        };
        
        res.send(ret);
    } else {
        let ret = {
            "type": "file",
            "content": "This is a file"
        };

        res.send(ret);
    }
})
