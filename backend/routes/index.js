const { Router } = require("express");

const userRouter = require('./user')

const router = Router

router.get("/user", userRouter)

module.exports = router