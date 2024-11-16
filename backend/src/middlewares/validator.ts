import { RequestHandler } from "express";
import { isValidObjectId } from "mongoose";
import { ZodObject, ZodRawShape, z } from "zod";

export const emailValidationSchema = z.object({
  email: z
    .string({
      required_error: "Email is missing!",
      invalid_type_error: "Invalid email type!",
    })
    .email("Invalid email!"),
});

export const newUserSchema = z.object({
  name: z
    .string({
      required_error: "Name is missing!",
      invalid_type_error: "Invalid name!",
    })
    .min(3, "Name must be 3 characters long!")
    .trim(),
});

export const newAuthorSchema = z.object({
  name: z
    .string({
      required_error: "Name is missing!",
      invalid_type_error: "Invalid name!",
    })
    .trim()
    .min(3, "Invalid name"),
  about: z
    .string({
      required_error: "About is missing!",
      invalid_type_error: "Invalid about!",
    })
    .trim()
    .min(100, "Please write at least 100 characters about yourself!"),
  socialLinks: z
    .array(z.string().url("Social links can only be list of  valid URLs!"))
    .optional(),
});

const commonBookSchema = {
  uploadMethod: z.enum(["aws", "local"], {
    required_error: "Please define a valid uploadMethod",
    message: "uploadMethod needs to be either aws or local",
  }),
  status: z.enum(["published", "unpublished"], {
    required_error: "Please select at least one status.",
    message: "Please select at least one status.",
  }),
  title: z
    .string({
      required_error: "Title is missing!",
      invalid_type_error: "Invalid title!",
    })
    .trim(),
  description: z
    .string({
      required_error: "Description is missing!",
      invalid_type_error: "Invalid Description!",
    })
    .trim(),
  language: z
    .string({
      required_error: "Language is missing!",
      invalid_type_error: "Invalid language!",
    })
    .trim(),
  publishedAt: z.coerce.date({
    required_error: "Publish date is missing!",
    invalid_type_error: "Invalid publish date!",
  }),
  publicationName: z
    .string({
      required_error: "Publication name is missing!",
      invalid_type_error: "Invalid publication name!",
    })
    .trim(),
  genre: z
    .string({
      required_error: "Genre is missing!",
      invalid_type_error: "Invalid genre!",
    })
    .trim(),
  price: z
    .string({
      required_error: "Price is missing!",
      invalid_type_error: "Invalid price!",
    })
    .transform((value, ctx) => {
      try {
        return JSON.parse(value);
      } catch (error) {
        ctx.addIssue({ code: "custom", message: "Invalid Price Data!" });
        return z.NEVER;
      }
    })
    .pipe(
      z.object({
        mrp: z
          .number({
            required_error: "MRP is missing!",
            invalid_type_error: "Invalid mrp price!",
          })
          .nonnegative("Invalid mrp!"),
        sale: z
          .number({
            required_error: "Sale price is missing!",
            invalid_type_error: "Invalid sale price!",
          })
          .nonnegative("Invalid sale price!"),
      })
    )
    // if the validator function returns false the error will be thrown
    .refine(
      (price) => price.sale <= price.mrp,
      "Sale price should be less then mrp!"
    ),
};

const fileInfo = z
  .string({
    required_error: "File info is missing!",
    invalid_type_error: "Invalid file info!",
  })
  .transform((value, ctx) => {
    try {
      return JSON.parse(value);
    } catch (error) {
      ctx.addIssue({ code: "custom", message: "Invalid File Info!" });
      return z.NEVER;
    }
  })
  .pipe(
    z.object({
      name: z
        .string({
          required_error: "fileInfo.name is missing!",
          invalid_type_error: "Invalid fileInfo.name!",
        })
        .trim(),
      type: z
        .string({
          required_error: "fileInfo.type is missing!",
          invalid_type_error: "Invalid fileInfo.type!",
        })
        .trim(),
      size: z
        .number({
          required_error: "fileInfo.size is missing!",
          invalid_type_error: "Invalid fileInfo.size!",
        })
        .nonnegative("Invalid fileInfo.size!"),
    })
  );

export const newBookSchema = z.object({
  ...commonBookSchema,
  fileInfo,
});

export const updateBookSchema = z.object({
  ...commonBookSchema,
  slug: z
    .string({
      message: "Invalid slug!",
    })
    .trim(),
  fileInfo: fileInfo.optional(),
});

export const newReviewSchema = z.object({
  rating: z
    .number({
      required_error: "Rating is missing!",
      invalid_type_error: "Invalid rating!",
    })
    .nonnegative("Rating must be within 1 to 5.")
    .min(1, "Minium rating should be 1")
    .max(5, "Maximum rating should be 5"),
  content: z
    .string({
      invalid_type_error: "Invalid rating!",
    })
    .optional(),
  bookId: z
    .string({
      required_error: "Book id is missing!",
      invalid_type_error: "Invalid book id!",
    })
    .transform((arg, ctx) => {
      if (!isValidObjectId(arg)) {
        ctx.addIssue({ code: "custom", message: "Invalid book id!" });
        return z.NEVER;
      }

      return arg;
    }),
});

export const historyValidationSchema = z.object({
  bookId: z
    .string({
      required_error: "Book id is missing!",
      invalid_type_error: "Invalid book id!",
    })
    .transform((arg, ctx) => {
      if (!isValidObjectId(arg)) {
        ctx.addIssue({ code: "custom", message: "Invalid book id!" });
        return z.NEVER;
      }

      return arg;
    }),
  lastLocation: z
    .string({
      invalid_type_error: "Invalid last location!",
    })
    .trim()
    .optional(),
  highlights: z
    .array(
      z.object({
        selection: z
          .string({
            required_error: "Highlight selection is missing",
            invalid_type_error: "Invalid Highlight selection!",
          })
          .trim(),
        fill: z
          .string({
            required_error: "Highlight fill is missing",
            invalid_type_error: "Invalid Highlight fill!",
          })
          .trim(),
      })
    )
    .optional(),
  remove: z.boolean({
    required_error: "Remove is missing!",
    invalid_type_error: "remove must be a boolean value!",
  }),
});

export const validate = <T extends ZodRawShape>(
  schema: ZodObject<T>
): RequestHandler => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (result.success) {
      req.body = result.data;
      next();
    } else {
      const errors = result.error.flatten().fieldErrors;
      return res.status(422).json({ errors });
    }
  };
};

//  = [{ product: idOf the product, count: how many products that our users wants to purchase }]

export const cartItemsSchema = z.object({
  items: z.array(
    z.object({
      product: z
        .string({
          required_error: "Product id is missing!",
          invalid_type_error: "Invalid product id!",
        })
        .transform((arg, ctx) => {
          if (!isValidObjectId(arg)) {
            ctx.addIssue({ code: "custom", message: "Invalid product id!" });
            return z.NEVER;
          }

          return arg;
        }),
      quantity: z.number({
        required_error: "Quantity is missing!",
        invalid_type_error: "Quantity must be number!",
      }),
    })
  ),
});
