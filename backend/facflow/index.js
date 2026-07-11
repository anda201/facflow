// express 변수 할당 
const express = require("./config/express");
// log 기록
const { logger } = require("./config/winston");

// express 프레임워크 실행
const port = 3000;
express().listen(port);
logger.info(`${process.env.NODE_ENV} - API Server Start At Port ${port}`);
