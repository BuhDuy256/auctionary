import { Router } from 'express';
import { readLists, createList, readList, updateList, deleteList } from '../routers/list.router.js';

const router = Router();

router.route('/')
    .get(readLists)
    .post(createList);

router.route('/:listId')
    .get(readList)
    .patch(updateList)
    .delete(deleteList);

export default router;