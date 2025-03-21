import express from 'express';
import { test, updateUser, deleteUser, signout, getUsers, getUser } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const userRouter = express.Router();
userRouter.get('/test', test);
userRouter.put('/update/:userId', verifyToken, updateUser);
userRouter.delete('/delete/:userId', verifyToken, deleteUser);
userRouter.post('/signout', signout);
userRouter.get('/getusers', verifyToken, getUsers);
userRouter.get('/:userId', getUser);



export default userRouter;
