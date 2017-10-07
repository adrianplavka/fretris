
import * as path from 'path';
import * as Express from 'express';

export const app = Express();

// Serve static files.
app.use(Express.static("src/client/web/.dist/"));

// Serve the index page.
app.get("/", (req, res) => {
    res.format({
        html: () => {
            res.status(200).sendFile(
                `${process.cwd()}/src/client/web/.dist/workspace/`
            );
        },
        default: () => {
            res.status(406).send({
                error: "This route responses with HTML only."
            })
        }
    });
});
