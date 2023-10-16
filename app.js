const http = require("http");
const express = require("express");
const { DataSource } = require("typeorm");
const app = express();

const appDataSource = new DataSource({
  type: "mysql",
  host: "127.0.0.1",
  port: "3306",
  username: "root",
  password: "2349",
  database: "wethread_50",
});

app.use(express.json()); // for parsing application/json

// Health Check function
app.get("/ping", async (req, res) => {
  res.status(200).json({ message: "pong" });
});
//1.회원가입
const signUp = async (req, res) => {
  console.log(req.body.name);
  const userNickname = req.body.nickname;
  const userEmail = req.body.email;
  const userPassword = req.body.password;

  const userData = await appDataSource.query(`
  INSERT INTO users (
    nickname,
    password,
    email
  )VALUES(
    '${userNickname}',
    '${userPassword}',
    '${userEmail}'

  )
  `);

  return res.status(200).json({ message: "signup_success" });
};
//2.게시물 작성
const upload = async (req, res) => {
  const content = req.body.content;
  const userId = req.body.user_id;

  const uploadData = await appDataSource.query(`
  INSERT INTO threads (user_id, content) values('${userId}', '${content}')
  `);

  return res.status(201).json({ message: "postcreated" });
};
//3.전체 게시글 조회
const view = async (req, res) => {
  const viewData = await appDataSource.query(`
  SELECT*FROM threads
  `);

  return res.json({ viewData });
};
//4.특정 게시글 조회
const searchView = async (req, res) => {
  const searchViewData = await appDataSource.query(`
  SELECT*FROM threads where user_id = "${req.body.user_id}"
  `);

  return res.json(searchViewData);
};
//5.게시글 수정
const modify = async (req, res) => {
  const modifyData = await appDataSource.query(`
  UPDATE threads SET content ="${req.body.newcontent}" WHERE user_id ="${req.body.user_id}" AND id="${req.body.id}"
  `);

  return res.json(modifyData);
};
//6.게시글 삭제
const deletethreads = async (req, res) => {
  const deleteData = await appDataSource.query(`
  DELETE FROM threads WHERE id = "${req.body.id}"  
  `);

  return res.json({ message: "thread deleted" });
};
//7.좋아요 누르기
const likeIt = async (req, res) => {
  const likeItData = await appDataSource.query(`
  INSERT INTO thread_likes (user_id, thread_id) VALUES ("${req.body.user_id}", "${req.body.thread_id}")
  `);

  return res.json({ message: "likethread" });
};

app.post("/likeit", likeIt);
app.get("/delete", deletethreads);
app.get("/modify", modify);
app.get("/searchView", searchView);
app.get("/view", view);
app.post("/users/sign-up", signUp);
app.post("/upload", upload);

const server = http.createServer(app); // express app 으로 서버를 만듭니다.

// 서버를 시작하는 함수입니다.
const start = async () => {
  // 서버를 시작하는 함수입니다.
  try {
    server.listen(8000, () => console.log(`Server is listening on 8000`));

    appDataSource.initialize().then(() => {
      console.log("Data Source has been initialized!");
    });
  } catch (err) {
    console.error(err);
  }
};

start();
