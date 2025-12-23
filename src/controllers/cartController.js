import { z } from "zod";
import { prisma } from "../database/prisma.js";

// model Cart {
//   id String @id @default(uuid()) @db.Uuid()
//   userId String? @db.Uuid()
//   sessionId String? @db.VarChar(255)
//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt

//   user User? @relation(fields: [userId], references: [id], onDelete: Cascade)
//   cartItems CartItem[]
// }

// model CartItem {
//   id String @id @default(uuid()) @db.Uuid()
//   cartId String @db.Uuid()
//   productId String @db.Uuid()
//   variantId String? @db.Uuid()
//   quantity Int @default(1)
//   addedAt DateTime @default(now())

//   cart Cart @relation(fields: [cartId], references: [id], onDelete: Cascade)
//   product Product @relation(fields: [productId], references: [id], onDelete: Cascade)
//   variant ProductVariant? @relation(fields: [variantId], references: [id], onDelete: Cascade)
// }

export const getCart = async (req, res) => {
  // I have user id
  const userId = req.user.id;

  // check if cart exists for user
  const existingCart = await prisma.cart.findFirst({
    where: {
      userId: userId,
    },
    include: {
      cartItems: {
        include: {
          product: true,
          variant: true
        }
      }
    }
  });

  if (existingCart) {
    return res.json({
      status: "Success",
      message: "Cart retrieved successfully",
      data: existingCart,
    });
  }

  const cart = await prisma.cart.create({
    data: {
      userId: userId,
    },
  });

  res.json({
    status: "Success",
    message: "Cart created successfully",
    data: cart,
  });
};

export const addItemToCart = async (req, res) => {
  const userId = req.user.id;
  const { productId, variantId, quantity } = req.body;

  const cartItemSchema = z.object({
    productId: z.uuid(),
    variantId: z.uuid().optional(),
    quantity: z.number().min(1),
  });

  const { success, error } = cartItemSchema.safeParse({
    productId,
    variantId,
    quantity,
  });

  console.log("I am here");

  if (!success) {
    return res.status(400).json({
      status: "Error",
      message: "Invalid input data",
      error: error.errors,
    });
  }

  // find the cart id for the user
  let cart = await prisma.cart.findFirst({
    where: {
      userId: userId,
    },
  });

  if (!cart) {
    // if not exists, create one
    cart = await prisma.cart.create({
      data: {
        userId: userId,
      },
    });
  }

  // check if product exists
  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });

  if (!product) {
    return res.status(400).json({
      status: "Error",
      message: "Product not found",
    });
  }


  // check if variant exists (if provided)
  if(variantId) {
    const variant = await prisma.productVariant.findUnique({
      where: {
        id: variantId,
      },
    });
    if (!variant) {
      return res.status(400).json({
        status: "Error",
        message: "Product variant not found",
      });
    }
  }

  // finally add item to cart
  const cartId = cart.id;
  const cartItem = await prisma.cartItem.create({
    data: {
      cartId,
      productId,
      variantId,
      quantity,
    },
  });


  res.json({
    status: "Success",
    message: "Item added to cart successfully",
    data: cartItem,
  })


};

export const updateCartItem = async (req, res) => {
  // todo
  res.send("Update cart item");
};

export const removeItemFromCart = async (req, res) => {
  const itemId = req.params.id;
  const userId = req.user.id;

  const itemIdSchema = z.uuid();

  const { success, error } = itemIdSchema.safeParse(itemId);

  if (!success) {
    return res.status(400).json({
      status: "Error",
      message: "Invalid item ID",
      error: error.errors,
    });
  }

  // find the cart id for the user
  const cart = await prisma.cart.findFirst({
    where: {
      userId: userId,
    },
  });

  // find the card item to be removed
  const cartId = cart.id;
  const cartItem = await prisma.cartItem.findFirst({
    where: {
      id: itemId,
      cartId: cartId,
    },
  });

  if(!cartItem) {
    return res.status(404).json({
      status: "Error",
      message: "Cart item not found",
    });
  }

  
  // finally delete the cart item
  await prisma.cartItem.delete({
    where: {
      id: itemId,
    },
  });

  res.json({
    status: "Success",
    message: "Cart item removed successfully",
  });
};

export const clearCart = async (req, res) => {
  const userId = req.user.id;

  // find user card first
  const cart = await prisma.cart.findFirst({
    where: {
      userId: userId,
    },
  });

  if (!cart) {
    return res.status(200).json({
      status: "Success",
      message: "Cart is already empty",
      data: { cart: null },
    });
  }

  // delete all cart items
  const cartId = cart.id;
  await prisma.cartItem.deleteMany({
    where: {
      cartId: cart.id,
    },
  });

  res.json({
    status: "Success",
    message: "Cart cleared successfully",
    data: { cart: null },
  });
};
