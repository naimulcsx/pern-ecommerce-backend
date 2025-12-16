import { prisma } from "../../database/prisma.js";
import { z } from "zod";


export const getAllVariant = async (req, res) =>{
  const variants =  await prisma.productVariant.findMany();

  res.json({
    status: 'success',
    message: 'All product variants fetched successfully',
    data: variants
  })
}

export const getVariantById = async (req, res) => {
  // Implementation for getting a variant by ID
  const variantId = req.params.id;

  const schema = z.object({
    id: z.uuid()
  });

  const { success, data, error } = schema.safeParse({ id: variantId });

  if (!success){
    return res.status(400).json({
      status: 'error',
      message: 'Bad request: Invalid UUID format',
    });
  }

  const variant = await prisma.productVariant.findUnique({
    where: { id: variantId }
  });

  if (!variant) {
    return res.status(404).json({
      status: 'error',
      message: 'Variant not found',
    });
  }

  res.json({
    status: 'success',
    message: 'Product variant fetched successfully',
    data: variant
  });
}


export const createVariant = async (req, res) => {
  const { productId, variantName, variantValue, priceAdjustment, stockQuantity, imageUrl } = req.body;

  const createSchema = z.object({
    productId: z.uuid(),
    variantName: z.string().max(50),
    variantValue: z.string().max(50),
    priceAdjustment: z.number().optional().default(0.00),
    stockQuantity: z.number().int().nonnegative().optional().default(0),
    imageUrl: z.string().url().optional()
  });

  const { success, data, error } = createSchema.safeParse({ productId, variantName, variantValue, priceAdjustment, stockQuantity, imageUrl });

  if (!success){
    return res.status(400).json({
      status: 'error',
      message: 'Bad request: ' + error.errors.map(e => e.message).join(', '),
    });
  }

  const newVariant = await prisma.productVariant.create({
    data: {
      productId: data.productId,
      variantName: data.variantName,
      variantValue: data.variantValue,
      priceAdjustment: data.priceAdjustment,
      stockQuantity: data.stockQuantity,
      imageUrl: data.imageUrl
    }
  });

  res.status(201).json({
    status: 'success',
    message: 'Product variant created successfully',
    data: newVariant
  });
}

export const updateVariant = async (req, res) => {
  // Implementation for updating a variant
  res.json({ message: 'This is assignment please do it yourself' });
}

export const deleteVariant = async (req, res) => {
  // Implementation for deleting a variant
  res.json({ message: 'This is assignment please do it yourself' });
}