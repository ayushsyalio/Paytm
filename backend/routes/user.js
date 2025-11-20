const express = require("express");
const zod = require("zod");
const { User, Account } = require("../db");
const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../config");
const { authMiddleware } = require("../middleware");

const router = express.Router();
//signup and signin routes

const signupSchema = zod.object({
  username: zod.string(),
  password: zod.string(),
  firstname: zod.string(),
  lastname: zod.string(),
});

router.post("/signup", async (req, res) => {
  const body = req.body;
  const { success } = signupSchema.safeParse(req.body);
  if (!success) {
    return res.json({
      message: "Email already taken / Invalid inputs",
    });
  }

  const existinguser = await User.findOne({
    username: req.body.username,
  });

  if (existinguser) {
    res.status(411).json({
      message: "Email already taken / Incorrect inputs",
    });
  }

  const user = await User.create({
    username:req.body.username,
    password:req.body.password,
    firstname:req.body.firstname,
    lastname:req.body.lastname,

  });

  const userId = user._id

  ////create new account---->

  await Account.create({
    userId,
    balance: 1 + Math.random()*10000,
  })

  ////---->



  const token = jwt.sign({userId,},
    JWT_SECRET
  );

  res.json({
    message: "user created successfully",
    token: token,
  });
});

const signinSchema = zod.object({
  username: zod.string().email(),
  password: zod.string(),
});

router.post("/signin", async (req, res) => {
  const body = req.body;

  //validate a input using a signin schema

  const { success } = signinSchema.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      message: "Incorrect credentials",
    });
  }

  //check if user exists
  const existinguser = await User.findOne({
    username: req.body.username,
    password: req.body.password,
  });

  if (existinguser) {
    const token = jwt.sign(
      {
        userId: existinguser._id,
      },
      JWT_SECRET
    );
    res.json({
      message: "Login succesfully",
      token: token,
    });
    return
  }
  res.status(411).json({
    message:"Error while logging in"

  })
});



const updateBody = zod.object({
    password:zod.string().optional(),
    firstname:zod.string().optional(),
    lastname:zod.string().optional(),
})

router.put('/', authMiddleware, async(req,res)=>{
    const {success} = updateBody.safeParse(req.body)

    if(!success){
        res.status(411).json({
            message:"Error while updating information"
        })
    }

    await User.updateOne(req.body,{
        id:req.userId,

    })

    res.json({
        message:"Updated succesfully"
    })
    
})

router.get('/bulk', async(req, res)=>{
    const filter = req.query.filter || "";
    const users = await User.find({
        $or:[{
            firstname:{
                "$regex":filter
            }
        },{
            lastname:{
                "$regex":filter

            }
        }]

    })
    res.json({
        user:users.map(user=>({
            username:user.username,
            firstname:user.firstname,
            lastname:user.lastname,
            _id:user._id
        }))
    })
})

module.exports = router;
