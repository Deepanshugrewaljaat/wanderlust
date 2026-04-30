const { z } = require("zod");

const listingSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    image: z.string().url("Invalid image URL"),
    price: z.coerce.number().min(0,"Price must be positive"),
    location: z.string().min(1, "Location is required"),
    country: z.string().min(1, "Country is required")
});

module.exports = { listingSchema };