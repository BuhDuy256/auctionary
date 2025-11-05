import { Router } from 'express';
import { newListSchema } from '../dto/requests/newListSchema.js';
import { ValidationError, NotFoundError } from '../../utils/errors.js';

const router = Router();

router.route('/')
    .get(async (req, res, next) => {
        try {
            const allTasks = await ListService.findAllTasks();
            res.status(200).json(allTasks);
        } catch (error) {
            next(error);
        }
    })
    .post(async (req, res, next) => {
        try {
            const { error, value } = newListSchema.validate(req.body);
    
            if (error) {
                throw new ValidationError(error.details[0].message);
            }
    
            const newList = await ListService.addList(value);
            res.status(201).json(newList);
        } catch (error) {
            next(error);
        }
    });

router.route('/:listId')
    .get(async ({ params: { listId } }, res, next) => {
        try {
            const foundList = await ListService.findByListId(listId);  

            if (!foundList) {
                throw new NotFoundError('List');
            }

            res.status(200).json(foundList);
        } catch (error) {
            next(error);
        }
    })
    .patch(async ({ params: { listId }, body }, res, next) => {
        try {
            const { error, value } = newListSchema.validate(body);

            if (error) {
                throw new ValidationError(error.details[0].message);
            }

            const updatedList = await ListService.updateListByList(listId, value);

            if (!updatedList) {
                throw new NotFoundError('List');
            }

            res.status(200).json(updatedList);
        } catch (error) {
            next(error);
        }
    })
    .delete(async ({ params: { listId } }, res, next) => {
        try {
            const isDeleted = await ListService.deleteByListId(listId);
            
            if (!isDeleted) {
                throw new NotFoundError('List');
            }
            
            res.status(204).send();
        } catch (error) {
            next(error);
        } 
    });

export default router;