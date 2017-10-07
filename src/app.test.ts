
import * as request from 'supertest';

import { app } from './app';

describe("Server", () => {
    it("GET '/': should return 200 w/ Accept: 'text/html'", () => {
        return request(app)
            .get("/")
            .set({ Accept: "text/html" })
            .expect(200);
    });

    it("GET '/': should return 406 w/ Accept: 'application/json'", () => {
        return request(app)
            .get("/")
            .set({ Accept: "application/json" })
            .expect(406)
            .expect({ error: "This route responses with HTML only." });
    });
});
