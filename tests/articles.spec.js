const request = require("supertest");
const { app } = require("../server");
const jwt = require("jsonwebtoken");
const config = require("../config");
const mongoose = require("mongoose");
const mockingoose = require("mockingoose");
const Article = require("../api/articles/articles.schema");
const articlesService = require("../api/articles/articles.service");

describe("tester API articles", () => {
  let token;
  const USER_ID = "5f7d0f3cb2ac6656c48e3f5c";
  const ARTICLE_ID = "5f7d0f3cb2ac6656c48e3f5d";
  const MOCK_ARTICLE = {
    _id: ARTICLE_ID,
    title: "Test Article",
    content: "Voici un article test",
    user: USER_ID,
  };

  beforeEach(() => {
    token = jwt.sign({ userId: USER_ID, role: "admin" }, config.secretJwtToken);
    mockingoose(Article).toReturn(MOCK_ARTICLE, "save");
    mockingoose(Article).toReturn(MOCK_ARTICLE, "findOneAndUpdate");
    mockingoose(Article).toReturn(null, "deleteOne");
  });

  afterEach(() => {
    jest.restoreAllMocks();
    mockingoose.resetAll();
  });

  describe("POST /api/articles", () => {
    it("cree un article existant", async () => {
      const res = await request(app)
        .post("/api/articles")
        .set("x-access-token", token)
        .send({ title: "New Article", content: "Content of new article" });

      expect(res.statusCode).toBe(201);
      expect(res.body.title).toBe("Test Article");
    });
  });

  describe("PUT /api/articles/:id", () => {
    it("met a jour un article existant", async () => {
      const res = await request(app)
        .put(`/api/articles/${ARTICLE_ID}`)
        .set("x-access-token", token)
        .send({ title: "Updated Article" });

      expect(res.statusCode).toBe(200);
      expect(res.body.title).toBe("Test Article");
    });
  });

  describe("DELETE /api/articles/:id", () => {
    it("supprime un article existant", async () => {
      const res = await request(app)
        .delete(`/api/articles/${ARTICLE_ID}`)
        .set("x-access-token", token);

      expect(res.statusCode).toBe(204);
    });
  });
});
