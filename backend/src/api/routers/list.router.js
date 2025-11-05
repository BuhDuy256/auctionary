import { ValidationError, NotFoundError } from '../../utils/errors.js';
import { newListSchema, updateListSchema } from '../schemas/list.schema.js';
import { listService } from '../../services/list.service.js'

export async function readLists(req, res, next) {
    try {
        const allTasks = await listService.findAllTasks();
        res.status(200).json(allTasks);
    } catch (error) {
        next(error);
    }
}

export async function createList(req, res, next) {
    try {
        const validatedData = newListSchema.parse(req.body);
        const newList = await listService.addList(validatedData);
        res.status(201).json(newList);
    } catch (error) {
        if (error.name === 'ZodError') {
            next(new ValidationError(error.errors[0].message));
        } else {
            next(error);
        }
    }
}

export async function readList(req, res, next) {
    try {
        const { listId } = req.params;
        const foundList = await listService.findByListId(listId);  

        if (!foundList) {
            throw new NotFoundError('List');
        }

        res.status(200).json(foundList);
    } catch (error) {
        next(error);
    }
}

export async function updateList(req, res, next) {
    try {
        const { listId } = req.params;
        const validatedData = updateListSchema.parse(req.body);
        const updatedList = await listService.updateByListId(listId, validatedData);

        if (!updatedList) {
            throw new NotFoundError('List');
        }

        res.status(200).json(updatedList);
    } catch (error) {
        if (error.name === 'ZodError') {
            next(new ValidationError(error.errors[0].message));
        } else {
            next(error);
        }
    }
}

export async function deleteList(req, res, next) {
    try {
        const { listId } = req.params;
        const isDeleted = await listService.deleteByListId(listId);
        
        if (!isDeleted) {
            throw new NotFoundError('List');
        }
        
        res.status(204).send();
    } catch (error) {
        next(error);
    } 
}