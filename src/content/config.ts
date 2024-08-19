import { defineCollection, z, reference } from "astro:content";

const blogCollection = defineCollection({
  //* 'content' es para contenido que se renderiza en la página como HTML o MD
  type: "content",
  //* Esquema de validación de los datos de las propiedades del contenido MD o MDX
  schema: ({image}) => z.object({
    title: z.string(),
    date: z.date(),
    description: z.string(),
    //* image() es un helper para validar la imagen de la propiedad en el contenido
    //* En este caso, se valida que la imagen tenga un ancho mínimo de 1200px 
    image: image().refine(img => img.width < 1200, {
      message: "La imagen debe ser de al menos 1200px de ancho",
    }),

    // Relacion
    // author: z.string(),
    author: reference("author"),

    // Relacion
    tags: z.array(z.string()),

    isDraft: z.boolean().default(false),
  }),
});

const authorCollection = defineCollection({
  //* 'data' es para contenido que se usa en la lógica de la página como JSON o YAML 
  type: "data",
  schema: ({image}) => z.object({
    name: z.string(),
    avatar: image(),
    twitter: z.string(),
    linkedIn: z.string(),
    github: z.string(),
    bio: z.string(),
    subtitle: z.string(),
  }),
});

//? Exportar las colecciones
//* Deben tener el mismo nombre que su coleccion de /content, por ejemplo, si se crea /blog, aquí se define la propiedad "blog"
export const collections = {
  blog: blogCollection,
  author: authorCollection,
}