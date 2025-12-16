import { prisma } from "../database/prisma.js";
import { z } from "zod";

export const getAllCategory = async (req, res) => {
  const categories = await prisma.category.findMany()

  res.json({
    status: 'success',
    message: 'Category fetched Successfully',
    data: { categories }
  })
}

export const getACategory = async (req, res) => {
  const categoryId = req.params.id;

  const categorySchema = z.object({
    id: z.uuid()
  })
  
  const { success, data, error } = categorySchema.safeParse({ id: categoryId });

  if (!success){
    res.status(400).json({
      status: 'error',
      message: 'Bad request',
    })
  }

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  })

  if (!category) {
    return res.status(404).json({
      status: 'error',
      message: 'Category not found',
    })
  }

  res.json({
    status: 'success',
    message: 'Category fetched Successfully',
    data: { category }
  })
}


export const createCategory = async (req, res) =>{
  const { name, slug, description, imageUrl, parentId } = req.body;


  const categoryCreateSchema = z.object({
    name: z.string().min(3),
    slug: z.string().min(3),
    description: z.string().min(5),
    imageUrl: z.url(),
    parentId: z.uuid().optional()
  })

  const { success, data, error } = categoryCreateSchema.safeParse(req.body);

  // validation failed 
  if (!success){
    res.status(400).json({
      status: 'error',
      message: 'Bad request payload must have name, slug, description, imageUrl, and optionally parentId',
    })
  }

  const categoryPayload = {
    name: data.name,
    slug: data.slug,
    description: data.description,
    imageUrl: data.imageUrl,
    parentId: data.parentId
  }

  const createdCategory = await prisma.category.create({
    data: categoryPayload
  })

  res.json({
    status: 'success',
    message: 'Category created Successfully',
    data: { category: createdCategory }
  })

}

export const updateCategory = async (req, res) =>{
  // Assignment please update the code here
  const categoryId = req.params.id;


  const categorySchema = z.object({
    id: z.uuid()
  })
  
  const { success: paramSuccess, data: paramData, error: paramError } = categorySchema.safeParse({ id: categoryId });

  if (!paramSuccess){
    res.status(400).json({
      status: 'error',
      message: 'Bad request',
    })
  } 


  const categoryUpdateSchema = z.object({
    name: z.string().min(3).optional(),
    description: z.string().min(5).optional()
  })

  const { success: bodySuccess, data: bodyData, error: bodyError } = categoryUpdateSchema.safeParse(req.body);


  // validation failed 
  if (!bodySuccess){
    res.status(400).json({
      status: 'error',
      message: 'Bad request',
    })
  }


  // valid update data and valid category id
  const updatedCategory = await prisma.category.update({
    where: { id: categoryId },
    data: bodyData
  })

  res.json({
    status: 'success',
    message: 'Category updated Successfully',
    data: { category: updatedCategory }
  })

}

export const deleteCategory = async (req, res) =>{
  const categoryId = req.params.id;

  const categorySchema = z.object({
    id: z.uuid()
  })
  
  const { success, data, error } = categorySchema.safeParse({ id: categoryId });

  if (!success){
    res.status(400).json({
      status: 'error',
      message: 'Bad request',
    })
  }

  // we have valid category id
  const deletedCategory = await prisma.category.delete({
    where: { id: categoryId }
  })

  res.json({
    status: 'success',
    message: 'Category deleted Successfully',
    data: { category: deletedCategory }
  })
}