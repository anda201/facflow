const express = require("express");
const compression = require("compression");
const methodOverride = require("method-override");
var cors = require("cors");

module.exports = function () {
  const app = express();

  //미들웨어 설정 : express 프레임워크를 사용하기 쉽게 하는 라이브러리들 설정.
  //http 요청 압축 및 해제
  app.use(compression()); 

  //body 값 파싱
  app.use(express.json());

  //form 요청 값 파싱
  app.use(express.urlencoded({ extended: true }));

  //put, delete 요청 처리
  app.use(methodOverride());

  //웹브라우저 cors 설정 관리
  app.use(cors());
  app.use(express.static("/home/ubuntu/food-map/front"));

  // app.use(express.static(process.cwd() + '/public'));

  //직접 구현하는 모듈
  require("../src/routes/indexRoute")(app);
  require("../src/routes/dashboardRoute")(app);
  require("../src/routes/planRoute")(app);
  require("../src/routes/productionRoute")(app);
  require("../src/routes/equipmentRoute")(app);

  return app;
};
