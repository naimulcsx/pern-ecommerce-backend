import { prisma } from '../../database/prisma.js'
import { z } from 'zod'

export const getAllProduct = async (req, res) =>{

  const products = await prisma.product.findMany({  })

  res.json({
    status: 'success',
    message: 'Product fetched Successfully',
    data: { products }
  })
}

export const getAProduct = async (req, res) =>{
  const productId = req.params.id;

  const productSchema = z.object({
    id: z.uuid()
  })
  
  const { success, data, error } = productSchema.safeParse({ id: productId });

  if (!success){
    res.status(400).json({
      status: 'error',
      message: 'Bad request',
    })
  }


  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      category: true,
      images: true,
      variants: true
    }
  })

  if (!product) {
    return res.status(404).json({
      status: 'error',
      message: 'Product not found',
    })
  }

  res.json({
    status: 'success',
    message: 'Product fetched Successfully',
    data: { product }
  })
}


export const createProduct = async (req, res) =>{
  console.log("I am here");

  const productCreateSchema = z.object({
    title: z.string().min(3),
    slug: z.string().min(3),
    description: z.string().min(5),
    basePrice: z.number().positive(),
    originalPrice: z.number().positive().optional(),
    stockQuantity: z.number().int().nonnegative(),
    specifications: z.any(),
    isFeatured: z.boolean().optional(),
    isActive: z.boolean().optional(),
    categoryId: z.uuid()
  })

  const { success, data, error } = productCreateSchema.safeParse(req.body);

  console.log(error);

  // validation failed 
  if (!success){
    res.status(400).json({
      status: 'error',
      message: 'Bad request payload should have title, slug, description, basePrice, originalPrice, stockQuantity, specifications, isFeatured, isActive, and categoryId',
    })
  }

  // check if valid category
  const category = await prisma.category.findUnique({
    where: { id: data.categoryId }
  })

  if(!category){
    res.json({
      status: 'error',
      message: 'Bad request invalid categoryId',
    })
  }

  const productPayload = {
    title: data.title,
    slug: data.slug,
    description: data.description,
    basePrice: data.basePrice,
    originalPrice: data.originalPrice,
    stockQuantity: data.stockQuantity,
    specifications: data.specifications,
    isFeatured: data.isFeatured ?? false,
    isActive: data.isActive ?? true,
    categoryId: data.categoryId
  }

  const createdProduct = await prisma.product.create({
    data: productPayload
  })

  res.json({
    status: 'success',
    message: 'Product Created Successfully',
    data: {product: createdProduct}
  })

}

export const updateProduct = async (req, res) => {
  // assignment please update accordingly the new product schema
  const productId = req.params.id;

  const productSchema = z.object({
    id: z.uuid()
  })
  
  const { success: paramSuccess, data: paramData, error: paramError } = productSchema.safeParse({ id: productId });

  if (!paramSuccess){
    res.status(400).json({
      status: 'error',
      message: 'Bad request',
    })
  }

  const productUpdateSchema = z.object({
    name: z.string().min(3).optional(),
    description: z.string().min(5).optional(),
    price: z.number().positive().optional(),
    stock: z.number().int().optional(),
    categoryId: z.uuid().optional()
  })

  const { success: bodySuccess, data: bodyData, error: bodyError } = productUpdateSchema.safeParse(req.body);

  if (!bodySuccess){
    res.status(400).json({
      status: 'error',
      message: 'Bad request payload should have name, description, price, stock and categoryId',
    })
  }

  const updatedProduct = await prisma.product.update({
    where: { id: productId },
    data: bodyData
  })

  res.json({
    status: 'success',
    message: 'Product Updated Successfully',
    data: { product: updatedProduct }
  })
}

export const deleteProduct = async (req, res) =>{
  const productId = req.params.id;

  const productSchema = z.object({
    id: z.uuid()
  })
  
  const { success, data, error } = productSchema.safeParse({ id: productId });

  if (!success){
    res.status(400).json({
      status: 'error',
      message: 'Bad request',
    })
  }

  const deletedProduct = await prisma.product.delete({
    where: { id: productId }
  })

  res.json({
    status: 'success',
    message: 'Product Deleted Successfully',
    data: { product: deletedProduct }
  })
}